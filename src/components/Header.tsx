import React from 'react';
import {
  ActiveTab,
  UserProfile,
  UserAccount
} from '../types';
import {
  Home,
  LayoutDashboard,
  UtensilsCrossed,
  Droplet,
  Scale,
  Activity,
  HeartPulse,
  ClipboardList,
  User,
  MessageSquareHeart,
  Moon,
  Sun,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
  KeyRound,
  Bot,
  LogOut,
  Lock,
  Database
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDark: boolean;
  setIsDark: (val: boolean | ((prev: boolean) => boolean)) => void;
  profile: UserProfile;
  currentUser: UserAccount | null;
  onOpenAuthModal: () => void;
  onPopulateSampleData: () => void;
  onLogout?: () => void;
  onOpenDatabaseModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  setIsDark,
  profile,
  currentUser,
  onOpenAuthModal,
  onPopulateSampleData,
  onLogout,
  onOpenDatabaseModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isAdmin = currentUser?.role === 'admin';

  // Base navigation items for community users
  const userNavItems: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'nutrition', label: 'Nutrition', icon: UtensilsCrossed },
    { id: 'water', label: 'Water', icon: Droplet },
    { id: 'bmi', label: 'BMI Calc', icon: Scale },
    { id: 'exercise', label: 'Exercises', icon: Activity, badge: '50+' },
    { id: 'ai_assistant', label: 'AI Coach', icon: Bot, badge: 'AI' },
    { id: 'tips', label: 'Health Tips', icon: HeartPulse },
    { id: 'survey', label: 'Survey', icon: ClipboardList },
    { id: 'feedback', label: 'Feedback', icon: MessageSquareHeart },
    { id: 'login', label: 'Login / Sign In', icon: KeyRound }
  ];

  // If user is admin, add Admin Panel to the list
  const navItems = [
    ...userNavItems,
    ...(isAdmin ? [{ id: 'admin' as ActiveTab, label: 'Admin Panel', icon: ShieldCheck, badge: 'Admin' }] : [])
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-2 z-40 w-full transition-all duration-200">
      {/* Top Banner / CEP Initiative Strip */}
      <div className="max-w-7xl mx-auto mb-2 px-2 sm:px-4">
        <div className="bg-emerald-950/90 dark:bg-emerald-950/95 backdrop-blur-md text-white px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between border border-white/20 shadow-md">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="truncate text-[11px] sm:text-xs">
              <strong className="font-semibold text-emerald-200">CEP Initiative:</strong> Community Health & Nutrition Tracker
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {currentUser ? (
              <>
                <span className="text-[11px] text-emerald-200/90 hidden sm:inline">
                  Active: <strong className="text-white">{currentUser.name}</strong>
                  <span className={`ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-bold ${isAdmin ? 'bg-emerald-600 text-white' : 'bg-white/20 text-emerald-200'}`}>
                    {currentUser.role.toUpperCase()}
                  </span>
                </span>

                <button
                  onClick={onPopulateSampleData}
                  title="Load realistic demo logs and statistics"
                  className="hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold border border-white/30 backdrop-blur-sm transition-all cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3 h-3 text-emerald-300" />
                  <span>Sample Logs</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-amber-300 font-bold hidden sm:inline-flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" /> Login Compulsory
                </span>
                <button
                  onClick={() => handleNavClick('login')}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold border border-emerald-400 transition-all cursor-pointer shadow-xs"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-2xl px-3 sm:px-4 lg:px-5 shadow-xl transition-all">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            {/* Logo & Brand */}
            <div
              onClick={() => handleNavClick(currentUser ? 'home' : 'login')}
              className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
              id="brand-logo-btn"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform duration-200">
                <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base sm:text-lg tracking-tight text-slate-950 dark:text-white">
                    Nutri<span className="text-emerald-700 dark:text-emerald-400">Track</span>
                  </span>
                  <span className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-black rounded-md bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30">
                    CEP 2026
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold tracking-tight hidden sm:block">
                  Community Health Tracker
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 font-medium overflow-x-auto no-scrollbar py-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isAdminItem = item.id === 'admin';

                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isAdminItem
                        ? 'text-emerald-900 dark:text-emerald-200 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30'
                        : 'text-slate-800 dark:text-slate-200 hover:text-emerald-900 dark:hover:text-emerald-300 hover:bg-white/40 dark:hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : isAdminItem ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && !isActive && (
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${isAdminItem ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Secondary Actions: Theme, Auth/Account, Mobile Menu Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Firestore Database Cloud Status (Admin Only) */}
              {isAdmin && onOpenDatabaseModal && (
                <button
                  id="firestore-db-status-btn"
                  onClick={onOpenDatabaseModal}
                  title="Firebase Firestore Cloud Database (Admin Only)"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-500/20 transition-all cursor-pointer text-xs font-bold shadow-xs"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden lg:inline text-[11px]">Firestore DB</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </button>
              )}

              {/* Dark / Light Mode Toggle */}
              <button
                id="theme-toggle-btn"
                onClick={() => setIsDark((prev) => !prev)}
                aria-label="Toggle dark and light mode"
                className="p-2 rounded-xl bg-white/50 dark:bg-white/10 border border-white/60 dark:border-white/15 text-slate-800 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-white/20 transition-all cursor-pointer shadow-xs"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
                )}
              </button>

              {/* Account / Sign In & Out */}
              {currentUser ? (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <button
                    id="header-auth-btn"
                    onClick={() => handleNavClick('profile')}
                    title="View Profile"
                    className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 pr-2.5 sm:pr-3 py-1 rounded-full border border-white/60 dark:border-white/15 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 transition-all cursor-pointer shadow-xs backdrop-blur-md"
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-xs shrink-0 ${isAdmin ? 'bg-gradient-to-tr from-emerald-600 to-teal-600' : 'bg-slate-800'}`}>
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-black text-slate-950 dark:text-white leading-tight max-w-[90px] truncate">
                          {currentUser.name.split(' ')[0]}
                        </p>
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                            isAdmin
                              ? 'bg-emerald-500/20 text-emerald-950 dark:text-emerald-300'
                              : 'bg-teal-500/20 text-teal-950 dark:text-teal-300'
                          }`}
                        >
                          {currentUser.role}
                        </span>
                      </div>
                    </div>
                  </button>

                  {onLogout && (
                    <button
                      onClick={onLogout}
                      title="Log Out of Session"
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/20 transition-all cursor-pointer flex items-center gap-1 text-xs font-black"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Sign Out</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  id="header-auth-btn"
                  onClick={() => handleNavClick('login')}
                  title="Sign In / Register"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="xl:hidden p-2 rounded-xl bg-white/50 dark:bg-white/10 border border-white/60 text-slate-800 dark:text-slate-200 hover:bg-white/70 transition-colors shadow-xs cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Mobile / Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden max-w-7xl mx-auto px-2 sm:px-4 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Role: {currentUser.role.toUpperCase()}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Not Signed In (Login Compulsory)</span>
                </div>
              )}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isAdminItem = item.id === 'admin';

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`p-2.5 rounded-xl text-left flex items-center gap-2 transition-all cursor-pointer text-xs font-bold ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : isAdminItem
                        ? 'bg-emerald-500/20 text-emerald-950 dark:text-emerald-200 border border-emerald-500/30'
                        : 'bg-slate-100/80 dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}

              {isAdmin && onOpenDatabaseModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDatabaseModal();
                  }}
                  className="p-2.5 rounded-xl text-left flex items-center gap-2 bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 border border-emerald-500/30 text-xs font-bold cursor-pointer"
                >
                  <Database className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="truncate">Firestore DB</span>
                </button>
              )}

              {currentUser && onLogout && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="p-2.5 rounded-xl text-left flex items-center gap-2 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 text-xs font-bold cursor-pointer"
                >
                  <LogOut className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="truncate">Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

