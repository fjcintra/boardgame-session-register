interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export default function LandingPage({ onOpenAuth }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Header / Navbar */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-slate-200 dark:border-slate-900 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center gap-2 text-2xl font-black text-rose-500">
          <span className="text-3xl">🎲</span>
          <span>DiceLog</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer" 
            onClick={() => onOpenAuth('login')}
          >
            Entrar
          </button>
          <button 
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20 hover:shadow-rose-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer" 
            onClick={() => onOpenAuth('register')}
          >
            Cadastrar
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-16 px-8 py-20 max-w-7xl mx-auto w-full flex-grow">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-slate-900 to-rose-500 dark:from-white dark:to-rose-500 bg-clip-text text-transparent mb-6 transition-colors duration-300">
            Suas jogatinas, organizadas em um só lugar.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl leading-relaxed mx-auto lg:mx-0">
            O DiceLog é o sistema definitivo para catalogar seu acervo de jogos de tabuleiro, 
            acompanhar suas vitórias, gerenciar tempos de partida e salvar aquelas regras da casa 
            que tornam cada sessão única.
          </p>
          <div className="flex justify-center lg:justify-start">
            <button 
              className="px-8 py-4 rounded-2xl font-bold text-lg text-white bg-rose-500 hover:bg-rose-600 shadow-xl shadow-rose-500/25 hover:shadow-rose-600/35 hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer" 
              onClick={() => onOpenAuth('register')}
            >
              Começar Agora — É Grátis
            </button>
          </div>
        </div>
        <div className="flex-1 relative flex items-center justify-center h-80 w-full max-w-md lg:max-w-none">
          <div className="absolute top-1/10 left-1/12 -rotate-6 bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 px-6 py-4 rounded-2xl shadow-2xl font-bold border border-slate-800 dark:border-slate-700 animate-bounce duration-2000">
            🎲 Catan
          </div>
          <div className="absolute top-4/10 right-1/12 rotate-3 bg-white text-rose-500 dark:bg-slate-800 dark:text-rose-400 px-6 py-4 rounded-2xl shadow-2xl font-bold border border-slate-100 dark:border-slate-700">
            🏆 Fábio venceu!
          </div>
          <div className="absolute bottom-1/10 left-1/4 -rotate-3 bg-rose-500 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold shadow-rose-500/25">
            ⏳ 01:30 min
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-24 px-8 w-full transition-colors duration-300">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 dark:text-white mb-4">
            O que o sistema faz?
          </h2>
          <p className="text-center text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-16">
            Tudo o que você precisa para manter o histórico do seu grupo de jogos atualizado.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-6 bg-rose-500/10 h-16 w-16 rounded-2xl flex items-center justify-center">📦</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Gerencie sua Coleção</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Adicione seus jogos favoritos à sua estante virtual. Visualize quando foram 
                adicionados e acompanhe a quantidade total de vezes que foram para a mesa.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-6 bg-rose-500/10 h-16 w-16 rounded-2xl flex items-center justify-center">📝</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Histórico de Partidas</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Registre logs detalhados de cada partida: vencedor, tempo de jogo, quantidade 
                de jogadores e notas personalizadas da sessão.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-6 bg-rose-500/10 h-16 w-16 rounded-2xl flex items-center justify-center">🛡️</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Regras da Casa</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Nunca mais esqueça as adaptações ou regras especiais que seu grupo usa. Salve-as 
                diretamente no log da partida para consultas futuras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 dark:text-white mb-4">
          Como Funciona?
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-16 w-full">
          <div className="flex-1 flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm w-full">
            <div className="text-2xl font-black bg-rose-500 text-white h-12 w-12 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-rose-500/20">1</div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Crie seu Perfil</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Cadastre-se rapidamente no sistema e gerencie suas informações pessoais.</p>
          </div>
          <div className="hidden md:block text-3xl text-rose-500 font-bold animate-pulse">➔</div>
          <div className="flex-1 flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm w-full">
            <div className="text-2xl font-black bg-rose-500 text-white h-12 w-12 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-rose-500/20">2</div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Explore seus Jogos</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Visualize sua biblioteca cadastrada e ordene por nome, data ou popularidade.</p>
          </div>
          <div className="hidden md:block text-3xl text-rose-500 font-bold animate-pulse">➔</div>
          <div className="flex-1 flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm w-full">
            <div className="text-2xl font-black bg-rose-500 text-white h-12 w-12 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-rose-500/20">3</div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Registre as Sessões</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Após jogar, registre quem venceu, quanto tempo levou e os detalhes da rodada.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-8 bg-white dark:bg-slate-950 transition-colors duration-300 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-xl font-black text-rose-500">
            <span className="text-2xl">🎲</span> DiceLog
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} DiceLog. Desenvolvido para amantes de jogos de tabuleiro.
          </p>
        </div>
      </footer>
    </div>
  );
}
