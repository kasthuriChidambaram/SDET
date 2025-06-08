import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { categoryService } from '../services/categoryService'
import { subcategoryService } from '../services/subcategoryService'
import { questionService } from '../services/questionService'

function CategoryView() {
  const { categorySlug } = useParams()
  const [category, setCategory] = useState(null)
  const [subcategories, setSubcategories] = useState([])
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategoryAndSubcategories = async () => {
      try {
        // Get category details
        const categories = await categoryService.getAllCategories()
        const currentCategory = categories.find(cat => cat.slug === categorySlug)
        
        if (!currentCategory) {
          setError('Category not found')
          return
        }

        setCategory(currentCategory)

        // Get subcategories
        const subcats = await subcategoryService.getSubcategoriesByCategory(currentCategory.id)
        setSubcategories(subcats)
      } catch (err) {
        setError('Failed to load category data')
        console.error(err)
      }
    }

    fetchCategoryAndSubcategories()
  }, [categorySlug])

  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedSubcategory) {
        try {
          const questionData = await questionService.getQuestionsBySubcategory(selectedSubcategory.id)
          setQuestions(questionData)
        } catch (err) {
          setError('Failed to load questions')
          console.error(err)
        }
      } else {
        setQuestions([])
      }
    }

    fetchQuestions()
  }, [selectedSubcategory])

  if (error) {
    return <div style={styles.error}>{error}</div>
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>{category?.name || 'Loading...'}</h2>
        <div style={styles.subcategoryList}>
          {subcategories.map(subcat => (
            <button
              key={subcat.id}
              style={{
                ...styles.subcategoryButton,
                ...(selectedSubcategory?.id === subcat.id ? styles.selectedSubcategory : {})
              }}
              onClick={() => setSelectedSubcategory(subcat)}
            >
              {subcat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={styles.content}>
        {selectedSubcategory ? (
          <>
            <h2 style={styles.contentTitle}>{selectedSubcategory.name}</h2>
            <div style={styles.questionList}>
              {questions.map(question => (
                <div key={question.id} style={styles.questionCard}>
                  <div style={styles.questionHeader}>
                    <h3 style={styles.questionTitle}>{question.question}</h3>
                    <span style={{
                      ...styles.difficultyBadge,
                      backgroundColor: getDifficultyColor(question.difficulty)
                    }}>
                      {question.difficulty}
                    </span>
                  </div>
                  <p style={styles.answer}>{question.answer}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={styles.placeholder}>
            Select a subcategory to view questions
          </div>
        )}
      </div>
    </div>
  )
}

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return '#4caf50'
    case 'medium':
      return '#ff9800'
    case 'hard':
      return '#f44336'
    default:
      return '#757575'
  }
}

const styles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 80px)', // Assuming navbar is 80px
  },
  sidebar: {
    width: '300px',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #e9ecef',
    padding: '1.5rem',
    overflowY: 'auto',
  },
  sidebarTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '1.5rem',
  },
  subcategoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  subcategoryButton: {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: '#4a5568',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#e2e8f0',
    },
  },
  selectedSubcategory: {
    backgroundColor: '#e2e8f0',
    color: '#2d3748',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto',
  },
  contentTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '2rem',
  },
  questionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  questionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2d3748',
    flex: 1,
    marginRight: '1rem',
  },
  difficultyBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  answer: {
    color: '#4a5568',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#a0aec0',
    fontSize: '1.2rem',
  },
  error: {
    padding: '2rem',
    color: '#e53e3e',
    textAlign: 'center',
    fontSize: '1.2rem',
  },
}

export default CategoryView 