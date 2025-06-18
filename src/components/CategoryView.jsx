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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Initialize Google AdSense
  useEffect(() => {
    if (window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Error loading Google AdSense:', error);
      }
    }
  }, [questions]); // Re-run when questions change

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
      {/* Mobile Sidebar Toggle */}
      {isMobile && (
        <button 
          style={styles.mobileSidebarToggle}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <div style={{
        ...styles.sidebar,
        ...(isMobile && {
          position: 'fixed',
          top: '64px',
          left: 0,
          height: 'calc(100vh - 64px)',
          zIndex: 1000,
          width: '240px',
          padding: '1rem',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        })
      }}>
        <h2 style={styles.sidebarTitle}>{category?.name || 'Loading...'}</h2>
        <div style={styles.subcategoryList}>
          {subcategories.map(subcat => (
            <button
              key={subcat.id}
              style={{
                ...styles.subcategoryButton,
                ...(selectedSubcategory?.id === subcat.id ? styles.selectedSubcategory : {})
              }}
              onClick={() => {
                setSelectedSubcategory(subcat)
                setIsSidebarOpen(false) // Close sidebar on mobile after selection
              }}
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
            
            {/* Google Ad in Footer */}
            <div style={styles.adContainer}>
              <ins
                className="adsbygoogle"
                style={styles.googleAd}
                data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
                data-ad-slot="YOUR_AD_SLOT_ID"
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>
          </>
        ) : (
          renderCategoryOverview()
        )}
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          style={styles.mobileOverlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
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
    position: 'relative',
    '@media (max-width: 768px)': {
      height: 'calc(100vh - 64px)',
    },
  },
  mobileSidebarToggle: {
    position: 'fixed',
    top: '80px',
    left: '10px',
    zIndex: 1001,
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #e9ecef',
    padding: '1.25rem',
    overflowY: 'auto',
    transition: 'transform 0.3s ease',
  },
  sidebarTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '1.5rem',
    '@media (max-width: 768px)': {
      fontSize: '1.2rem',
      marginBottom: '1rem',
    },
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
    fontSize: '1rem',
    '@media (max-width: 768px)': {
      padding: '0.5rem 0.75rem',
      fontSize: '0.9rem',
    },
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
    '@media (max-width: 768px)': {
      padding: '1rem',
      marginLeft: '0',
    },
  },
  contentTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '2rem',
    '@media (max-width: 768px)': {
      fontSize: '1.5rem',
      marginBottom: '1.5rem',
    },
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
    '@media (max-width: 768px)': {
      padding: '1rem',
    },
  },
  description: {
    fontSize: '1.1rem',
    lineHeight: '1.7',
    color: '#4a5568',
    marginBottom: '2rem',
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      marginBottom: '1.5rem',
    },
  },
  overviewTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '1rem',
    '@media (max-width: 768px)': {
      fontSize: '1.3rem',
    },
  },
  subcategoriesOverview: {
    marginTop: '2rem',
  },
  topicGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '0.75rem',
    },
  },
  topicCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid #e2e8f0',
    '@media (max-width: 768px)': {
      padding: '1rem',
    },
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
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      marginBottom: '0.75rem',
    },
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
    '@media (max-width: 768px)': {
      gap: '1rem',
    },
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '@media (max-width: 768px)': {
      padding: '1rem',
    },
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    gap: '1rem',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '0.5rem',
    },
  },
  questionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2d3748',
    flex: 1,
    margin: 0,
    '@media (max-width: 768px)': {
      fontSize: '1.1rem',
    },
  },
  difficultyBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    '@media (max-width: 768px)': {
      fontSize: '0.8rem',
      padding: '0.2rem 0.6rem',
    },
  },
  error: {
    padding: '2rem',
    color: '#e53e3e',
    textAlign: 'center',
    fontSize: '1.2rem',
    '@media (max-width: 768px)': {
      padding: '1rem',
      fontSize: '1rem',
    },
  },
  inlineCode: {
    backgroundColor: '#f0f0f0',
    padding: '2px 4px',
    borderRadius: '3px',
    fontFamily: 'monospace',
    color: '#c7254e',
    fontSize: '0.9em',
    '@media (max-width: 768px)': {
      fontSize: '0.85em',
    },
  },
  codeBlockPre: {
    background: '#f8f8f8',
    padding: '12px',
    borderRadius: '4px',
    borderLeft: '3px solid #61dafb',
    overflowX: 'auto',
    margin: '16px 0',
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    color: '#333',
    fontSize: '0.9rem',
    '@media (max-width: 768px)': {
      padding: '8px',
      fontSize: '0.8rem',
      margin: '12px 0',
    },
  },
  bulletPoint: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    color: '#4a5568',
    lineHeight: '1.6',
    marginBottom: '0.5rem',
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
    margin: '0 0 0.5rem 0',
    '@media (max-width: 768px)': {
      fontSize: '0.95rem',
    },
  },
  answerContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  adContainer: {
    marginTop: '2rem',
    textAlign: 'center',
    '@media (max-width: 768px)': {
      marginTop: '1.5rem',
    },
  },
  googleAd: {
    display: 'inline-block',
    width: '300px',
    height: '250px',
    '@media (max-width: 768px)': {
      width: '100%',
      maxWidth: '320px',
      height: '100px',
    },
  },
  mobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
}

export default CategoryView 