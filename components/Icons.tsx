import React from 'react';
import { 
  Sword, Brain, Cpu, Bot, Atom, TrendingUp, Scale, Mic, ShieldAlert, Telescope,
  Palette, Scroll, Globe, BookOpen, Flame, Rocket, Zap, Stethoscope, Music, Eye,
  Lock
} from 'lucide-react';

export const getIcon = (name: string, className: string = "w-6 h-6") => {
  const props = { className };
  switch (name) {
    case "Sword": return <Sword {...props} />;
    case "Brain": return <Brain {...props} />;
    case "Cpu": return <Cpu {...props} />;
    case "Bot": return <Bot {...props} />;
    case "Atom": return <Atom {...props} />;
    case "TrendingUp": return <TrendingUp {...props} />;
    case "Scale": return <Scale {...props} />;
    case "Mic": return <Mic {...props} />;
    case "ShieldAlert": return <ShieldAlert {...props} />;
    case "Telescope": return <Telescope {...props} />;
    case "Palette": return <Palette {...props} />;
    case "Scroll": return <Scroll {...props} />;
    case "Globe": return <Globe {...props} />;
    case "BookOpen": return <BookOpen {...props} />;
    case "Flame": return <Flame {...props} />;
    case "Rocket": return <Rocket {...props} />;
    case "Zap": return <Zap {...props} />;
    case "Stethoscope": return <Stethoscope {...props} />;
    case "Music": return <Music {...props} />;
    case "Eye": return <Eye {...props} />;
    default: return <Lock {...props} />;
  }
};
