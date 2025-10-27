// frontend/src/components/Navigation.tsx
import React, { useState, useEffect } from 'react';
import { Satellite, Menu, X } from 'lucide-react';

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Satellite className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              SatCom AI
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#dashboard" className="text-apple-light-gray hover:text-white transition-colors duration-300 text-sm font-medium">
              Dashboard
            </a>
            <a href="#simulation" className="text-apple-light-gray hover:text-white transition-colors duration-300 text-sm font-medium">
              Simulation
            </a>
            <a href="#analytics" className="text-apple-light-gray hover:text-white transition-colors duration-300 text-sm font-medium">
              Analytics
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <a href="#dashboard" className="text-apple-light-gray hover:text-white transition-colors duration-300 text-sm font-medium">
                Dashboard
              </a>
              <a href="#simulation" className="text-apple-light-gray hover:text-white transition-colors duration-300 text-sm font-medium">
                Simulation
              </a>
              <a href="#analytics" className="text-apple-light-gray hover:text-white transition-colors duration-300 text-sm font-medium">
                Analytics
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};