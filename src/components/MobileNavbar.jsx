import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { categoryService } from '../services/categoryService'

function MobileNavbar() {
    const [categories, setCategories] = useState([])
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories()
                setCategories(data)
            } catch (err) {
                setError('Failed to load categories')
                console.error(err)
            }
        }

        fetchCategories()
    }, [])

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false)
    }, [location.pathname])

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('mobile-menu-open')
        } else {
            document.body.classList.remove('mobile-menu-open')
        }

        return () => {
            document.body.classList.remove('mobile-menu-open')
        }
    }, [isMenuOpen])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleCategoryClick = (categorySlug) => {
        navigate(`/${categorySlug}`)
        setIsMenuOpen(false)
    }

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsMenuOpen(false)
        }
    }

    if (error) {
        return <div className="mobile-navbar-error">Error: {error}</div>
    }

    return (
        <nav style={styles.nav}>
            <div style={styles.header}>
                <Link to="/" style={styles.logo}>SDET Interview Prep</Link>
                <button 
                    style={styles.hamburger}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    className="hamburger-button"
                >
                    <span style={{fontSize: '2rem', color: '#2d3748', lineHeight: 1}}>☰</span>
                </button>
            </div>
            
            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div 
                    style={styles.menuOverlay} 
                    className="mobile-menu-overlay"
                    onClick={handleOverlayClick}
                >
                    <div style={styles.menuContent} className="mobile-menu-content">
                        <h3 style={styles.menuTitle}>Categories</h3>
                        <div style={styles.categoryList}>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    style={styles.categoryButton}
                                    className="mobile-category-button"
                                    onClick={() => handleCategoryClick(category.slug)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

const styles = {
    nav: {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: '#f8f9fa',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        height: '64px',
    },
    logo: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        textDecoration: 'none',
        color: '#2d3748',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flexShrink: 1,
        marginRight: '1rem',
    },
    hamburger: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '30px',
        height: '30px',
        position: 'relative',
        zIndex: 9999,
    },
    hamburgerLine: {
        width: '100%',
        height: '3px',
        backgroundColor: '#2d3748',
        borderRadius: '2px',
        transition: 'all 0.3s ease',
    },
    menuOverlay: {
        position: 'fixed',
        top: '64px',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
    },
    menuContent: {
        backgroundColor: '#ffffff',
        padding: '1rem',
        height: '100%',
        overflowY: 'auto',
    },
    menuTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#2d3748',
        textAlign: 'center',
    },
    categoryList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    categoryButton: {
        background: 'none',
        border: 'none',
        padding: '1rem',
        fontSize: '1rem',
        textAlign: 'left',
        cursor: 'pointer',
        borderRadius: '8px',
        transition: 'background-color 0.2s',
        color: '#4a5568',
        fontWeight: '500',
        ':hover': {
            backgroundColor: '#f7fafc',
        },
    },
}

export default MobileNavbar 