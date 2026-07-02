import { useState } from 'react';
import { apiFetch, setToken } from '../../utils/api';

interface RegisteredUser {
  nome: string;
  sobrenome: string;
  email: string;
  password?: string;
  telefone?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  cidade?: string;
  estado?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register';
  onAuthSuccess: (user: RegisteredUser) => void;
}

export default function AuthModal({ isOpen, onClose, initialMode, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic email validation
    if (!formData.email.includes('@')) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      if (mode === 'register') {
        if (!formData.nome || !formData.sobrenome || !formData.password) {
          setError('Por favor, preencha todos os campos obrigatórios.');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('As senhas não coincidem.');
          return;
        }

        // Generate username from name + surname + random digits
        const generatedUsername = `${formData.nome.toLowerCase()}.${formData.sobrenome.toLowerCase()}.${Math.floor(Math.random() * 10000)}`.replace(/[^a-z0-9.]/g, '');

        // Register on backend
        await apiFetch('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            email: formData.email,
            username: generatedUsername,
            nome: formData.nome,
            sobrenome: formData.sobrenome,
            password: formData.password
          })
        });

        // After register, perform login to retrieve token
        const loginParams = new URLSearchParams();
        loginParams.append('username', formData.email);
        loginParams.append('password', formData.password);

        const tokenRes: { access_token: string } = await apiFetch('/auth/login', {
          method: 'POST',
          body: loginParams
        });

        // Store token
        setToken(tokenRes.access_token);

        // Fetch registered user profile
        const userRes: RegisteredUser = await apiFetch('/users/me');
        
        onAuthSuccess(userRes);
        onClose();
      } else {
        // Login mode
        const loginParams = new URLSearchParams();
        loginParams.append('username', formData.email);
        loginParams.append('password', formData.password);

        const tokenRes: { access_token: string } = await apiFetch('/auth/login', {
          method: 'POST',
          body: loginParams
        });

        // Store token
        setToken(tokenRes.access_token);

        // Fetch user profile
        const userRes: RegisteredUser = await apiFetch('/users/me');

        onAuthSuccess(userRes);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Erro na autenticação. Verifique os dados e tente novamente.');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-center items-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800/80 text-slate-900 dark:text-white relative animate-scale-in">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800/60 pb-4">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">
            {mode === 'login' ? 'Entrar na Conta' : 'Criar Nova Conta'}
          </h2>
          <button className="text-slate-400 hover:text-rose-500 text-3xl font-light cursor-pointer line-height-none" onClick={onClose}>&times;</button>
        </div>

        {error && (
          <div className="bg-rose-500/10 border-l-4 border-rose-500 text-rose-600 dark:text-rose-450 p-3 rounded-xl mb-4 font-semibold text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="auth-nome" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome</label>
                <input
                  type="text"
                  id="auth-nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="auth-sobrenome" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sobrenome</label>
                <input
                  type="text"
                  id="auth-sobrenome"
                  value={formData.sobrenome}
                  onChange={(e) => setFormData({ ...formData, sobrenome: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-email" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">E-mail</label>
            <input
              type="email"
              id="auth-email"
              placeholder="seu.email@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-password" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Senha</label>
            <input
              type="password"
              id="auth-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold"
            />
          </div>

          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-confirm-password" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confirmar Senha</label>
              <input
                type="password"
                id="auth-confirm-password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold"
              />
            </div>
          )}

          <button type="submit" className="w-full py-3.5 rounded-2xl font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/15 hover:shadow-rose-600/25 active:translate-y-0.5 hover:-translate-y-0.5 transition-all cursor-pointer text-sm mt-2 duration-200">
            {mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400 font-semibold">
          {mode === 'login' ? (
            <p>
              Não tem uma conta?{' '}
              <button className="text-rose-500 font-bold hover:underline cursor-pointer ml-1" onClick={() => setMode('register')}>
                Cadastre-se
              </button>
            </p>
          ) : (
            <p>
              Já tem uma conta?{' '}
              <button className="text-rose-500 font-bold hover:underline cursor-pointer ml-1" onClick={() => setMode('login')}>
                Entre aqui
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
