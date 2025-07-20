import React from 'react'
import NavBar from './NavBar'
import Footer from './Footer'

function RootLayout({children}) {
  return (
    <>
    <NavBar/>
{children}
    <Footer/>

    
    </>
  )
}

export default RootLayout