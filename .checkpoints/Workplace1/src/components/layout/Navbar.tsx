import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User as UserIcon, Shield, Compass, Sparkles, LogOut } from 'lucide-react';

interface NavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath = '/', onNavigate }) => {
  const { user, isAuthenticated, isLearner, isArtist, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (path: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  const navLinks = [
    { label: 'Discover', path: '/discover' },
    { label: 'Artists', path: '/artists' },
    { label: 'Art Forms', path: '/art-forms' },
    { label: 'Learn', path: '/learn' },
    { label: 'Experiences', path: '/experiences' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8E2D5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1C1B19] text-[#FDFBF7] flex items-center justify-center shadow-md group-hover:bg-[#C85A32] transition-colors">
              <span className="font-serif font-bold text-lg tracking-wider">A</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#1C1B19] group-hover:text-[#C85A32] transition-colors">
                  ANUNAAD
                </span>
                <span className="font-devanagari text-xs text-[#8E877B] tracking-normal font-normal">
                  अनुनाद
                </span>
              </div>
              <span className="text-[10px] text-[#A8A296] font-mono tracking-widest uppercase block -mt-1">
                Living Traditions
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#C85A32] bg-[#FAF7F0] font-semibold'
                      : 'text-[#5E5B54] hover:text-[#1C1B19] hover:bg-[#F5F2EA]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => handleNav('/join-artist')}
              className="text-xs font-semibold uppercase tracking-wider text-[#5C4033] hover:text-[#C85A32] px-3 py-2 transition-colors cursor-pointer"
            >
              For Artists
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-[#E8E2D5] bg-white hover:bg-[#FAF7F0] transition-colors cursor-pointer text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[#C85A32] text-white flex items-center justify-center font-bold">
                    {user?.name.charAt(0) || 'U'}
                  </div>
                  <span className="font-medium text-[#1C1B19] max-w-[100px] truncate">{user?.name}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D5] shadow-xl py-2 z-50 text-xs animate-fade-in">
                    <div className="px-4 py-2 border-b border-[#E8E2D5]">
                      <p className="font-semibold text-[#1C1B19] truncate">{user?.name}</p>
                      <p className="text-[11px] text-[#8E877B] truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider bg-[#F5F2EA] text-[#C85A32]">
                        {user?.role.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="py-1">
                      {isLearner && (
                        <button
                          type="button"
                          onClick={(e) => handleNav('/dashboard/learner', e)}
                          className="w-full text-left px-4 py-2 hover:bg-[#FAF7F0] flex items-center gap-2 text-[#1C1B19] cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5 text-[#C85A32]" />
                          <span>Learner Portal</span>
                        </button>
                      )}

                      {isArtist && (
                        <button
                          type="button"
                          onClick={(e) => handleNav('/dashboard/artist', e)}
                          className="w-full text-left px-4 py-2 hover:bg-[#FAF7F0] flex items-center gap-2 text-[#1C1B19] cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#D97724]" />
                          <span>Artist Dashboard & Wallet</span>
                        </button>
                      )}

                      {isAdmin && (
                        <div className="space-y-0.5">
                          <button
                            type="button"
                            onClick={(e) => handleNav('/admin', e)}
                            className="w-full text-left px-4 py-2 hover:bg-[#FAF7F0] flex items-center justify-between text-[#1C1B19] font-semibold cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Shield className="w-3.5 h-3.5 text-[#2D4F38]" />
                              <span>Admin Console</span>
                            </div>
                            <span className="text-[9px] font-mono uppercase bg-[#2D4F38]/10 text-[#2D4F38] px-1.5 py-0.5 rounded">All</span>
                          </button>
                          
                          {/* Fast Admin Profile Sections */}
                          <div className="px-3 py-1 space-y-0.5 bg-[#FAF7F0]/60 rounded-xl mx-2 text-[11px]">
                            <button
                              type="button"
                              onClick={(e) => handleNav('/admin?section=metrics', e)}
                              className="w-full text-left px-2 py-1 rounded hover:bg-white text-[#5E5B54] hover:text-[#C85A32] flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <span>• Platform Overview</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleNav('/admin?section=artists', e)}
                              className="w-full text-left px-2 py-1 rounded hover:bg-white text-[#5E5B54] hover:text-[#C85A32] flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <span>• Keepers Verification</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleNav('/admin?section=cms', e)}
                              className="w-full text-left px-2 py-1 rounded hover:bg-white text-[#5E5B54] hover:text-[#C85A32] flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <span>• Website CMS</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleNav('/admin?section=ledger', e)}
                              className="w-full text-left px-2 py-1 rounded hover:bg-white text-[#5E5B54] hover:text-[#C85A32] flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <span>• Financial Ledger</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleNav('/admin?section=payouts', e)}
                              className="w-full text-left px-2 py-1 rounded hover:bg-white text-[#5E5B54] hover:text-[#C85A32] flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <span>• Artist Payouts</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleNav('/admin?section=settings', e)}
                              className="w-full text-left px-2 py-1 rounded hover:bg-white text-[#5E5B54] hover:text-[#C85A32] flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <span>• Rules & Emergency</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleNav('/admin?section=audit', e)}
                              className="w-full text-left px-2 py-1 rounded hover:bg-white text-[#5E5B54] hover:text-[#C85A32] flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <span>• Security Audit</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[#E8E2D5] pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          logout();
                          handleNav('/', e);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNav('/login')}
                className="text-xs font-semibold px-4 py-2 text-[#1C1B19] hover:text-[#C85A32] transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => handleNav('/discover')}
              className="px-4 py-2 bg-[#1C1B19] hover:bg-[#C85A32] text-white text-xs font-medium rounded-full transition-colors shadow-sm cursor-pointer"
            >
              Explore
            </button>
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1C1B19] hover:bg-[#F5F2EA] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8E2D5] bg-[#FDFBF7] px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                  currentPath === link.path
                    ? 'bg-[#FAF7F0] text-[#C85A32] font-semibold'
                    : 'text-[#1C1B19] hover:bg-[#F5F2EA]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8E2D5] space-y-2">
            <button
              onClick={() => handleNav('/join-artist')}
              className="w-full text-left px-4 py-2 text-sm text-[#C85A32] font-medium"
            >
              For Artists: Share Your Lineage
            </button>

            {isAuthenticated ? (
              <div className="space-y-1 px-4">
                <p className="text-xs text-[#8E877B]">Signed in as {user?.name}</p>
                {isLearner && (
                  <button
                    onClick={() => handleNav('/dashboard/learner')}
                    className="block text-sm py-1 font-medium text-[#1C1B19]"
                  >
                    Learner Portal
                  </button>
                )}
                {isArtist && (
                  <button
                    onClick={() => handleNav('/dashboard/artist')}
                    className="block text-sm py-1 font-medium text-[#1C1B19]"
                  >
                    Artist Dashboard & Wallet
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => handleNav('/admin')}
                    className="block text-sm py-1 font-semibold text-[#2D4F38]"
                  >
                    Admin Console
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    handleNav('/');
                  }}
                  className="block text-sm py-1 text-red-600 font-medium pt-2"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 px-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="py-2.5 text-center text-xs font-semibold border border-[#E8E2D5] rounded-xl bg-white text-[#1C1B19]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('/discover')}
                  className="py-2.5 text-center text-xs font-semibold bg-[#1C1B19] text-white rounded-xl"
                >
                  Explore
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
