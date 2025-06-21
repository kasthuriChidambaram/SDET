import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import MobileNavbar from './MobileNavbar'

function ResponsiveNavbar() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        // Check on mount
        checkScreenSize()

        // Add event listener for window resize
        window.addEventListener('resize', checkScreenSize)

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    return isMobile ? <MobileNavbar /> : <Navbar />
}

export default ResponsiveNavbar 