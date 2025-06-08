import React from 'react'
import Navbar from './components/Navbar'

function App() {
  return (
    <div>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.container}>
          <h1 style={styles.title}>Welcome to Your SDET Interview Preparation Hub</h1>
          <h2 style={styles.subtitle}>Master the skills. Crack the interview. Accelerate your tech career.</h2>
          
          <div style={styles.section}>
            <p>Software testing has come a long way — from manual checkbox validations to today's intelligent, integrated automation frameworks. In the early days, testers were seen as gatekeepers, running manual test cases at the end of development cycles. But as software delivery evolved with Agile and DevOps, the need for engineers who could test and code grew rapidly.</p>
            
            <p>That's how the role of the Software Development Engineer in Test (SDET) was born — a unique hybrid of developer and tester, capable of building robust test frameworks, automating quality checks, and contributing directly to engineering excellence.</p>
            
            <p>Today, SDETs are not just testers — they're critical contributors to product stability, deployment speed, and user experience. Their responsibilities span from UI and API automation to CI/CD pipeline integration, performance testing, and even writing production-level code to simulate real-world user scenarios.</p>
            
            <p>This platform is your one-stop destination to explore this dynamic field, understand its expectations, and prepare yourself to take on your next big opportunity with confidence.</p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>But what about AI? Will it replace testers?</h2>
            <p>AI has definitely entered the world of testing — with tools that can generate test cases, perform visual testing, and even suggest assertions based on code or user behavior. However, AI is not here to replace testers. It's here to augment them.</p>
            
            <ul style={styles.list}>
              <li>AI can automate repetitive, rule-based tasks — but it lacks context, curiosity, and the critical thinking needed to explore edge cases.</li>
              <li>AI can help identify patterns — but it can't judge product usability or user experience.</li>
              <li>Most importantly, AI doesn't understand intent — it doesn't know what the user wants, only what it's been trained on.</li>
            </ul>
            
            <p>That's why the role of the SDET is more important than ever — someone who understands both the technology and the user, and can use tools (including AI) effectively to deliver better, faster, and smarter testing.</p>
          </div>

          <div style={styles.section}>
            <p style={styles.conclusion}>SDET isn't just a job title — it's a mindset. This platform is your launchpad to think like an engineer, test like a pro, and build a career that grows with technology.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

const styles = {
  main: {
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    minHeight: 'calc(100vh - 80px)', // Assuming navbar is 80px
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#4a5568',
    marginBottom: '2rem',
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    color: '#2d3748',
    marginBottom: '1rem',
    fontWeight: '600',
  },
  list: {
    paddingLeft: '2rem',
    marginBottom: '1rem',
  },
  conclusion: {
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#2d3748',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}

export default App