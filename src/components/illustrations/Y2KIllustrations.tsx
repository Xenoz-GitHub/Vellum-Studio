import { useEffect, useState } from 'react';

// Interactive AI Brain Illustration
export function AIBrainIllustration({ className = '' }: { className?: string }) {
  const [pulse, setPulse] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => (p + 1) % 3);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer glow circles */}
      <circle cx="100" cy="100" r="80" fill="url(#brainGlow)" opacity={pulse === 0 ? "0.4" : "0.2"} className="transition-opacity duration-300" />
      <circle cx="100" cy="100" r="65" fill="url(#brainGlow2)" opacity={pulse === 1 ? "0.5" : "0.3"} className="transition-opacity duration-300" />
      
      {/* Main brain shape */}
      <path
        d="M100 40C80 40 65 55 65 75C65 80 66 85 68 89C60 92 55 100 55 110C55 122 64 132 75 135C78 145 88 152 100 152C112 152 122 145 125 135C136 132 145 122 145 110C145 100 140 92 132 89C134 85 135 80 135 75C135 55 120 40 100 40Z"
        fill="url(#brainGradient)"
        stroke="#1e293b"
        strokeWidth="4"
        className="drop-shadow-lg"
      />
      
      {/* Brain details */}
      <path d="M75 70C75 70 80 75 85 72" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <path d="M115 70C115 70 110 75 105 72" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <path d="M70 95C70 95 75 100 80 97" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <path d="M120 95C120 95 115 100 110 97" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="85" cy="85" r="3" fill="#1e293b" />
      <circle cx="115" cy="85" r="3" fill="#1e293b" />
      
      {/* Sparkles */}
      <g opacity={pulse === 0 ? "1" : "0.3"} className="transition-opacity duration-300">
        <path d="M50 60L52 65L57 67L52 69L50 74L48 69L43 67L48 65Z" fill="#fbbf24" stroke="#1e293b" strokeWidth="2" />
      </g>
      <g opacity={pulse === 1 ? "1" : "0.3"} className="transition-opacity duration-300">
        <path d="M150 60L152 65L157 67L152 69L150 74L148 69L143 67L148 65Z" fill="#ec4899" stroke="#1e293b" strokeWidth="2" />
      </g>
      <g opacity={pulse === 2 ? "1" : "0.3"} className="transition-opacity duration-300">
        <path d="M100 160L102 165L107 167L102 169L100 174L98 169L93 167L98 165Z" fill="#8b5cf6" stroke="#1e293b" strokeWidth="2" />
      </g>
      
      <defs>
        <radialGradient id="brainGlow">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="brainGlow2">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="brainGradient" x1="65" y1="40" x2="145" y2="152">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Interactive Design Tools Illustration
export function DesignToolsIllustration({ className = '' }: { className?: string }) {
  const [activeHover, setActiveHover] = useState<number | null>(null);

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="100" cy="100" r="85" fill="url(#toolsGradient)" opacity="0.2" />
      
      {/* Pencil tool */}
      <g 
        onMouseEnter={() => setActiveHover(1)} 
        onMouseLeave={() => setActiveHover(null)}
        style={{ transform: activeHover === 1 ? 'scale(1.1)' : 'scale(1)', transformOrigin: '60px 60px', transition: 'transform 0.3s' }}
      >
        <rect x="50" y="40" width="20" height="40" rx="3" fill="#fbbf24" stroke="#1e293b" strokeWidth="3" />
        <path d="M50 80L60 95L70 80Z" fill="#1e293b" stroke="#1e293b" strokeWidth="2" />
        <rect x="55" y="45" width="10" height="5" fill="#f59e0b" />
      </g>
      
      {/* Color palette */}
      <g 
        onMouseEnter={() => setActiveHover(2)} 
        onMouseLeave={() => setActiveHover(null)}
        style={{ transform: activeHover === 2 ? 'scale(1.1)' : 'scale(1)', transformOrigin: '140px 60px', transition: 'transform 0.3s' }}
      >
        <rect x="120" y="45" width="40" height="30" rx="5" fill="white" stroke="#1e293b" strokeWidth="3" />
        <circle cx="130" cy="60" r="5" fill="#ef4444" />
        <circle cx="142" cy="60" r="5" fill="#3b82f6" />
        <circle cx="154" cy="60" r="5" fill="#10b981" />
      </g>
      
      {/* Magic wand */}
      <g 
        onMouseEnter={() => setActiveHover(3)} 
        onMouseLeave={() => setActiveHover(null)}
        style={{ transform: activeHover === 3 ? 'scale(1.1) rotate(10deg)' : 'scale(1) rotate(0deg)', transformOrigin: '100px 120px', transition: 'all 0.3s' }}
      >
        <path d="M95 100L105 130" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
        <path d="M90 90L95 100L105 95L100 105Z" fill="#a78bfa" stroke="#1e293b" strokeWidth="3" />
        {activeHover === 3 && (
          <>
            <path d="M85 85L87 90L92 92L87 94L85 99L83 94L78 92L83 90Z" fill="#fbbf24" stroke="#1e293b" strokeWidth="2" />
            <path d="M110 85L112 90L117 92L112 94L110 99L108 94L103 92L108 90Z" fill="#ec4899" stroke="#1e293b" strokeWidth="2" />
          </>
        )}
      </g>
      
      {/* Layers */}
      <g 
        onMouseEnter={() => setActiveHover(4)} 
        onMouseLeave={() => setActiveHover(null)}
        style={{ transform: activeHover === 4 ? 'scale(1.1)' : 'scale(1)', transformOrigin: '60px 140px', transition: 'transform 0.3s' }}
      >
        <rect x="40" y="130" width="40" height="8" rx="2" fill="#06b6d4" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="45" y="140" width="40" height="8" rx="2" fill="#8b5cf6" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="50" y="150" width="40" height="8" rx="2" fill="#ec4899" stroke="#1e293b" strokeWidth="2.5" />
      </g>
      
      {/* Shapes tool */}
      <g 
        onMouseEnter={() => setActiveHover(5)} 
        onMouseLeave={() => setActiveHover(null)}
        style={{ transform: activeHover === 5 ? 'scale(1.1)' : 'scale(1)', transformOrigin: '140px 140px', transition: 'transform 0.3s' }}
      >
        <circle cx="130" cy="145" r="10" fill="#10b981" stroke="#1e293b" strokeWidth="3" />
        <rect x="145" y="135" width="20" height="20" rx="2" fill="#f59e0b" stroke="#1e293b" strokeWidth="3" />
      </g>
      
      <defs>
        <linearGradient id="toolsGradient" x1="15" y1="15" x2="185" y2="185">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Interactive Collaboration Illustration
export function CollaborationIllustration({ className = '' }: { className?: string }) {
  const [bounce, setBounce] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(b => (b + 1) % 3);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Connection lines with animation */}
      <path d="M60 100 Q 100 80 140 100" stroke="#a78bfa" strokeWidth="3" strokeDasharray="5,5" opacity="0.5">
        <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
      </path>
      <path d="M100 60 L 100 140" stroke="#ec4899" strokeWidth="3" strokeDasharray="5,5" opacity="0.5">
        <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
      </path>
      
      {/* Avatar 1 - Top */}
      <g style={{ transform: bounce === 0 ? 'translateY(-5px)' : 'translateY(0)', transition: 'transform 0.3s' }}>
        <circle cx="100" cy="50" r="20" fill="url(#avatar1)" stroke="#1e293b" strokeWidth="4" />
        <circle cx="110" cy="45" r="3" fill="white" />
        <path d="M95 45C95 45 97 50 100 48" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        <path d="M105 45C105 45 103 50 100 48" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      </g>
      
      {/* Avatar 2 - Left */}
      <g style={{ transform: bounce === 1 ? 'translateY(-5px)' : 'translateY(0)', transition: 'transform 0.3s' }}>
        <circle cx="50" cy="100" r="20" fill="url(#avatar2)" stroke="#1e293b" strokeWidth="4" />
        <circle cx="60" cy="95" r="3" fill="white" />
        <path d="M45 95C45 95 47 100 50 98" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        <path d="M55 95C55 95 53 100 50 98" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      </g>
      
      {/* Avatar 3 - Right */}
      <g style={{ transform: bounce === 2 ? 'translateY(-5px)' : 'translateY(0)', transition: 'transform 0.3s' }}>
        <circle cx="150" cy="100" r="20" fill="url(#avatar3)" stroke="#1e293b" strokeWidth="4" />
        <circle cx="160" cy="95" r="3" fill="white" />
        <path d="M145 95C145 95 147 100 150 98" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        <path d="M155 95C155 95 153 100 150 98" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      </g>
      
      {/* Avatar 4 - Bottom */}
      <g style={{ transform: bounce === 0 ? 'translateY(-5px)' : 'translateY(0)', transition: 'transform 0.3s' }}>
        <circle cx="100" cy="150" r="20" fill="url(#avatar4)" stroke="#1e293b" strokeWidth="4" />
        <circle cx="110" cy="145" r="3" fill="white" />
        <path d="M95 145C95 145 97 150 100 148" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        <path d="M105 145C105 145 103 150 100 148" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      </g>
      
      {/* Heart in center */}
      <g opacity={bounce === 1 ? "1" : "0.6"} className="transition-opacity duration-300">
        <path d="M100 105 C 95 100 85 100 85 110 C 85 118 100 128 100 128 C 100 128 115 118 115 110 C 115 100 105 100 100 105Z" 
          fill="#ef4444" 
          stroke="#1e293b" 
          strokeWidth="3"
        />
      </g>
      
      <defs>
        <linearGradient id="avatar1" x1="80" y1="30" x2="120" y2="70">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="avatar2" x1="30" y1="80" x2="70" y2="120">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="avatar3" x1="130" y1="80" x2="170" y2="120">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="avatar4" x1="80" y1="130" x2="120" y2="170">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Interactive Export Illustration
export function ExportIllustration({ className = '' }: { className?: string }) {
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDownloading(d => !d);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Document */}
      <rect x="50" y="40" width="80" height="100" rx="8" fill="white" stroke="#1e293b" strokeWidth="4" />
      <rect x="60" y="55" width="60" height="6" rx="3" fill="#e5e7eb" />
      <rect x="60" y="70" width="50" height="6" rx="3" fill="#e5e7eb" />
      <rect x="60" y="85" width="55" height="6" rx="3" fill="#e5e7eb" />
      <rect x="60" y="100" width="45" height="6" rx="3" fill="#e5e7eb" />
      
      {/* File formats badges */}
      <g>
        <rect x="35" y="95" width="35" height="20" rx="4" fill="#ef4444" stroke="#1e293b" strokeWidth="2.5" />
        <text x="52.5" y="109" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">PDF</text>
      </g>
      <g>
        <rect x="130" y="70" width="40" height="20" rx="4" fill="#f59e0b" stroke="#1e293b" strokeWidth="2.5" />
        <text x="150" y="84" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">PPTX</text>
      </g>
      <g>
        <rect x="132" y="115" width="35" height="20" rx="4" fill="#10b981" stroke="#1e293b" strokeWidth="2.5" />
        <text x="149.5" y="129" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">PNG</text>
      </g>
      
      {/* Download arrow with animation */}
      <g style={{ transform: downloading ? 'translateY(10px)' : 'translateY(0)', opacity: downloading ? 0.3 : 1, transition: 'all 0.5s' }}>
        <rect x="85" y="145" width="30" height="5" rx="2.5" fill="#8b5cf6" stroke="#1e293b" strokeWidth="2" />
        <path d="M90 150L100 165L110 150" fill="#8b5cf6" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
        <rect x="96" y="125" width="8" height="25" rx="2" fill="#8b5cf6" stroke="#1e293b" strokeWidth="2" />
      </g>
      
      {/* Success checkmark */}
      {downloading && (
        <g opacity="0" style={{ animation: 'fadeIn 0.3s 0.5s forwards' }}>
          <circle cx="100" cy="160" r="15" fill="#10b981" stroke="#1e293b" strokeWidth="3" />
          <path d="M92 160L97 165L108 154" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      
      {/* Sparkles */}
      <g opacity={downloading ? "1" : "0.4"} className="transition-opacity duration-300">
        <path d="M40 50L42 55L47 57L42 59L40 64L38 59L33 57L38 55Z" fill="#fbbf24" stroke="#1e293b" strokeWidth="2" />
        <path d="M155 40L157 45L162 47L157 49L155 54L153 49L148 47L153 45Z" fill="#ec4899" stroke="#1e293b" strokeWidth="2" />
      </g>
    </svg>
  );
}

// Fast Speed Illustration
export function FastSpeedIllustration({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Rocket body */}
      <ellipse cx="100" cy="140" rx="20" ry="8" fill="url(#smoke)" opacity="0.4">
        <animate attributeName="rx" values="20;25;20" dur="0.5s" repeatCount="indefinite" />
      </ellipse>
      
      <g>
        <path d="M85 120C85 120 90 40 100 30C110 40 115 120 115 120Z" fill="url(#rocketBody)" stroke="#1e293b" strokeWidth="4" />
        <circle cx="100" cy="75" r="12" fill="#06b6d4" stroke="#1e293b" strokeWidth="3" />
        <circle cx="100" cy="75" r="6" fill="white" opacity="0.7" />
        
        {/* Rocket fins */}
        <path d="M85 110L75 130L85 125Z" fill="#fbbf24" stroke="#1e293b" strokeWidth="3" />
        <path d="M115 110L125 130L115 125Z" fill="#fbbf24" stroke="#1e293b" strokeWidth="3" />
        
        {/* Rocket window highlight */}
        <circle cx="95" cy="70" r="3" fill="white" opacity="0.8" />
        
        {/* Fire */}
        <g>
          <path d="M92 120C92 125 95 130 95 135C95 138 97 140 100 140C103 140 105 138 105 135C105 130 108 125 108 120" fill="#ef4444" stroke="#1e293b" strokeWidth="2.5">
            <animate attributeName="d" values="M92 120C92 125 95 130 95 135C95 138 97 140 100 140C103 140 105 138 105 135C105 130 108 125 108 120;M93 120C93 126 95 132 96 137C96 140 98 142 100 142C102 142 104 140 104 137C104 132 107 126 107 120;M92 120C92 125 95 130 95 135C95 138 97 140 100 140C103 140 105 138 105 135C105 130 108 125 108 120" dur="0.3s" repeatCount="indefinite" />
          </path>
          <path d="M95 125C95 128 97 131 97 134C97 136 98 137 100 137C102 137 103 136 103 134C103 131 105 128 105 125" fill="#fbbf24" stroke="none">
            <animate attributeName="d" values="M95 125C95 128 97 131 97 134C97 136 98 137 100 137C102 137 103 136 103 134C103 131 105 128 105 125;M96 125C96 129 97 133 98 136C98 138 99 139 100 139C101 139 102 138 102 136C102 133 103 129 104 125;M95 125C95 128 97 131 97 134C97 136 98 137 100 137C102 137 103 136 103 134C103 131 105 128 105 125" dur="0.3s" repeatCount="indefinite" />
          </path>
        </g>
      </g>
      
      {/* Speed lines */}
      <g opacity="0.6">
        <path d="M40 60L60 62" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round">
          <animate attributeName="x1" values="40;20" dur="0.8s" repeatCount="indefinite" />
          <animate attributeName="x2" values="60;40" dur="0.8s" repeatCount="indefinite" />
        </path>
        <path d="M45 80L70 82" stroke="#ec4899" strokeWidth="4" strokeLinecap="round">
          <animate attributeName="x1" values="45;25" dur="0.9s" repeatCount="indefinite" />
          <animate attributeName="x2" values="70;50" dur="0.9s" repeatCount="indefinite" />
        </path>
        <path d="M35 100L65 102" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round">
          <animate attributeName="x1" values="35;15" dur="1s" repeatCount="indefinite" />
          <animate attributeName="x2" values="65;45" dur="1s" repeatCount="indefinite" />
        </path>
        
        <path d="M140 65L160 67" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round">
          <animate attributeName="x1" values="140;160" dur="0.7s" repeatCount="indefinite" />
          <animate attributeName="x2" values="160;180" dur="0.7s" repeatCount="indefinite" />
        </path>
        <path d="M135 85L165 87" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round">
          <animate attributeName="x1" values="135;155" dur="0.85s" repeatCount="indefinite" />
          <animate attributeName="x2" values="165;185" dur="0.85s" repeatCount="indefinite" />
        </path>
      </g>
      
      {/* Stars */}
      <path d="M60 40L62 45L67 47L62 49L60 54L58 49L53 47L58 45Z" fill="#fbbf24" stroke="#1e293b" strokeWidth="2">
        <animateTransform attributeName="transform" type="rotate" from="0 60 47" to="360 60 47" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M145 50L147 55L152 57L147 59L145 64L143 59L138 57L143 55Z" fill="#ec4899" stroke="#1e293b" strokeWidth="2">
        <animateTransform attributeName="transform" type="rotate" from="0 145 57" to="-360 145 57" dur="4s" repeatCount="indefinite" />
      </path>
      
      <defs>
        <linearGradient id="rocketBody" x1="85" y1="30" x2="115" y2="120">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <radialGradient id="smoke">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// Template Gallery Illustration
export function TemplateGalleryIllustration({ className = '' }: { className?: string }) {
  const [activeCard, setActiveCard] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard(c => (c % 3) + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Template card 1 */}
      <g style={{ 
        transform: activeCard === 1 ? 'translateY(-10px) scale(1.05)' : 'translateY(0) scale(1)', 
        transition: 'all 0.3s',
        transformOrigin: '65px 70px'
      }}>
        <rect x="30" y="40" width="70" height="60" rx="8" fill="url(#template1)" stroke="#1e293b" strokeWidth="3" />
        <rect x="37" y="48" width="25" height="4" rx="2" fill="white" opacity="0.8" />
        <rect x="37" y="56" width="20" height="3" rx="1.5" fill="white" opacity="0.6" />
        <rect x="37" y="62" width="22" height="3" rx="1.5" fill="white" opacity="0.6" />
        <circle cx="80" cy="75" r="12" fill="white" opacity="0.7" />
        {activeCard === 1 && <circle cx="65" cy="25" r="5" fill="#fbbf24" stroke="#1e293b" strokeWidth="2" />}
      </g>
      
      {/* Template card 2 */}
      <g style={{ 
        transform: activeCard === 2 ? 'translateY(-10px) scale(1.05)' : 'translateY(0) scale(1)', 
        transition: 'all 0.3s',
        transformOrigin: '100px 115px'
      }}>
        <rect x="65" y="85" width="70" height="60" rx="8" fill="url(#template2)" stroke="#1e293b" strokeWidth="3" />
        <rect x="72" y="93" width="28" height="4" rx="2" fill="white" opacity="0.8" />
        <rect x="72" y="101" width="23" height="3" rx="1.5" fill="white" opacity="0.6" />
        <rect x="72" y="107" width="25" height="3" rx="1.5" fill="white" opacity="0.6" />
        <rect x="108" y="95" width="20" height="15" rx="3" fill="white" opacity="0.7" />
        {activeCard === 2 && <circle cx="100" cy="70" r="5" fill="#ec4899" stroke="#1e293b" strokeWidth="2" />}
      </g>
      
      {/* Template card 3 */}
      <g style={{ 
        transform: activeCard === 3 ? 'translateY(-10px) scale(1.05)' : 'translateY(0) scale(1)', 
        transition: 'all 0.3s',
        transformOrigin: '135px 70px'
      }}>
        <rect x="100" y="40" width="70" height="60" rx="8" fill="url(#template3)" stroke="#1e293b" strokeWidth="3" />
        <rect x="107" y="48" width="30" height="4" rx="2" fill="white" opacity="0.8" />
        <rect x="107" y="56" width="25" height="3" rx="1.5" fill="white" opacity="0.6" />
        <circle cx="152" cy="68" r="10" fill="white" opacity="0.7" />
        <rect x="107" y="78" width="56" height="3" rx="1.5" fill="white" opacity="0.5" />
        <rect x="107" y="84" width="50" height="3" rx="1.5" fill="white" opacity="0.5" />
        {activeCard === 3 && <circle cx="135" cy="25" r="5" fill="#06b6d4" stroke="#1e293b" strokeWidth="2" />}
      </g>
      
      {/* Plus button */}
      <g>
        <circle cx="100" cy="165" r="18" fill="white" stroke="#1e293b" strokeWidth="4" />
        <path d="M100 155L100 175M90 165L110 165" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      </g>
      
      <defs>
        <linearGradient id="template1" x1="30" y1="40" x2="100" y2="100">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="template2" x1="65" y1="85" x2="135" y2="145">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
        <linearGradient id="template3" x1="100" y1="40" x2="170" y2="100">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
