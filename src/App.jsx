import React, { useState } from 'react'
import './App.css'

export default function App() {
  const [userType, setUserType] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Placeholder para Supabase signup
      if (!formData.email || !formData.password || !formData.name) {
        throw new Error('Por favor preencha todos os campos')
      }
      
      // Aqui conectaremos com Supabase depois
      console.log('Signup data:', { ...formData, userType })
      
      // Por enquanto, simula login bem-sucedido
      setIsLoggedIn(true)
      setFormData({ email: '', password: '', name: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserType(null)
    setFormData({ email: '', password: '', name: '' })
  }

  // Landing page
  if (!userType && !isLoggedIn) {
    return (
      <div className="landing">
        <div className="hero">
          <h1>🏊‍♂️ Services Hub</h1>
          <p>Connect with Trusted Pool Professionals</p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            Marketplace pra contratar e oferecer serviços de piscina
          </p>
          
          <div className="cta-buttons">
            <button 
              onClick={() => setUserType('client')}
              className="btn btn-primary"
            >
              👤 Sou Cliente
            </button>
            <button 
              onClick={() => setUserType('professional')}
              className="btn btn-secondary"
            >
              🔧 Sou Profissional
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Formulário de signup/login
  if (userType && !isLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <button 
            onClick={() => setUserType(null)}
            className="back-btn"
          >
            ← Voltar
          </button>

          <h2>
            {userType === 'client' ? '👤 Cadastro - Cliente' : '🔧 Cadastro - Profissional'}
          </h2>

          <form onSubmit={handleSignup}>
            <input
              type="text"
              name="name"
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            {userType === 'professional' && (
              <>
                <input
                  type="text"
                  placeholder="Nome da empresa (opcional)"
                  className="optional"
                />
                <input
                  type="number"
                  placeholder="Anos de experiência"
                  className="optional"
                />
              </>
            )}

            {error && <p className="error">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Processando...' : 'Cadastrar'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Dashboard após login
  if (isLoggedIn) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>✅ Bem-vindo!</h1>
          <p>
            {userType === 'client' 
              ? '👤 Você está logado como Cliente' 
              : '🔧 Você está logado como Profissional'}
          </p>
        </div>

        <div className="dashboard-content">
          <div className="card">
            <h3>Seu Perfil</h3>
            <p>Email: {formData.email}</p>
            <p>Nome: {formData.name}</p>
            <p>Tipo: {userType === 'client' ? 'Cliente' : 'Profissional'}</p>
          </div>

          <div className="card">
            <h3>Próximos Passos</h3>
            {userType === 'client' ? (
              <ul>
                <li>Buscar profissionais por serviço</li>
                <li>Agendar serviços</li>
                <li>Avaliar profissionais</li>
              </ul>
            ) : (
              <ul>
                <li>Adicionar seus serviços</li>
                <li>Receber agendamentos</li>
                <li>Gerenciar disponibilidade</li>
              </ul>
            )}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="btn btn-danger"
        >
          Sair
        </button>
      </div>
    )
  }
}
