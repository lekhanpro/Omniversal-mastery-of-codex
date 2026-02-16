import { Quote, DomainConnection } from './types';

export const quotes: Quote[] = [
  { text: "What I cannot create, I do not understand.", author: "Richard Feynman", domain: "Scientific Intelligence & Systems" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche", domain: "Philosophical Engineering" },
  { text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", author: "Albert Einstein", domain: "Scientific Intelligence & Systems" },
  { text: "We can only see a short distance ahead, but we can see plenty there that needs to be done.", author: "Alan Turing", domain: "Tech Creation & Digital Wizardry" },
  { text: "The superior man thinks always of virtue; the common man thinks of comfort.", author: "Confucius", domain: "Philosophical Engineering" },
  { text: "The present is theirs; the future, for which I really worked, is mine.", author: "Nikola Tesla", domain: "Scientific Intelligence & Systems" },
  { text: "Information is the resolution of uncertainty.", author: "Claude Shannon", domain: "Deep Computing & Data Mastery" },
  { text: "Read Euler, read Euler, he is the master of us all.", author: "Pierre-Simon Laplace", domain: "Deep Computing & Data Mastery" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", domain: "Strategic Business & Finance" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", domain: "Strategic Business & Finance" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch", domain: "Mind & Cognitive Science" },
  { text: "Language is the house of being.", author: "Martin Heidegger", domain: "Communication & Influence" }
];

export const domainConnections: DomainConnection[] = [
  { from: 1, to: 2 }, // Physical Mastery → Mind & Cognitive
  { from: 1, to: 7 }, // Physical Mastery → Philosophy
  { from: 2, to: 3 }, // Mind → Tech
  { from: 2, to: 4 }, // Mind → AI
  { from: 2, to: 12 }, // Mind → Meta-Learning
  { from: 3, to: 4 }, // Tech → AI
  { from: 3, to: 9 }, // Tech → Cybersecurity
  { from: 3, to: 15 }, // Tech → Deep Computing
  { from: 4, to: 5 }, // AI → Science
  { from: 4, to: 15 }, // AI → Deep Computing
  { from: 5, to: 17 }, // Science → Planetary Health
  { from: 6, to: 10 }, // Business → Future Intelligence
  { from: 6, to: 11 }, // Business → Global Intelligence
  { from: 7, to: 8 }, // Philosophy → Communication
  { from: 7, to: 16 }, // Philosophy → Social Engineering
  { from: 8, to: 16 }, // Communication → Social Engineering
  { from: 9, to: 3 }, // Cybersecurity → Tech
  { from: 10, to: 11 }, // Future → Global
  { from: 11, to: 14 }, // Global → Public Systems
  { from: 12, to: 2 }, // Meta-Learning → Mind
  { from: 13, to: 8 }, // Creative Arts → Communication
  { from: 14, to: 6 }, // Public Systems → Business
  { from: 15, to: 4 }, // Deep Computing → AI
  { from: 16, to: 8 }, // Social Engineering → Communication
  { from: 17, to: 5 }  // Planetary Health → Science
];
