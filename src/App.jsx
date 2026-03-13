import React, { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import './App.css'

export default function App() {
  const { user, session, loading, error, signup, login, logout, checkAuth } = useAuth()
  const [userType, setUserType] = useState(null)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  const [formError, setFormError] = useState('')
  const [isSignup, setIsSignup] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Check auth state on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormError('')
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)

    try {
      if (!formData.email || !formData.password || !formData.name) {
        throw new Error('Por favor preencha todos os campos')
      }

      // Extra data for professionals
      const extraData = userType === 'professional' 
        ? {
            years_experience: document.querySelector('input[placeholder*="anos"]')?.value || 0,
            company_name: document.querySelector('input[placeholder*="empresa"]')?.value || '',
          }
        : {}

      await signup(formData.email, formData.password, formData.name, userType, extraData)
      setFormData({ email: '', password: '', name: '' })
    } catch (err) {
      setFormError(err.message || 'Erro ao fazer cadastro')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Por favor preencha email e senha')
      }

      await login(formData.email, formData.password)
      setFormData({ email: '', password: '', name: '' })
    } catch (err) {
      setFormError(err.message || 'Erro ao fazer login')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setUserType(null)
    } catch (err) {
      setFormError(err.message || 'Erro ao fazer logout')
    }
  }

  // Loading state
  if (loading && !user) {
    return (
      <div className="landing">
        <div className="hero">
          <h1>🏊‍♂️ Services Hub</h1>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  // Landing page (não logado)
  if (!user && !session) {
    return (
      <div className="landing">
        <div className="hero">
          <h1>🏊‍♂️ Services Hub</h1>
          <p>Connect with Trusted Pool Professionals</p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            Marketplace pra contratar e oferecer serviços de piscina
          </p>
          
          {!userType && (
            <div className="cta-buttons">
              <button 
                onClick={() => {
                  setUserType('client')
                  setIsSignup(true)
                }}
                className="btn btn-primary"
              >
                👤 Sou Cliente
              </button>
              <button 
                onClick={() => {
                  setUserType('professional')
                  setIsSignup(true)
                }}
                className="btn btn-secondary"
              >
                🔧 Sou Profissional
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Formulário de signup/login
  if (userType && !user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <button 
            onClick={() => {
              setUserType(null)
              setIsSignup(true)
              setFormData({ email: '', password: '', name: '' })
              setFormError('')
            }}
            className="back-btn"
          >
            ← Voltar
          </button>

          <h2>
            {isSignup 
              ? (userType === 'client' ? '👤 Cadastro - Cliente' : '🔧 Cadastro - Profissional')
              : '🔓 Login'
            }
          </h2>

          {error && <p className="error">{error}</p>}
          {formError && <p className="error">{formError}</p>}

          <form onSubmit={isSignup ? handleSignup : handleLogin}>
            {isSignup && (
              <input
                type="text"
                name="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            )}
            
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

            {isSignup && userType === 'professional' && (
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

            <button 
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Processando...' : isSignup ? 'Cadastrar' : 'Login'}
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
            {isSignup ? 'Já tem conta? ' : 'Sem conta? '}
            <button
              onClick={() => setIsSignup(!isSignup)}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontWeight: 'bold',
              }}
            >
              {isSignup ? 'Login' : 'Cadastre-se'}
            </button>
          </p>
        </div>
      </div>
    )
  }

  // Dashboard (logado)
  if (user && session) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>✅ Bem-vindo, {user.name}!</h1>
          <p>
            {user.user_type === 'client' 
              ? '👤 Você está logado como Cliente' 
              : '🔧 Você está logado como Profissional'}
          </p>
        </div>

        <div className="dashboard-content">
          <div className="card">
            <h3>Seu Perfil</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Nome:</strong> {user.name}</p>
            <p><strong>Tipo:</strong> {user.user_type === 'client' ? 'Cliente' : 'Profissional'}</p>
            {user.user_type === 'professional' && user.company_name && (
              <p><strong>Empresa:</strong> {user.company_name}</p>
            )}
            {user.user_type === 'professional' && user.years_experience && (
              <p><strong>Experiência:</strong> {user.years_experience} anos</p>
            )}
          </div>

          <div className="card">
            <h3>Próximos Passos</h3>
            {user.user_type === 'client' ? (
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

          {error && <p className="error">{error}</p>}
        </div>

        <button 
          onClick={handleLogout}
          disabled={submitting}
          className="btn btn-danger"
        >
          {submitting ? 'Saindo...' : 'Sair'}
        </button>
      </div>
    )
  }
}
