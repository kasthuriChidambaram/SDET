import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { categoryService } from '../services/categoryService'

function Navbar() {
    const [categories, setCategories] = useState([])
    const [error, setError] = useState(null)

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

    if (error) {
        return <div className="navbar-error">Error: {error}</div>
    }

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.logo}>SDET Interview Prep</Link>
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
        </nav>
    )
}

const styles = {
    nav: {
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: '64px',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginRight: '2rem',
        textDecoration: 'none',
        color: '#2d3748',
    },
    categories: {
        display: 'flex',
        gap: '1.5rem',
    },
    link: {
        textDecoration: 'none',
        color: '#4a5568',
        fontWeight: '500',
        padding: '0.5rem',
        borderRadius: '4px',
        transition: 'all 0.2s',
        ':hover': {
            backgroundColor: '#e2e8f0',
            color: '#2d3748',
        },
    },
}

export default Navbar 