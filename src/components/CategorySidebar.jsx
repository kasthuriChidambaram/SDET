import React from 'react'

function CategorySidebar({ category, subcategories, selectedSubcategory, setSelectedSubcategory }) {
  const styles = {
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
    },
    selectedSubcategory: {
      backgroundColor: '#e2e8f0',
      color: '#2d3748',
      fontWeight: '500',
    },
  }

  return (
    <div style={styles.sidebar} className="category-sidebar">
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
  )
}

export default CategorySidebar 