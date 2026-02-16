import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Circle, CheckCircle2 } from 'lucide-react';
import { Topic } from '../types';

interface AccordionProps {
  topic: Topic;
  defaultOpen?: boolean;
  index: number;
  domainId: number;
}

const Accordion: React.FC<AccordionProps> = ({ topic, defaultOpen = false, index, domainId }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [checkedPoints, setCheckedPoints] = useState<Set<number>>(new Set());

  useEffect(() => {
    const checked = new Set<number>();
    topic.points.forEach((_, pointIdx) => {
      const key = `codex_d${domainId}_s${index}_p${pointIdx}`;
      if (localStorage.getItem(key) === 'true') {
        checked.add(pointIdx);
      }
    });
    setCheckedPoints(checked);
  }, [domainId, index, topic.points]);

  const togglePoint = (pointIdx: number) => {
    const key = `codex_d${domainId}_s${index}_p${pointIdx}`;
    const newChecked = new Set(checkedPoints);
    
    if (newChecked.has(pointIdx)) {
      newChecked.delete(pointIdx);
      localStorage.removeItem(key);
    } else {
      newChecked.add(pointIdx);
      localStorage.setItem(key, 'true');
    }
    
    setCheckedPoints(newChecked);
    window.dispatchEvent(new Event('storage'));
  };

  const completionPercentage = (checkedPoints.size / topic.points.length) * 100;

  return (
    <div className="mb-4 border border-dark-border bg-dark-card/50 backdrop-blur-sm rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center flex-1">
            <span className="font-mono text-neon-blue mr-4 opacity-50">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="font-semibold text-lg text-gray-100 flex-1">{topic.title}</h3>
            <span className="text-xs font-mono text-gray-500 mr-4">
              {checkedPoints.size}/{topic.points.length}
            </span>
        </div>
        <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
        >
            <ChevronDown className="w-5 h-5 text-neon-blue" />
        </motion.div>
      </button>

      {completionPercentage > 0 && (
        <div className="h-1 bg-dark-bg">
          <div 
            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 pt-0 border-t border-dark-border/50">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                {topic.points.map((point, idx) => {
                  const isChecked = checkedPoints.has(idx);
                  return (
                    <li 
                      key={idx} 
                      className={`flex items-start text-sm cursor-pointer p-2 rounded hover:bg-white/5 transition-all ${
                        isChecked ? 'text-neon-blue' : 'text-gray-400'
                      }`}
                      onClick={() => togglePoint(idx)}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-neon-blue flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 mr-2 mt-0.5 text-neon-purple flex-shrink-0" />
                      )}
                      <span className={isChecked ? 'line-through' : ''}>{point}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
