import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import type { Game } from '../MyGames/MyGames';

export interface Match {
  id: number;
  game_id: number;
  user_id: string;
  date: string;
  duration_minutes: number;
  players_count: number;
  winner_name: string;
  notes?: string | null;
  game_title: string;
  created_at: string;
}

export default function MyMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedGamesFilter, setSelectedGamesFilter] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedMatchId, setExpandedMatchId] = useState<number | null>(null);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    gameId: '',
    vencedor: '',
    tempoJogo: '01:00', // default duration HH:MM
    quantidadeJogadores: '4',
    regrasCasa: ''
  });

  // Fetch matches and games
  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      // 1. Fetch user's board games for filters & forms
      const gamesData = await apiFetch<Game[]>('/games?sort_by=name-asc');
      setGames(gamesData);

      // 2. Fetch matches based on current sorting and filters
      let matchesPath = `/matches?sort_by=${sortBy}`;
      if (selectedGamesFilter.length > 0) {
        const queryParams = selectedGamesFilter.map(id => `game_ids=${id}`).join('&');
        matchesPath += `&${queryParams}`;
      }
      const matchesData = await apiFetch<Match[]>(matchesPath);
      setMatches(matchesData);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar dados de partidas.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reload matches when sorting or filters change
  useEffect(() => {
    fetchData();
  }, [sortBy, selectedGamesFilter]);

  const toggleFilter = (gameId: number) => {
    setSelectedGamesFilter(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const toggleExpand = (id: number) => {
    setExpandedMatchId(prev => prev === id ? null : id);
  };

  const handleOpenModal = () => {
    setFormData({ gameId: '', vencedor: '', tempoJogo: '01:00', quantidadeJogadores: '4', regrasCasa: '' });
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.gameId) {
      setError('Por favor, selecione um jogo.');
      return;
    }

    // Convert time duration from "HH:MM" string to minutes integer
    let duration_minutes = 60;
    try {
      const parts = formData.tempoJogo.split(':');
      duration_minutes = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    } catch (e) {
      duration_minutes = 60;
    }

    try {
      await apiFetch('/matches', {
        method: 'POST',
        body: JSON.stringify({
          game_id: parseInt(formData.gameId, 10),
          duration_minutes: duration_minutes,
          players_count: parseInt(formData.quantidadeJogadores, 10),
          winner_name: formData.vencedor,
          notes: formData.regrasCasa || null
        })
      });
      handleCloseModal();
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Falha ao registrar partida.');
    }
  };

  // Handle Delete Match
  const handleDeleteMatch = async (id: number, gameTitle: string, date: string) => {
    const formattedDate = new Date(date).toLocaleDateString('pt-BR');
    if (!window.confirm(`Excluir registro da partida de "${gameTitle}" jogada em ${formattedDate}?`)) {
      return;
    }
    setError('');
    try {
      await apiFetch(`/matches/${id}`, {
        method: 'DELETE'
      });
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Falha ao excluir registro de partida.');
    }
  };

  // Helper to format minutes into HH:MM
  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 font-sans">
      <div className="flex justify-between items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex-wrap gap-4 mb-8 transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Minhas Partidas</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Histórico completo das suas jogatinas</p>
        </div>
        <button 
          className="px-5 py-3 rounded-2xl font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 active:translate-y-0.5 hover:-translate-y-0.5 transition-all cursor-pointer duration-200"
          onClick={handleOpenModal}
        >
          + Nova Partida
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border-l-4 border-rose-500 text-rose-600 dark:text-rose-400 p-4 rounded-xl mb-6 font-semibold transition-colors duration-300">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="relative">
          <button 
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all cursor-pointer"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span>Filtrar por Jogo {selectedGamesFilter.length > 0 && `(${selectedGamesFilter.length})`}</span>
            <span className="text-xs text-rose-500">{isFilterOpen ? '▲' : '▼'}</span>
          </button>
          
          {isFilterOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-20 p-4 flex flex-col gap-1">
              {games.length === 0 ? (
                <div className="p-3 text-slate-450 dark:text-slate-500 text-xs font-semibold">Nenhum jogo na coleção</div>
              ) : (
                <div className="max-h-60 overflow-y-auto flex flex-col gap-1">
                  {games.map(game => (
                    <label key={game.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer select-none text-sm text-slate-700 dark:text-slate-300 font-semibold transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedGamesFilter.includes(game.id)}
                        onChange={() => toggleFilter(game.id)}
                        className="accent-rose-500"
                      />
                      <span>{game.title}</span>
                    </label>
                  ))}
                </div>
              )}
              {selectedGamesFilter.length > 0 && (
                <button 
                  className="w-full text-center py-2 text-rose-500 hover:bg-rose-500/5 rounded-xl text-xs font-bold transition-all cursor-pointer mt-2"
                  onClick={() => setSelectedGamesFilter([])}
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="sort-matches" className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Ordenar:</label>
          <select 
            id="sort-matches" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-2xl font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-500 transition-all cursor-pointer text-sm"
          >
            <option value="date-desc">Mais recentes</option>
            <option value="date-asc">Mais antigas</option>
            <option value="winner">Vencedor</option>
            <option value="playtime">Tempo de Jogo</option>
            <option value="players">Qtd. de Jogadores</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-lg font-bold text-slate-500 dark:text-slate-400 animate-pulse">
          Carregando histórico...
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white/60 dark:bg-slate-900/40 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 transition-colors duration-300">
          <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">Nenhuma partida registrada!</h3>
          <p className="text-sm">Você pode registrar partidas a partir da aba "Meus jogos" ou clicando em "+ Nova Partida" acima.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {matches.map(match => (
            <div 
              key={match.id} 
              className={`border border-slate-200/45 dark:border-slate-750/70 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm transition-all duration-300 ${
                expandedMatchId === match.id ? 'shadow-md ring-2 ring-rose-500/10' : ''
              }`}
            >
              <div 
                className="flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-750/30 cursor-pointer select-none transition-colors"
                onClick={() => toggleExpand(match.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-950/80 text-white flex items-center justify-center font-extrabold text-lg">
                    {match.game_title.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-950 dark:text-white">{match.game_title}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>📅 {new Date(match.date).toLocaleDateString('pt-BR')}</span>
                  <span>⏳ {formatDuration(match.duration_minutes)}</span>
                  <span className="text-lg text-rose-500/80 font-normal w-4 text-center">{expandedMatchId === match.id ? '−' : '+'}</span>
                </div>
              </div>
              
              {expandedMatchId === match.id && (
                <div className="p-6 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm transition-all">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Vencedor</span>
                    <span className="font-bold text-rose-500 dark:text-rose-450 flex items-center gap-1">🏆 {match.winner_name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Tempo de Jogo</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">⏳ {formatDuration(match.duration_minutes)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Jogadores</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">👥 {match.players_count}</span>
                  </div>
                  {match.notes && (
                    <div className="flex flex-col gap-1 sm:col-span-3">
                      <span className="text-xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Regras da Casa / Observações</span>
                      <span className="font-medium text-slate-600 dark:text-slate-350 bg-white dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-700/40 inline-block leading-relaxed">
                        {match.notes}
                      </span>
                    </div>
                  )}
                  <div className="sm:col-span-3 flex justify-end mt-2">
                    <button
                      onClick={() => handleDeleteMatch(match.id, match.game_title, match.date)}
                      className="px-4 py-2.5 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-xs font-bold cursor-pointer"
                    >
                      Excluir Registro
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Registro de Nova Partida */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-center items-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800/80 text-slate-900 dark:text-white animate-scale-in">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Registrar Nova Partida</h2>
              <button className="text-slate-400 hover:text-rose-500 text-3xl font-light cursor-pointer line-height-none" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="gameId" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jogo</label>
                <select 
                  id="gameId"
                  value={formData.gameId}
                  onChange={(e) => setFormData({...formData, gameId: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold cursor-pointer"
                >
                  <option value="" disabled>Selecione um jogo...</option>
                  {games.map(game => (
                    <option key={game.id} value={game.id}>{game.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="vencedor" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vencedor</label>
                <input 
                  type="text" 
                  id="vencedor" 
                  maxLength={32}
                  value={formData.vencedor}
                  onChange={(e) => setFormData({...formData, vencedor: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tempoJogo" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tempo de jogo</label>
                  <input 
                    type="time" 
                    id="tempoJogo" 
                    value={formData.tempoJogo}
                    onChange={(e) => setFormData({...formData, tempoJogo: e.target.value})}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="quantidadeJogadores" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Qtd Jogadores</label>
                  <input 
                    type="number" 
                    id="quantidadeJogadores" 
                    min="1"
                    value={formData.quantidadeJogadores}
                    onChange={(e) => setFormData({...formData, quantidadeJogadores: e.target.value})}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="regrasCasa" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Regras da casa / Observações</label>
                <textarea 
                  id="regrasCasa" 
                  rows={4}
                  value={formData.regrasCasa}
                  onChange={(e) => setFormData({...formData, regrasCasa: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                <button type="button" className="px-5 py-3 rounded-2xl font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer text-sm" onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" className="px-5 py-3 rounded-2xl font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/15 hover:shadow-rose-600/25 active:translate-y-0.5 hover:-translate-y-0.5 transition-all cursor-pointer text-sm">Salvar Partida</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
