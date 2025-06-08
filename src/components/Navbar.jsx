import React, { useEffect, useState } from 'react'
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
            <div style={styles.logo}>SDET Interview Prep</div>
            <div style={styles.categories}>
                {categories.map(category => (
                    <a
                        key={category.id}
                        href={`/${category.slug}`}
                        style={styles.link}
                    >
                        {category.name}
                    </a>
                ))}
            </div>
        </nav>
    )
}

const styles = {
    nav: {
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginRight: '2rem'
    },
    categories: {
        display: 'flex',
        gap: '1.5rem'
    },
    link: {
        textDecoration: 'none',
        color: '#333',
        fontWeight: '500',
        padding: '0.5rem',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#e9ecef'
        }
    }
}

export default Navbar 