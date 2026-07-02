import { useState } from 'react';
import { apiFetch } from '../../utils/api';

export default function Configuracoes() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!formData.newPassword || !formData.confirmNewPassword) {
      setError('Por favor, preencha a nova senha.');
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      await apiFetch('/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          password: formData.newPassword
        })
      });
      setSuccess('Senha alterada com sucesso!');
      setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err: any) {
      setError(err.message || 'Falha ao atualizar senha.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 font-sans">
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col gap-1 mb-8 transition-colors duration-300">
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">Configurações</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Gerencie sua segurança e preferências da conta</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/40 dark:border-slate-800/80 shadow-sm p-8 flex flex-col transition-colors duration-300 text-slate-900 dark:text-white">
        <h3 className="text-lg font-bold text-rose-500 dark:text-rose-400 mb-2">Alterar Senha</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          Insira sua nova senha abaixo. Evite usar senhas fáceis ou repetidas de outros serviços.
        </p>

        {success && (
          <div className="bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl mb-4 font-semibold text-xs">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-rose-500/10 border-l-4 border-rose-500 text-rose-600 dark:text-rose-450 p-3 rounded-xl mb-4 font-semibold text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-password" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nova Senha</label>
            <input
              type="password"
              id="new-password"
              placeholder="Digite a nova senha"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm-new-password" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confirmar Nova Senha</label>
            <input
              type="password"
              id="confirm-new-password"
              placeholder="Confirme a nova senha"
              value={formData.confirmNewPassword}
              onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 rounded-2xl font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/15 hover:shadow-rose-600/25 active:translate-y-0.5 hover:-translate-y-0.5 transition-all cursor-pointer text-sm mt-2 disabled:bg-slate-350 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Atualizar Senha'}
          </button>
        </form>
      </div>
    </div>
  );
}
