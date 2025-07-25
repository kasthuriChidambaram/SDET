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
        document.body.style.margin = '0';
        document.body.style.padding = '0';
    }, []);

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

    useEffect(() => {
        setIsMenuOpen(false)
    }, [location.pathname])

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
                <div style={styles.leftAction}>
                    <button
                        style={styles.hamburger}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M4 6H20M4 12H20M4 18H20" 
                                stroke="#2d3748" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>

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
        justifyContent: 'flex-start',
        height: '64px',
        padding: '0 1rem',
    },
    leftAction: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '64px',
    },
    hamburger: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        margin: 0,
        height: '64px',
        width: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: '0px',
        top: '0px',
        zIndex: 9999,
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
