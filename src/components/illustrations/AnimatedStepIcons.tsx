import { useEffect, useState } from 'react';

// Step 1: Template Selection Icon
export function TemplateSelectionIcon({ className = '' }: { className?: string }) {
  const [activeCard, setActiveCard] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard(c => (c + 1) % 3);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Template cards */}
      <g style={{ transform: activeCard === 0 ? 'scale(1.1)' : 'scale(1)', transformOrigin: '30px 40px', transition: 'transform 0.3s' }}>
        <rect x="15" y="30" width="30" height="35" rx="4" fill="url(#temp1)" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="19" y="35" width="10" height="2" rx="1" fill="white" opacity="0.8" />
        <rect x="19" y="40" width="8" height="1.5" rx="0.75" fill="white" opacity="0.6" />
      </g>
      
      <g style={{ transform: activeCard === 1 ? 'scale(1.1)' : 'scale(1)', transformOrigin: '60px 40px', transition: 'transform 0.3s' }}>
        <rect x="45" y="30" width="30" height="35" rx="4" fill="url(#temp2)" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="49" y="35" width="12" height="2" rx="1" fill="white" opacity="0.8" />
        <rect x="49" y="40" width="9" height="1.5" rx="0.75" fill="white" opacity="0.6" />
      </g>
      
      <g style={{ transform: activeCard === 2 ? 'scale(1.1)' : 'scale(1)', transformOrigin: '90px 40px', transition: 'transform 0.3s' }}>
        <rect x="75" y="30" width="30" height="35" rx="4" fill="url(#temp3)" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="79" y="35" width="11" height="2" rx="1" fill="white" opacity="0.8" />
        <rect x="79" y="40" width="10" height="1.5" rx="0.75" fill="white" opacity="0.6" />
      </g>
      
      {/* Cursor */}
      <g style={{ transform: `translateX(${activeCard * 30}px)`, transition: 'transform 0.3s' }}>
        <path d="M28 75L28 85L35 80Z" fill="#1e293b" stroke="white" strokeWidth="1.5" />
      </g>
      
      <defs>
        <linearGradient id="temp1" x1="15" y1="30" x2="45" y2="65">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="temp2" x1="45" y1="30" x2="75" y2="65">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="temp3" x1="75" y1="30" x2="105" y2="65">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Step 2: Customize Icon
export function CustomizeIcon({ className = '' }: { className?: string }) {
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsDragging(d => !d);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Canvas */}
      <rect x="20" y="25" width="80" height="70" rx="6" fill="white" stroke="#1e293b" strokeWidth="3" />
      
      {/* Text lines */}
      <rect x="30" y="35" width="40" height="4" rx="2" fill="#e5e7eb" />
      <rect x="30" y="45" width="35" height="3" rx="1.5" fill="#e5e7eb" />
      
      {/* Shape being dragged */}
      <g style={{ 
        transform: isDragging ? 'translate(60px, 60px) rotate(15deg)' : 'translate(75px, 75px) rotate(0deg)', 
        transition: 'all 0.6s ease-in-out' 
      }}>
        <rect x="-8" y="-8" width="16" height="16" rx="2" fill="url(#customize)" stroke="#1e293b" strokeWidth="2.5" />
      </g>
      
      {/* Target position indicator */}
      {isDragging && (
        <g opacity="0.5" style={{ animation: 'pulse 1s infinite' }}>
          <rect x="52" y="52" width="16" height="16" rx="2" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="2,2" fill="none" />
        </g>
      )}
      
      {/* Cursor */}
      <g style={{ 
        transform: isDragging ? 'translate(60px, 68px)' : 'translate(75px, 83px)', 
        transition: 'transform 0.6s ease-in-out' 
      }}>
        <path d="M0 0L0 10L7 5Z" fill="#1e293b" stroke="white" strokeWidth="1.5" />
      </g>
      
      <defs>
        <linearGradient id="customize" x1="0" y1="0" x2="16" y2="16">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Step 3: Export Icon
export function ExportIconStep({ className = '' }: { className?: string }) {
  const [exporting, setExporting] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setExporting(true);
      setTimeout(() => setExporting(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Document */}
      <rect x="30" y="20" width="60" height="70" rx="6" fill="white" stroke="#1e293b" strokeWidth="3" />
      <rect x="40" y="30" width="40" height="4" rx="2" fill="#e5e7eb" />
      <rect x="40" y="40" width="35" height="3" rx="1.5" fill="#e5e7eb" />
      <rect x="40" y="48" width="37" height="3" rx="1.5" fill="#e5e7eb" />
      
      {/* Export arrow */}
      <g style={{ 
        transform: exporting ? 'translateY(20px)' : 'translateY(0)', 
        opacity: exporting ? 0.3 : 1,
        transition: 'all 0.5s' 
      }}>
        <rect x="54" y="85" width="12" height="4" rx="2" fill="#8b5cf6" stroke="#1e293b" strokeWidth="2" />
        <path d="M52 89L60 100L68 89" fill="#8b5cf6" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
        <rect x="57" y="70" width="6" height="20" rx="2" fill="#8b5cf6" stroke="#1e293b" strokeWidth="2" />
      </g>
      
      {/* Success */}
      {exporting && (
        <g style={{ animation: 'fadeIn 0.3s' }}>
          <circle cx="60" cy="95" r="12" fill="#10b981" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M54 95L58 99L66 91" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      
      {/* File format badges */}
      <g opacity={exporting ? 1 : 0.6} style={{ transition: 'opacity 0.3s' }}>
        <rect x="15" y="60" width="20" height="12" rx="3" fill="#ef4444" stroke="#1e293b" strokeWidth="2" />
        <text x="25" y="68" fill="white" fontSize="7" fontWeight="bold" textAnchor="middle">PDF</text>
      </g>
      <g opacity={exporting ? 1 : 0.6} style={{ transition: 'opacity 0.3s', transitionDelay: '0.1s' }}>
        <rect x="95" y="45" width="22" height="12" rx="3" fill="#f59e0b" stroke="#1e293b" strokeWidth="2" />
        <text x="106" y="53" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">PPTX</text>
      </g>
      <g opacity={exporting ? 1 : 0.6} style={{ transition: 'opacity 0.3s', transitionDelay: '0.2s' }}>
        <rect x="95" y="70" width="20" height="12" rx="3" fill="#10b981" stroke="#1e293b" strokeWidth="2" />
        <text x="105" y="78" fill="white" fontSize="7" fontWeight="bold" textAnchor="middle">PNG</text>
      </g>
    </svg>
  );
}
