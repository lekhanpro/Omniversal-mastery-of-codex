import React, { useState, useEffect } from 'react';
import { domains } from '../data';
import { Trash2 } from 'lucide-react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WeeklyPlanner: React.FC = () => {
  const [plannerData, setPlannerData] = useState<{ [key: number]: { domain: string; goal: string } }>({});

  useEffect(() => {
    const data: { [key: number]: { domain: string; goal: string } } = {};
    days.forEach((_, index) => {
      data[index] = {
        domain: localStorage.getItem(`planner_day${index}_domain`) || '',
        goal: localStorage.getItem(`planner_day${index}_goal`) || ''
      };
    });
    setPlannerData(data);
  }, []);

  const handleDomainChange = (dayIndex: number, value: string) => {
    if (value) {
      localStorage.setItem(`planner_day${dayIndex}_domain`, value);
    } else {
      localStorage.removeItem(`planner_day${dayIndex}_domain`);
    }
    setPlannerData(prev => ({
      ...prev,
      [dayIndex]: { ...prev[dayIndex], domain: value }
    }));
  };

  const handleGoalChange = (dayIndex: number, value: string) => {
    if (value) {
      localStorage.setItem(`planner_day${dayIndex}_goal`, value);
    } else {
      localStorage.removeItem(`planner_day${dayIndex}_goal`);
    }
    setPlannerData(prev => ({
      ...prev,
      [dayIndex]: { ...prev[dayIndex], goal: value }
    }));
  };

  const clearWeek = () => {
    if (window.confirm('Are you sure you want to clear the entire week?')) {
      days.forEach((_, index) => {
        localStorage.removeItem(`planner_day${index}_domain`);
        localStorage.removeItem(`planner_day${index}_goal`);
      });
      const emptyData: { [key: number]: { domain: string; goal: string } } = {};
      days.forEach((_, index) => {
        emptyData[index] = { domain: '', goal: '' };
      });
      setPlannerData(emptyData);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
        {days.map((day, index) => {
          const hasDomain = plannerData[index]?.domain;
          return (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all ${
                hasDomain
                  ? 'bg-neon-blue/5 border-neon-blue/30 shadow-[0_0_20px_rgba(0,243,255,0.1)]'
                  : 'bg-dark-card border-dark-border'
              }`}
            >
              <h3 className="text-lg font-bold text-neon-blue mb-3 text-center font-mono">
                {day}
              </h3>
              <select
                value={plannerData[index]?.domain || ''}
                onChange={(e) => handleDomainChange(index, e.target.value)}
                className="w-full px-3 py-2 mb-3 bg-dark-bg border border-dark-border rounded-lg text-gray-200 text-sm focus:outline-none focus:border-neon-blue transition-colors"
              >
                <option value="">Select Domain...</option>
                {domains.filter(d => !d.isLocked).map(d => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Today's goal..."
                value={plannerData[index]?.goal || ''}
                onChange={(e) => handleGoalChange(index, e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-neon-blue transition-colors"
              />
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={clearWeek}
          className="inline-flex items-center gap-2 px-6 py-3 bg-dark-card border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-all font-mono"
        >
          <Trash2 className="w-4 h-4" />
          Clear Week
        </button>
      </div>
    </div>
  );
};

export default WeeklyPlanner;
