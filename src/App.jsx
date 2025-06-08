import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import CategoryView from './components/CategoryView'

function App() {
  return (
    <Router>
      <div style={styles.app}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:categorySlug" element={<CategoryView />} />
        </Routes>
      </div>
    </Router>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }
}

export default App