import { useState } from 'react';
import './App.css';
import Profile from './components/Profile/Profile';
import MyGames from './components/MyGames/MyGames';
import MyMatches from './components/MyMatches/MyMatches';

function App() {
  const [activePage, setActivePage] = useState('perfil');

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Menu</h2>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activePage === 'perfil' ? 'active' : ''}`}
            onClick={() => setActivePage('perfil')}
          >
            Perfil
          </button>
          <button 
            className={`nav-item ${activePage === 'jogos' ? 'active' : ''}`}
            onClick={() => setActivePage('jogos')}
          >
            Meus jogos
          </button>
          <button 
            className={`nav-item ${activePage === 'partidas' ? 'active' : ''}`}
            onClick={() => setActivePage('partidas')}
          >
            Minhas partidas
          </button>
          <button 
            className={`nav-item ${activePage === 'config' ? 'active' : ''}`}
            onClick={() => setActivePage('config')}
          >
            Configurações
          </button>
        </nav>
      </aside>
      <main className="main-content">
        {activePage === 'perfil' ? (
          <Profile />
        ) : activePage === 'jogos' ? (
          <MyGames />
        ) : activePage === 'partidas' ? (
          <MyMatches />
        ) : (
          <h1>Em desenvolvimento...</h1>
        )}
      </main>
    </div>
  )
}

export default App
