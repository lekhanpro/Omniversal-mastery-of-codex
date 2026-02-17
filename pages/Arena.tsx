import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Clock, Trophy, Target, Flame } from 'lucide-react';

interface Question {
  id: number;
  domain: number;
  question: string;
  options: string[];
  correct: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizResult {
  score: number;
  total: number;
  domainScores: Record<number, { correct: number; total: number }>;
  timeElapsed: number;
  mode: string;
}

const Arena: React.FC = () => {
  const [mode, setMode] = useState<'menu' | 'domain' | 'speed' | 'gauntlet' | 'results'>('menu');
  const [showDomainSelect, setShowDomainSelect] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const domainNames = [
    "Physical Mastery",
    "Mind & Cognition",
    "Tech Creation",
    "AI & Robotics",
    "Scientific Intelligence",
    "Business & Finance",
    "Philosophy",
    "Communication",
    "Cybersecurity",
    "Future Intelligence",
    "Global Intelligence",
    "Meta-Learning",
    "Creative Arts",
    "Public Systems",
    "Deep Computing",
    "Social Engineering",
    "Planetary Health",
    "Quantum & Cosmos",
    "Consciousness",
    "Mythic Mastery"
  ];

  const questionBank: Question[] = [
    // Domain 1: Physical Mastery
    { id: 1, domain: 1, question: "What is the primary energy system used during a 100m sprint?", options: ["Aerobic", "Anaerobic Alactic (ATP-PC)", "Anaerobic Lactic", "Oxidative"], correct: 1, difficulty: 'medium' },
    { id: 2, domain: 1, question: "Which muscle fiber type is most resistant to fatigue?", options: ["Type I (Slow-twitch)", "Type IIa (Fast-twitch oxidative)", "Type IIx (Fast-twitch glycolytic)", "Type III"], correct: 0, difficulty: 'easy' },
    { id: 3, domain: 1, question: "What does VO2 max measure?", options: ["Maximum heart rate", "Maximum oxygen uptake", "Maximum power output", "Maximum lactate threshold"], correct: 1, difficulty: 'medium' },
    { id: 4, domain: 1, question: "In BJJ, what position is considered the most dominant?", options: ["Guard", "Side control", "Mount", "Back control"], correct: 3, difficulty: 'medium' },
    { id: 5, domain: 1, question: "What is the stretch-shortening cycle?", options: ["A flexibility routine", "Eccentric-concentric muscle action", "A warm-up protocol", "A recovery technique"], correct: 1, difficulty: 'hard' },
    { id: 6, domain: 1, question: "Which training method is best for explosive power?", options: ["Steady-state cardio", "Plyometrics", "Yoga", "Pilates"], correct: 1, difficulty: 'easy' },
    { id: 7, domain: 1, question: "What is the primary purpose of the Valsalva maneuver in lifting?", options: ["Increase blood flow", "Stabilize the spine", "Improve flexibility", "Reduce fatigue"], correct: 1, difficulty: 'hard' },
    { id: 8, domain: 1, question: "Which martial art emphasizes throws and takedowns?", options: ["Boxing", "Muay Thai", "Judo", "Taekwondo"], correct: 2, difficulty: 'easy' },

    // Domain 2: Mind & Cognition
    { id: 9, domain: 2, question: "What brain structure is primarily responsible for memory consolidation?", options: ["Amygdala", "Hippocampus", "Cerebellum", "Prefrontal cortex"], correct: 1, difficulty: 'medium' },
    { id: 10, domain: 2, question: "What is the capacity of working memory according to Miller's Law?", options: ["5±2 items", "7±2 items", "9±2 items", "11±2 items"], correct: 1, difficulty: 'medium' },
    { id: 11, domain: 2, question: "Which neurotransmitter is most associated with reward and motivation?", options: ["Serotonin", "GABA", "Dopamine", "Acetylcholine"], correct: 2, difficulty: 'easy' },
    { id: 12, domain: 2, question: "What is neuroplasticity?", options: ["Brain's ability to form new connections", "Brain's electrical activity", "Brain's chemical balance", "Brain's size increase"], correct: 0, difficulty: 'easy' },
    { id: 13, domain: 2, question: "What cognitive bias causes us to seek information confirming our beliefs?", options: ["Anchoring bias", "Confirmation bias", "Availability heuristic", "Dunning-Kruger effect"], correct: 1, difficulty: 'medium' },
    { id: 14, domain: 2, question: "Which sleep stage is most important for memory consolidation?", options: ["Stage 1", "Stage 2", "REM sleep", "Stage 3 (Deep sleep)"], correct: 3, difficulty: 'hard' },
    { id: 15, domain: 2, question: "What is the Stroop effect?", options: ["Memory interference", "Color-word interference", "Attention deficit", "Learning plateau"], correct: 1, difficulty: 'hard' },
    { id: 16, domain: 2, question: "Which part of the brain is responsible for executive functions?", options: ["Occipital lobe", "Temporal lobe", "Prefrontal cortex", "Parietal lobe"], correct: 2, difficulty: 'medium' },

    // Domain 3: AI & ML
    { id: 17, domain: 3, question: "What is overfitting in machine learning?", options: ["Model too simple", "Model too complex for training data", "Model perfectly balanced", "Model underfitting"], correct: 1, difficulty: 'medium' },
    { id: 18, domain: 3, question: "Which algorithm is used for classification and regression?", options: ["K-means", "Decision Trees", "PCA", "Apriori"], correct: 1, difficulty: 'easy' },
    { id: 19, domain: 3, question: "What does CNN stand for in deep learning?", options: ["Central Neural Network", "Convolutional Neural Network", "Cascading Neural Network", "Computational Neural Network"], correct: 1, difficulty: 'easy' },
    { id: 20, domain: 3, question: "What is the vanishing gradient problem?", options: ["Gradients become too large", "Gradients become too small", "No gradients exist", "Gradients oscillate"], correct: 1, difficulty: 'hard' },
    { id: 21, domain: 3, question: "Which activation function is most commonly used in hidden layers?", options: ["Sigmoid", "ReLU", "Linear", "Step"], correct: 1, difficulty: 'medium' },
    { id: 22, domain: 3, question: "What is transfer learning?", options: ["Training from scratch", "Using pre-trained models", "Transferring data", "Moving models between servers"], correct: 1, difficulty: 'medium' },
    { id: 23, domain: 3, question: "What does GAN stand for?", options: ["General Adversarial Network", "Generative Adversarial Network", "Gradient Adversarial Network", "Global Adversarial Network"], correct: 1, difficulty: 'medium' },
    { id: 24, domain: 3, question: "Which metric is best for imbalanced classification?", options: ["Accuracy", "F1-score", "MSE", "R-squared"], correct: 1, difficulty: 'hard' },

    // Domain 4: Physics
    { id: 25, domain: 4, question: "What is the speed of light in vacuum?", options: ["3×10^8 m/s", "3×10^6 m/s", "3×10^10 m/s", "3×10^5 m/s"], correct: 0, difficulty: 'easy' },
    { id: 26, domain: 4, question: "What is entropy in thermodynamics?", options: ["Energy", "Temperature", "Disorder", "Pressure"], correct: 2, difficulty: 'medium' },
    { id: 27, domain: 4, question: "Which particle is responsible for mass?", options: ["Photon", "Higgs boson", "Electron", "Quark"], correct: 1, difficulty: 'medium' },
    { id: 28, domain: 4, question: "What is Heisenberg's Uncertainty Principle about?", options: ["Energy conservation", "Position-momentum uncertainty", "Time dilation", "Wave-particle duality"], correct: 1, difficulty: 'hard' },
    { id: 29, domain: 4, question: "What force holds atomic nuclei together?", options: ["Electromagnetic", "Gravitational", "Strong nuclear", "Weak nuclear"], correct: 2, difficulty: 'medium' },
    { id: 30, domain: 4, question: "What is a black hole's event horizon?", options: ["Point of no return", "Center of black hole", "Edge of universe", "Wormhole entrance"], correct: 0, difficulty: 'medium' },
    { id: 31, domain: 4, question: "What does E=mc² represent?", options: ["Energy-mass equivalence", "Electric field", "Entropy formula", "Electromagnetic wave"], correct: 0, difficulty: 'easy' },
    { id: 32, domain: 4, question: "What is quantum entanglement?", options: ["Particle collision", "Correlated quantum states", "Wave interference", "Energy transfer"], correct: 1, difficulty: 'hard' },

    // Domain 5: Philosophy
    { id: 33, domain: 5, question: "Who wrote 'Meditations'?", options: ["Seneca", "Marcus Aurelius", "Epictetus", "Plato"], correct: 1, difficulty: 'easy' },
    { id: 34, domain: 5, question: "What is Kant's Categorical Imperative?", options: ["Act on universal maxims", "Maximize happiness", "Follow divine command", "Seek virtue"], correct: 0, difficulty: 'hard' },
    { id: 35, domain: 5, question: "What is the Ship of Theseus paradox about?", options: ["Time travel", "Identity over time", "Free will", "Knowledge"], correct: 1, difficulty: 'medium' },
    { id: 36, domain: 5, question: "Who is the father of Western philosophy?", options: ["Aristotle", "Plato", "Socrates", "Pythagoras"], correct: 2, difficulty: 'easy' },
    { id: 37, domain: 5, question: "What is Nietzsche's concept of 'Übermensch'?", options: ["Superman", "Overman/Higher human", "Underman", "Common man"], correct: 1, difficulty: 'medium' },
    { id: 38, domain: 5, question: "What is epistemology?", options: ["Study of being", "Study of knowledge", "Study of ethics", "Study of logic"], correct: 1, difficulty: 'medium' },
    { id: 39, domain: 5, question: "What is Descartes' famous statement?", options: ["Know thyself", "I think, therefore I am", "Life is suffering", "God is dead"], correct: 1, difficulty: 'easy' },
    { id: 40, domain: 5, question: "What is the Trolley Problem testing?", options: ["Logic", "Ethical reasoning", "Memory", "Perception"], correct: 1, difficulty: 'medium' },

    // Domain 6: Economics
    { id: 41, domain: 6, question: "What is opportunity cost?", options: ["Money spent", "Value of next best alternative", "Total cost", "Fixed cost"], correct: 1, difficulty: 'easy' },
    { id: 42, domain: 6, question: "What causes inflation?", options: ["Decrease in money supply", "Increase in money supply", "Decrease in demand", "Increase in savings"], correct: 1, difficulty: 'medium' },
    { id: 43, domain: 6, question: "What is GDP?", options: ["Government Debt Product", "Gross Domestic Product", "Global Development Plan", "General Demand Price"], correct: 1, difficulty: 'easy' },
    { id: 44, domain: 6, question: "What is a Nash Equilibrium?", options: ["Market equilibrium", "No player can benefit by changing strategy", "Supply equals demand", "Zero-sum game"], correct: 1, difficulty: 'hard' },
    { id: 45, domain: 6, question: "What is comparative advantage?", options: ["Being best at everything", "Lower opportunity cost", "Higher productivity", "More resources"], correct: 1, difficulty: 'medium' },
    { id: 46, domain: 6, question: "What is the law of diminishing returns?", options: ["Returns increase forever", "Returns eventually decrease", "Returns stay constant", "Returns become negative"], correct: 1, difficulty: 'medium' },
    { id: 47, domain: 6, question: "What is a monopoly?", options: ["Many sellers", "Single seller", "Two sellers", "Perfect competition"], correct: 1, difficulty: 'easy' },
    { id: 48, domain: 6, question: "What is quantitative easing?", options: ["Raising interest rates", "Central bank buying assets", "Increasing taxes", "Reducing government spending"], correct: 1, difficulty: 'hard' },

    // Domain 7: Language
    { id: 49, domain: 7, question: "What is a phoneme?", options: ["Smallest unit of meaning", "Smallest unit of sound", "Word structure", "Sentence structure"], correct: 1, difficulty: 'medium' },
    { id: 50, domain: 7, question: "What is syntax?", options: ["Word meaning", "Sentence structure", "Sound patterns", "Writing system"], correct: 1, difficulty: 'easy' },
    { id: 51, domain: 7, question: "Who developed the theory of Universal Grammar?", options: ["Saussure", "Chomsky", "Pinker", "Whorf"], correct: 1, difficulty: 'medium' },
    { id: 52, domain: 7, question: "What is pragmatics in linguistics?", options: ["Sound study", "Meaning study", "Context-dependent language use", "Grammar rules"], correct: 2, difficulty: 'hard' },
    { id: 53, domain: 7, question: "What is a morpheme?", options: ["Sound unit", "Smallest meaningful unit", "Sentence", "Paragraph"], correct: 1, difficulty: 'medium' },
    { id: 54, domain: 7, question: "What is the Sapir-Whorf hypothesis?", options: ["Language affects thought", "Thought affects language", "Language is innate", "Language is learned"], correct: 0, difficulty: 'hard' },
    { id: 55, domain: 7, question: "What is semantics?", options: ["Sound patterns", "Meaning study", "Grammar rules", "Writing systems"], correct: 1, difficulty: 'easy' },
    { id: 56, domain: 7, question: "What is code-switching?", options: ["Programming", "Alternating between languages", "Encryption", "Translation"], correct: 1, difficulty: 'medium' },

    // Domain 8: Biology
    { id: 57, domain: 8, question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"], correct: 1, difficulty: 'easy' },
    { id: 58, domain: 8, question: "What is DNA's structure?", options: ["Single helix", "Double helix", "Triple helix", "Quadruple helix"], correct: 1, difficulty: 'easy' },
    { id: 59, domain: 8, question: "What is natural selection?", options: ["Random mutation", "Survival of the fittest", "Genetic drift", "Gene flow"], correct: 1, difficulty: 'medium' },
    { id: 60, domain: 8, question: "What is homeostasis?", options: ["Cell division", "Maintaining internal balance", "Energy production", "Protein synthesis"], correct: 1, difficulty: 'medium' },
    { id: 61, domain: 8, question: "What are telomeres?", options: ["Chromosome ends", "Cell centers", "DNA mutations", "Protein structures"], correct: 0, difficulty: 'hard' },
    { id: 62, domain: 8, question: "What is CRISPR?", options: ["Protein", "Gene editing tool", "Cell type", "Organism"], correct: 1, difficulty: 'medium' },
    { id: 63, domain: 8, question: "What is the central dogma of molecular biology?", options: ["DNA→RNA→Protein", "Protein→RNA→DNA", "RNA→DNA→Protein", "DNA→Protein→RNA"], correct: 0, difficulty: 'hard' },
    { id: 64, domain: 8, question: "What is apoptosis?", options: ["Cell growth", "Programmed cell death", "Cell division", "Cell mutation"], correct: 1, difficulty: 'medium' },

    // Domain 9: Cybersecurity
    { id: 65, domain: 9, question: "What is a zero-day exploit?", options: ["Old vulnerability", "Unknown vulnerability", "Patched vulnerability", "Theoretical vulnerability"], correct: 1, difficulty: 'medium' },
    { id: 66, domain: 9, question: "What does CIA stand for in security?", options: ["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Cyber Intelligence Analysis", "Computer Information Access"], correct: 1, difficulty: 'easy' },
    { id: 67, domain: 9, question: "What is phishing?", options: ["Hacking hardware", "Social engineering attack", "Malware type", "Encryption method"], correct: 1, difficulty: 'easy' },
    { id: 68, domain: 9, question: "What is a DDoS attack?", options: ["Data theft", "Distributed Denial of Service", "Disk destruction", "Database deletion"], correct: 1, difficulty: 'medium' },
    { id: 69, domain: 9, question: "What is end-to-end encryption?", options: ["Server-side encryption", "Only sender and receiver can decrypt", "Database encryption", "Network encryption"], correct: 1, difficulty: 'medium' },
    { id: 70, domain: 9, question: "What is SQL injection?", options: ["Database query attack", "Network attack", "Physical attack", "Social engineering"], correct: 0, difficulty: 'medium' },
    { id: 71, domain: 9, question: "What is a honeypot in cybersecurity?", options: ["Password manager", "Decoy system", "Firewall", "Antivirus"], correct: 1, difficulty: 'hard' },
    { id: 72, domain: 9, question: "What is two-factor authentication?", options: ["Two passwords", "Two verification methods", "Two users", "Two devices"], correct: 1, difficulty: 'easy' },

    // Domain 10: Future Intelligence
    { id: 73, domain: 10, question: "What is the technological singularity?", options: ["AI surpasses human intelligence", "First computer", "Internet creation", "Quantum computing"], correct: 0, difficulty: 'medium' },
    { id: 74, domain: 10, question: "What is transhumanism?", options: ["Human extinction", "Human enhancement beyond current limits", "Time travel", "Space colonization"], correct: 1, difficulty: 'medium' },
    { id: 75, domain: 10, question: "What is neuromorphic computing?", options: ["Cloud computing", "Brain-inspired computing", "Quantum computing", "Distributed computing"], correct: 1, difficulty: 'hard' },
    { id: 76, domain: 10, question: "What is the Fermi Paradox?", options: ["Time travel paradox", "Why haven't we found aliens?", "Quantum paradox", "AI paradox"], correct: 1, difficulty: 'medium' },
    { id: 77, domain: 10, question: "What is AGI?", options: ["Artificial General Intelligence", "Advanced Graphics Interface", "Automated Game Intelligence", "Augmented General Interface"], correct: 0, difficulty: 'easy' },
    { id: 78, domain: 10, question: "What is the simulation hypothesis?", options: ["We live in a simulation", "Simulations are impossible", "Reality is an illusion", "Dreams are real"], correct: 0, difficulty: 'medium' },
    { id: 79, domain: 10, question: "What is quantum supremacy?", options: ["Quantum computer outperforms classical", "Quantum physics is superior", "Quantum mechanics rules", "Quantum entanglement"], correct: 0, difficulty: 'hard' },
    { id: 80, domain: 10, question: "What is the Drake Equation?", options: ["Physics formula", "Estimate of alien civilizations", "AI formula", "Quantum equation"], correct: 1, difficulty: 'medium' },

    // Domain 11: Global Intelligence
    { id: 81, domain: 11, question: "What is geopolitics?", options: ["Study of rocks", "Politics influenced by geography", "Global economics", "International trade"], correct: 1, difficulty: 'easy' },
    { id: 82, domain: 11, question: "What is soft power?", options: ["Military strength", "Cultural influence", "Economic sanctions", "Physical force"], correct: 1, difficulty: 'medium' },
    { id: 83, domain: 11, question: "What is the Thucydides Trap?", options: ["Economic crisis", "Rising power threatens established power", "Trade war", "Military alliance"], correct: 1, difficulty: 'hard' },
    { id: 84, domain: 11, question: "What is cultural relativism?", options: ["All cultures are equal", "Cultures should be understood in context", "Western culture is superior", "Culture doesn't matter"], correct: 1, difficulty: 'medium' },
    { id: 85, domain: 11, question: "What is the Westphalian system?", options: ["Economic system", "Nation-state sovereignty", "Trade agreement", "Military alliance"], correct: 1, difficulty: 'hard' },
    { id: 86, domain: 11, question: "What is diaspora?", options: ["Disease spread", "Scattered population from homeland", "Cultural festival", "Trade route"], correct: 1, difficulty: 'medium' },
    { id: 87, domain: 11, question: "What is the Bretton Woods system?", options: ["Forest management", "International monetary system", "Trade agreement", "Military pact"], correct: 1, difficulty: 'hard' },
    { id: 88, domain: 11, question: "What is realpolitik?", options: ["Idealistic politics", "Pragmatic power-based politics", "Democratic politics", "Socialist politics"], correct: 1, difficulty: 'medium' },

    // Domain 12: Meta-Learning
    { id: 89, domain: 12, question: "What is spaced repetition?", options: ["Continuous study", "Reviewing at increasing intervals", "Random review", "One-time study"], correct: 1, difficulty: 'easy' },
    { id: 90, domain: 12, question: "What is deliberate practice?", options: ["Random practice", "Focused, goal-oriented practice", "Easy practice", "Fun practice"], correct: 1, difficulty: 'medium' },
    { id: 91, domain: 12, question: "What is the Feynman Technique?", options: ["Math formula", "Teach to learn", "Memory palace", "Speed reading"], correct: 1, difficulty: 'medium' },
    { id: 92, domain: 12, question: "What is chunking in learning?", options: ["Breaking into pieces", "Grouping information", "Memorizing everything", "Skipping content"], correct: 1, difficulty: 'easy' },
    { id: 93, domain: 12, question: "What is metacognition?", options: ["Thinking about thinking", "Fast thinking", "Emotional thinking", "Creative thinking"], correct: 0, difficulty: 'medium' },
    { id: 94, domain: 12, question: "What is the forgetting curve?", options: ["Learning speed", "Memory decay over time", "Study schedule", "Brain capacity"], correct: 1, difficulty: 'medium' },
    { id: 95, domain: 12, question: "What is interleaving?", options: ["Mixing different topics", "Studying one topic deeply", "Taking breaks", "Group study"], correct: 0, difficulty: 'hard' },
    { id: 96, domain: 12, question: "What is a growth mindset?", options: ["Fixed abilities", "Abilities can be developed", "Natural talent only", "IQ is everything"], correct: 1, difficulty: 'easy' },

    // Domain 13: Creative Arts
    { id: 97, domain: 13, question: "What is the rule of thirds in composition?", options: ["Divide into thirds", "Use three colors", "Three subjects", "Three layers"], correct: 0, difficulty: 'easy' },
    { id: 98, domain: 13, question: "What is chiaroscuro?", options: ["Color mixing", "Light-dark contrast", "Perspective technique", "Brush technique"], correct: 1, difficulty: 'medium' },
    { id: 99, domain: 13, question: "What is the golden ratio?", options: ["1.414", "1.618", "1.732", "2.0"], correct: 1, difficulty: 'medium' },
    { id: 100, domain: 13, question: "What is negative space?", options: ["Dark areas", "Empty space around subject", "Background", "Shadows"], correct: 1, difficulty: 'easy' },
    { id: 101, domain: 13, question: "What is the hero's journey?", options: ["Travel story", "Narrative structure", "Character type", "Plot twist"], correct: 1, difficulty: 'medium' },
    { id: 102, domain: 13, question: "What is synesthesia in art?", options: ["Color theory", "Cross-sensory experience", "Perspective", "Texture"], correct: 1, difficulty: 'hard' },
    { id: 103, domain: 13, question: "What is the Kuleshov effect?", options: ["Color effect", "Film editing creates meaning", "Sound effect", "Camera angle"], correct: 1, difficulty: 'hard' },
    { id: 104, domain: 13, question: "What is impasto?", options: ["Thin paint", "Thick paint texture", "Watercolor technique", "Digital effect"], correct: 1, difficulty: 'medium' },

    // Domain 14: Public Systems
    { id: 105, domain: 14, question: "What is federalism?", options: ["Central government only", "Power divided between levels", "No government", "Military rule"], correct: 1, difficulty: 'easy' },
    { id: 106, domain: 14, question: "What is judicial review?", options: ["Reviewing laws", "Courts can declare laws unconstitutional", "Jury duty", "Legal appeal"], correct: 1, difficulty: 'medium' },
    { id: 107, domain: 14, question: "What is public goods theory?", options: ["Private property", "Non-excludable, non-rivalrous goods", "Government spending", "Tax policy"], correct: 1, difficulty: 'hard' },
    { id: 108, domain: 14, question: "What is bureaucracy?", options: ["Democracy", "Administrative system", "Monarchy", "Anarchy"], correct: 1, difficulty: 'easy' },
    { id: 109, domain: 14, question: "What is the tragedy of the commons?", options: ["Public benefit", "Overuse of shared resources", "Private property", "Government failure"], correct: 1, difficulty: 'medium' },
    { id: 110, domain: 14, question: "What is participatory budgeting?", options: ["Government decides", "Citizens decide budget allocation", "No budget", "Private funding"], correct: 1, difficulty: 'medium' },
    { id: 111, domain: 14, question: "What is administrative law?", options: ["Criminal law", "Governs government agencies", "Civil law", "International law"], correct: 1, difficulty: 'hard' },
    { id: 112, domain: 14, question: "What is e-governance?", options: ["Electronic voting only", "Digital government services", "Email system", "Online shopping"], correct: 1, difficulty: 'easy' },

    // Domain 15: Deep Computing
    { id: 113, domain: 15, question: "What is Big O notation?", options: ["Algorithm efficiency", "Programming language", "Data type", "Operating system"], correct: 0, difficulty: 'medium' },
    { id: 114, domain: 15, question: "What is the CAP theorem?", options: ["Consistency, Availability, Partition tolerance", "Computer Architecture Principles", "Central Access Protocol", "Cache Algorithm Performance"], correct: 0, difficulty: 'hard' },
    { id: 115, domain: 15, question: "What is MapReduce?", options: ["Navigation algorithm", "Distributed data processing", "Graphics rendering", "Network protocol"], correct: 1, difficulty: 'medium' },
    { id: 116, domain: 15, question: "What is a hash table?", options: ["Encryption method", "Key-value data structure", "Network protocol", "File system"], correct: 1, difficulty: 'easy' },
    { id: 117, domain: 15, question: "What is dynamic programming?", options: ["Web development", "Optimization technique", "Programming language", "Database query"], correct: 1, difficulty: 'hard' },
    { id: 118, domain: 15, question: "What is a binary search tree?", options: ["Linear structure", "Hierarchical sorted structure", "Graph structure", "Array structure"], correct: 1, difficulty: 'medium' },
    { id: 119, domain: 15, question: "What is NP-completeness?", options: ["Easy problems", "Hardest problems in NP", "Polynomial problems", "Linear problems"], correct: 1, difficulty: 'hard' },
    { id: 120, domain: 15, question: "What is parallel computing?", options: ["Sequential processing", "Simultaneous processing", "Cloud computing", "Quantum computing"], correct: 1, difficulty: 'easy' },

    // Domain 16: Social Engineering
    { id: 121, domain: 16, question: "What is cognitive dissonance?", options: ["Mental clarity", "Conflicting beliefs discomfort", "Memory loss", "Learning difficulty"], correct: 1, difficulty: 'medium' },
    { id: 122, domain: 16, question: "What is the halo effect?", options: ["Light perception", "One trait influences overall impression", "Memory enhancement", "Learning speed"], correct: 1, difficulty: 'medium' },
    { id: 123, domain: 16, question: "What is social proof?", options: ["Legal evidence", "Following others' behavior", "Personal identity", "Social media"], correct: 1, difficulty: 'easy' },
    { id: 124, domain: 16, question: "What is the foot-in-the-door technique?", options: ["Sales method", "Small request then larger", "Door-to-door sales", "Marketing strategy"], correct: 1, difficulty: 'medium' },
    { id: 125, domain: 16, question: "What is priming in psychology?", options: ["First impression", "Exposure influences response", "Memory technique", "Learning method"], correct: 1, difficulty: 'hard' },
    { id: 126, domain: 16, question: "What is groupthink?", options: ["Brainstorming", "Conformity suppresses dissent", "Team building", "Group learning"], correct: 1, difficulty: 'medium' },
    { id: 127, domain: 16, question: "What is the mere exposure effect?", options: ["First impression", "Familiarity increases liking", "Surprise effect", "Novelty preference"], correct: 1, difficulty: 'medium' },
    { id: 128, domain: 16, question: "What is reciprocity in influence?", options: ["Mutual exchange", "People return favors", "Competition", "Negotiation"], correct: 1, difficulty: 'easy' },

    // Domain 17: Planetary Health
    { id: 129, domain: 17, question: "What is the greenhouse effect?", options: ["Plant growth", "Atmospheric heat trapping", "Ocean warming", "Deforestation"], correct: 1, difficulty: 'easy' },
    { id: 130, domain: 17, question: "What is biodiversity?", options: ["Plant types", "Variety of life", "Animal species", "Ecosystem size"], correct: 1, difficulty: 'easy' },
    { id: 131, domain: 17, question: "What is carbon sequestration?", options: ["Carbon release", "Carbon capture and storage", "Carbon production", "Carbon trading"], correct: 1, difficulty: 'medium' },
    { id: 132, domain: 17, question: "What is eutrophication?", options: ["Water purification", "Nutrient pollution in water", "Ocean acidification", "Coral bleaching"], correct: 1, difficulty: 'hard' },
    { id: 133, domain: 17, question: "What is a keystone species?", options: ["Largest species", "Disproportionate ecosystem impact", "Most common species", "Endangered species"], correct: 1, difficulty: 'medium' },
    { id: 134, domain: 17, question: "What is the circular economy?", options: ["Round products", "Waste elimination system", "Economic cycle", "Trade system"], correct: 1, difficulty: 'medium' },
    { id: 135, domain: 17, question: "What is rewilding?", options: ["Zoo release", "Ecosystem restoration", "Wildlife hunting", "Forest planting"], correct: 1, difficulty: 'medium' },
    { id: 136, domain: 17, question: "What is ocean acidification?", options: ["Ocean pollution", "pH decrease from CO2", "Salt increase", "Temperature rise"], correct: 1, difficulty: 'hard' },

    // Domain 18: Quantum & Cosmos
    { id: 137, domain: 18, question: "What is quantum superposition?", options: ["Particle speed", "Multiple states simultaneously", "Particle collision", "Wave motion"], correct: 1, difficulty: 'medium' },
    { id: 138, domain: 18, question: "What is dark matter?", options: ["Black holes", "Invisible matter affecting gravity", "Dark energy", "Empty space"], correct: 1, difficulty: 'medium' },
    { id: 139, domain: 18, question: "What is the cosmic microwave background?", options: ["Star radiation", "Big Bang remnant radiation", "Galaxy light", "Black hole radiation"], correct: 1, difficulty: 'hard' },
    { id: 140, domain: 18, question: "What is quantum tunneling?", options: ["Particle teleportation", "Particle passes through barrier", "Particle collision", "Particle decay"], correct: 1, difficulty: 'hard' },
    { id: 141, domain: 18, question: "What is a quasar?", options: ["Star type", "Extremely bright galactic nucleus", "Planet", "Asteroid"], correct: 1, difficulty: 'medium' },
    { id: 142, domain: 18, question: "What is the Planck length?", options: ["Largest scale", "Smallest meaningful length", "Average distance", "Light year"], correct: 1, difficulty: 'hard' },
    { id: 143, domain: 18, question: "What is redshift?", options: ["Color change", "Light stretched by expansion", "Star color", "Heat radiation"], correct: 1, difficulty: 'medium' },
    { id: 144, domain: 18, question: "What is a neutron star?", options: ["New star", "Collapsed star core", "Exploding star", "Binary star"], correct: 1, difficulty: 'medium' },

    // Domain 19: Consciousness
    { id: 145, domain: 19, question: "What is the hard problem of consciousness?", options: ["Brain complexity", "Explaining subjective experience", "Memory storage", "Neural networks"], correct: 1, difficulty: 'hard' },
    { id: 146, domain: 19, question: "What is qualia?", options: ["Quantity", "Subjective experience quality", "Brain waves", "Consciousness level"], correct: 1, difficulty: 'hard' },
    { id: 147, domain: 19, question: "What is mindfulness?", options: ["Intelligence", "Present moment awareness", "Memory", "Concentration"], correct: 1, difficulty: 'easy' },
    { id: 148, domain: 19, question: "What is the default mode network?", options: ["Computer network", "Brain network active at rest", "Neural pathway", "Memory system"], correct: 1, difficulty: 'hard' },
    { id: 149, domain: 19, question: "What is ego death?", options: ["Physical death", "Loss of self-identity", "Brain damage", "Memory loss"], correct: 1, difficulty: 'medium' },
    { id: 150, domain: 19, question: "What is lucid dreaming?", options: ["Clear dreams", "Aware you're dreaming", "Vivid dreams", "Recurring dreams"], correct: 1, difficulty: 'easy' },
    { id: 151, domain: 19, question: "What is the global workspace theory?", options: ["Office design", "Consciousness as information broadcast", "Brain structure", "Memory theory"], correct: 1, difficulty: 'hard' },
    { id: 152, domain: 19, question: "What is metaconsciousness?", options: ["Super consciousness", "Awareness of awareness", "Unconsciousness", "Dream state"], correct: 1, difficulty: 'medium' },

    // Domain 20: Mythic Mastery
    { id: 153, domain: 20, question: "What is an archetype?", options: ["Ancient artifact", "Universal symbol or pattern", "Historical figure", "Mythology book"], correct: 1, difficulty: 'easy' },
    { id: 154, domain: 20, question: "What is the collective unconscious?", options: ["Group thinking", "Shared inherited memories", "Social consciousness", "Cultural knowledge"], correct: 1, difficulty: 'medium' },
    { id: 155, domain: 20, question: "What is the monomyth?", options: ["Single myth", "Hero's journey pattern", "Creation story", "Ancient text"], correct: 1, difficulty: 'medium' },
    { id: 156, domain: 20, question: "What is a trickster archetype?", options: ["Villain", "Boundary-crossing disruptor", "Hero", "Mentor"], correct: 1, difficulty: 'medium' },
    { id: 157, domain: 20, question: "What is the shadow in Jungian psychology?", options: ["Darkness", "Repressed aspects of self", "Evil twin", "Unconscious mind"], correct: 1, difficulty: 'hard' },
    { id: 158, domain: 20, question: "What is a creation myth?", options: ["Art story", "Origin of world story", "Hero story", "Love story"], correct: 1, difficulty: 'easy' },
    { id: 159, domain: 20, question: "What is the axis mundi?", options: ["Earth's axis", "World center/cosmic axis", "Mountain peak", "Tree trunk"], correct: 1, difficulty: 'hard' },
    { id: 160, domain: 20, question: "What is apotheosis?", options: ["Death", "Becoming divine", "Transformation", "Enlightenment"], correct: 1, difficulty: 'medium' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('arena_best_streak');
    if (saved) setBestStreak(parseInt(saved));
  }, []);

  const startQuiz = (quizMode: 'domain' | 'speed' | 'gauntlet', domain?: number) => {
    let selectedQuestions: Question[] = [];
    
    if (quizMode === 'domain' && domain) {
      selectedQuestions = questionBank.filter(q => q.domain === domain);
      setSelectedDomain(domain);
      setTimeLeft(0);
    } else if (quizMode === 'speed') {
      selectedQuestions = [...questionBank].sort(() => Math.random() - 0.5).slice(0, 20);
      setTimeLeft(120);
    } else if (quizMode === 'gauntlet') {
      selectedQuestions = [...questionBank].sort(() => Math.random() - 0.5);
      setTimeLeft(0);
    }
    
    setQuestions(selectedQuestions);
    setCurrentQuestion(0);
    setAnswers({});
    setMode(quizMode);
    setStartTime(Date.now());
  };

  const selectAnswer = (answerIndex: number) => {
    setAnswers({ ...answers, [currentQuestion]: answerIndex });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const domainScores: Record<number, { correct: number; total: number }> = {};
    let correct = 0;
    
    questions.forEach((q, idx) => {
      if (!domainScores[q.domain]) {
        domainScores[q.domain] = { correct: 0, total: 0 };
      }
      domainScores[q.domain].total++;
      
      if (answers[idx] === q.correct) {
        correct++;
        domainScores[q.domain].correct++;
      }
    });
    
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const newStreak = correct === questions.length ? streak + 1 : 0;
    setStreak(newStreak);
    
    if (newStreak > bestStreak) {
      setBestStreak(newStreak);
      localStorage.setItem('arena_best_streak', newStreak.toString());
    }
    
    setResult({
      score: correct,
      total: questions.length,
      domainScores,
      timeElapsed,
      mode: mode === 'domain' ? `Domain ${selectedDomain}` : mode === 'speed' ? 'Speed Round' : 'Gauntlet'
    });
    setMode('results');
  };

  useEffect(() => {
    if (timeLeft > 0 && (mode === 'speed' || mode === 'gauntlet')) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, mode]);

  useEffect(() => {
    if (mode === 'results' && result && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 400;
      canvas.height = 400;

      const centerX = 200;
      const centerY = 200;
      const radius = 150;
      const domains = Object.keys(result.domainScores).map(Number);
      
      ctx.clearRect(0, 0, 400, 400);
      
      // Draw grid circles
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw axes
      domains.forEach((_, idx) => {
        const angle = (idx / domains.length) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      });
      
      // Draw data polygon
      ctx.fillStyle = 'rgba(0, 243, 255, 0.2)';
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      domains.forEach((domain, idx) => {
        const score = result.domainScores[domain];
        const percentage = score.total > 0 ? score.correct / score.total : 0;
        const angle = (idx / domains.length) * Math.PI * 2 - Math.PI / 2;
        const distance = radius * percentage;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Draw labels
      ctx.fillStyle = '#c9a84c';
      ctx.font = '12px JetBrains Mono';
      ctx.textAlign = 'center';
      
      domains.forEach((domain, idx) => {
        const angle = (idx / domains.length) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius + 30);
        const y = centerY + Math.sin(angle) * (radius + 30);
        ctx.fillText(`D${domain}`, x, y);
      });
    }
  }, [mode, result]);

  if (mode === 'menu') {
    return (
      <div className="min-h-screen bg-black text-white p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-yellow-950/20" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <Link to="/" className="flex items-center text-neon-blue hover:text-neon-blue/80 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-mono text-sm">Back to Codex</span>
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 mb-4">
              THE ARENA
            </h1>
            <p className="text-gray-400 text-lg">Test your knowledge across all domains</p>
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-yellow-500" />
                <span className="font-mono text-sm">Streak: <span className="text-yellow-500">{streak}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold" />
                <span className="font-mono text-sm">Best: <span className="text-gold">{bestStreak}</span></span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-dark-card/60 backdrop-blur-md border border-red-500/30 rounded-xl p-6 hover:border-red-500 transition-all cursor-pointer group"
                 onClick={() => setShowDomainSelect(true)}>
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-red-500" />
                <span className="text-xs font-mono text-gray-500">8 QUESTIONS</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-red-500 transition-colors">Domain Drill</h3>
              <p className="text-sm text-gray-400">Master one domain at a time. 8 questions per domain.</p>
            </div>

            <div className="bg-dark-card/60 backdrop-blur-md border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500 transition-all cursor-pointer group"
                 onClick={() => startQuiz('speed')}>
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-yellow-500" />
                <span className="text-xs font-mono text-gray-500">2 MIN TIMER</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-500 transition-colors">Speed Round</h3>
              <p className="text-sm text-gray-400">20 random questions. 2 minutes. Think fast.</p>
            </div>

            <div className="bg-dark-card/60 backdrop-blur-md border border-gold/30 rounded-xl p-6 hover:border-gold transition-all cursor-pointer group"
                 onClick={() => startQuiz('gauntlet')}>
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-8 h-8 text-gold" />
                <span className="text-xs font-mono text-gray-500">80 QUESTIONS</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors">Gauntlet Mode</h3>
              <p className="text-sm text-gray-400">All 80 questions. No timer. Ultimate challenge.</p>
            </div>
          </div>

          {showDomainSelect && (
            <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-red-500">Select Domain</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {domainNames.map((name, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      startQuiz('domain', idx + 1);
                      setShowDomainSelect(false);
                    }}
                    className="p-3 bg-dark-bg border border-dark-border rounded-lg hover:border-red-500 hover:text-red-500 transition-all text-sm font-mono"
                  >
                    D{idx + 1}: {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'results' && result) {
    const percentage = Math.round((result.score / result.total) * 100);
    const grade = percentage >= 90 ? 'S' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'D';
    const gradeColor = percentage >= 90 ? 'text-gold' : percentage >= 80 ? 'text-green-500' : percentage >= 70 ? 'text-blue-500' : percentage >= 60 ? 'text-yellow-500' : 'text-red-500';

    return (
      <div className="min-h-screen bg-black text-white p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-black to-blue-950/20" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-mono text-neon-blue mb-2">RESULTS</h1>
            <p className="text-gray-400">{result.mode}</p>
          </div>

          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-8 mb-6">
            <div className="text-center mb-6">
              <div className={`text-8xl font-bold ${gradeColor} mb-4`}>{grade}</div>
              <div className="text-3xl font-mono mb-2">{result.score} / {result.total}</div>
              <div className="text-xl text-gray-400">{percentage}% Correct</div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-dark-bg/50 rounded-lg p-4">
                <Clock className="w-6 h-6 mx-auto mb-2 text-neon-blue" />
                <div className="text-sm text-gray-400">Time</div>
                <div className="font-mono text-lg">{Math.floor(result.timeElapsed / 60)}:{(result.timeElapsed % 60).toString().padStart(2, '0')}</div>
              </div>
              <div className="bg-dark-bg/50 rounded-lg p-4">
                <Flame className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-sm text-gray-400">Streak</div>
                <div className="font-mono text-lg">{streak}</div>
              </div>
              <div className="bg-dark-bg/50 rounded-lg p-4">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-gold" />
                <div className="text-sm text-gray-400">Best</div>
                <div className="font-mono text-lg">{bestStreak}</div>
              </div>
            </div>
          </div>

          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-8 mb-6">
            <h3 className="text-xl font-bold mb-4 text-neon-blue">Domain Performance</h3>
            <div className="flex justify-center mb-6">
              <canvas ref={canvasRef} className="max-w-full" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(result.domainScores).map(([domain, score]) => (
                <div key={domain} className="bg-dark-bg/50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Domain {domain}</div>
                  <div className="font-mono text-sm">{score.correct}/{score.total}</div>
                  <div className="text-xs text-neon-blue">{Math.round((score.correct / score.total) * 100)}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setMode('menu')}
              className="px-6 py-3 bg-dark-card border border-dark-border rounded-lg hover:border-neon-blue transition-all font-mono"
            >
              Back to Menu
            </button>
            <button
              onClick={() => {
                if (selectedDomain && result.mode.startsWith('Domain')) {
                  startQuiz('domain', selectedDomain);
                } else if (result.mode === 'Speed Round') {
                  startQuiz('speed');
                } else {
                  startQuiz('gauntlet');
                }
              }}
              className="px-6 py-3 bg-neon-blue text-black rounded-lg hover:bg-neon-blue/80 transition-all font-mono font-bold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-black text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-yellow-950/20" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-gray-400">
              Question {currentQuestion + 1} / {questions.length}
            </span>
            {mode === 'speed' && timeLeft > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className={`font-mono text-sm ${timeLeft < 30 ? 'text-red-500' : 'text-yellow-500'}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
          <span className="font-mono text-xs text-gray-500">Domain {currentQ.domain}</span>
        </div>

        <div className="w-full bg-dark-bg rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-8 mb-6">
          <h2 className="text-2xl font-bold mb-8">{currentQ.question}</h2>
          
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => selectAnswer(idx)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  answers[currentQuestion] === idx
                    ? 'border-neon-blue bg-neon-blue/10 text-neon-blue'
                    : 'border-dark-border hover:border-gray-600 hover:bg-white/5'
                }`}
              >
                <span className="font-mono text-sm mr-3 text-gray-500">{String.fromCharCode(65 + idx)}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setMode('menu')}
            className="px-6 py-3 bg-dark-card border border-dark-border rounded-lg hover:border-red-500 hover:text-red-500 transition-all font-mono"
          >
            Quit
          </button>
          <button
            onClick={nextQuestion}
            disabled={answers[currentQuestion] === undefined}
            className="px-6 py-3 bg-neon-blue text-black rounded-lg hover:bg-neon-blue/80 transition-all font-mono font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Arena;
