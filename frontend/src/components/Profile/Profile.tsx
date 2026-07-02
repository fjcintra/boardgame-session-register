import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

interface ProfileProps {
  user?: {
    nome: string;
    sobrenome: string;
    email: string;
    telefone?: string;
    endereco?: string;
    numero?: string;
    complemento?: string;
    cidade?: string;
    estado?: string;
  } | null;
  onUserUpdate?: (updatedUser: any) => void;
  onLogout?: () => void;
}

export default function Profile({ user, onUserUpdate, onLogout }: ProfileProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    telefone: '',
    endereco: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: ''
  });

  // Fallback default mock user if no real user exists
  const userData = user || {
    nome: 'Fábio',
    sobrenome: 'Silva',
    email: 'fabio.silva@example.com',
    telefone: '(11) 98765-4321',
    endereco: 'Rua das Flores',
    numero: '123',
    complemento: 'Apt 4B',
    cidade: 'São Paulo',
    estado: 'SP'
  };

  // Sync form state when modal opens or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        sobrenome: user.sobrenome || '',
        telefone: user.telefone || '',
        endereco: user.endereco || '',
        numero: user.numero || '',
        complemento: user.complemento || '',
        cidade: user.cidade || '',
        estado: user.estado || ''
      });
    }
  }, [user, isEditModalOpen]);

  const handleOpenEdit = () => {
    if (!user) {
      setError('Apenas usuários autenticados no banco de dados podem editar o perfil.');
    } else {
      setError('');
    }
    setIsEditModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nome || !formData.sobrenome) {
      setError('Nome e sobrenome são obrigatórios.');
      return;
    }

    try {
      const updatedUser = await apiFetch('/users/me', {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Falha ao atualizar perfil.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-sm transition-colors duration-300 font-sans flex flex-col">
      <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800/60 pb-6 mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-rose-500/20 tracking-wider">
          {userData.nome.charAt(0)}{userData.sobrenome.charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Meu Perfil</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gerencie suas informações pessoais</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h3 className="text-xs font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest border-b border-rose-500/10 pb-2 mb-4">Informações Pessoais</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-700/30 hover:border-rose-500/20 dark:hover:border-rose-500/20 transition-all duration-200">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-1 block">Nome</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{userData.nome}</span>
            </div>
            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-700/30 hover:border-rose-500/20 dark:hover:border-rose-500/20 transition-all duration-200">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-1 block">Sobrenome</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{userData.sobrenome}</span>
            </div>
            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-700/30 hover:border-rose-500/20 dark:hover:border-rose-500/20 transition-all duration-200">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-1 block">E-mail</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{userData.email}</span>
            </div>
            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-700/30 hover:border-rose-500/20 dark:hover:border-rose-500/20 transition-all duration-200">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-1 block">Telefone</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{userData.telefone || 'Não informado'}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest border-b border-rose-500/10 pb-2 mb-4">Endereço</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-700/30 hover:border-rose-500/20 dark:hover:border-rose-500/20 transition-all duration-200 sm:col-span-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-1 block">Endereço</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{userData.endereco || 'Não informado'}</span>
            </div>
            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-700/30 hover:border-rose-500/20 dark:hover:border-rose-500/20 transition-all duration-200">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-1 block">Número</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{userData.numero || 'Não informado'}</span>
            </div>
            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-700/30 hover:border-rose-500/20 dark:hover:border-rose-500/20 transition-all duration-200">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-1 block">Complemento</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{userData.complemento || 'Não informado'}</span>
            </div>
            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-700/30 hover:border-rose-500/20 dark:hover:border-rose-500/20 transition-all duration-200">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-1 block">Cidade</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{userData.cidade || 'Não informado'}</span>
            </div>
            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-700/30 hover:border-rose-500/20 dark:hover:border-rose-500/20 transition-all duration-200">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-1 block">Estado</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{userData.estado || 'Não informado'}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 self-end">
          <button 
            className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-350 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition-all duration-200 cursor-pointer"
            onClick={onLogout}
          >
            Sair da Conta
          </button>
          <button 
            className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md shadow-rose-500/20 active:translate-y-0.5 hover:-translate-y-0.5 cursor-pointer transition-all duration-200"
            onClick={handleOpenEdit}
          >
            Editar Perfil
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-center items-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && setIsEditModalOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800/80 text-slate-900 dark:text-white animate-scale-in">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Editar Perfil</h2>
              <button className="text-slate-400 hover:text-rose-500 text-3xl font-light cursor-pointer line-height-none" onClick={() => setIsEditModalOpen(false)}>&times;</button>
            </div>

            {error && (
              <div className="bg-rose-500/10 border-l-4 border-rose-500 text-rose-600 dark:text-rose-400 p-3 rounded-xl mb-4 font-semibold text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="edit-nome" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome *</label>
                  <input
                    type="text"
                    id="edit-nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                    disabled={!user}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="edit-sobrenome" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sobrenome *</label>
                  <input
                    type="text"
                    id="edit-sobrenome"
                    value={formData.sobrenome}
                    onChange={(e) => setFormData({ ...formData, sobrenome: e.target.value })}
                    required
                    disabled={!user}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="edit-telefone" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Telefone</label>
                  <input
                    type="text"
                    id="edit-telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    disabled={!user}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="edit-endereco" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Endereço</label>
                  <input
                    type="text"
                    id="edit-endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    disabled={!user}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 col-span-1">
                  <label htmlFor="edit-numero" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Número</label>
                  <input
                    type="text"
                    id="edit-numero"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    disabled={!user}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <label htmlFor="edit-complemento" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Complemento</label>
                  <input
                    type="text"
                    id="edit-complemento"
                    value={formData.complemento}
                    onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                    disabled={!user}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="edit-cidade" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cidade</label>
                  <input
                    type="text"
                    id="edit-cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    disabled={!user}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="edit-estado" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estado</label>
                  <input
                    type="text"
                    id="edit-estado"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    disabled={!user}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                <button type="button" className="px-5 py-3 rounded-2xl font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-805 transition-all cursor-pointer text-sm" onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
                <button type="submit" className="px-5 py-3 rounded-2xl font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/15 hover:shadow-rose-600/25 active:translate-y-0.5 hover:-translate-y-0.5 transition-all cursor-pointer text-sm" disabled={!user}>Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
