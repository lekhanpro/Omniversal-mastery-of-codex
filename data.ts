import { Domain } from './types';

export const domains: Domain[] = [
  {
    id: 1,
    title: "Physical Mastery & Combat Systems",
    shortDescription: "Biomechanics, physiology, and combat intelligence unified for somatic dominance.",
    icon: "Sword",
    pillars: [
      "Biomechanics – how the body moves",
      "Physiology – how the body functions",
      "Combat Intelligence – how the body fights",
      "Somatic Mastery – how the body adapts"
    ],
    subdomains: [
      {
        title: "Biomechanics & Movement Science",
        points: ["Human anatomy", "Functional joint mechanics", "Movement patterns", "Gait cycle analysis", "Kinetic chain optimization", "Center of gravity control", "Biotensegrity theory"]
      },
      {
        title: "Strength & Power Engineering",
        points: ["Progressive overload systems", "Maximal strength training", "Explosive power development", "Plyometrics", "Isometrics", "Tendon strength conditioning"]
      },
      {
        title: "Endurance & Conditioning",
        points: ["Cardiovascular endurance", "VO2 max training", "Sprint mechanics", "Metabolic conditioning (MetCon)", "Respiratory control training"]
      },
      {
        title: "Mobility, Flexibility & Joint Freedom",
        points: ["Dynamic mobility", "Loaded stretching", "Joint decompression", "Movement flow systems", "Spinal mobility"]
      },
      {
        title: "Tactical Combat Systems",
        points: ["Reaction speed training", "Distance management", "Fight IQ", "Tactical feints", "Combat footwork theory", "Pressure control"]
      },
      {
        title: "Striking Arts",
        points: ["Boxing mechanics", "Muay Thai striking", "Karate striking science", "Wing Chun chain punching", "Power generation physics"]
      },
      {
        title: "Grappling & Control Arts",
        points: ["Brazilian Jiu-Jitsu", "Wrestling takedowns", "Judo throwing systems", "Ground control", "Leverage-based submissions"]
      },
      {
        title: "Weapons Systems",
        points: ["Bladed weapons", "Staff & stick arts", "Tactical weapon retention", "Disarm mechanics"]
      },
      {
        title: "Combat Psychology",
        points: ["Threat response control", "Adrenaline management", "Fight mindset", "Flow state induction", "Cognitive reaction conditioning"]
      }
    ],
    advancedLayers: [
      { name: "Mechanical Mastery", description: "Movement efficiency, force output, kinetic chains" },
      { name: "Energetic Mastery", description: "Energy systems, stamina, breath control" },
      { name: "Perceptual Mastery", description: "Reading opponents, spatial intelligence, anticipation" },
      { name: "Strategic Mastery", description: "Tactical patterns, opponent psychology, game theory" },
      { name: "Integrated Mastery", description: "Mind-body synchronization, flow state, unconscious competence" }
    ],
    tracks: [
      { name: "Warrior Conditioning", description: "Complete physical dominance (Strength, speed, endurance)" },
      { name: "Tactical Operator", description: "Strategic, real-world combat ability (Fight IQ, weapons)" },
      { name: "Combat Athlete", description: "Competition-level striking/grappling mastery" },
      { name: "Somatic Master", description: "Total control of body, movement, breath, awareness" }
    ]
  },
  {
    id: 2,
    title: "Mind & Cognitive Science",
    shortDescription: "The architecture of intelligence, memory, perception, and consciousness.",
    icon: "Brain",
    pillars: [
      "Cognition – processing information",
      "Neuroscience – brain operation",
      "Psychology – behavior emergence",
      "Computation – intelligence modeling",
      "Philosophy of Mind – consciousness",
      "Linguistics – language structure"
    ],
    subdomains: [
      {
        title: "Memory Systems",
        points: ["Working memory", "Long-term memory", "Encoding mechanisms", "Memory distortions", "Neural substrates (hippocampus)"]
      },
      {
        title: "Attention & Focus Architecture",
        points: ["Selective attention", "Deep work states", "Executive control", "Cognitive load", "Flow state triggers"]
      },
      {
        title: "Perception Systems",
        points: ["Visual perception", "Pattern recognition", "Top-down vs bottom-up processing", "Gestalt principles"]
      },
      {
        title: "Learning & Skill Acquisition",
        points: ["Schema formation", "Chunking", "Spaced repetition", "Neural plasticity", "Transfer of learning"]
      },
      {
        title: "Decision-Making & Reasoning",
        points: ["Logic-based reasoning", "Heuristics & biases", "Game theory cognition", "Bayesian decision-making"]
      },
      {
        title: "Intelligence Frameworks",
        points: ["Fluid vs crystallized intelligence", "Computational intelligence", "Metacognition", "Creativity & divergent thinking"]
      },
      {
        title: "Cognitive Bias Architecture",
        points: ["Confirmation bias", "Anchoring", "Loss aversion", "First-principles thinking", "Debiasing strategies"]
      }
    ],
    advancedLayers: [
      { name: "Mechanical Cognition", description: "Information processing, memory, perception." },
      { name: "Strategic Cognition", description: "Decision-making, intelligence, problem-solving." },
      { name: "Emotional Cognition", description: "Affect, empathy, self-regulation." },
      { name: "Meta-Cognition", description: "Self-awareness, learning optimization, insight generation." },
      { name: "Integrated Cognitive Mastery", description: "High-level cognitive performance." }
    ],
    tracks: [
      { name: "Cognitive Scientist", description: "Research, modeling, theory-building." },
      { name: "Cognitive Engineer", description: "Building AI, computational models, intelligent systems." },
      { name: "Neuropsychology Practitioner", description: "Brain-behavior relationships, assessment." },
      { name: "Human Performance Architect", description: "Peak mental performance, focus, learning engineering." }
    ]
  },
  {
    id: 3,
    title: "Tech Creation & Digital Wizardry",
    shortDescription: "Full-spectrum creation: Engineering, Architecture, UI/UX, and DevOps.",
    icon: "Cpu",
    pillars: [
      "Software Engineering", "Digital Architecture", "UI/UX Mastery", "Cloud & Infrastructure", "Product Engineering", "HCI"
    ],
    subdomains: [
      { title: "Programming Foundations", points: ["Algorithms", "Data structures", "Clean code", "Design patterns"] },
      { title: "Frontend Development", points: ["React/Next.js", "TailwindCSS", "State management", "WebAssembly"] },
      { title: "Backend Development", points: ["Microservices", "GraphQL/REST", "Database design", "Auth systems"] },
      { title: "Cloud Computing", points: ["AWS/Azure", "Kubernetes", "Serverless", "Infrastructure-as-Code"] },
      { title: "DevOps & Automation", points: ["CI/CD pipelines", "Containerization", "Observability", "SRE"] },
      { title: "Security & Defense", points: ["Cryptography", "OWASP", "Identity management", "Secure coding"] }
    ],
    advancedLayers: [
      { name: "Coding Mastery", description: "Syntax, structures, problem-solving." },
      { name: "System Mastery", description: "APIs, databases, architecture." },
      { name: "Product Mastery", description: "Designing meaningful, impactful apps." },
      { name: "Infrastructure Mastery", description: "Cloud, deployment, DevOps." },
      { name: "Innovation Mastery", description: "VR, AR, BCI, future interfaces." }
    ],
    tracks: [
      { name: "Full-Stack Engineer", description: "Frontend + Backend + Cloud." },
      { name: "System & Cloud Engineer", description: "Backend, databases, cloud, DevOps." },
      { name: "UI/UX + Product Designer", description: "Interaction design, visual systems." },
      { name: "Digital Wizard", description: "Build anything, design anything, deploy anything." }
    ]
  },
  {
    id: 4,
    title: "AI, Robotics & Automation",
    shortDescription: "Building intelligent agents, physical robotics, and autonomous systems.",
    icon: "Bot",
    pillars: ["Artificial Intelligence", "Machine Learning", "Robotics", "Automation", "Embedded Systems", "HRI"],
    subdomains: [
      { title: "AI Foundations", points: ["Agents", "Search algorithms", "Game theory", "Knowledge representation"] },
      { title: "Machine Learning", points: ["Supervised/Unsupervised", "Reinforcement learning", "Neural Networks", "Transformers"] },
      { title: "Deep Learning", points: ["CNNs", "RNNs/LSTMs", "Diffusion models", "LLMs & Prompt Engineering"] },
      { title: "Computer Vision", points: ["Object detection", "Segmentation", "3D reconstruction", "SLAM"] },
      { title: "Robotics Engineering", points: ["Kinematics", "Trajectory planning", "Control systems (PID/MPC)", "Sensors"] },
      { title: "Automation", points: ["PLC", "SCADA", "Industrial IOT", "Process automation"] }
    ],
    tracks: [
      { name: "AI Engineer", description: "Deep learning, NLP, CV, models." },
      { name: "Robotics Engineer", description: "Kinematics, control, perception." },
      { name: "Automation Architect", description: "Industrial automation, PLC, SCADA." },
      { name: "AGI Researcher", description: "Neuro-inspired AI, next-gen systems." }
    ]
  },
  {
    id: 5,
    title: "Scientific Intelligence & Systems",
    shortDescription: "Understanding the fundamental workings of reality from particles to ecosystems.",
    icon: "Atom",
    pillars: ["Physics", "Chemistry", "Biology", "Math Modeling", "Systems Thinking", "Scientific Reasoning"],
    subdomains: [
      { title: "Physics", points: ["Quantum mechanics", "Relativity", "Thermodynamics", "Fluid dynamics"] },
      { title: "Chemistry", points: ["Atomic structure", "Reaction kinetics", "Organic chemistry", "Materials science"] },
      { title: "Biology", points: ["Genetics", "Neurobiology", "Evolutionary biology", "Bioenergetics"] },
      { title: "Mathematics", points: ["Calculus", "Linear Algebra", "Probability", "Topology"] },
      { title: "Complexity Science", points: ["Chaos theory", "Network theory", "Emergence", "Feedback loops"] }
    ],
    tracks: [
      { name: "Pure Scientist", description: "Deep physics/chemistry/biology mastery." },
      { name: "Scientific Modeler", description: "Mathematical & computational modeling." },
      { name: "Systems Thinker", description: "Complex systems, ecology, adaptive networks." },
      { name: "Research Engineer", description: "Applied science into engineering solutions." }
    ]
  },
  {
    id: 6,
    title: "Strategic Business & Finance",
    shortDescription: "Mastering markets, capital allocation, and organizational leadership.",
    icon: "TrendingUp",
    pillars: ["Strategy", "Entrepreneurship", "Finance", "Operations", "Marketing", "Leadership"],
    subdomains: [
      { title: "Business Strategy", points: ["Game theory", "Blue ocean strategy", "Value chain analysis", "Moats"] },
      { title: "Entrepreneurship", points: ["Lean startup", "MVP", "Product-market fit", "Scaling"] },
      { title: "Financial Architecture", points: ["P&L management", "Valuation (DCF)", "Capital allocation", "Unit economics"] },
      { title: "Investment", points: ["Portfolio theory", "Derivatives", "Macro-economics", "Venture capital"] },
      { title: "Marketing", points: ["Consumer psychology", "Brand positioning", "Growth hacking", "Funnel architecture"] }
    ],
    tracks: [
      { name: "Business Strategist", description: "Competitive strategy + systems thinking." },
      { name: "Entrepreneur & Founder", description: "Build ideas → products → companies." },
      { name: "Financial Architect", description: "Investments, capital, valuation, wealth systems." },
      { name: "Marketing Architect", description: "Brand building + digital growth + revenue scale." }
    ]
  },
  {
    id: 7,
    title: "Philosophical Engineering",
    shortDescription: "Inner mastery, logic, ethics, and the engineering of the self.",
    icon: "Scale",
    pillars: ["Philosophy", "Self-Mastery", "Meaning", "Ethics", "Logic", "Existentialism"],
    subdomains: [
      { title: "Metaphysics", points: ["Ontology", "Free will vs determinism", "Consciousness"] },
      { title: "Epistemology", points: ["Rationalism vs Empiricism", "Scientific method", "Truth theories"] },
      { title: "Logic & Reasoning", points: ["Formal logic", "Fallacies", "First principles", "Mental models"] },
      { title: "Stoicism & Wisdom", points: ["Emotional regulation", "Virtue ethics", "Mindfulness", "Resilience"] },
      { title: "Existentialism", points: ["Authenticity", "Responsibility", "Meaning construction", "Absurdism"] }
    ],
    tracks: [
      { name: "Philosopher-Engineer", description: "Clarity + logic + real-world application." },
      { name: "Inner Mastery Architect", description: "Emotional, mental, spiritual self-regulation." },
      { name: "Ethical Strategist", description: "Moral reasoning for leadership & innovation." },
      { name: "Consciousness Explorer", description: "Mind, awareness, introspection." }
    ]
  },
  {
    id: 8,
    title: "Communication & Influence",
    shortDescription: "The art of rhetoric, persuasion, storytelling, and negotiation.",
    icon: "Mic",
    pillars: ["Verbal", "Non-Verbal", "Persuasion", "Writing", "Social Intelligence", "Narrative"],
    subdomains: [
      { title: "Verbal Mastery", points: ["Vocal projection", "Tonality", "Rhetoric", "Public speaking"] },
      { title: "Non-Verbal", points: ["Body language", "Micro-expressions", "Proxemics", "Eye contact"] },
      { title: "Persuasion Psychology", points: ["Cialdini’s principles", "Framing", "Cognitive biases", "Negotiation"] },
      { title: "Narrative Engineering", points: ["Story structure", "Hero’s journey", "Metaphor", "Copywriting"] },
      { title: "Conflict Resolution", points: ["De-escalation", "Mediation", "Diplomacy", "High-stakes conversation"] }
    ],
    tracks: [
      { name: "Communication Architect", description: "Expert in speech, writing, clarity." },
      { name: "Influence Strategist", description: "Persuasion, psychology, decision shaping." },
      { name: "Social Intelligence Engineer", description: "Interpersonal mastery + relationship architecture." },
      { name: "Narrative Master", description: "Crafts powerful stories, scripts, brand narratives." }
    ]
  },
  {
    id: 9,
    title: "Cybernetics & Cybersecurity",
    shortDescription: "Control systems, digital defense, ethical hacking, and information warfare.",
    icon: "ShieldAlert",
    pillars: ["Cybernetics", "Security", "Ethical Hacking", "Network Arch", "Digital Warfare", "SecEng"],
    subdomains: [
      { title: "Cybernetics", points: ["Feedback loops", "System stability", "Information theory", "Entropy"] },
      { title: "Offensive Security", points: ["Penetration testing", "Exploit development", "Social engineering", "Red teaming"] },
      { title: "Defensive Security", points: ["Blue teaming", "Incident response", "Forensics", "Cryptography"] },
      { title: "Network Security", points: ["Protocols (TCP/IP)", "Firewalls", "VPNs", "Traffic analysis"] },
      { title: "Cyber Warfare", points: ["APT groups", "Digital sovereignty", "PsyOps", "Critical infrastructure"] }
    ],
    tracks: [
      { name: "Cybersecurity Engineer", description: "Defense, architecture, SOC operations." },
      { name: "Red Team Specialist", description: "Pen-testing, exploitation, offensive security." },
      { name: "Digital Forensics Analyst", description: "Incident response, malware analysis, attribution." },
      { name: "Cyber Warfare Strategist", description: "Nation-state operations, intelligence, geopolitics." }
    ]
  },
  {
    id: 10,
    title: "Future Intelligence & Foresight",
    shortDescription: "Forecasting, scenario planning, and architecting the trajectory of civilization.",
    icon: "Telescope",
    pillars: ["Futures Thinking", "Emerging Tech", "Foresight", "Scenarios", "Risk", "Long-Termism"],
    subdomains: [
      { title: "Futures Thinking", points: ["Horizon scanning", "Trend analysis", "Wildcards", "Black swans"] },
      { title: "Scenario Planning", points: ["Backcasting", "World-building", "Simulation", "Wargaming"] },
      { title: "Emerging Tech", points: ["Nanotech", "Biotech", "Spacefaring", "Energy transition"] },
      { title: "Civilizational Risks", points: ["Existential risk (X-Risk)", "Great Filter", "AI Alignment", "Climate resilience"] },
      { title: "Post-Humanism", points: ["Transhumanism", "Brain-machine interfaces", "Genetic engineering", "Longevity"] }
    ],
    tracks: [
      { name: "Futurist & Analyst", description: "Predict and map the future." },
      { name: "Innovation Architect", description: "Design breakthrough technologies and systems." },
      { name: "Civilization Strategist", description: "Understand long-term global patterns." },
      { name: "Human Futures Designer", description: "Map the future of identity, consciousness, and humanity." }
    ]
  },
  {
    id: 11,
    title: "Global Intelligence & Cultural Fluency",
    shortDescription: "Global strategy, anthropology, diplomacy, and geopolitical systems thinking.",
    icon: "Globe",
    pillars: [
      "Cultural Anthropology – how humans form cultures",
      "Geopolitics & Power – how nations act and influence",
      "Global Economics – how money flows across borders",
      "Diplomacy & International Relations – how states cooperate",
      "Civilizations & Societies – how cultures evolve",
      "Cross-Cultural Communication – understanding people globally",
      "Global Systems & Institutions – how the world is governed",
      "Worldviews, Religion & Belief Systems – how meaning shapes society"
    ],
    subdomains: [
      {
        title: "Cultural Anthropology",
        points: ["Cultural systems", "Traditions & customs", "Social norms", "Identity formation", "Rituals & symbolic behavior", "Kinship systems", "Cross-cultural psychology", "Cultural evolution", "Language as culture", "Material culture"]
      },
      {
        title: "Civilizations & Macro-Culture",
        points: ["Civilizational histories", "Cultural archetypes", "East vs West paradigms", "Tribal vs national identity", "Collective memory", "Cultural resilience", "Cultural fusion", "Civilizational cycles", "Cultural decline & renewal"]
      },
      {
        title: "Geopolitics & Power Structures",
        points: ["National power models", "Geography & strategic advantage", "Border dynamics", "Security dilemmas", "Superpower competition", "Military strategy", "Geopolitical alliances", "Resource competition", "Sea power vs land power", "Multipolarity"]
      },
      {
        title: "Global Political Systems",
        points: ["Democracy", "Authoritarianism", "Hybrid political systems", "Federal vs unitary states", "Political legitimacy", "Governance frameworks", "Public policy systems", "Human rights infrastructure", "Political ideology analysis", "Election systems"]
      },
      {
        title: "International Relations (IR)",
        points: ["Realism", "Liberalism", "Constructivism", "Soft power", "Hard power", "Economic statecraft", "Diplomacy", "Treaties & negotiations", "Multilateralism", "Peace & conflict studies"]
      },
      {
        title: "Global Economics",
        points: ["Trade systems", "Global markets", "Currency & exchange dynamics", "Financial institutions", "Development economics", "Supply chains", "Economic sanctions", "Resource economics", "Economic blocs", "Global inequality systems"]
      },
      {
        title: "Global Institutions & Governance",
        points: ["United Nations", "IMF", "World Bank", "WTO", "NATO", "WHO", "Intergovernmental treaties", "International law", "Climate agreements", "NGO networks"]
      },
      {
        title: "Cultural Psychology & Worldview Systems",
        points: ["Cultural value frameworks (Hofstede)", "Individualism vs collectivism", "High-context vs low-context cultures", "Belief systems", "Cultural scripts", "Emotion across cultures", "Cross-cultural behavior prediction", "Stereotypes & cultural bias", "Social identity theory", "Intergroup dynamics"]
      },
      {
        title: "World Religions & Belief Architectures",
        points: ["Hinduism", "Buddhism", "Christianity", "Islam", "Judaism", "Indigenous religions", "Atheism & secularism", "New-age spiritualities", "Comparative religion", "Religion & societal behavior"]
      },
      {
        title: "Migration & Global Human Movement",
        points: ["Diaspora communities", "Refugee systems", "Economic migration", "Cultural integration", "Border conflict", "Multiculturalism", "Global labor flows", "Identity change in migration", "Demographic transitions", "Urbanization dynamics"]
      },
      {
        title: "Global Security & Conflict",
        points: ["War theory", "Nuclear strategy", "Hybrid warfare", "Cyber warfare", "Terrorism studies", "Insurgency & counterinsurgency", "Intelligence operations", "Regional conflict mapping", "Peacebuilding", "Strategic deterrence"]
      },
      {
        title: "Cross-Cultural Communication",
        points: ["Communication styles", "Non-verbal cultural cues", "Translation challenges", "Diplomatic communication", "Business etiquette globally", "Cultural miscommunication prevention", "Global emotional expression", "Speech indirectness vs directness", "Cultural humor", "Trust-building across cultures"]
      },
      {
        title: "Global Change & Future Trends",
        points: ["Climate-driven migration", "Technological globalization", "Global youth culture", "Polarization & nationalism", "Cultural homogenization vs preservation", "Future of work", "Aging population", "AI-driven geopolitical shifts", "Planetary governance", "Post-globalization scenarios"]
      }
    ],
    advancedLayers: [
      { name: "Cultural Intelligence (CQ)", description: "Understanding how humans think in different societies." },
      { name: "Global Strategic Intelligence", description: "Reading geopolitical shifts and global patterns." },
      { name: "Economic & Policy Intelligence", description: "Understanding global systems and economic flows." },
      { name: "Diplomatic Intelligence", description: "Influence, negotiation, cross-border communication." },
      { name: "Civilizational Intelligence", description: "Understanding the long arc of human development." }
    ],
    tracks: [
      { name: "Cultural Intelligence Specialist", description: "Deep understanding of human behavior across cultures." },
      { name: "Global Strategist", description: "Reads the world like a geopolitical chessboard." },
      { name: "International Relations Architect", description: "Focus on diplomacy, alliances, conflict, governance." },
      { name: "Global Economist", description: "Analyzes world markets, macro trends, development." },
      { name: "Civilizational Thinker", description: "Understands long-term cultural evolution and global futures." }
    ],
    isLocked: false
  },
  {
    id: 12,
    title: "Meta-Learning & Ultra Cognition",
    shortDescription: "Ability to learn anything, master anything, adapt to anything, and think at higher levels.",
    icon: "BookOpen",
    pillars: [
      "Learning Science – how the brain encodes and absorbs knowledge",
      "Memory Engineering – storing and retrieving information efficiently",
      "Skill Acquisition Systems – gaining skills faster and deeper",
      "Cognitive Optimization – maximizing mental performance",
      "Knowledge Compression – learning complex ideas quickly",
      "Meta-Cognition – thinking about, analyzing, and improving thinking",
      "Learning Strategy Design – creating personal learning systems",
      "Parallel Skill Learning – mastering multiple skills at once"
    ],
    subdomains: [
      {
        title: "Learning Science",
        points: ["Neuroscience of learning", "Sensory input processing", "Attention mechanisms", "Learning phases", "Skill transfer principles", "Feedback loops", "Learning plateaus", "Deliberate practice", "Learning efficiency models", "Retention-based learning"]
      },
      {
        title: "Memory Engineering",
        points: ["Working memory mechanics", "Encoding techniques", "Spaced repetition", "Active recall systems", "Long-term memory storage", "Visualization methods", "Memory palaces", "Mnemonics", "Interleaving", "Forgetting curve optimization"]
      },
      {
        title: "Skill Acquisition",
        points: ["Motor vs cognitive skill learning", "Micro-skill breakdown", "Rapid feedback optimization", "Automaticity building", "Procedural learning", "Mastery cycles", "Reverse engineering expert performance", "Technique refinement", "Rapid skill testing", "Error correction systems"]
      },
      {
        title: "Cognitive Optimization",
        points: ["Focus training", "Mental energy management", "Cognitive endurance", "Flow state induction", "Multitasking vs task switching", "Deep work blocks", "Cognitive load balancing", "Neurotransmitter regulation", "Sleep-based learning", "Biofeedback techniques"]
      },
      {
        title: "Knowledge Compression",
        points: ["Chunking intelligence", "Abstraction and simplification", "Pattern recognition", "Concept stacking", "Rapid summarization", "Mental model integration", "Cross-domain linking", "High-compression note-taking", "Framework building", "First-principles compression"]
      },
      {
        title: "Meta-Cognition",
        points: ["Self-monitoring", "Self-evaluation", "Bias detection", "Reflective thinking", "Insight generation", "Error awareness", "Thought auditing", "Cognitive calibration", "Adaptive reasoning", "Learning self-correction"]
      },
      {
        title: "Learning Strategy Design",
        points: ["Personalized learning systems", "Study blueprinting", "Time-block learning", "Curriculum design", "Multi-phase learning plans", "SMART + deep goals", "Habit-linked learning", "Self-directed learning frameworks", "Learning strictness vs flexibility", "Productivity integration"]
      },
      {
        title: "Parallel Skill Learning",
        points: ["Cross-training skills", "Shared-domain skills", "Learning-transfer networks", "Rotational practice", "Multidomain cognition", "Skill synergies", "Avoiding cognitive overload", "Multi-skill timelines", "Strategic pairing of skills", "Deep-divergent learning"]
      },
      {
        title: "Learning Tools & Technologies",
        points: ["Note-taking systems", "Flashcard systems", "AI learning assistants", "Knowledge graphs", "Productivity tools", "Mind mapping", "Digital memory systems", "Immersive learning tech (VR/AR)"]
      },
      {
        title: "Growth Mindset & Learning Psychology",
        points: ["Fixed vs growth mindset", "Belief systems about intelligence", "Intrinsic motivation", "Confidence cycles", "Fear-of-failure removal", "Learning anxiety reduction", "Mastery identity", "Cognitive resilience", "Discipline psychology"]
      },
      {
        title: "Cognitive Flexibility",
        points: ["Switching between mental frameworks", "Reframing problems", "Thinking from multiple perspectives", "Creative problem solving", "Open-minded thinking", "Adaptive cognition", "Structural flexibility", "Lateral thinking", "Analogy-based reasoning"]
      },
      {
        title: "Ultra-Learning (High-Intensity Learning)",
        points: ["High-focus sprints", "Aggressive immersive learning", "Real-world exposure", "Rapid project cycles", "Performance benchmarking", "Hyper-structured routines", "Continuous improvement loops"]
      }
    ],
    advancedLayers: [
      { name: "Memory Mastery", description: "Total control over retention and recall." },
      { name: "Skill Mastery", description: "Mastering any skill through scientific practice." },
      { name: "Cognitive Mastery", description: "Focus, clarity, mental endurance, flow." },
      { name: "Meta-Mastery", description: "Understanding how your own mind learns." },
      { name: "Ultra-Mastery", description: "Learning at speeds and depths far above normal human levels." }
    ],
    tracks: [
      { name: "Ultra-Learner", description: "Master skills at accelerated speed." },
      { name: "Learning Scientist", description: "Understand the mechanisms of learning itself." },
      { name: "Cognitive Optimizer", description: "Enhance mental performance." },
      { name: "Memory Engineer", description: "Master memory techniques and retention science." },
      { name: "Mastery System Designer", description: "Build learning systems for others." }
    ],
    isLocked: false
  },
  {
    id: 13,
    title: "Creative Arts & Expression",
    shortDescription: "Ability to create, express, design, imagine, craft, and bring ideas to life.",
    icon: "Palette",
    pillars: [
      "Visual Arts – drawing, painting, composition",
      "Digital Arts – 2D/3D modeling, animation, design tool mastery",
      "Storytelling & Narrative Craft – writing, worldbuilding, character creation",
      "Cinematic & Motion Arts – filmmaking, directing, animation sequences",
      "Music & Sound Design – audio creation, mixing, composing",
      "Creative Psychology – creativity science, inspiration, ideation",
      "Aesthetic Theory – color, form, symbolism, beauty principles",
      "Expressive Identity – personal style, artistic voice"
    ],
    subdomains: [
      {
        title: "Drawing & Illustration",
        points: ["Line fundamentals", "Shape & form", "Perspective (1, 2, 3 point)", "Anatomy & figure drawing", "Gesture drawing", "Shading & light", "Visual clarity", "Stylization techniques", "Composition planning", "Character design basics"]
      },
      {
        title: "Painting & Color Arts",
        points: ["Color theory", "Value structure", "Digital painting", "Blending techniques", "Texture creation", "Lighting effects", "Atmospheric perspective", "Traditional vs digital methods", "Palette building", "Mood creation"]
      },
      {
        title: "Graphic Design",
        points: ["Typography", "Layout & hierarchy", "Iconography", "Branding design", "Minimalism & clarity", "Logo design", "Poster composition", "Visual communication", "Design systems", "Software mastery"]
      },
      {
        title: "2D Animation",
        points: ["Frame-by-frame principles", "Timing & spacing", "Squash and stretch", "Character animation", "Lip-sync", "Motion arcs", "Exaggeration", "Anticipation & follow-through", "Visual storytelling", "Stylized animation"]
      },
      {
        title: "3D Animation & CGI",
        points: ["Modeling", "Sculpting", "Rigging", "Texturing", "Lighting & rendering", "Simulation (cloth, particles, fluids)", "Camera animation", "Character animation", "Environment creation", "Software (Blender, Maya, Cinema 4D)"]
      },
      {
        title: "Cinematic Arts & Filmmaking",
        points: ["Storyboarding", "Cinematography", "Framing & camera angles", "Editing", "Film grammar", "Cinematic lighting", "Sound design", "Directing", "Visual effects", "Color grading"]
      },
      {
        title: "Storytelling & Narrative Craft",
        points: ["Plot structure", "Character development", "Theme", "Setting & worldbuilding", "Dialogue writing", "Conflict dynamics", "Story arcs", "Symbolism", "Narrative tension", "Emotional beats"]
      },
      {
        title: "Creative Writing",
        points: ["Prose styles", "Poetry", "Scriptwriting", "Flash fiction", "Narrative pacing", "Scene construction", "Tone & voice", "Literary devices", "Editing techniques", "Writer’s workflow"]
      },
      {
        title: "Worldbuilding",
        points: ["Cultures & societies", "Geography & ecosystems", "Technology & magic systems", "Languages", "History & timelines", "Political structures", "Religions & beliefs", "Economy & trade", "Aesthetic identity", "World logic & coherence"]
      },
      {
        title: "Music & Sound Design",
        points: ["Music theory", "Composition", "Melody, harmony, rhythm", "Digital audio workstations", "Synth design", "Sound effects", "Ambient soundscapes", "Foley recording", "Mixing & mastering", "Voice processing"]
      },
      {
        title: "Creative Psychology",
        points: ["Creativity triggers", "Idea generation", "Divergent thinking", "Flow states", "Overcoming creative blocks", "Inspiration patterns", "Creative confidence", "Emotional expression", "Artistic identity", "Discipline vs play"]
      },
      {
        title: "Aesthetic Theory",
        points: ["Beauty & form", "Minimalism vs maximalism", "Symmetry & asymmetry", "Balance & tension", "Color psychology", "Symbol systems", "Visual semiotics", "Emotional aesthetics", "Cultural aesthetics", "Style evolution"]
      },
      {
        title: "Performance Arts",
        points: ["Acting", "Voice acting", "Dance systems", "Stage presence", "Improvisation", "Emotional delivery", "Physical expression", "Timing & rhythm", "Audience connection", "Theatrical strategy"]
      },
      {
        title: "Personal Expression & Artistic Identity",
        points: ["Finding your style", "Developing a signature", "Creative authenticity", "Voice development", "Artistic branding", "Creative philosophy", "Reflective expression", "Expressive boundaries", "Creative storytelling identity", "Emotional resonance"]
      }
    ],
    advancedLayers: [
      { name: "Technical Artistic Skill", description: "Mastering tools, techniques, and principles." },
      { name: "Narrative & Conceptual Skill", description: "Creating meaning, stories, and emotional depth." },
      { name: "Aesthetic Intelligence", description: "Designing beauty, symbolism, and atmosphere." },
      { name: "Creative Intelligence", description: "Generating ideas, innovating, problem-solving creatively." },
      { name: "Expressive Identity", description: "Becoming an artist with a personal voice and style." }
    ],
    tracks: [
      { name: "Visual Artist", description: "Drawing, painting, design, character creation." },
      { name: "Animator (2D or 3D)", description: "Motion, timing, visual storytelling." },
      { name: "Digital Creator", description: "Graphic design, content design, web visuals." },
      { name: "Cinematic Artist", description: "Filmmaking, editing, VFX." },
      { name: "Story Architect", description: "Writer, storyteller, worldbuilder." },
      { name: "Music & Sound Designer", description: "Audio creation, composition, sound engineering." },
      { name: "Creative Director", description: "Aesthetic vision, concept leadership, artistic systems." }
    ],
    isLocked: false
  },
  {
    id: 14,
    title: "Public Systems & Civic Innovation",
    shortDescription: "Mastery in how human societies are managed, governed, regulated, developed, and improved.",
    icon: "Scale",
    pillars: [
      "Governance Systems – how societies create rules and institutions",
      "Law & Justice – how enforcement and rights are structured",
      "Public Policy – how governments solve societal problems",
      "Public Administration – how systems and institutions function",
      "Civic Innovation – designing new solutions for public good",
      "Infrastructure & Urban Systems – cities, transport, utilities",
      "Social Welfare & Public Services – health, education, safety nets",
      "Disaster & Crisis Management – resilience and emergency systems"
    ],
    subdomains: [
      {
        title: "Governance & Political Systems",
        points: ["Democracy models", "Parliamentary vs presidential systems", "Federal vs unitary structures", "Electoral systems", "Checks and balances", "Public accountability", "Governance failures & corruption", "Decentralization", "Participatory governance", "Constitutional design"]
      },
      {
        title: "Law & Justice Systems",
        points: ["Criminal law", "Civil law", "Constitutional law", "Administrative law", "Human rights law", "Court systems", "Law enforcement structures", "Evidence systems", "Legal due process", "Justice reform"]
      },
      {
        title: "Public Policy Design",
        points: ["Policy cycle", "Problem identification", "Agenda setting", "Policy formulation", "Economic policy design", "Social policy", "Education policy", "Health policy", "Environmental policy", "Policy evaluation"]
      },
      {
        title: "Public Administration",
        points: ["Bureaucratic structures", "Public sector management", "Government budgeting", "Public finance", "Service delivery systems", "Procurement systems", "Ethics in public administration", "Administrative accountability", "Workforce management", "E-governance"]
      },
      {
        title: "Civic Innovation & Public Technology",
        points: ["GovTech systems", "Digital identity systems", "Public data infrastructure", "Smart governance", "Transparency platforms", "Civic apps & public digital services", "Blockchain in governance", "AI for public policy", "Civic hacking", "Open data ecosystems"]
      },
      {
        title: "Infrastructure & Urban Systems",
        points: ["Transport systems", "Water & sanitation systems", "Energy systems", "Housing systems", "Public facilities", "Utilities planning", "Urban planning", "Smart cities", "Sustainable cities", "Rural development systems"]
      },
      {
        title: "Social Welfare & Human Development",
        points: ["Poverty alleviation", "Social insurance", "Universal basic services", "Public health systems", "Education systems", "Food security", "Family welfare", "Labor welfare", "Disability and inclusion", "Community development"]
      },
      {
        title: "Disaster Management & Resilience",
        points: ["Risk assessment", "Early warning systems", "Emergency response", "Crisis leadership", "Recovery & reconstruction", "Climate resilience", "Disaster communication", "Community preparedness", "Pandemic management", "Infrastructure resilience"]
      },
      {
        title: "Public Finance & Economic Governance",
        points: ["Taxation systems", "Fiscal policy", "Public budgeting", "Debt management", "Public expenditure reviews", "Financial accountability", "Economic stabilization", "Long-term fiscal planning", "Monetary-fiscal coordination", "Funding public goods"]
      },
      {
        title: "Citizen Engagement & Participation",
        points: ["Civil society movements", "Public consultations", "Participatory budgeting", "Community-based governance", "NGO structures", "Activism & advocacy", "Volunteerism ecosystems", "Public awareness campaigns", "Media & public opinion", "Social empowerment"]
      },
      {
        title: "Ethics, Accountability & Transparency",
        points: ["Anti-corruption systems", "Ethical leadership", "Whistleblower protections", "Transparency mechanisms", "Governance audits", "Institutional integrity", "Social accountability", "Trust in institutions", "Public value model", "Code of conduct systems"]
      },
      {
        title: "Comparative Public Systems Globally",
        points: ["Nordic welfare states", "Asian governance models", "Anglo-American models", "African state systems", "Latin American public structures", "Gulf governance", "Comparative performance analysis", "Case studies of successful systems", "International benchmarks", "Governance innovation trends"]
      }
    ],
    advancedLayers: [
      { name: "Governance Intelligence", description: "Understanding how societies are structured and managed." },
      { name: "Policy Intelligence", description: "Designing effective social, economic, and environmental policies." },
      { name: "Administrative Intelligence", description: "Running institutions effectively and ethically." },
      { name: "Civic Innovation Intelligence", description: "Using technology and creativity to improve public systems." },
      { name: "Systems-Level Civic Mastery", description: "Integrating governance, policy, administration, and community." }
    ],
    tracks: [
      { name: "Public Governance Architect", description: "Focus on institutions, laws, constitutions, and systemic design." },
      { name: "Policy Scientist", description: "Design data-driven policies that solve real problems." },
      { name: "Public Administration Leader", description: "Master bureaucracy, service delivery, logistics, and management." },
      { name: "Civic Innovator", description: "Use technology + design to reform public services." },
      { name: "Urban & Infrastructure Systems Engineer", description: "Shape cities, utilities, and long-term development." }
    ],
    isLocked: false
  },
  {
    id: 15,
    title: "Deep Computing & Data Mastery",
    shortDescription: "Solving the hardest computational problems using advanced algorithms, math, and high-performance systems.",
    icon: "Cpu",
    pillars: [
      "Algorithms & Complexity – efficient problem-solving",
      "Data Structures – organizing information",
      "High-Performance Computing – large-scale computation",
      "Distributed Systems – large multi-machine computing",
      "Data Science & Analytics – extracting meaning from data",
      "Computational Mathematics – math for algorithms",
      "Optimization & Modeling – best solutions under constraints",
      "Big Data Architecture – handling massive datasets"
    ],
    subdomains: [
      {
        title: "Algorithms",
        points: ["Sorting & searching algorithms", "Graph algorithms", "Dynamic programming", "Greedy algorithms", "Divide-and-conquer", "Backtracking", "String algorithms", "Numerical algorithms", "Approximation algorithms", "Randomized algorithms"]
      },
      {
        title: "Algorithmic Complexity",
        points: ["Time complexity (Big O)", "Space complexity", "Computational classes (P, NP, NP-complete)", "Hardness & tractability", "Lower bounds", "Optimization of algorithms", "Amortized analysis", "Algorithmic limits", "Problem reducibility", "Computational boundaries"]
      },
      {
        title: "Data Structures",
        points: ["Arrays, lists", "Stacks, queues", "Trees (binary, AVL, red-black)", "Graphs (directed, weighted, DAGs)", "Hash tables", "Heaps", "Tries", "Disjoint sets", "Segment trees", "Bloom filters"]
      },
      {
        title: "High-Performance Computing (HPC)",
        points: ["Parallel computing", "GPU computing", "Vectorization", "Distributed memory systems", "Shared memory systems", "Cluster computing", "Supercomputers", "Computational pipelines", "Numerical precision", "Performance profiling & optimization"]
      },
      {
        title: "Distributed Systems",
        points: ["Distributed consensus", "CAP theorem", "MapReduce", "Distributed storage", "Replication & sharding", "Distributed algorithms", "Event-driven systems", "Leader election", "Fault tolerance", "Large-scale concurrency"]
      },
      {
        title: "Big Data Architecture",
        points: ["Hadoop ecosystem", "Spark systems", "NoSQL systems", "Stream processing", "Data lakes", "Real-time pipelines", "Batch processing", "Data ingestion frameworks", "ETL processes", "Scalable storage systems"]
      },
      {
        title: "Data Science Foundations",
        points: ["Exploratory data analysis", "Data wrangling", "Statistical analysis", "Probability systems", "Correlation & causation", "Hypothesis testing", "Regression models", "Classification models", "Clustering systems", "Forecasting"]
      },
      {
        title: "Machine Learning Foundations",
        points: ["Supervised models", "Unsupervised models", "Feature engineering", "Model evaluation", "Bias-variance tradeoff", "ML pipelines", "Model deployment", "Hyperparameter tuning", "ML systems design", "Foundational ML theory"]
      },
      {
        title: "Computational Mathematics",
        points: ["Linear algebra", "Calculus", "Differential equations", "Numerical methods", "Optimization", "Probability theory", "Discrete mathematics", "Graph theory", "Tensor mathematics", "Fourier analysis"]
      },
      {
        title: "Data Engineering",
        points: ["Data modeling", "Database design", "Data warehouse development", "SQL optimization", "Data governance", "Metadata management", "Data versioning", "API-driven data delivery", "Pipeline automation", "Data reliability engineering"]
      },
      {
        title: "Cloud & Scalable Compute",
        points: ["Cloud compute fundamentals", "Serverless computing", "Scalable databases", "Cloud orchestration", "Containerization (Docker/K8s)", "Cloud cost optimization", "Distributed storage", "High availability systems", "Auto-scaling algorithms", "Fault resilience"]
      },
      {
        title: "Mathematical Optimization",
        points: ["Linear programming", "Nonlinear programming", "Integer programming", "Constraint programming", "Lagrange multipliers", "Heuristic optimization", "Evolutionary algorithms", "Swarm intelligence", "Multi-objective optimization", "Real-world optimization systems"]
      },
      {
        title: "Scientific Computing",
        points: ["Simulation systems", "Finite element analysis", "Monte Carlo methods", "Diffusion modeling", "Agent-based modeling", "Large-scale numerical solvers", "Physics-based computation", "Engineering simulation tools", "Bioinformatics computation", "Computational chemistry"]
      },
      {
        title: "Data Visualization & Interpretation",
        points: ["Charts & graphs", "Dashboarding", "Visual storytelling", "UI for data", "Interactive visualizations", "Geospatial mapping", "Pattern discovery", "Analytical narratives", "Large-scale visualization", "Heatmaps, embeddings, projections"]
      }
    ],
    advancedLayers: [
      { name: "Algorithmic Intelligence", description: "Ability to design optimal solutions." },
      { name: "Data Intelligence", description: "Understanding patterns, insight extraction." },
      { name: "Computational Intelligence", description: "Mastery of high-performance systems." },
      { name: "Systems Intelligence", description: "Building scalable architectures." },
      { name: "Integrated Deep Computing Mastery", description: "Full command over computation, mathematics, and data systems." }
    ],
    tracks: [
      { name: "Algorithm Engineer", description: "Design powerful algorithms and solve hard problems." },
      { name: "Data Scientist", description: "Analyze, model, and interpret complex data." },
      { name: "Data Engineer", description: "Build large-scale data systems and pipelines." },
      { name: "Distributed Systems Architect", description: "Design scalable, fault-tolerant computing systems." },
      { name: "HPC & Computational Scientist", description: "Use supercomputing to solve scientific problems." },
      { name: "Optimization Specialist", description: "Solve real-world optimization problems using math + algorithms." }
    ],
    isLocked: false
  },
  {
    id: 16,
    title: "Social Engineering & Behavioral Design",
    shortDescription: "Combines psychology, persuasion, influence, behavioral economics, habit design, identity architecture, and group dynamics.",
    icon: "Brain",
    pillars: [
      "Behavioral Psychology – how humans think and act",
      "Influence & Persuasion Systems – shifting decisions, emotions, beliefs",
      "Identity & Habit Engineering – shaping the self and automatic behaviors",
      "Group Behavior & Social Dynamics – how humans act collectively",
      "Motivation & Drive Systems – why people take action",
      "Social Power Structures – authority, hierarchy, leadership",
      "Behavioral Economics – cognitive biases + incentives",
      "Culture & Memetics – how ideas spread between people"
    ],
    subdomains: [
      {
        title: "Behavioral Psychology",
        points: ["Cognitive-behavioral patterns", "Emotional processing", "Reward systems", "Behavior triggers", "Automatic vs deliberate action", "Conditioning & reinforcement", "Behavior loops", "Decision heuristics", "Behavioral scripts", "Behavioral constraints"]
      },
      {
        title: "Cognitive Bias Engineering",
        points: ["Availability heuristic", "Anchoring", "Framing effects", "Confirmation bias", "Loss aversion", "Social proof", "Authority bias", "Scarcity bias", "Overconfidence", "Priming mechanisms"]
      },
      {
        title: "Persuasion & Influence Architecture",
        points: ["Social proof", "Reciprocity", "Commitment & consistency", "Authority", "Liking", "Scarcity", "Fear persuasion", "Emotional persuasion", "Narrative persuasion", "Ethical influence"]
      },
      {
        title: "Human Behavioral Triggers",
        points: ["Cue → routine → reward models", "Sensory triggers", "Emotional triggers", "Environmental triggers", "Social triggers", "Attention triggers", "Motivation triggers", "Heuristic triggers", "Cultural triggers", "Status triggers"]
      },
      {
        title: "Identity Engineering",
        points: ["Self-concept shaping", "Archetype alignment", "Belief system design", "Identity-based habits", "Internal narratives", "Self-image reconstruction", "Values engineering", "Identity transitions", "Social identity mapping", "Behavioral reinforcement"]
      },
      {
        title: "Habit Design",
        points: ["Habit loop optimization", "Habit stacking", "Habit shaping", "Habit extinction", "Positive reinforcement", "Environment shaping", "Behavioral automation", "Keystone habits", "Habit tracking", "Habit rewiring"]
      },
      {
        title: "Motivation Science",
        points: ["Intrinsic vs extrinsic motivation", "Dopamine motivation cycles", "Goal systems", "Willpower vs momentum", "Expectancy theory", "Emotion-driven motivation", "Long-term motivation", "Motivation decay", "Anti-friction principles", "Reward optimization"]
      },
      {
        title: "Social Dynamics & Interpersonal Behavior",
        points: ["Attraction dynamics", "Rapport building", "Trust systems", "Power positioning", "Dominance signals", "Cooperation & competition", "Conflict psychology", "Social hierarchy mapping", "Group influence", "Social intuition"]
      },
      {
        title: "Group Psychology & Collective Behavior",
        points: ["Herd behavior", "Crowd dynamics", "Collective identity", "Group conformity", "Mass persuasion", "Leadership influence", "Cultural programming", "Rituals & collective emotions", "Symbolic group coordination", "Social contagion"]
      },
      {
        title: "Behavioral Economics",
        points: ["Decision-making under uncertainty", "Incentive design", "Nudge theory", "Choice architecture", "Loss aversion", "Hyperbolic discounting", "Behavioral finance", "Market psychology", "Limited rationality", "Mental accounting"]
      },
      {
        title: "Communication-Based Influence",
        points: ["Framing", "Anchoring", "Verbal calibration", "Tonal influence", "Micro-expression decoding", "Narrative control", "Reframing objections", "Linguistic patterns", "Suggestion mechanisms", "Emotional resonance"]
      },
      {
        title: "Power Dynamics",
        points: ["Social hierarchy structures", "Positional power", "Personal power", "Relational power", "Situational power", "Hidden power", "Charisma systems", "Manipulation detection", "Influence without authority", "Ethical power use"]
      },
      {
        title: "Memetics & Cultural Transmission",
        points: ["Idea replication", "Viral ideas", "Symbolic codes", "Meme engineering", "Cultural evolution", "Norm shaping", "Trend propagation", "Mass persuasion loops", "Cultural resonance", "Social media influence systems"]
      },
      {
        title: "Behavioral Design Systems",
        points: ["UX behavioral shaping", "Gamification", "Incentive design", "Behavioral reward systems", "User motivation loops", "Friction reduction", "Commitment optimization", "Onboarding behavior", "Habit-based product design", "Addictive design ethics"]
      }
    ],
    advancedLayers: [
      { name: "Psychological Influence", description: "Understanding mind-level triggers." },
      { name: "Identity Control", description: "Shaping self and others through beliefs." },
      { name: "Behavioral Engineering", description: "Creating and altering habits, actions, choices." },
      { name: "Social Power Mastery", description: "Influence over groups, dynamics, and hierarchies." },
      { name: "Cultural & Memetic Engineering", description: "Shaping ideas at the level of society itself." }
    ],
    tracks: [
      { name: "Behavioral Designer", description: "Build systems that guide behavior ethically." },
      { name: "Social Engineer", description: "Influence decisions and actions through psychology." },
      { name: "Identity Architect", description: "Build mindset, beliefs, and self-concept frameworks." },
      { name: "Behavioral Economist", description: "Design incentives and choice structures." },
      { name: "Influence Strategist", description: "Master persuasion, power, and social dynamics." }
    ],
    isLocked: false
  },
  {
    id: 17,
    title: "Planetary Health & Resilient Futures",
    shortDescription: "Protecting Earth’s systems, restoring ecosystems, preparing humanity for future risks, and building long-term resilience.",
    icon: "Globe",
    pillars: [
      "Ecology & Ecosystems – how natural systems function",
      "Climate Science – planetary dynamics & global warming",
      "Environmental Engineering – designing sustainable systems",
      "Sustainability Science – balancing human and ecological needs",
      "Energy Systems & Decarbonization – clean power transitions",
      "Food & Water Security – stable supplies for humanity",
      "Biodiversity & Conservation – protecting life on Earth",
      "Planetary Risk & Resilience – preparing for global threats"
    ],
    subdomains: [
      {
        title: "Ecology & Ecosystem Dynamics",
        points: ["Food webs", "Biomes", "Nutrient cycles (carbon, nitrogen, water)", "Trophic levels", "Keystone species", "Ecological succession", "Population dynamics", "Ecosystem services", "Human impact on ecosystems", "Ecosystem restoration"]
      },
      {
        title: "Biodiversity & Conservation Biology",
        points: ["Genetic diversity", "Species diversity", "Habitat conservation", "Endangered species", "Invasive species", "Wildlife management", "Protected areas", "Conservation planning", "Rewilding projects", "Biome restoration"]
      },
      {
        title: "Climate Science",
        points: ["Greenhouse gas dynamics", "Radiative forcing", "Climate feedback loops", "Global carbon cycle", "Cryosphere systems", "Ocean–atmosphere interactions", "Climate modeling", "Extreme weather events", "Paleoclimate studies", "Climate tipping points"]
      },
      {
        title: "Earth Systems Science",
        points: ["Atmosphere", "Hydrosphere", "Lithosphere", "Biosphere", "Anthroposphere (human systems)", "Earth system interactions", "Planetary boundaries", "Geophysical cycles", "Continental drift & plate tectonics", "Earth system resilience"]
      },
      {
        title: "Sustainability Science",
        points: ["Circular economy", "Regenerative design", "Zero-waste systems", "Sustainable development goals (SDGs)", "Ethical resource use", "Ecological footprint", "Environmental ethics", "Intergenerational equity", "Green innovation", "Systems sustainability"]
      },
      {
        title: "Environmental Engineering",
        points: ["Waste management", "Air quality systems", "Water purification", "Soil remediation", "Renewable energy systems", "Pollution control", "Environmental impact assessments", "Green building systems", "Urban sustainability", "Environmental monitoring"]
      },
      {
        title: "Energy Systems & Decarbonization",
        points: ["Solar, wind, hydro, geothermal", "Nuclear fission", "Nuclear fusion (future)", "Hydrogen economy", "Battery technology", "Smart grids", "Carbon capture & storage", "Energy storage systems", "Fossil fuel phase-out", "Global energy policy"]
      },
      {
        title: "Food Security & Agro-Ecology",
        points: ["Sustainable agriculture", "Soil health", "Vertical farming", "Precision farming", "Climate-resilient crops", "Aquaculture", "Plant-based systems", "Permaculture", "Food distribution networks", "Global food equity"]
      },
      {
        title: "Water Security & Hydrological Systems",
        points: ["Water cycle", "Groundwater systems", "Watershed management", "Irrigation systems", "Desalination", "Water purification", "Water scarcity solutions", "Flood management", "Wetland conservation", "Water governance"]
      },
      {
        title: "Environmental Economics & Policy",
        points: ["Carbon pricing", "Pollution externalities", "Natural capital valuation", "Resource economics", "Environmental regulations", "Green finance", "Climate policy", "Sustainability governance", "International environmental agreements", "Ecosystem service valuation"]
      },
      {
        title: "Disaster Science & Planetary Risk",
        points: ["Natural hazards", "Disaster preparedness", "Risk modeling", "Pandemic systems", "Climate-related disasters", "Infrastructure vulnerability", "Humanitarian logistics", "Early warning systems", "Recovery frameworks", "Extreme global risks"]
      },
      {
        title: "Urban Planning & Sustainable Cities",
        points: ["Smart cities", "Green architecture", "Public transport systems", "Waste recycling", "Urban heat island solutions", "City climate adaptation", "Ecological urban design", "Public green spaces", "Urban resilience", "Community-centered development"]
      },
      {
        title: "Global Health & Planetary Well-Being",
        points: ["Zoonotic diseases", "Environmental health", "One Health approach", "Air, water, and soil health", "Climate-health interactions", "Heat stress", "Environmental toxins", "Public health infrastructure", "Disease surveillance", "Ecosystem-human health links"]
      },
      {
        title: "Future Planetary Scenarios",
        points: ["Climate migration", "Planetary collapse scenarios", "Resilient civilization models", "Geoengineering prospects", "Post-disaster reconstruction", "Global adaptation strategy", "Planetary governance", "Long-term sustainability roadmaps", "Regenerative planetary systems", "Interplanetary environmental ethics"]
      }
    ],
    advancedLayers: [
      { name: "Ecological Intelligence", description: "Understanding Earth’s natural systems deeply." },
      { name: "Sustainability Intelligence", description: "Balancing environment, society, and economy." },
      { name: "Engineering & Technological Intelligence", description: "Designing systems that work with nature." },
      { name: "Risk & Resilience Intelligence", description: "Managing global threats and shocks." },
      { name: "Planetary Stewardship", description: "Long-term responsibility for Earth’s future." }
    ],
    tracks: [
      { name: "Environmental Scientist", description: "Study ecosystems, climate, biodiversity." },
      { name: "Sustainability Specialist", description: "Design sustainable human systems." },
      { name: "Environmental Engineer", description: "Build systems that protect ecosystems and reduce pollution." },
      { name: "Climate Strategist", description: "Work on climate policy, modeling, mitigation." },
      { name: "Resilience Architect", description: "Prepare cities, nations, and systems for future risks." },
      { name: "Planetary Health Expert", description: "Integrate ecology, climate, and human well-being." }
    ],
    isLocked: false
  },
  {
    id: 18,
    title: "Space Exploration & Cosmological Engineering",
    shortDescription: "Navigating, understanding, and inhabiting space, and designing large-scale cosmic systems.",
    icon: "Rocket",
    pillars: [
      "Astrophysics & Cosmology – how the universe works",
      "Astronautics & Rocket Science – how to reach and navigate space",
      "Orbital Mechanics – how objects move in space",
      "Spacecraft Engineering – designing and operating machines for space",
      "Human Spaceflight & Life Support – keeping humans alive in space",
      "Planetary Science & Exploration – understanding planets, moons, asteroids",
      "Space Habitats & Colonization – building settlements beyond Earth",
      "Cosmological Engineering – manipulating large-scale cosmic structures"
    ],
    subdomains: [
      {
        title: "Astrophysics",
        points: ["Star formation", "Stellar evolution", "Supernovae", "Black holes", "Neutron stars", "White dwarfs", "Galaxy formation", "Dark matter", "Dark energy", "Cosmic microwave background"]
      },
      {
        title: "Cosmology",
        points: ["Big Bang theory", "Early universe physics", "Inflation", "Cosmic expansion", "Spacetime curvature", "Multiverse theories", "Large-scale cosmic structures", "Cosmological constants", "Universe fate scenarios", "Quantum cosmology"]
      },
      {
        title: "Rocket Science (Astronautics)",
        points: ["Rocket equation", "Thrust & propulsion", "Liquid vs solid propellant", "Multi-stage rockets", "Launch dynamics", "Rocket guidance systems", "Reusable rocket engineering", "Propulsion efficiency", "Safety systems", "Launch infrastructure"]
      },
      {
        title: "Propulsion Systems",
        points: ["Chemical propulsion", "Ion propulsion", "Plasma propulsion", "Solar sails", "Nuclear thermal rockets", "Nuclear electric propulsion", "Fusion propulsion (theoretical)", "Antimatter engines (theoretical)", "Warp drives (speculative)", "Alcubierre metric physics"]
      },
      {
        title: "Orbital Mechanics",
        points: ["Kepler’s laws", "Orbital transfers", "Gravity assists", "Insertion & escape trajectories", "Hohmann transfers", "Station-keeping", "Lagrange points", "Orbital decay", "Rendezvous & docking", "Interplanetary trajectories"]
      },
      {
        title: "Spacecraft Engineering",
        points: ["Spacecraft design", "Structural engineering", "Thermal control", "Power systems (solar, nuclear)", "Radiation shielding", "Communication systems", "Navigation systems", "Space robotics", "Satellite technologies", "Payload integration"]
      },
      {
        title: "Human Spaceflight",
        points: ["Life support systems", "Space medicine", "Microgravity physiology", "Space psychology", "Spacesuits & EVA systems", "Human factors engineering", "Radiation protection", "Long-duration spaceflight", "Health monitoring systems", "Crew safety and survival"]
      },
      {
        title: "Space Habitats & Colonization",
        points: ["Space stations", "Lunar bases", "Martian habitats", "Artificial gravity", "Hydroponics & closed-loop ecosystems", "In-situ resource utilization (ISRU)", "Terraforming concepts", "Energy systems for colonies", "Habitability criteria", "Interplanetary governance"]
      },
      {
        title: "Planetary Science",
        points: ["Geological processes", "Atmospheric science", "Planetary composition", "Water detection", "Volcanism", "Planetary magnetospheres", "Moons & ring systems", "Asteroid & comet science", "Exoplanet characteristics", "Planet formation"]
      },
      {
        title: "Space Mining & Resource Utilization",
        points: ["Asteroid mining", "Lunar resource extraction", "Regolith processing", "Water ice extraction", "Metal extraction", "Fuel production in space", "Resource transport", "Economic feasibility", "Space industry development", "Robotics for mining"]
      },
      {
        title: "Deep-Space Exploration",
        points: ["Probes & landers", "Interstellar probes", "Gravity wave detection", "Radio astronomy", "Deep-space communication", "Autonomous navigation", "Time delay communication systems", "Outer solar system missions", "Interstellar travel concepts", "Cryogenic sleep research"]
      },
      {
        title: "SETI & Astrobiology",
        points: ["Life detection methods", "Biosignatures", "Exoplanet habitability", "Origins of life", "Extremophiles", "Artificial signal detection", "Kardashev scale civilizations", "Fermi paradox", "Technosignature searches", "Evolution of intelligence"]
      },
      {
        title: "Cosmological Engineering (Far-Future Systems)",
        points: ["Star lifting", "Dyson spheres", "Stellar engines (Shkadov thruster)", "Planet-moving engines", "Orbital reconfiguration", "Controlling black holes", "Creating artificial gravity wells", "Wormhole construction (theoretical)", "Spacetime manipulation", "Universe-scale energy management"]
      },
      {
        title: "Space Governance & Law",
        points: ["Outer Space Treaty", "Resource rights", "Space traffic control", "Space militarization", "Interplanetary law", "Colony governance", "Ethical frameworks", "Space diplomacy", "Space sustainability", "International cooperation"]
      }
    ],
    advancedLayers: [
      { name: "Space Physics Intelligence", description: "Understanding cosmic laws and phenomena." },
      { name: "Astronautical Engineering Mastery", description: "Designing powerful spacecraft and propulsion systems." },
      { name: "Colony & Habitat Engineering", description: "Creating spaces where humans can live and thrive." },
      { name: "Cosmic Systems Design", description: "Manipulating large-scale celestial structures." },
      { name: "Interstellar Civilization Architecture", description: "Planning humanity’s long-term expansion into the cosmos." }
    ],
    tracks: [
      { name: "Astrophysicist", description: "Study stars, galaxies, black holes, universe structure." },
      { name: "Aerospace Engineer", description: "Build rockets, spacecraft, and propulsion systems." },
      { name: "Planetary Scientist", description: "Study planets, moons, asteroids, and habitability." },
      { name: "Colony Architect", description: "Design life-support, habitats, and interplanetary cities." },
      { name: "Astrobiologist", description: "Search for life and understand its cosmic origins." },
      { name: "Cosmic Engineer", description: "Design megastructures and manipulate cosmic systems." }
    ],
    isLocked: false
  },
  {
    id: 19,
    title: "Civilization Building & Strategic Design",
    shortDescription: "History, anthropology, economics, architecture, geopolitics, governance, strategy, engineering, and futures thinking.",
    icon: "Scroll",
    pillars: [
      "Civilizational History & Evolution",
      "Macro-Strategy & Large-Scale Planning",
      "Governance & Institutional Design",
      "Economic Systems & Value Creation",
      "Infrastructure & Megastructure Engineering",
      "Urban Futures & City Design",
      "Cultural Systems & Social Evolution",
      "Long-Term Foresight & Civilization Survival"
    ],
    subdomains: [
      {
        title: "Civilizational History",
        points: ["Rise and fall cycles", "Ancient vs modern civilizations", "Technological revolutions", "Agricultural → Industrial → Digital epochs", "Imperial expansion patterns", "Civilizational collapse factors", "Comparative civilizations", "Cultural syncretism", "Migration waves", "Evolution of institutions"]
      },
      {
        title: "Civilizational Theory",
        points: ["Toynbee’s challenge-response model", "Spengler’s decline theory", "Tainter’s complexity-collapse theory", "Diamond’s environmental collapse theory", "Marxist historical materialism", "Cyclical vs linear models", "Memetic evolution of societies", "Civilizational lifespan mapping", "Meta-civilizational patterns", "Long-wave sociohistorical cycles"]
      },
      {
        title: "Macro-Strategy & Grand Strategy",
        points: ["National strategy", "Civilizational goals", "Power projection", "Economic dominance strategy", "Technological dominance strategy", "Cultural influence strategy", "Soft vs hard vs smart power", "Multi-decade planning", "Complex scenario mapping", "Strategic time-horizon design"]
      },
      {
        title: "Governance & Institutional Architecture",
        points: ["Constitution design", "Executive, legislative, judicial balance", "Federal vs centralized systems", "Administrative complexity", "Regulation design", "Ethics & institutional integrity", "Decentralized governance", "Legal foundations", "Policy-making ecosystems", "Institutional evolution models"]
      },
      {
        title: "Economic Systems & Macroeconomics",
        points: ["Capitalism vs socialism vs hybrid models", "Global trade networks", "Industrial policy", "Monetary systems", "Fiscal systems", "Development economics", "Innovation economies", "Economic cycles", "Inequality dynamics", "Resource distribution systems"]
      },
      {
        title: "Innovation Systems & Technological Infrastructure",
        points: ["National innovation ecosystems", "Research institutions", "Startup ecosystems", "Intellectual property systems", "High-tech industries", "Digital infrastructure", "Cyber infrastructure", "AI-driven national development", "Technology diffusion", "Knowledge economy systems"]
      },
      {
        title: "Megastructure Engineering",
        points: ["Arcologies", "Mega-cities", "Space elevators", "Underwater cities", "Floating cities", "Planet-scale energy grids", "Continental high-speed rail", "Renewable supergrids", "Hyperloop systems", "Advanced transportation networks"]
      },
      {
        title: "Urban Futures & Smart Cities",
        points: ["City planning", "Public transport", "Smart infrastructure", "Urban sustainability", "Urban density design", "Mixed-use development", "Housing systems", "Social infrastructure", "Digital city governance", "Smart mobility systems"]
      },
      {
        title: "Cultural Systems & Social Structures",
        points: ["Collective identity", "Cultural values & norms", "Mythology & storytelling", "Education systems", "Media ecosystems", "Social cohesion", "Cultural change patterns", "Demographics", "Family systems", "Intercultural integration"]
      },
      {
        title: "Civilization Resilience & Risk Management",
        points: ["Collapse prevention", "Resource sustainability", "Energy resilience", "Climate resilience", "Geopolitical risk", "Infrastructure robustness", "Social stability systems", "Institutional adaptability", "Crisis response", "Long-term survival strategy"]
      },
      {
        title: "Planetary Governance & Global Cooperation",
        points: ["International systems", "Peace architecture", "Treaty systems", "Multi-civilizational collaboration", "Global commons protection", "Space governance", "Climate governance", "Planetary institutions", "Collective intelligence systems", "Global societal coordination"]
      },
      {
        title: "Civilization Futures & Existential Horizons",
        points: ["AGI-driven civilization models", "Interplanetary civilization", "Kardashev scale development", "Cosmic-scale engineering", "Post-scarcity societies", "Hypercivilization architecture", "Long-term continuity", "Civilization after 10,000 years", "Evolution of human identity", "Civilizational meaning & purpose"]
      }
    ],
    advancedLayers: [
      { name: "Historical Intelligence", description: "Understanding patterns of civilizations across time." },
      { name: "Institutional Intelligence", description: "Designing governance systems that last centuries." },
      { name: "Strategic Intelligence", description: "Thinking in decades, centuries, and global scales." },
      { name: "Structural Intelligence", description: "Designing cities, infrastructure, and megasystems." },
      { name: "Futurist Intelligence", description: "Guiding civilization toward long-term survival." }
    ],
    tracks: [
      { name: "Civilization Architect", description: "Design the systems that shape nations and societies." },
      { name: "Grand Strategist", description: "Think across decades, continents, and civilizations." },
      { name: "Institutional Designer", description: "Create governance and administrative frameworks." },
      { name: "Infrastructure & Megastructure Engineer", description: "Design massive urban and planetary-scale systems." },
      { name: "Cultural Systems Designer", description: "Shape identity, meaning, values, and cultural evolution." },
      { name: "Futurist & Long-Term Strategist", description: "Guide humanity across the next millennium." }
    ],
    isLocked: false
  },
  {
    id: 20,
    title: "Mythic Mastery & Esoteric Systems",
    shortDescription: "Symbolic foundation of civilizations, archetypal mind, roots of story, and esoteric systems for understanding reality.",
    icon: "Eye",
    pillars: [
      "Mythology & Archetypes – universal human story-patterns",
      "Symbol Systems – meaning-making through signs and symbols",
      "Esoteric Traditions – hidden knowledge systems",
      "Consciousness Evolution – expanded self-awareness",
      "Rituals & Transformation Systems – structured personal change",
      "Mysticism & Inner States – transcendent experience",
      "Narrative Identity Design – mythic self-crafting",
      "Collective Unconscious & Shared Myth – cultural meaning architecture"
    ],
    subdomains: [
      {
        title: "Mythology",
        points: ["Hero’s journey", "Creation myths", "Death & rebirth cycles", "Trickster stories", "Warrior myths", "Sage archetypes", "Cultural mythologies (Greek, Indian, Norse, Egyptian)", "Mythic symbols", "Mythic moral structures", "Myth as psychological map"]
      },
      {
        title: "Archetypes & the Collective Unconscious",
        points: ["Jungian archetypes", "Shadow archetype", "Animus/Anima", "Hero", "Mentor", "Destroyer", "Creator", "Caregiver", "Seeker", "Sovereign", "Archetypal pattern recognition", "Archetype influence on behavior"]
      },
      {
        title: "Symbol Systems & Esoteric Codes",
        points: ["Sacred geometry", "Mandalas", "Sigils", "Totems", "Alchemical symbols", "Religious symbolism", "Astrological symbolism", "Number symbolism", "Tarot architecture", "Symbolic narratives"]
      },
      {
        title: "Esoteric Traditions",
        points: ["Hermeticism", "Gnosticism", "Kabbalah", "Yoga & Tantra", "Zen & Taoist wisdom", "Sufism", "Shamanism", "Mystery schools", "Occult traditions", "Esoteric Christianity", "Hidden teachings in major religions", "Inner alchemy"]
      },
      {
        title: "Mysticism & Higher States",
        points: ["Meditation", "Transcendence", "Non-dual awareness", "Ego dissolution", "Unity consciousness", "Out-of-body experiences", "Peak experiences", "Inner silence mastery", "Deep trance states", "Contemplative states"]
      },
      {
        title: "Rituals & Transformation Pathways",
        points: ["Initiation rituals", "Life transition rituals", "Identity rebirth rituals", "Symbolic death & rebirth", "Affirmation rituals", "Warrior rituals", "Artistic & creative rituals", "Mind-body integration rituals", "Cultural ceremonial practices", "Structured transformation processes"]
      },
      {
        title: "Consciousness Architecture",
        points: ["Layers of self", "Subconscious systems", "Deep psyche", "Mythic imagination", "Dreamwork & symbolic dreams", "Lucid dreaming", "Archetypal imagination", "Shadow integration", "Inner narrative engineering", "Higher self models"]
      },
      {
        title: "Narrative Identity Design",
        points: ["Mythic self-construction", "Personal legend crafting", "Story-based identity", "Psychological reframing", "Inner narrative rewriting", "Archetype adoption", "Mythic motivation systems", "Personal symbolism", "Heroic identity alignment", "Destiny frameworks"]
      },
      {
        title: "Esoteric Knowledge Integration",
        points: ["Pattern recognition", "Hidden meanings", "Nonlinear thinking", "Intuitive intelligence", "Symbolic cognition", "Meta-symbol frameworks", "Synchronicity", "Esoteric interpretation of history", "Living mythology", "Inner wisdom systems"]
      },
      {
        title: "Cultural Myth & Collective Meaning",
        points: ["Cultural heroes", "National myths", "Religious narratives", "Civilizational symbols", "Global mythic patterns", "Mass psychology of myth", "Story-driven cultural evolution", "Myth as societal foundation", "Media and modern mythology", "Mythopoetic social design"]
      }
    ],
    advancedLayers: [
      { name: "Symbolic Intelligence", description: "Understanding meaning buried beneath the surface." },
      { name: "Archetypal Intelligence", description: "Recognizing and shaping human behavior through mythic patterns." },
      { name: "Esoteric Intelligence", description: "Grasping hidden frameworks of inner development." },
      { name: "Mythic Construction", description: "Building stories, identities, and personal mythology." },
      { name: "Collective Mythic Architecture", description: "Shaping culture, movements, and civilizational meaning." }
    ],
    tracks: [
      { name: "Mythologist", description: "Study global myth systems and archetypal patterns." },
      { name: "Esoteric Practitioner", description: "Master meditation, transformation, and symbolic systems." },
      { name: "Narrative Architect", description: "Craft identity, stories, and symbolic meaning." },
      { name: "Cultural Mythmaker", description: "Influence collective narratives and cultural evolution." },
      { name: "Consciousness Researcher", description: "Study mysticism, inner states, and the deep psyche." }
    ],
    isLocked: false
  }
];