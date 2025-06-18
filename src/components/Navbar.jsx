import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { categoryService } from '../services/categoryService'

function Navbar() {
    const [categories, setCategories] = useState([])
    const [error, setError] = useState(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    if (error) {
        return <div className="navbar-error">Error: {error}</div>
    }

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.logo}>SDET Interview Prep</Link>
            
            {/* Mobile Menu Button */}
            <button 
                style={styles.mobileMenuButton}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                <span style={styles.hamburgerLine}></span>
                <span style={styles.hamburgerLine}></span>
                <span style={styles.hamburgerLine}></span>
            </button>

            {/* Desktop Menu */}
            <div style={styles.categories}>
                {categories.map(category => (
                    <Link
                        key={category.id}
                        to={`/${category.slug}`}
                        style={styles.link}
                    >
                        {category.name}
                    </Link>
                ))}
            </div>

            {/* Mobile Menu */}
            <div style={{
                ...styles.mobileMenu,
                display: isMobileMenuOpen ? 'flex' : 'none'
            }}>
                {categories.map(category => (
                    <Link
                        key={category.id}
                        to={`/${category.slug}`}
                        style={styles.mobileLink}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {category.name}
                    </Link>
                ))}
            </div>
        </nav>
    )
}

const styles = {
    nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: '64px',
        '@media (max-width: 768px)': {
            padding: '1rem',
            height: 'auto',
            minHeight: '64px',
        },
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textDecoration: 'none',
        color: '#2d3748',
        '@media (max-width: 768px)': {
            fontSize: '1.2rem',
        },
    },
    categories: {
        display: 'flex',
        gap: '1.5rem',
        '@media (max-width: 768px)': {
            display: 'none',
        },
    },
    link: {
        textDecoration: 'none',
        color: '#4a5568',
        fontWeight: '500',
        padding: '0.5rem',
        borderRadius: '4px',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        ':hover': {
            backgroundColor: '#e2e8f0',
            color: '#2d3748',
        },
    },
    mobileMenuButton: {
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '30px',
        height: '30px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        '@media (max-width: 768px)': {
            display: 'flex',
        },
    },
    hamburgerLine: {
        width: '100%',
        height: '3px',
        backgroundColor: '#2d3748',
        borderRadius: '2px',
        transition: 'all 0.3s',
    },
    mobileMenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#f8f9fa',
        flexDirection: 'column',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderTop: '1px solid #e9ecef',
    },
    mobileLink: {
        textDecoration: 'none',
        color: '#4a5568',
        fontWeight: '500',
        padding: '1rem',
        borderRadius: '4px',
        transition: 'all 0.2s',
        borderBottom: '1px solid #e9ecef',
        ':hover': {
            backgroundColor: '#e2e8f0',
            color: '#2d3748',
        },
    },
}

export default Navbar 