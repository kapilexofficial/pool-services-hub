import React from 'react'
import './App.css'

export default function App() {
  const [userType, setUserType] = React.useState(null)
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)

  if (!isLoggedIn && !userType) {
    return (
      <div className="landing">
        <div className="hero">
          <h1>🏊‍♂️ Services Hub</h1>
          <p>Connect with Trusted Pool Professionals</p>
          
          <div className="cta-buttons">
            <button onClick={() => setUserType('client')}>
              I'm Looking for Help
            </button>
            <button onClick={() => setUserType('professional')}>
              I'm a Professional
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (userType === 'client' && !isLoggedIn) {
    return (
      <div className="auth-container">
        <h2>Sign Up - Client</h2>
        <form onSubmit={(e) => {
          e.preventDefault()
          setIsLoggedIn(true)
        }}>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="text" placeholder="Name" required />
          <button type="submit">Sign Up</button>
        </form>
        <button onClick={() => setUserType(null)}>Back</button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h1>Welcome to Services Hub!</h1>
      <p>Type: {userType}</p>
      <button onClick={() => {
        setIsLoggedIn(false)
        setUserType(null)
      }}>
        Logout
      </button>
    </div>
  )
}
