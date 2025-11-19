import React, { useState, useEffect } from 'react';
import { domains } from '../data';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../components/Icons';
import { ArrowLeft } from 'lucide-react';

const KnowledgeMap: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Orbit Configuration
  const innerRadius = 220;
  const outerRadius = 380;
  
  // Split domains into two orbits
  const innerOrbitDomains = domains.slice(0, 8);
  const outerOrbitDomains = domains.slice(8, 20);

  const getPosition = (index: number, total: number, radius: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    };
  };

  return (
    <div className="min-h-full relative overflow-hidden bg-black flex flex-col items-center">
       {/* Enhanced Background */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1a2e] via-[#050505] to-black pointer-events-none"></div>
       <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none animate-pulse-slow"></div>
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
       
       {/* Ambient Glows */}
       <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-neon-blue/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
       </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center py-12 md:py-0 md:h-[calc(100vh-64px)]">
        
        {/* Header / Navigation */}
        <div className="md:absolute md:top-8 md:left-8 flex flex-col items-center md:items-start mb-8 md:mb-0 z-30">
            <Link to="/" className="flex items-center text-neon-blue mb-2 hover:underline font-mono text-sm">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Codex
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tight">
              <span className="text-neon-blue">NEURAL</span> CONSTELLATION
            </h1>
            <p className="text-gray-500 text-xs md:text-sm max-w-xs mx-auto md:mx-0 mt-1">
              Interactive Knowledge System. Hover to pause.
            </p>
        </div>

        {/* DESKTOP ORBIT VIEW */}
        {!isMobile && (
          <div className="relative w-[900px] h-[900px] flex items-center justify-center scale-75 lg:scale-90 xl:scale-100 transition-transform duration-500 pause-on-hover">
            
            {/* Central Hub - Enhanced */}
            <Link to="/" className="absolute z-30 w-60 h-60 rounded-full bg-black/90 border-2 border-neon-blue shadow-[0_0_100px_rgba(0,243,255,0.4)] flex items-center justify-center text-center backdrop-blur-xl group cursor-pointer hover:scale-105 transition-all duration-500">
               
               {/* Pulsing Outer Border */}
               <div className="absolute -inset-2 rounded-full border-2 border-neon-blue/50 animate-pulse"></div>
               <div className="absolute -inset-1 rounded-full border border-neon-blue/80 blur-[2px] animate-pulse"></div>
               
               {/* Interactive Glow */}
               <div className="absolute inset-0 rounded-full bg-neon-blue/5 group-hover:bg-neon-blue/15 transition-colors duration-500"></div>

               {/* Spinning Elements */}
               <div className="absolute inset-4 rounded-full border border-dashed border-neon-blue/30 animate-spin-slower"></div>
               <div className="absolute inset-8 rounded-full border border-dotted border-neon-purple/40 animate-reverse-spin-slow"></div>
               
               <div className="relative z-10 pointer-events-none">
                  <div className="text-neon-blue text-xs font-mono tracking-[0.25em] mb-2 group-hover:text-white transition-colors">SYSTEM CORE</div>
                  <div className="text-white font-black text-2xl leading-tight tracking-tight drop-shadow-[0_0_10px_rgba(0,243,255,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(0,243,255,0.8)] transition-all">OMNIVERSAL<br/>MASTERY<br/>CODEX</div>
               </div>
            </Link>

            {/* INNER ORBIT GROUP */}
            <div className="absolute inset-0 pointer-events-none animate-spin-slow">
                {/* Ring */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                   <circle cx="50%" cy="50%" r={innerRadius} fill="none" stroke="#00f3ff" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                   {/* Spokes */}
                   {innerOrbitDomains.map((_, idx) => {
                     const pos = getPosition(idx, innerOrbitDomains.length, innerRadius);
                     return (
                        <line 
                            key={`spoke-in-${idx}`}
                            x1="50%" y1="50%" 
                            x2={`calc(50% + ${pos.x}px)`} 
                            y2={`calc(50% + ${pos.y}px)`} 
                            stroke="#00f3ff" 
                            strokeWidth="1" 
                            opacity="0.1" 
                        />
                     );
                   })}
                </svg>

                {/* Nodes */}
                {innerOrbitDomains.map((domain, idx) => {
                  const pos = getPosition(idx, innerOrbitDomains.length, innerRadius);
                  return (
                    <div
                      key={domain.id}
                      className="absolute w-14 h-14 -ml-7 -mt-7 z-40 pointer-events-auto"
                      style={{ left: `calc(50% + ${pos.x}px)`, top: `calc(50% + ${pos.y}px)` }}
                    >
                       {/* Counter-rotate the icon container so it stays upright */}
                       <div className="w-full h-full animate-reverse-spin-slow relative">
                         <div className="w-full h-full animate-float" style={{ animationDelay: `${idx * -0.5}s` }}>
                           <Link to={domain.isLocked ? '#' : `/domain/${domain.id}`} className="relative block w-full h-full group">
                              
                              {/* Spinning Outer Ring for Local Rotation Effect */}
                              <div className="absolute -inset-2 rounded-full border border-dashed border-neon-blue/30 animate-spin-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                              <div className={`
                                w-full h-full rounded-full flex items-center justify-center border bg-black/90 backdrop-blur-md transition-all duration-300 relative z-10
                                ${domain.isLocked ? 'border-gray-800 text-gray-600' : 'border-neon-blue/40 text-neon-blue group-hover:border-neon-blue group-hover:shadow-[0_0_30px_rgba(0,243,255,0.6)]'}
                              `}>
                                 {getIcon(domain.icon, "w-6 h-6")}
                              </div>
                              
                              {/* Tooltip */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                 <div className="bg-black/90 border border-neon-blue/30 rounded p-2 backdrop-blur-md shadow-lg shadow-neon-blue/10">
                                    <span className="text-[10px] font-mono text-neon-blue block mb-0.5">DOMAIN 0{domain.id}</span>
                                    <span className="text-xs font-bold text-white leading-tight block">{domain.title}</span>
                                 </div>
                              </div>
                           </Link>
                         </div>
                       </div>
                    </div>
                  );
                })}
            </div>

            {/* OUTER ORBIT GROUP */}
            <div className="absolute inset-0 pointer-events-none animate-spin-slower" style={{ animationDirection: 'reverse' }}>
                {/* Ring */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                   <circle cx="50%" cy="50%" r={outerRadius} fill="none" stroke="#bc13fe" strokeWidth="1" strokeDasharray="6 4" opacity="0.2" />
                    {/* Spokes */}
                   {outerOrbitDomains.map((_, idx) => {
                     const pos = getPosition(idx, outerOrbitDomains.length, outerRadius);
                     return (
                        <line 
                            key={`spoke-out-${idx}`}
                            x1="50%" y1="50%" 
                            x2={`calc(50% + ${pos.x}px)`} 
                            y2={`calc(50% + ${pos.y}px)`} 
                            stroke="#bc13fe" 
                            strokeWidth="1" 
                            opacity="0.05" 
                        />
                     );
                   })}
                </svg>

                {/* Nodes */}
                {outerOrbitDomains.map((domain, idx) => {
                  const pos = getPosition(idx, outerOrbitDomains.length, outerRadius);
                  return (
                    <div
                      key={domain.id}
                      className="absolute w-12 h-12 -ml-6 -mt-6 z-40 pointer-events-auto"
                      style={{ left: `calc(50% + ${pos.x}px)`, top: `calc(50% + ${pos.y}px)` }}
                    >
                       {/* Counter-rotate to keep upright. Parent is 'reverse' so this must be 'normal' to cancel out */}
                       <div className="w-full h-full animate-spin-slower">
                         <div className="w-full h-full animate-float" style={{ animationDelay: `${idx * -0.7}s` }}>
                           <Link to={domain.isLocked ? '#' : `/domain/${domain.id}`} className="relative block w-full h-full group">
                              
                              {/* Spinning Outer Ring for Local Rotation Effect */}
                              <div className="absolute -inset-2 rounded-full border border-dashed border-neon-purple/30 animate-spin-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                              <div className={`
                                w-full h-full rounded-full flex items-center justify-center border bg-black/90 backdrop-blur-md transition-all duration-300 relative z-10
                                ${domain.isLocked ? 'border-gray-800 text-gray-600' : 'border-neon-purple/40 text-neon-purple group-hover:border-neon-purple group-hover:shadow-[0_0_30px_rgba(188,19,254,0.6)]'}
                              `}>
                                 {getIcon(domain.icon, "w-5 h-5")}
                              </div>
                               {/* Tooltip */}
                               <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                 <div className="bg-black/90 border border-neon-purple/30 rounded p-2 backdrop-blur-md shadow-lg shadow-neon-purple/10">
                                    <span className="text-[10px] font-mono text-neon-purple block mb-0.5">DOMAIN {domain.id}</span>
                                    <span className="text-xs font-bold text-gray-300 leading-tight block">{domain.title}</span>
                                 </div>
                              </div>
                           </Link>
                         </div>
                       </div>
                    </div>
                  );
                })}
            </div>

          </div>
        )}

        {/* MOBILE STREAM VIEW */}
        {isMobile && (
          <div className="w-full max-w-md px-6 relative">
             <div className="absolute left-9 top-0 bottom-0 w-px bg-gradient-to-b from-neon-blue via-neon-purple to-transparent opacity-30"></div>
             
             <div className="space-y-8 pb-20 pt-8">
                {domains.map((domain, idx) => (
                  <motion.div 
                    key={domain.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative pl-12"
                  >
                    {/* Dot on timeline */}
                    <div className={`absolute left-[30px] top-3 w-2 h-2 rounded-full ${idx < 8 ? 'bg-neon-blue shadow-[0_0_10px_#00f3ff]' : 'bg-neon-purple'} -translate-x-1/2 ring-4 ring-black`}></div>

                    <Link 
                      to={domain.isLocked ? '#' : `/domain/${domain.id}`}
                      className={`block p-4 rounded-xl border bg-dark-card/50 backdrop-blur-md transition-all ${domain.isLocked ? 'border-gray-800 opacity-60' : 'border-dark-border hover:border-neon-blue/50'}`}
                    >
                       <div className="flex items-center mb-2">
                          <span className={`font-mono text-xs mr-3 ${idx < 8 ? 'text-neon-blue' : 'text-neon-purple'}`}>0{domain.id}</span>
                          {getIcon(domain.icon, "w-4 h-4 text-gray-400")}
                       </div>
                       <h3 className="font-bold text-white text-sm">{domain.title}</h3>
                    </Link>
                  </motion.div>
                ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default KnowledgeMap;