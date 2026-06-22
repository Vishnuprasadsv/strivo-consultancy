import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Contact from './pages/Contact'

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar/>
        {/* Main content will go here, using flex-grow to push footer down */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<div className="h-[50vh] flex items-center justify-center text-gray-500"><p>Click 'Get Started' to open the Contact Page.</p></div>} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer/>
      </div>
    </BrowserRouter>
  )
}

export default App