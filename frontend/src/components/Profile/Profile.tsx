import './Profile.css';

export default function Profile() {
  // Mock data that will come from the database in the future
  const userData = {
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

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {userData.nome.charAt(0)}{userData.sobrenome.charAt(0)}
        </div>
        <div className="profile-title">
          <h2>Meu Perfil</h2>
          <p>Gerencie suas informações pessoais</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>Informações Pessoais</h3>
          <div className="profile-grid">
            <div className="profile-field">
              <label>Nome</label>
              <div className="field-value">{userData.nome}</div>
            </div>
            <div className="profile-field">
              <label>Sobrenome</label>
              <div className="field-value">{userData.sobrenome}</div>
            </div>
            <div className="profile-field">
              <label>E-mail</label>
              <div className="field-value">{userData.email}</div>
            </div>
            <div className="profile-field">
              <label>Telefone</label>
              <div className="field-value">{userData.telefone}</div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Endereço</h3>
          <div className="profile-grid">
            <div className="profile-field full-width">
              <label>Endereço</label>
              <div className="field-value">{userData.endereco}</div>
            </div>
            <div className="profile-field">
              <label>Número</label>
              <div className="field-value">{userData.numero}</div>
            </div>
            <div className="profile-field">
              <label>Complemento</label>
              <div className="field-value">{userData.complemento}</div>
            </div>
            <div className="profile-field">
              <label>Cidade</label>
              <div className="field-value">{userData.cidade}</div>
            </div>
            <div className="profile-field">
              <label>Estado</label>
              <div className="field-value">{userData.estado}</div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="edit-btn">Editar Perfil</button>
        </div>
      </div>
    </div>
  );
}
