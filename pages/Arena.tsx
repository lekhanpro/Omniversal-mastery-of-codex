import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Swords, Target, Timer, Trophy } from 'lucide-react';
import { arenaQuestions } from '../data';
import { ArenaQuestion } from '../types';
import { appendActivity, masteryDomains, readLS, writeLS } from '../utils/codex';

type Mode = 'domain' | 'speed' | 'gauntlet';
type Screen = 'home' | 'domain-select' | 'quiz' | 'results';

interface ActiveQuestion extends ArenaQuestion {
  runtimeId: string;
}

interface AnswerRecord {
  question: ActiveQuestion;
  chosen: string | null;
  correct: boolean;
  scoreGain: number;
  timeSpent: number;
}

interface ArenaResultRecord {
  id: string;
  mode: Mode;
  score: number;
  timestamp: number;
  totalQuestions: number;
  correct: number;
  domainScores: Record<number, { correct: number; total: number }>;
}

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
};

const uid = (prefix: string): string => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const playTone = (frequency: number, duration: number, type: OscillatorType, volume = 0.2): void => {
  const audio = new AudioContext();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, audio.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + duration);
};

const getGrade = (scorePercent: number): { letter: string; title: string; color: string } => {
  if (scorePercent >= 97) return { letter: 'A+', title: 'Omniversal Mastery', color: '#d7b860' };
  if (scorePercent >= 90) return { letter: 'A', title: 'Domain Champion', color: '#e4c97b' };
  if (scorePercent >= 80) return { letter: 'B', title: 'Ascending Scholar', color: '#67a6ff' };
  if (scorePercent >= 70) return { letter: 'C', title: 'Knowledge Seeker', color: '#f4f4f4' };
  if (scorePercent >= 60) return { letter: 'D', title: 'The Path Awaits', color: '#ffac65' };
  return { letter: 'F', title: 'Return to the Grimoire', color: '#ff6565' };
};

const updateStreakAndBadges = (): { streak: number; badges: string[] } => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const lastDate = localStorage.getItem('arena_streak_last') ?? '';
  let streak = Number.parseInt(localStorage.getItem('arena_streak') ?? '0', 10);

  if (lastDate === today) {
    return { streak, badges: readLS<string[]>('arena_badges', []) };
  }
  if (lastDate === yesterday) {
    streak += 1;
  } else {
    streak = 1;
  }
  localStorage.setItem('arena_streak', String(streak));
  localStorage.setItem('arena_streak_last', today);

  const badges = readLS<string[]>('arena_badges', []);
  const nextBadges = [...badges];
  if (streak >= 3 && !nextBadges.includes('ember_streak')) nextBadges.push('ember_streak');
  if (streak >= 7 && !nextBadges.includes('streak_7')) nextBadges.push('streak_7');
  if (streak >= 30 && !nextBadges.includes('streak_30')) nextBadges.push('streak_30');
  writeLS('arena_badges', nextBadges);

  return { streak, badges: nextBadges };
};

const buildQuiz = (mode: Mode, domainId?: number): ActiveQuestion[] => {
  const bank = arenaQuestions;
  if (mode === 'domain' && domainId) {
    const domainBank = bank.filter((question) => question.domain === domainId);
    const seeded = shuffle(domainBank);
    const result: ActiveQuestion[] = [];
    for (let index = 0; index < 10; index += 1) {
      const source = seeded[index % seeded.length];
      result.push({ ...source, runtimeId: `${source.id}-${index}` });
    }
    return result;
  }
  if (mode === 'speed') {
    return shuffle(bank)
      .slice(0, 20)
      .map((question) => ({ ...question, runtimeId: uid('speed') }));
  }
  return shuffle(bank)
    .slice(0, 30)
    .map((question) => ({ ...question, runtimeId: uid('gauntlet') }));
};

const RadarChart: React.FC<{
  session: Record<number, { correct: number; total: number }>;
  average: Record<number, { correct: number; total: number }>;
}> = ({ session, average }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 120;
    let raf = 0;
    let progress = 0;

    const domainIds = masteryDomains.map((domain) => domain.id);
    const getValue = (source: Record<number, { correct: number; total: number }>, domainId: number): number => {
      const entry = source[domainId];
      if (!entry || entry.total === 0) return 0;
      return entry.correct / entry.total;
    };

    const drawPolygon = (source: Record<number, { correct: number; total: number }>, stroke: string, fill: string): void => {
      context.beginPath();
      domainIds.forEach((domainId, index) => {
        const angle = (Math.PI * 2 * index) / domainIds.length - Math.PI / 2;
        const ratio = getValue(source, domainId) * progress;
        const x = centerX + Math.cos(angle) * radius * ratio;
        const y = centerY + Math.sin(angle) * radius * ratio;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.closePath();
      context.fillStyle = fill;
      context.strokeStyle = stroke;
      context.lineWidth = 2;
      context.fill();
      context.stroke();
    };

    const draw = (): void => {
      progress = Math.min(1, progress + 0.03);
      context.clearRect(0, 0, width, height);
      context.strokeStyle = 'rgba(255,255,255,0.15)';
      context.lineWidth = 1;

      for (let ring = 1; ring <= 5; ring += 1) {
        const scale = ring / 5;
        context.beginPath();
        domainIds.forEach((_, index) => {
          const angle = (Math.PI * 2 * index) / domainIds.length - Math.PI / 2;
          const x = centerX + Math.cos(angle) * radius * scale;
          const y = centerY + Math.sin(angle) * radius * scale;
          if (index === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });
        context.closePath();
        context.stroke();
      }

      drawPolygon(average, 'rgba(89, 153, 255, 0.8)', 'rgba(89, 153, 255, 0.22)');
      drawPolygon(session, 'rgba(201, 168, 76, 0.95)', 'rgba(201, 168, 76, 0.26)');

      if (progress < 1) raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [average, session]);

  return <canvas ref={canvasRef} width={360} height={320} className="mx-auto w-full max-w-md" />;
};

const Arena: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [mode, setMode] = useState<Mode>('domain');
  const [selectedDomain, setSelectedDomain] = useState<number>(masteryDomains[0]?.id ?? 1);
  const [questions, setQuestions] = useState<ActiveQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [score, setScore] = useState(0);
  const [questionTime, setQuestionTime] = useState(15);
  const [gauntletTime, setGauntletTime] = useState(1200);
  const [floatingBonus, setFloatingBonus] = useState('');
  const [wrongStreak, setWrongStreak] = useState(0);
  const [domainStreak, setDomainStreak] = useState(0);
  const [lastDomain, setLastDomain] = useState<number | null>(null);
  const [redFlash, setRedFlash] = useState(false);
  const [results, setResults] = useState<ArenaResultRecord[]>(readLS<ArenaResultRecord[]>('arena_results', []));
  const [currentStreak, setCurrentStreak] = useState(Number.parseInt(localStorage.getItem('arena_streak') ?? '0', 10));
  const [animatedScore, setAnimatedScore] = useState(0);
  const warningSecondRef = useRef<number>(6);

  const currentQuestion = questions[index];
  const totalPossible = useMemo(() => questions.length * 300, [questions.length]);
  const correctCount = answers.filter((answer) => answer.correct).length;
  const scorePercent = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
  const grade = getGrade(scorePercent);

  const allTimeAverage = useMemo(() => {
    const aggregate: Record<number, { correct: number; total: number }> = {};
    results.forEach((result) => {
      Object.entries(result.domainScores).forEach(([domainKey, value]) => {
        const domain = Number(domainKey);
        const current = aggregate[domain] ?? { correct: 0, total: 0 };
        aggregate[domain] = {
          correct: current.correct + value.correct,
          total: current.total + value.total,
        };
      });
    });
    return aggregate;
  }, [results]);

  useEffect(() => {
    if (screen === 'results') {
      let raf = 0;
      const target = score;
      let current = 0;
      const step = (): void => {
        current = Math.min(target, current + Math.max(10, target / 40));
        setAnimatedScore(Math.floor(current));
        if (current < target) raf = requestAnimationFrame(step);
      };
      step();
      return () => cancelAnimationFrame(raf);
    }
    return undefined;
  }, [score, screen]);

  useEffect(() => {
    if (screen !== 'quiz') return undefined;
    if (mode !== 'speed' || submitted) return undefined;

    warningSecondRef.current = Math.ceil(questionTime);
    const timer = window.setInterval(() => {
      setQuestionTime((value) => {
        const next = value - 0.1;
        const rounded = Math.ceil(next);
        if (rounded <= 5 && rounded !== warningSecondRef.current) {
          playTone(620, 0.08, 'square', 0.07);
          warningSecondRef.current = rounded;
        }
        if (next <= 0) {
          window.clearInterval(timer);
          handleAnswer(null, true);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [mode, questionTime, screen, submitted]);

  useEffect(() => {
    if (screen !== 'quiz' || mode !== 'gauntlet') return undefined;
    const timer = window.setInterval(() => {
      setGauntletTime((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [mode, screen]);

  const startQuiz = (nextMode: Mode, domainId?: number): void => {
    setMode(nextMode);
    const nextQuestions = buildQuiz(nextMode, domainId);
    setQuestions(nextQuestions);
    setScreen('quiz');
    setIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setShowExplanation(false);
    setAnswers([]);
    setScore(0);
    setQuestionTime(15);
    setGauntletTime(1200);
    setFloatingBonus('');
    setWrongStreak(0);
    setDomainStreak(0);
    setLastDomain(null);
  };

  const nextQuestion = (): void => {
    if (index >= questions.length - 1) {
      finishQuiz();
      return;
    }
    setIndex((value) => value + 1);
    setSelectedOption(null);
    setSubmitted(false);
    setShowExplanation(false);
    setQuestionTime(15);
    setFloatingBonus('');
  };

  const handleAnswer = (option: string | null, timedOut = false): void => {
    if (!currentQuestion || submitted) return;
    setSelectedOption(option);
    setSubmitted(true);

    const correct = option === currentQuestion.correct;
    const elapsed = mode === 'speed' ? 15 - questionTime : 0;
    let gain = 0;

    if (correct) {
      playTone(900, 0.14, 'sine', 0.16);
      gain = 100;
      if (mode === 'speed' && elapsed <= 5) {
        gain += 200;
        setFloatingBonus('+200!');
      }
      if (mode === 'gauntlet') {
        const streak = lastDomain === currentQuestion.domain ? domainStreak + 1 : 1;
        setDomainStreak(streak);
        setLastDomain(currentQuestion.domain);
        if (streak >= 3) {
          gain += 50;
          setFloatingBonus('+50 DOMAIN STREAK');
        }
      }
      setWrongStreak(0);
    } else {
      if (!timedOut) playTone(150, 0.25, 'sawtooth', 0.18);
      if (mode === 'gauntlet') {
        const nextWrong = wrongStreak + 1;
        setWrongStreak(nextWrong);
        setDomainStreak(0);
        if (nextWrong >= 5) {
          setRedFlash(true);
          window.setTimeout(() => setRedFlash(false), 450);
        }
      }
    }

    setScore((value) => value + gain);
    setAnswers((current) => [
      ...current,
      {
        question: currentQuestion,
        chosen: option,
        correct,
        scoreGain: gain,
        timeSpent: elapsed,
      },
    ]);

    if (mode === 'domain') {
      setShowExplanation(true);
      return;
    }
    window.setTimeout(() => nextQuestion(), 700);
  };

  const finishQuiz = (): void => {
    const domainScores: Record<number, { correct: number; total: number }> = {};
    answers.forEach((answer) => {
      const current = domainScores[answer.question.domain] ?? { correct: 0, total: 0 };
      domainScores[answer.question.domain] = {
        correct: current.correct + (answer.correct ? 1 : 0),
        total: current.total + 1,
      };
    });

    const record: ArenaResultRecord = {
      id: uid('arena'),
      mode,
      score,
      timestamp: Date.now(),
      totalQuestions: questions.length,
      correct: answers.filter((answer) => answer.correct).length,
      domainScores,
    };

    const nextResults = [record, ...results].slice(0, 100);
    setResults(nextResults);
    writeLS('arena_results', nextResults);
    appendActivity('quiz', [...new Set(answers.map((answer) => answer.question.domain))], `Completed ${mode} arena run`);

    const streakInfo = updateStreakAndBadges();
    setCurrentStreak(streakInfo.streak);
    setScreen('results');
  };

  const saveResultSnapshot = (): void => {
    const exportPayload = {
      score,
      grade,
      mode,
      answers,
      timestamp: Date.now(),
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `arena-result-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const sessionDomainScores = useMemo(() => {
    const aggregate: Record<number, { correct: number; total: number }> = {};
    answers.forEach((answer) => {
      const current = aggregate[answer.question.domain] ?? { correct: 0, total: 0 };
      aggregate[answer.question.domain] = {
        correct: current.correct + (answer.correct ? 1 : 0),
        total: current.total + 1,
      };
    });
    return aggregate;
  }, [answers]);

  if (screen === 'home') {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="mb-1 text-center font-cinzel text-5xl text-[#ff6f6f] [text-shadow:0_0_18px_rgba(255,100,100,0.45)]">THE ARENA</h1>
        <p className="mb-6 text-center text-sm text-gray-400">Three modes. One objective. Relentless clarity.</p>

        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/55 bg-orange-500/10 px-4 py-1.5 text-xs text-orange-300">
            <Flame className="h-4 w-4" style={{ transform: `scale(${1 + Math.min(1.2, currentStreak / 20)})` }} />
            Streak: {currentStreak} day{currentStreak === 1 ? '' : 's'}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <button type="button" onClick={() => setScreen('domain-select')} className="rounded-xl border border-white/15 bg-black/45 p-5 text-left hover:border-red-300/55">
            <h3 className="mb-2 text-lg font-semibold text-white">Domain Drill</h3>
            <p className="text-sm text-gray-400">10 questions focused on one selected domain.</p>
          </button>
          <button type="button" onClick={() => startQuiz('speed')} className="rounded-xl border border-white/15 bg-black/45 p-5 text-left hover:border-yellow-300/55">
            <h3 className="mb-2 text-lg font-semibold text-white">Speed Round</h3>
            <p className="text-sm text-gray-400">20 questions. 15 seconds each. Answer fast for x2 bonus.</p>
          </button>
          <button type="button" onClick={() => startQuiz('gauntlet')} className="rounded-xl border border-white/15 bg-black/45 p-5 text-left hover:border-red-400/55">
            <h3 className="mb-2 text-lg font-semibold text-white">Gauntlet Mode</h3>
            <p className="text-sm text-gray-400">30 questions across all domains with a 20-minute limit.</p>
          </button>
        </div>

        <div className="mt-8 rounded-xl border border-white/10 bg-black/45 p-4">
          <h2 className="mb-3 text-sm uppercase tracking-[0.2em] text-gray-500">Last 10 Sessions</h2>
          <div className="space-y-2 text-sm text-gray-300">
            {results.slice(0, 10).map((result) => (
              <div key={result.id} className="flex items-center justify-between rounded border border-white/10 px-3 py-2">
                <span>{new Date(result.timestamp).toLocaleDateString()} · {result.mode.toUpperCase()}</span>
                <span className="font-mono text-[#e4ca87]">{result.score}</span>
              </div>
            ))}
            {results.length === 0 && <div className="text-gray-500">No sessions yet.</div>}
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'domain-select') {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6">
        <h2 className="mb-4 font-cinzel text-3xl text-white">Choose Domain Drill</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {masteryDomains.map((domain) => (
            <button
              key={domain.id}
              type="button"
              onClick={() => {
                setSelectedDomain(domain.id);
                startQuiz('domain', domain.id);
              }}
              className="rounded-lg border border-white/15 bg-black/45 px-4 py-3 text-left text-sm text-gray-200 hover:border-[#c9a84c]"
            >
              D{domain.id}. {domain.title}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setScreen('home')} className="mt-4 rounded border border-white/20 px-3 py-1.5 text-sm text-gray-300">
          Back to Arena
        </button>
      </div>
    );
  }

  if (screen === 'quiz' && currentQuestion) {
    const progress = ((index + 1) / questions.length) * 100;
    const timerPercent = mode === 'speed' ? (questionTime / 15) * 100 : (gauntletTime / 1200) * 100;
    const timerColor = mode !== 'speed' ? '#44aaff' : questionTime > 8 ? '#44ff88' : questionTime > 5 ? '#ffcc44' : '#ff6666';

    return (
      <div className="relative mx-auto max-w-4xl px-4 py-6">
        {redFlash && <div className="pointer-events-none fixed inset-0 z-40 bg-red-600/30" />}
        {redFlash && mode === 'gauntlet' && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
            <div className="rounded-2xl border border-red-400/70 bg-black/70 px-7 py-4 text-center">
              <div className="text-3xl font-cinzel tracking-[0.12em] text-red-200">THE ARENA TESTS YOU</div>
            </div>
          </div>
        )}
        <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
          <span>{mode.toUpperCase()} · Q{index + 1}/{questions.length}</span>
          <span className="font-mono">Score: {score}</span>
        </div>
        <div className="mb-3 h-2 rounded-full bg-white/10">
          <div className="h-full rounded-full bg-[#c9a84c]" style={{ width: `${progress}%` }} />
        </div>
        <div className={`mb-4 h-2 rounded-full ${mode === 'speed' && questionTime <= 5 ? 'pulse-warning' : ''}`} style={{ background: 'rgba(255,255,255,0.12)' }}>
          <div className="h-full rounded-full transition-all duration-100" style={{ width: `${timerPercent}%`, backgroundColor: timerColor }} />
        </div>

        <motion.h2 key={currentQuestion.runtimeId} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-6 font-cinzel text-2xl text-white md:text-3xl">
          {currentQuestion.question}
        </motion.h2>

        <div className="grid gap-3 md:grid-cols-2">
          {currentQuestion.options.map((option) => {
            const isCorrect = option === currentQuestion.correct;
            const chosen = selectedOption === option;
            const failed = submitted && chosen && !isCorrect;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleAnswer(option)}
                disabled={submitted}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                  !submitted
                    ? 'border-white/15 bg-black/45 text-gray-200 hover:border-[#c9a84c]'
                    : isCorrect
                    ? 'border-green-400/80 bg-green-500/20 text-green-200'
                    : chosen
                    ? 'shake-x border-red-400/80 bg-red-500/20 text-red-200'
                    : 'border-white/10 bg-black/35 text-gray-500'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {floatingBonus && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: -24 }} exit={{ opacity: 0 }} className="pointer-events-none absolute right-8 top-12 text-lg font-bold text-[#e4ca87]">
              {floatingBonus.includes('DOMAIN STREAK') ? (
                <span className="inline-flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-300" />
                  {floatingBonus}
                </span>
              ) : (
                floatingBonus
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {mode === 'domain' && showExplanation && (
          <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-6 rounded-xl border border-white/15 bg-black/55 p-4">
            <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-500">Explanation</h3>
            <p className="text-sm text-gray-200">{currentQuestion.explanation}</p>
            <button type="button" onClick={nextQuestion} className="mt-4 rounded border border-[#c9a84c]/70 px-3 py-1.5 text-xs text-[#e4ca87]">
              Next Question
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-4xl text-white">Results</h2>
          <p className="text-sm text-gray-400">{mode.toUpperCase()} completed</p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Score</div>
          <div className="text-3xl font-bold text-[#e4ca87]">{animatedScore}</div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-white/12 bg-black/50 p-5 text-center">
        <div className="mb-1 text-5xl font-bold" style={{ color: grade.color }}>{grade.letter}</div>
        <div className="text-lg text-gray-200">{grade.title}</div>
        <div className="mt-2 text-sm text-gray-400">{correctCount}/{questions.length} correct · {scorePercent.toFixed(1)}%</div>
      </div>

      {mode === 'gauntlet' && (
        <div className="mb-6 rounded-xl border border-white/12 bg-black/50 p-5">
          <h3 className="mb-3 text-sm uppercase tracking-[0.2em] text-gray-500">Gauntlet Radar</h3>
          <RadarChart session={sessionDomainScores} average={allTimeAverage} />
        </div>
      )}

      <div className="mb-6 rounded-xl border border-white/12 bg-black/50 p-5">
        <h3 className="mb-3 text-sm uppercase tracking-[0.2em] text-gray-500">Wrong Answers Review</h3>
        <div className="space-y-3 text-sm">
          {answers
            .filter((answer) => !answer.correct)
            .map((answer) => (
              <div key={answer.question.runtimeId} className="rounded border border-red-400/25 bg-red-500/5 p-3">
                <p className="mb-1 text-gray-200">{answer.question.question}</p>
                <p className="text-red-200">Your answer: {answer.chosen ?? 'Timeout'}</p>
                <p className="text-green-200">Correct: {answer.question.correct}</p>
                <p className="text-gray-400">{answer.question.explanation}</p>
              </div>
            ))}
          {answers.filter((answer) => !answer.correct).length === 0 && <p className="text-gray-400">No wrong answers in this run.</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => startQuiz(mode, selectedDomain)} className="rounded border border-white/20 px-3 py-1.5 text-sm text-gray-200">
          Try Again
        </button>
        <button type="button" onClick={() => setScreen('domain-select')} className="rounded border border-white/20 px-3 py-1.5 text-sm text-gray-200">
          Different Domain
        </button>
        <button type="button" onClick={() => setScreen('home')} className="rounded border border-white/20 px-3 py-1.5 text-sm text-gray-200">
          Back to Arena
        </button>
        <button type="button" onClick={saveResultSnapshot} className="rounded border border-[#c9a84c]/70 px-3 py-1.5 text-sm text-[#e4ca87]">
          Save
        </button>
      </div>
    </div>
  );
};

export default Arena;
