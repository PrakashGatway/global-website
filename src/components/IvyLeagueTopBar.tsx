interface TopBarProps {
  isScrolled?: boolean;
}

export default function IvyLeagueTopBar({ isScrolled = false }: TopBarProps) {
  return (
    <div style={{ backgroundColor: '#f46c44' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center py-2 text-xs sm:text-sm gap-2 sm:gap-0">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-white text-xs sm:text-sm">Contact us: +91 9876543210</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <a href="#" className="text-white hover:opacity-80 text-xs sm:text-sm">Our Centres</a>
          <button className="text-gray-900 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium hover:opacity-90" style={{ backgroundColor: '#ffff29' }}>FREE DEMO</button>
          <a href="#" className="text-white hover:opacity-80 text-xs sm:text-sm">Student Login</a>
        </div>
      </div>
    </div>
  );
}

