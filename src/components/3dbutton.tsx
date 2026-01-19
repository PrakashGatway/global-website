'use client';

interface ThreeDButtonProps {
  children: React.ReactNode;
  textColor?: string;
  borderColor?: string;
  onClick?: () => void;
}

export default function ThreeDButton({ children, textColor = "text-white", borderColor, onClick }: ThreeDButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${textColor} ${borderColor || ''} px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 w-full sm:w-auto border-2`}
      style={{ 
        backgroundColor: borderColor ? 'transparent' : '#f46c44',
        boxShadow: borderColor ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
      }}
    >
      {children}
    </button>
  );
}
