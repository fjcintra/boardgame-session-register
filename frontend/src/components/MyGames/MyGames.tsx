import { useState, useMemo } from 'react';
import './MyGames.css';

// Mock data for games
const initialGames = [
  { id: 1, name: 'Catan', addedDate: '2023-05-10', timesPlayed: 12 },
  { id: 2, name: 'Ticket to Ride', addedDate: '2023-08-22', timesPlayed: 8 },
  { id: 3, name: 'Pandemic', addedDate: '2022-11-05', timesPlayed: 25 },
  { id: 4, name: 'Carcassonne', addedDate: '2024-01-15', timesPlayed: 4 },
  { id: 5, name: 'Terraforming Mars', addedDate: '2023-02-18', timesPlayed: 18 },
  { id: 6, name: '7 Wonders', addedDate: '2023-10-30', timesPlayed: 15 },
];

export default function MyGames() {
  const [sortBy, setSortBy] = useState('name-asc');
  
  // Modal state
  const [selectedGame, setSelectedGame] = useState<typeof initialGames[0] | null>(null);
  const [formData, setFormData] = useState({
    vencedor: '',
    tempoJogo: '',
    quantidadeJogadores: '',
    regrasCasa: ''
  });

  const handleOpenModal = (game: typeof initialGames[0]) => {
    setSelectedGame(game);
    setFormData({ vencedor: '', tempoJogo: '', quantidadeJogadores: '', regrasCasa: '' });
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados da partida a serem salvos:', { gameId: selectedGame?.id, ...formData });
    // Future: API call to save to database here
    handleCloseModal();
  };

  // Sort logic
  const sortedGames = useMemo(() => {
    const gamesCopy = [...initialGames];
    
    switch (sortBy) {
      case 'name-asc':
        return gamesCopy.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return gamesCopy.sort((a, b) => b.name.localeCompare(a.name));
      case 'recent':
        return gamesCopy.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
      case 'oldest':
        return gamesCopy.sort((a, b) => new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime());
      case 'most-played':
        return gamesCopy.sort((a, b) => b.timesPlayed - a.timesPlayed);
      default:
        return gamesCopy;
    }
  }, [sortBy]);

  return (
    <div className="games-container">
      <div className="games-header">
        <div className="games-title">
          <h2>Meus Jogos</h2>
          <p>Sua coleção de jogos de tabuleiro</p>
        </div>
        
        <div className="games-filters">
          <label htmlFor="sort-select">Ordenar por:</label>
          <div className="select-wrapper">
            <select 
              id="sort-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
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

      <div className="games-grid">
        {sortedGames.map(game => (
          <div key={game.id} className="game-card">
            <div className="game-card-image">
              <span>{game.name.charAt(0)}</span>
            </div>
            <div className="game-card-content">
              <h3>{game.name}</h3>
              <div className="game-stats">
                <span className="stat">
                  <i className="icon-calendar">📅</i> 
                  Adicionado: {new Date(game.addedDate).toLocaleDateString('pt-BR')}
                </span>
                <span className="stat">
                  <i className="icon-play">🎲</i> 
                  Partidas: {game.timesPlayed}
                </span>
              </div>
            </div>
            <div className="game-card-actions">
              <button className="play-btn" onClick={() => handleOpenModal(game)}>Registrar Partida</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Registro de Partida */}
      {selectedGame && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Registrar Partida - {selectedGame.name}</h2>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
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
