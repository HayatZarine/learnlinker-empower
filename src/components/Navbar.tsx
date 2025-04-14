
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import StealthButton from './StealthButton';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if component is within Router context to prevent errors
  const isInRouterContext = (() => {
    try {
      useLocation();
      return true;
    } catch (error) {
      return false;
    }
  })();

  // Generate either Link component (if in Router) or regular anchor tag
  const SafeLink = ({ to, className, children, onClick = null }) => {
    return isInRouterContext ? (
      <Link to={to} className={className} onClick={onClick}>
        {children}
      </Link>
    ) : (
      <a href={to} className={className} onClick={onClick}>
        {children}
      </a>
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <SafeLink 
              to="/" 
              className="text-xl md:text-2xl font-semibold text-primary flex items-center"
            >
              <span className="mr-2 text-accent">Learn</span>Linker
            </SafeLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <SafeLink to="/" className="text-foreground/80 hover:text-primary transition-colors">
              Home
            </SafeLink>
            <SafeLink to="/how-it-works" className="text-foreground/80 hover:text-primary transition-colors">
              How It Works
            </SafeLink>
            <SafeLink to="/register?role=volunteer" className="text-foreground/80 hover:text-primary transition-colors">
              Volunteer
            </SafeLink>
            <SafeLink to="/about" className="text-foreground/80 hover:text-primary transition-colors">
              About Us
            </SafeLink>
            <SafeLink to="/login" className="btn-secondary">
              Login
            </SafeLink>
            <SafeLink to="/register" className="btn-primary">
              Sign Up
            </SafeLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground focus:outline-none"
              aria-label="Toggle menu"
            >
              {!isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <SafeLink 
                to="/" 
                className="text-foreground/80 hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </SafeLink>
              <SafeLink 
                to="/how-it-works" 
                className="text-foreground/80 hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </SafeLink>
              <SafeLink 
                to="/register?role=volunteer" 
                className="text-foreground/80 hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Volunteer
              </SafeLink>
              <SafeLink 
                to="/about" 
                className="text-foreground/80 hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </SafeLink>
              <div className="flex space-x-4 pt-2">
                <SafeLink 
                  to="/login" 
                  className="btn-secondary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </SafeLink>
                <SafeLink 
                  to="/register" 
                  className="btn-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </SafeLink>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Emergency Exit Button (fixed position) */}
      <div className="fixed bottom-4 right-4 z-50">
        <StealthButton />
      </div>
    </nav>
  );
};

export default Navbar;
