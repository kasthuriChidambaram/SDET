import React from 'react'
import Navbar from './components/Navbar'

function App() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <h1>Welcome to SDET Interview Prep</h1>
        <p>Select a category from the navigation bar to get started.</p>
      </main>
    </div>
  )
}

export default App