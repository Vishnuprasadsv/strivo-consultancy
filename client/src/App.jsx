import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Contact from './pages/Contact'
import Insight from './pages/Insight'
import Article from './pages/Article'
import Strategic from './pages/Strategic'
import Operations from './pages/Operations'
import Change from './pages/Change'
import Digital from './pages/Digital'
import Home from './pages/Home'


const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar/>
        {/* Main content will go here, using flex-grow to push footer down */}
        <main className="flex-grow">
          <Routes>
            <Route path="/home" element={<Home/>}/>
            <Route path="/" element={<div className="h-[50vh] flex items-center justify-center text-gray-500"><p>Click 'Get Started' to open the Contact Page.</p></div>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/insights" element={<Insight />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/strategic" element={<Strategic />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/change" element={<Change />} />
            <Route path="/digital" element={<Digital />} />
          </Routes>
        </main>
        <Footer/>
      </div>
    </BrowserRouter>
  )
}

export default App