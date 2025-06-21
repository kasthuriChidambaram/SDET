import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import ResponsiveNavbar from './components/ResponsiveNavbar'
import Home from './components/Home'
import CategoryView from './components/CategoryView'

function App() {
  return (
    <Router>
      <div style={styles.app}>
        <ResponsiveNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:categorySlug" element={<CategoryView />} />
        </Routes>
        <Analytics />
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