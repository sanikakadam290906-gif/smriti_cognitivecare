import React from 'react';

interface CulturalIconProps {
  type: string;
  className?: string;
  size?: number;
  color?: string;
}

export const CulturalIcon: React.FC<CulturalIconProps> = ({
  type,
  className = 'w-10 h-10',
  size = 40,
  color,
}) => {
  switch (type) {
    case 'xorai':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Traditional bell-metal tray on pedestal */}
          <path d="M12 28C12 20 52 20 52 28C52 36 40 38 40 46L44 54H20L24 46C24 38 12 36 12 28Z" fill="#D4AF37" stroke="#997A15" strokeWidth="2.5" />
          <ellipse cx="32" cy="24" rx="20" ry="6" fill="#F4D03F" stroke="#997A15" strokeWidth="2" />
          <path d="M28 20C28 14 32 8 32 8C32 8 36 14 36 20" stroke="#997A15" strokeWidth="2.5" fill="#F9E79F" />
          <rect x="18" y="54" width="28" height="5" rx="2" fill="#B7950B" stroke="#7D6608" strokeWidth="2" />
        </svg>
      );
    case 'jaapi':
    case 'khumbeu':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Conical woven bamboo sun hat with red & green motifs */}
          <polygon points="32,10 8,46 56,46" fill="#E8D7B8" stroke="#8C6D3F" strokeWidth="2.5" />
          <polygon points="32,10 24,32 40,32" fill="#C0392B" opacity="0.85" />
          <circle cx="32" cy="38" r="4" fill="#27AE60" />
          <path d="M14 42L50 42" stroke="#8C6D3F" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="32" cy="10" r="3" fill="#8C6D3F" />
        </svg>
      );
    case 'gamosa':
    case 'silk':
    case 'puan':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Traditional woven red & white fabric with traditional borders */}
          <rect x="10" y="14" width="44" height="36" rx="4" fill="#FCFBF9" stroke="#C0392B" strokeWidth="2.5" />
          <rect x="10" y="40" width="44" height="6" fill="#C0392B" />
          <path d="M12 36L18 30L24 36L30 30L36 36L42 30L48 36L52 30" stroke="#C0392B" strokeWidth="2" fill="none" />
          <line x1="12" y1="50" x2="12" y2="56" stroke="#C0392B" strokeWidth="2" />
          <line x1="20" y1="50" x2="20" y2="56" stroke="#C0392B" strokeWidth="2" />
          <line x1="28" y1="50" x2="28" y2="56" stroke="#C0392B" strokeWidth="2" />
          <line x1="36" y1="50" x2="36" y2="56" stroke="#C0392B" strokeWidth="2" />
          <line x1="44" y1="50" x2="44" y2="56" stroke="#C0392B" strokeWidth="2" />
          <line x1="52" y1="50" x2="52" y2="56" stroke="#C0392B" strokeWidth="2" />
        </svg>
      );
    case 'tea_leaves':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Fresh two leaves and a bud */}
          <path d="M32 54C32 40 32 30 32 20" stroke="#4D7C0F" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 34C20 32 14 20 18 12C26 12 30 22 32 34Z" fill="#65A30D" stroke="#365314" strokeWidth="2" />
          <path d="M32 30C44 28 50 16 46 8C38 8 34 18 32 30Z" fill="#84CC16" stroke="#365314" strokeWidth="2" />
          <path d="M32 20C30 14 32 8 32 6C34 8 35 14 32 20Z" fill="#4D7C0F" />
        </svg>
      );
    case 'basket':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Handwoven cane/bamboo basket */}
          <ellipse cx="32" cy="18" rx="20" ry="7" fill="#E0C9A6" stroke="#8C6239" strokeWidth="2.5" />
          <path d="M12 18L18 52H46L52 18" fill="#D2B48C" stroke="#8C6239" strokeWidth="2.5" />
          <path d="M16 26L48 44M16 44L48 26" stroke="#8C6239" strokeWidth="1.5" opacity="0.6" />
          <path d="M22 18C22 8 42 8 42 18" stroke="#6F4E37" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'cup':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Terracotta/clay tea cup */}
          <path d="M16 22L20 50C20 54 26 56 32 56C38 56 44 54 44 50L48 22H16Z" fill="#C87449" stroke="#873600" strokeWidth="2.5" />
          <ellipse cx="32" cy="22" rx="16" ry="5" fill="#DC7633" stroke="#873600" strokeWidth="2" />
          <path d="M28 14C28 10 32 8 32 8M36 15C36 12 40 10 40 10" stroke="#B3B6B7" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'kettle':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Traditional tea kettle */}
          <ellipse cx="32" cy="46" rx="18" ry="12" fill="#D5D8DC" stroke="#5D6D7E" strokeWidth="2.5" />
          <rect x="22" y="24" width="20" height="6" rx="2" fill="#5D6D7E" />
          <path d="M32 24V18" stroke="#5D6D7E" strokeWidth="3" />
          <path d="M46 38L56 30V26" stroke="#5D6D7E" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M18 36C10 36 10 46 16 50" stroke="#5D6D7E" strokeWidth="3" fill="none" />
          <path d="M22 24C22 10 42 10 42 24" stroke="#34495E" strokeWidth="3.5" fill="none" />
        </svg>
      );
    case 'drum':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Folk Bihu Dhol drum */}
          <ellipse cx="14" cy="32" rx="4" ry="14" fill="#F5CBA7" stroke="#784212" strokeWidth="2" />
          <ellipse cx="50" cy="32" rx="4" ry="14" fill="#F5CBA7" stroke="#784212" strokeWidth="2" />
          <path d="M14 18C28 14 36 14 50 18V46C36 50 28 50 14 46V18Z" fill="#A04000" stroke="#784212" strokeWidth="2.5" />
          <path d="M14 18L50 46M14 46L50 18" stroke="#FADBD8" strokeWidth="1.5" opacity="0.6" />
        </svg>
      );
    case 'lemon':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Assam oblong Kaji Nemu */}
          <ellipse cx="32" cy="32" rx="16" ry="24" transform="rotate(-30 32 32)" fill="#F4D03F" stroke="#B7950B" strokeWidth="2.5" />
          <path d="M26 12C28 6 36 8 36 8" stroke="#27AE60" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="36" cy="10" rx="6" ry="3" fill="#2ECC71" />
        </svg>
      );
    case 'orange':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <circle cx="32" cy="34" r="20" fill="#E67E22" stroke="#BA4A00" strokeWidth="2.5" />
          <path d="M32 14V10" stroke="#7E5109" strokeWidth="2.5" />
          <ellipse cx="38" cy="10" rx="6" ry="3.5" fill="#27AE60" />
        </svg>
      );
    case 'orchid':
    case 'flower_red':
    case 'rhododendron':
    case 'marigold':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <circle cx="32" cy="32" r="8" fill={color || '#F39C12'} />
          <circle cx="32" cy="18" r="7" fill={color || '#E74C3C'} opacity="0.9" />
          <circle cx="44" cy="24" r="7" fill={color || '#E74C3C'} opacity="0.9" />
          <circle cx="44" cy="40" r="7" fill={color || '#E74C3C'} opacity="0.9" />
          <circle cx="32" cy="46" r="7" fill={color || '#E74C3C'} opacity="0.9" />
          <circle cx="20" cy="40" r="7" fill={color || '#E74C3C'} opacity="0.9" />
          <circle cx="20" cy="24" r="7" fill={color || '#E74C3C'} opacity="0.9" />
        </svg>
      );
    case 'bamboo':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <rect x="22" y="10" width="8" height="44" rx="2" fill="#52BE80" stroke="#1E8449" strokeWidth="2" />
          <rect x="34" y="10" width="8" height="44" rx="2" fill="#48C9B0" stroke="#1E8449" strokeWidth="2" />
          <line x1="22" y1="24" x2="30" y2="24" stroke="#196F3D" strokeWidth="3" />
          <line x1="22" y1="38" x2="30" y2="38" stroke="#196F3D" strokeWidth="3" />
          <line x1="34" y1="20" x2="42" y2="20" stroke="#196F3D" strokeWidth="3" />
          <line x1="34" y1="34" x2="42" y2="34" stroke="#196F3D" strokeWidth="3" />
        </svg>
      );
    case 'ginger':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M18 42C14 36 16 28 22 26C26 24 30 28 34 26C38 24 38 16 44 18C50 20 48 30 46 36C44 42 48 46 44 50C40 54 32 48 26 50C20 52 18 46 18 42Z" fill="#D4AC0D" stroke="#9A7D0A" strokeWidth="2.5" />
        </svg>
      );
    case 'flute':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <rect x="8" y="28" width="48" height="8" rx="4" transform="rotate(-25 32 32)" fill="#EDBB99" stroke="#A04000" strokeWidth="2" />
          <circle cx="24" cy="30" r="1.5" fill="#6E2C00" />
          <circle cx="30" cy="28" r="1.5" fill="#6E2C00" />
          <circle cx="36" cy="26" r="1.5" fill="#6E2C00" />
          <circle cx="42" cy="24" r="1.5" fill="#6E2C00" />
        </svg>
      );
    case 'jackfruit':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="34" rx="18" ry="22" fill="#7D6608" stroke="#5B4A05" strokeWidth="2.5" />
          <path d="M32 12V6" stroke="#4D5656" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'shuttle':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M8 32C18 24 46 24 56 32C46 40 18 40 8 32Z" fill="#A0522D" stroke="#5C2E17" strokeWidth="2" />
          <ellipse cx="32" cy="32" rx="10" ry="3" fill="#FFF" />
          <circle cx="32" cy="32" r="2" fill="#C0392B" />
        </svg>
      );
    case 'water_pot':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <circle cx="32" cy="38" r="16" fill="#D4AC0D" stroke="#7D6608" strokeWidth="2.5" />
          <path d="M26 22H38V16H26V22Z" fill="#B7950B" stroke="#7D6608" strokeWidth="2" />
          <ellipse cx="32" cy="16" rx="8" ry="3" fill="#F4D03F" />
        </svg>
      );
    case 'fan':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M16 16C16 16 32 8 48 16C48 32 40 44 32 44C24 44 16 32 16 16Z" fill="#FAD7A0" stroke="#B9770E" strokeWidth="2" />
          <line x1="32" y1="44" x2="32" y2="58" stroke="#7E5109" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    case 'pestle':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <rect x="28" y="10" width="8" height="44" rx="4" fill="#873600" stroke="#4A1E00" strokeWidth="2" />
          <ellipse cx="32" cy="10" rx="6" ry="3" fill="#A04000" />
          <ellipse cx="32" cy="54" rx="6" ry="3" fill="#A04000" />
        </svg>
      );
    // Patterns & Shapes
    case 'diamond':
    case 'rhombus':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <polygon points="32,8 56,32 32,56 8,32" fill={color || '#527961'} stroke="#1D2420" strokeWidth="2" />
        </svg>
      );
    case 'chevron':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M12 20L32 36L52 20M12 36L32 52L52 36" stroke={color || '#C87449'} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <polygon points="32,8 39,24 56,24 42,35 47,52 32,42 17,52 22,35 8,24 25,24" fill={color || '#B7950B'} stroke="#7D6608" strokeWidth="2" />
        </svg>
      );
    case 'leaf_braid':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M32 8C20 18 20 46 32 56C44 46 44 18 32 8Z" fill={color || '#27AE60'} stroke="#145A32" strokeWidth="2" />
          <line x1="32" y1="8" x2="32" y2="56" stroke="#145A32" strokeWidth="2" />
        </svg>
      );
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <circle cx="32" cy="32" r="22" fill={color || '#527961'} stroke="#1D2420" strokeWidth="2" />
        </svg>
      );
    case 'square':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <rect x="12" y="12" width="40" height="40" rx="4" fill={color || '#C87449'} stroke="#1D2420" strokeWidth="2" />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <polygon points="32,10 54,50 10,50" fill={color || '#4B778B'} stroke="#1D2420" strokeWidth="2" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <circle cx="32" cy="32" r="20" fill="#CBDCD0" stroke="#527961" strokeWidth="2" />
          <circle cx="32" cy="32" r="8" fill="#527961" />
        </svg>
      );
  }
};
