import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

export interface Game {
  id: number;
  owner_id: string;
  title: string;
  min_players?: number | null;
  max_players?: number | null;
  description?: string | null;
  added_date: string;
  times_played: number;
}

export default function MyGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name-asc');
  const [error, setError] = useState('');

  // Register Match Modal State
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState({
    vencedor: '',
    tempoJogo: '01:00', // default duration HH:MM
    quantidadeJogadores: '4',
    regrasCasa: ''
  });

  // New Game Modal State
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false);
  const [newGameData, setNewGameData] = useState({
    title: '',
    min_players: '',
    max_players: '',
    description: ''
  });

  // Load games from backend
  const fetchGames = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiFetch<Game[]>(`/games?sort_by=${sortBy}`);
      setGames(data);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar jogos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [sortBy]);

  // Handle Match Registration
  const handleOpenRegisterMatch = (game: Game) => {
    setSelectedGame(game);
    setFormData({ vencedor: '', tempoJogo: '01:00', quantidadeJogadores: '4', regrasCasa: '' });
  };

  const handleCloseRegisterMatch = () => {
    setSelectedGame(null);
  };

  const handleSubmitMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGame) return;

    setError('');
    // Parse time duration from "HH:MM" string to minutes integer
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
          game_id: selectedGame.id,
          duration_minutes: duration_minutes,
          players_count: parseInt(formData.quantidadeJogadores, 10),
          winner_name: formData.vencedor,
          notes: formData.regrasCasa || null
        })
      });
      handleCloseRegisterMatch();
      // Reload games to update the matches counter
      fetchGames();
    } catch (err: any) {
      setError(err.message || 'Falha ao registrar partida.');
    }
  };

  // Handle Create Game
  const handleOpenNewGame = () => {
    setNewGameData({ title: '', min_players: '', max_players: '', description: '' });
    setError('');
    setIsNewGameModalOpen(true);
  };

  const handleCloseNewGame = () => {
    setIsNewGameModalOpen(false);
  };

  const handleSubmitNewGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newGameData.title.trim()) {
      setError('O título do jogo é obrigatório.');
      return;
    }

    try {
      await apiFetch('/games', {
        method: 'POST',
        body: JSON.stringify({
          title: newGameData.title,
          min_players: newGameData.min_players ? parseInt(newGameData.min_players, 10) : null,
          max_players: newGameData.max_players ? parseInt(newGameData.max_players, 10) : null,
          description: newGameData.description || null
        })
      });
      handleCloseNewGame();
      fetchGames();
    } catch (err: any) {
      setError(err.message || 'Falha ao criar jogo.');
    }
  };

  // Handle Delete Game
  const handleDeleteGame = async (id: number, title: string) => {
    if (!window.confirm(`Tem certeza de que deseja remover "${title}" da sua coleção? Isso também removerá todas as partidas registradas dele.`)) {
      return;
    }
    setError('');
    try {
      await apiFetch(`/games/${id}`, {
        method: 'DELETE'
      });
      fetchGames();
    } catch (err: any) {
      setError(err.message || 'Falha ao excluir jogo.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 font-sans">
      <div className="flex justify-between items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex-wrap gap-4 mb-8 transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Meus Jogos</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sua coleção de jogos de tabuleiro</p>
        </div>

        <div className="flex gap-4 items-center flex-wrap">
          <button 
            onClick={handleOpenNewGame}
            className="px-5 py-3 rounded-2xl font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 active:translate-y-0.5 hover:-translate-y-0.5 transition-all cursor-pointer duration-200"
          >
            + Novo Jogo
          </button>

          <div className="flex items-center gap-3">
            <label htmlFor="sort-select" className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Ordenar:</label>
            <select 
              id="sort-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-2xl font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-500 transition-all cursor-pointer text-sm"
            >
              <option value="name-asc">Nome (A-Z)</option>
              <option value="name-desc">Nome (Z-A)</option>
              <option value="recent">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
              <option value="most-played">Mais jogados</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border-l-4 border-rose-500 text-rose-600 dark:text-rose-400 p-4 rounded-xl mb-6 font-semibold transition-colors duration-300">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-20 text-lg font-bold text-slate-500 dark:text-slate-400 animate-pulse">
          Carregando coleção...
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white/60 dark:bg-slate-900/40 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 transition-colors duration-300">
          <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">Sua coleção está vazia!</h3>
          <p className="text-sm">Adicione seu primeiro jogo de tabuleiro clicando no botão "+ Novo Jogo" acima.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(game => (
            <div key={game.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/40 dark:border-slate-750/70 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center text-5xl font-black text-slate-700/30 dark:text-slate-800/50 select-none">
                {game.title.charAt(0)}
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white leading-tight">{game.title}</h3>
                    <button 
                      onClick={() => handleDeleteGame(game.id, game.title)}
                      title="Excluir Jogo"
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10 dark:hover:bg-rose-500/10 cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                  {game.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                      {game.description}
                    </p>
                  )}
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700/60 pt-4 mt-auto flex flex-col gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    <span>📅</span> Adicionado: {new Date(game.added_date).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="flex items-center gap-2">
                    <span>🎲</span> Partidas: {game.times_played}
                  </span>
                  {(game.min_players || game.max_players) && (
                    <span className="flex items-center gap-2">
                      <span>👥</span> Jogadores: {game.min_players || '?'}-{game.max_players || '?'}
                    </span>
                  )}
                </div>
              </div>
              <div className="px-6 pb-6">
                <button 
                  className="w-full py-3 rounded-2xl font-bold bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-all cursor-pointer text-sm"
                  onClick={() => handleOpenRegisterMatch(game)}
                >
                  Registrar Partida
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Registro de Partida */}
      {selectedGame && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-center items-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && handleCloseRegisterMatch()}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800/80 text-slate-900 dark:text-white animate-scale-in">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Registrar Partida - {selectedGame.title}</h2>
              <button className="text-slate-400 hover:text-rose-500 text-3xl font-light cursor-pointer line-height-none" onClick={handleCloseRegisterMatch}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmitMatch} className="flex flex-col gap-5">
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
                <label htmlFor="regrasCasa" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Regras da casa / Notas</label>
                <textarea 
                  id="regrasCasa" 
                  rows={4}
                  value={formData.regrasCasa}
                  onChange={(e) => setFormData({...formData, regrasCasa: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                <button type="button" className="px-5 py-3 rounded-2xl font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer text-sm" onClick={handleCloseRegisterMatch}>Cancelar</button>
                <button type="submit" className="px-5 py-3 rounded-2xl font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/15 hover:shadow-rose-600/25 active:translate-y-0.5 hover:-translate-y-0.5 transition-all cursor-pointer text-sm">Salvar Partida</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Cadastro de Jogo */}
      {isNewGameModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-center items-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && handleCloseNewGame()}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800/80 text-slate-900 dark:text-white animate-scale-in">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Adicionar Novo Jogo</h2>
              <button className="text-slate-400 hover:text-rose-500 text-3xl font-light cursor-pointer line-height-none" onClick={handleCloseNewGame}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmitNewGame} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="game-title" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Título do Jogo *</label>
                <input 
                  type="text" 
                  id="game-title" 
                  value={newGameData.title}
                  onChange={(e) => setNewGameData({...newGameData, title: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="game-min-players" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jogadores Mín.</label>
                  <input 
                    type="number" 
                    id="game-min-players" 
                    min="1"
                    value={newGameData.min_players}
                    onChange={(e) => setNewGameData({...newGameData, min_players: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="game-max-players" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jogadores Máx.</label>
                  <input 
                    type="number" 
                    id="game-max-players" 
                    min="1"
                    value={newGameData.max_players}
                    onChange={(e) => setNewGameData({...newGameData, max_players: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="game-description" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Descrição / Notas</label>
                <textarea 
                  id="game-description" 
                  rows={4}
                  value={newGameData.description}
                  onChange={(e) => setNewGameData({...newGameData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10 transition-all text-sm font-semibold resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                <button type="button" className="px-5 py-3 rounded-2xl font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer text-sm" onClick={handleCloseNewGame}>Cancelar</button>
                <button type="submit" className="px-5 py-3 rounded-2xl font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/15 hover:shadow-rose-600/25 active:translate-y-0.5 hover:-translate-y-0.5 transition-all cursor-pointer text-sm">Salvar Jogo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
