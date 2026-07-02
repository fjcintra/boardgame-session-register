import { useState, useEffect } from 'react';
import Profile from './components/Profile/Profile';
import MyGames from './components/MyGames/MyGames';
import MyMatches from './components/MyMatches/MyMatches';
import LandingPage from './components/LandingPage/LandingPage';
import AuthModal from './components/Auth/AuthModal';
import { apiFetch, getToken, removeToken } from './utils/api';
import Configuracoes from './components/Configuracoes/Configuracoes';

export interface User {
  nome: string;
  sobrenome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  cidade?: string;
  estado?: string;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return getToken() !== null;
  });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activePage, setActivePage] = useState('perfil');

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }
      try {
        const u = await apiFetch<User>('/users/me');
        setUser(u);
        setIsLoggedIn(true);
      } catch (err) {
        removeToken();
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Sync Dark Mode state to document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setIsLoggedIn(true);
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setUser(null);
    setActivePage('perfil'); // Reset to default tab
  };

  if (isLoading && getToken()) {
    return (
      <div className="flex justify-center items-center w-screen h-screen font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
          <span className="text-lg font-bold text-rose-500 animate-pulse">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <LandingPage onOpenAuth={handleOpenAuth} />
        <AuthModal
          key={`${authModalOpen}-${authMode}`}
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authMode}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      <aside className="w-64 h-full flex-shrink-0 bg-slate-900 dark:bg-slate-950/80 dark:backdrop-blur-md text-slate-100 flex flex-col p-6 shadow-2xl z-10 border-r border-slate-800 dark:border-slate-900 transition-colors duration-300">
        <div className="flex items-center gap-3 text-xl font-black text-rose-500 tracking-wider mb-8 pb-4 border-b border-slate-800 dark:border-slate-900">
          <span className="text-2xl">🎲</span>
          <span>DiceLog</span>
        </div>
        
        <nav className="flex flex-col gap-2 flex-grow">
          <button 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold cursor-pointer transition-all duration-200 ${
              activePage === 'perfil' 
                ? 'text-rose-500 bg-rose-500/10 border-l-4 border-rose-500' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
            onClick={() => setActivePage('perfil')}
          >
            👤 Perfil
          </button>
          
          <button 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold cursor-pointer transition-all duration-200 ${
              activePage === 'jogos' 
                ? 'text-rose-500 bg-rose-500/10 border-l-4 border-rose-500' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
            onClick={() => setActivePage('jogos')}
          >
            📦 Meus jogos
          </button>
          
          <button 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold cursor-pointer transition-all duration-200 ${
              activePage === 'partidas' 
                ? 'text-rose-500 bg-rose-500/10 border-l-4 border-rose-500' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
            onClick={() => setActivePage('partidas')}
          >
            ⚔️ Minhas partidas
          </button>
          
          <button 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold cursor-pointer transition-all duration-200 ${
              activePage === 'config' 
                ? 'text-rose-500 bg-rose-500/10 border-l-4 border-rose-500' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
            onClick={() => setActivePage('config')}
          >
            ⚙️ Configurações
          </button>

          {/* Dark Mode Toggle Button */}
          <button 
            className="flex items-center justify-between px-4 py-3 rounded-xl text-left font-semibold cursor-pointer transition-all duration-200 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 mt-4 border-t border-slate-800/60 dark:border-slate-900/60 pt-4"
            onClick={() => setDarkMode(!darkMode)}
          >
            <span>{darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}</span>
          </button>

          <button 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold cursor-pointer transition-all duration-200 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 mt-auto border-t border-slate-800/60 dark:border-slate-900/60 pt-4"
            onClick={handleLogout}
          >
            🚪 Sair
          </button>
        </nav>
      </aside>
      
      <main className="flex-1 h-full overflow-y-auto flex justify-center items-start p-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="w-full max-w-5xl py-8">
          {activePage === 'perfil' ? (
            <Profile user={user} onUserUpdate={(u) => setUser(u)} onLogout={handleLogout} />
          ) : activePage === 'jogos' ? (
            <MyGames />
          ) : activePage === 'partidas' ? (
            <MyMatches />
          ) : activePage === 'config' ? (
            <Configuracoes />
          ) : (
            <div className="text-center">
              <h1 className="text-5xl font-black bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent">
                Em desenvolvimento...
              </h1>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
