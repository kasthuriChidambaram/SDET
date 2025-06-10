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
        
        // Reset selected subcategory when category changes
        setSelectedSubcategory(null)
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

  const renderCategoryOverview = () => {
    if (!category) return null

    return (
      <div style={styles.categoryOverview}>
        <h2 style={styles.contentTitle}>{category.name}</h2>
        <div style={styles.overviewCard}>
          <p style={styles.description}>{category.description}</p>
          
          <div style={styles.overviewSection}>
            <h3 style={styles.overviewTitle}>What you'll learn</h3>
            <div style={styles.overviewContent}>
              {category.overview && category.overview.split('\n').map((point, index) => (
                <div key={index} style={styles.overviewPoint}>
                  <span style={styles.bulletPoint}>•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.subcategoriesOverview}>
            <h3 style={styles.overviewTitle}>Available Topics</h3>
            <div style={styles.topicGrid}>
              {subcategories.map(subcat => (
                <div
                  key={subcat.id}
                  style={styles.topicCard}
                  onClick={() => setSelectedSubcategory(subcat)}
                >
                  <h4 style={styles.topicTitle}>{subcat.name}</h4>
                  <button style={styles.exploreButton}>
                    Explore →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // This function will now focus on parsing text into 'code' or 'text' blocks.
  // It will return an array of objects describing each block.
  const parseContentBlocks = (text) => {
    const normalized = text.replace(/\r\n/g, '\n'); // Normalize line breaks
    
    // Split into segments alternating between text and code blocks
    const segments = normalized.split(/(```[\s\S]*?```)/g);
    
    return segments.map(segment => {
      if (segment.startsWith('```') && segment.endsWith('```')) {
        const content = segment.slice(3, -3).trim();
        // Extract language if present
        const firstNewlineIndex = content.indexOf('\n');
        let lang = '';
        let code = content;

        if (firstNewlineIndex !== -1) {
          lang = content.substring(0, firstNewlineIndex).trim();
          code = content.substring(firstNewlineIndex + 1).trim();
        }
        return { type: 'code', content: code, lang: lang };
      }
      // If it's not a code block, it's a text segment
      return { type: 'text', content: segment };
    }).filter(block => block.content.trim() !== ''); // Filter out empty segments that might arise from split
  };

  // This function remains dedicated to processing inline code within a single line/text string.
  const renderInlineCode = (text) => {
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, j) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={`inline-${j}`} style={styles.inlineCode}>
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // This function now orchestrates the rendering of the entire answer.
  const renderAnswer = (answer) => {
    if (!answer) return null;

    const contentBlocks = parseContentBlocks(answer);

    return (
      <div style={styles.answerContainer}>
        {contentBlocks.map((block, i) => {
          if (block.type === 'code') {
            // Render a code block
            return (
              <pre key={`code-block-${i}`} style={styles.codeBlockPre}>
                <code className={`language-${block.lang}`}>
                  {block.content}
                </code>
              </pre>
            );
          } else { // type === 'text'
            // For text blocks, split by lines to handle paragraphs and bullets
            const lines = block.content.split('\n');
            return lines.map((line, lineIndex) => {
              const trimmedLine = line.trim();
              if (!trimmedLine) return null; // Skip empty lines

              // Check for bullet points
              if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
                return (
                  <div key={`bullet-${i}-${lineIndex}`} style={styles.bulletPoint}>
                    <span style={styles.bullet}>•</span>
                    <span>{renderInlineCode(trimmedLine.substring(1).trim())}</span>
                  </div>
                );
              }
              // Regular paragraph with inline code
              return (
                <p key={`paragraph-${i}-${lineIndex}`} style={styles.answerParagraph}>
                  {renderInlineCode(trimmedLine)}
                </p>
              );
            });
          }
        })}
      </div>
    );
  };

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
                  {renderAnswer(question.answer)}
                </div>
              ))}
            </div>
          </>
        ) : (
          renderCategoryOverview()
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
  categoryOverview: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  overviewCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  description: {
    fontSize: '1.1rem',
    lineHeight: '1.7',
    color: '#4a5568',
    marginBottom: '2rem',
  },
  overviewSection: {
    marginBottom: '2rem',
  },
  overviewTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '1rem',
  },
  overviewContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  overviewPoint: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    fontSize: '1.1rem',
    color: '#4a5568',
  },
  bulletPoint: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    color: '#4a5568',
    lineHeight: '1.6',
  },
  bullet: {
    color: '#4299e1',
    fontSize: '1.2rem',
    lineHeight: '1.5',
    flexShrink: 0,
  },
  answerParagraph: {
    color: '#4a5568',
    lineHeight: '1.6',
    margin: 0,
  },
  answerContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  subcategoriesOverview: {
    marginTop: '2rem',
  },
  topicGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  topicCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid #e2e8f0',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
  },
  topicTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '1rem',
  },
  exploreButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#4299e1',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    padding: 0,
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
  error: {
    padding: '2rem',
    color: '#e53e3e',
    textAlign: 'center',
    fontSize: '1.2rem',
  },
  inlineCode: {
    backgroundColor: '#f0f0f0',
    padding: '2px 4px',
    borderRadius: '3px',
    fontFamily: 'monospace',
    color: '#c7254e', // A distinct color for inline code
  },
  codeBlockPre: { // Renamed from codeBlock to avoid conflict and signify <pre> tag
    background: '#f8f8f8',
    padding: '12px',
    borderRadius: '4px',
    borderLeft: '3px solid #61dafb', // Blue border for code blocks
    overflowX: 'auto',
    margin: '16px 0',
    whiteSpace: 'pre-wrap', // Preserves whitespace and line breaks inside pre
    fontFamily: 'monospace',
    color: '#333', // Default text color for code block content
  },
}

export default CategoryView 