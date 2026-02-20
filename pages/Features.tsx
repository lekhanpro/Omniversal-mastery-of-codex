import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    BarChart3,
    BookOpenText,
    Compass,
    Flame,
    Hammer,
    Map,
    Sparkles,
    Telescope,
    ArrowRight
} from 'lucide-react';

const featuresList = [
    {
        path: '/map',
        name: 'Knowledge Map',
        description: 'Explore a beautiful orbital representation of all 20 mastery domains and their interconnections.',
        icon: <Map className="h-6 w-6" />,
        color: '#3b82f6',
    },
    {
        path: '/oracle',
        name: 'The Oracle',
        description: 'Consult the AI mentor for guidance and wisdom specifically tailored for the Omniversal Codex.',
        icon: <Sparkles className="h-6 w-6" />,
        color: '#f59e0b',
    },
    {
        path: '/arena',
        name: 'The Arena',
        description: 'A place to challenge yourself, test your skills, and prove your knowledge mastery.',
        icon: <Flame className="h-6 w-6" />,
        color: '#ef4444',
    },
    {
        path: '/grimoire',
        name: 'The Grimoire',
        description: 'A repository of advanced reading, complex theories, and deep conceptual notes.',
        icon: <BookOpenText className="h-6 w-6" />,
        color: '#a855f7',
    },
    {
        path: '/observatory',
        name: 'Observatory',
        description: 'Track distant topics, high-level trends, and survey the overarching structure of your learning.',
        icon: <Telescope className="h-6 w-6" />,
        color: '#0ea5e9',
    },
    {
        path: '/forge',
        name: 'The Forge',
        description: 'Synthesize new ideas and build tangible projects out of the knowledge you have acquired.',
        icon: <Hammer className="h-6 w-6" />,
        color: '#f97316',
    },
    {
        path: '/cartography',
        name: 'Cartography',
        description: 'Map out new uncharted intellectual territories and plan your future domain expansions.',
        icon: <Compass className="h-6 w-6" />,
        color: '#10b981',
    },
    {
        path: '/dashboard',
        name: 'Analytics Dashboard',
        description: 'Detailed metrics and performance tracking of your complete codex progression.',
        icon: <BarChart3 className="h-6 w-6" />,
        color: '#6366f1',
    },
];

const MotionLink = motion(Link);

const Features: React.FC = () => {
    return (
        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-8 md:px-8 md:py-12">
            <section className="glass-panel mb-10 rounded-3xl p-8 md:p-12">
                <h1 className="hero-shimmer font-cinzel text-3xl font-bold tracking-wide text-[var(--codex-text-strong)] md:text-5xl">
                    Codex Features
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-[var(--codex-text-soft)]">
                    Launch sophisticated tools designed to enhance your structural learning. Expand your mastery via interactive mapping, AI mentorship, metrics, and more.
                </p>
            </section>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {featuresList.map((feature, idx) => (
                    <MotionLink
                        key={feature.path}
                        to={feature.path}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group glass-panel flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all hover:border-[var(--codex-primary)]/45 hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div>
                            <div
                                className="mb-4 inline-flex items-center justify-center rounded-xl p-3"
                                style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                            >
                                {feature.icon}
                            </div>
                            <h2 className="mb-2 font-cinzel text-xl font-bold text-[var(--codex-text-strong)] group-hover:text-[var(--codex-primary)] transition-colors">
                                {feature.name}
                            </h2>
                            <p className="mb-6 text-sm text-[var(--codex-text-soft)]">
                                {feature.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-[var(--codex-text-muted)] group-hover:text-[var(--codex-primary)] transition-colors">
                            <span>EXPLORE</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </MotionLink>
                ))}
            </div>
        </div>
    );
};

export default Features;
