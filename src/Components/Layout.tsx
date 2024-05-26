import { Outlet } from 'react-router-dom'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import React from 'react'
export function Layout () {
  return (
    <div>
      <Header />
        <Outlet />
      <Footer />
    </div>
  )
}
