import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Circle } from 'lucide-react';
import { Topic } from '../types';

interface AccordionProps {
  topic: Topic;
  defaultOpen?: boolean;
  index: number;
}

const Accordion: React.FC<AccordionProps> = ({ topic, defaultOpen = false, index }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 border border-dark-border bg-dark-card/50 backdrop-blur-sm rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center">
            <span className="font-mono text-neon-blue mr-4 opacity-50">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="font-semibold text-lg text-gray-100">{topic.title}</h3>
        </div>
        <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
        >
            <ChevronDown className="w-5 h-5 text-neon-blue" />
        </motion.div>
      </button>

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
                {topic.points.map((point, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-400">
                    <Circle className="w-2 h-2 mr-2 mt-1.5 text-neon-purple fill-neon-purple" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
