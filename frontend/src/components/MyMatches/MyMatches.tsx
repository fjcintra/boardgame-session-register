import { useState, useMemo } from 'react';
import './MyMatches.css';

const gamesList = [
  { id: 1, name: 'Catan' },
  { id: 2, name: 'Ticket to Ride' },
  { id: 3, name: 'Pandemic' },
  { id: 4, name: 'Carcassonne' },
  { id: 5, name: 'Terraforming Mars' },
  { id: 6, name: '7 Wonders' },
];

const initialMatches = [
  { id: 1, gameId: 1, gameName: 'Catan', date: '2023-11-01', playtime: '01:30', winner: 'Fábio', playerCount: 4, houseRules: 'Sem ladrão nas primeiras 2 rodadas' },
  { id: 2, gameId: 3, gameName: 'Pandemic', date: '2023-11-15', playtime: '00:45', winner: 'Todos (Coop)', playerCount: 3, houseRules: '' },
  { id: 3, gameId: 5, gameName: 'Terraforming Mars', date: '2023-12-05', playtime: '02:15', winner: 'Ana', playerCount: 4, houseRules: 'Draft de cartas inicial' },
  { id: 4, gameId: 1, gameName: 'Catan', date: '2023-12-10', playtime: '01:15', winner: 'Carlos', playerCount: 3, houseRules: '' },
  { id: 5, gameId: 4, gameName: 'Carcassonne', date: '2024-01-20', playtime: '00:50', winner: 'Fábio', playerCount: 2, houseRules: 'Camponeses contam diferente' },
];

export default function MyMatches() {
  const [matches, setMatches] = useState(initialMatches);
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedGamesFilter, setSelectedGamesFilter] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedMatchId, setExpandedMatchId] = useState<number | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    gameId: '',
    vencedor: '',
    tempoJogo: '',
    quantidadeJogadores: '',
    regrasCasa: ''
  });

  const toggleFilter = (gameId: number) => {
    setSelectedGamesFilter(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const sortedAndFilteredMatches = useMemo(() => {
    let result = [...matches];

    // Filter
    if (selectedGamesFilter.length > 0) {
      result = result.filter(match => selectedGamesFilter.includes(match.gameId));
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'winner':
          return a.winner.localeCompare(b.winner);
        case 'playtime':
          return a.playtime.localeCompare(b.playtime); // Simple string sort for HH:MM
        case 'players':
          return b.playerCount - a.playerCount;
        default:
          return 0;
      }
    });

    return result;
  }, [matches, sortBy, selectedGamesFilter]);

  const toggleExpand = (id: number) => {
    setExpandedMatchId(prev => prev === id ? null : id);
  };

  const handleOpenModal = () => {
    setFormData({ gameId: '', vencedor: '', tempoJogo: '', quantidadeJogadores: '', regrasCasa: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const game = gamesList.find(g => g.id === Number(formData.gameId));
    if (game) {
      const newMatch = {
        id: Date.now(),
        gameId: game.id,
        gameName: game.name,
        date: new Date().toISOString().split('T')[0], // current date as string YYYY-MM-DD
        playtime: formData.tempoJogo,
        winner: formData.vencedor,
        playerCount: Number(formData.quantidadeJogadores),
        houseRules: formData.regrasCasa
      };
      setMatches([newMatch, ...matches]);
      console.log('Partida registrada:', newMatch);
    }
    handleCloseModal();
  };

  return (
    <div className="matches-container">
      <div className="matches-header">
        <div className="matches-title">
          <h2>Minhas Partidas</h2>
          <p>Histórico completo das suas jogatinas</p>
        </div>
        <button className="new-match-btn" onClick={handleOpenModal}>
          + Nova Partida
        </button>
      </div>

      <div className="matches-controls">
        <div className="filter-dropdown">
          <button 
            className="filter-toggle-btn" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            Filtrar por Jogo {selectedGamesFilter.length > 0 && `(${selectedGamesFilter.length})`}
            <span className="arrow">{isFilterOpen ? '▲' : '▼'}</span>
          </button>
          
          {isFilterOpen && (
            <div className="filter-menu">
              {gamesList.map(game => (
                <label key={game.id} className="filter-item">
                  <input 
                    type="checkbox" 
                    checked={selectedGamesFilter.includes(game.id)}
                    onChange={() => toggleFilter(game.id)}
                  />
                  <span>{game.name}</span>
                </label>
              ))}
              {selectedGamesFilter.length > 0 && (
                <button className="clear-filters-btn" onClick={() => setSelectedGamesFilter([])}>
                  Limpar Filtros
                </button>
              )}
            </div>
          )}
        </div>

        <div className="sort-wrapper">
          <label htmlFor="sort-matches">Ordenar:</label>
          <select 
            id="sort-matches" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date-desc">Mais recentes</option>
            <option value="date-asc">Mais antigas</option>
            <option value="winner">Vencedor</option>
            <option value="playtime">Tempo de Jogo</option>
            <option value="players">Qtd. de Jogadores</option>
          </select>
        </div>
      </div>

      <div className="matches-list">
        {sortedAndFilteredMatches.length === 0 ? (
          <div className="no-matches">Nenhuma partida encontrada com os filtros atuais.</div>
        ) : (
          sortedAndFilteredMatches.map(match => (
            <div 
              key={match.id} 
              className={`match-card ${expandedMatchId === match.id ? 'expanded' : ''}`}
            >
              <div className="match-bar" onClick={() => toggleExpand(match.id)}>
                <div className="match-bar-info">
                  <div className="match-game-icon">{match.gameName.charAt(0)}</div>
                  <span className="match-game-name">{match.gameName}</span>
                </div>
                <div className="match-bar-meta">
                  <span className="match-date">{new Date(match.date).toLocaleDateString('pt-BR')}</span>
                  <span className="match-time">⏳ {match.playtime}</span>
                  <span className="expand-icon">{expandedMatchId === match.id ? '−' : '+'}</span>
                </div>
              </div>
              
              {expandedMatchId === match.id && (
                <div className="match-details">
                  <div className="detail-item">
                    <span className="detail-label">Vencedor</span>
                    <span className="detail-value winner-highlight">🏆 {match.winner}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tempo de Jogo</span>
                    <span className="detail-value">{match.playtime}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Jogadores</span>
                    <span className="detail-value">👥 {match.playerCount}</span>
                  </div>
                  {match.houseRules && (
                    <div className="detail-item full-width">
                      <span className="detail-label">Regras da Casa</span>
                      <span className="detail-value rules-text">{match.houseRules}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal de Registro de Nova Partida */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Registrar Nova Partida</h2>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="gameId">Jogo</label>
                <select 
                  id="gameId"
                  value={formData.gameId}
                  onChange={(e) => setFormData({...formData, gameId: e.target.value})}
                  required
                >
                  <option value="" disabled>Selecione um jogo...</option>
                  {gamesList.map(game => (
                    <option key={game.id} value={game.id}>{game.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="vencedor">Vencedor</label>
                <input 
                  type="text" 
                  id="vencedor" 
                  maxLength={32}
                  value={formData.vencedor}
                  onChange={(e) => setFormData({...formData, vencedor: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tempoJogo">Tempo de jogo</label>
                <input 
                  type="time" 
                  id="tempoJogo" 
                  value={formData.tempoJogo}
                  onChange={(e) => setFormData({...formData, tempoJogo: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantidadeJogadores">Quantidade de jogadores</label>
                <input 
                  type="number" 
                  id="quantidadeJogadores" 
                  min="1"
                  value={formData.quantidadeJogadores}
                  onChange={(e) => setFormData({...formData, quantidadeJogadores: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="regrasCasa">Regras da casa</label>
                <textarea 
                  id="regrasCasa" 
                  rows={4}
                  value={formData.regrasCasa}
                  onChange={(e) => setFormData({...formData, regrasCasa: e.target.value})}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" className="save-btn">Salvar Partida</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
