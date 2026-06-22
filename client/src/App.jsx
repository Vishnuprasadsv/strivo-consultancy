import React from 'react'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'

const App = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar/>
      {/* Main content will go here, using flex-grow to push footer down */}
      <main className="flex-grow">
      </main>
      <Footer/>
    </div>
  )
}

export default App