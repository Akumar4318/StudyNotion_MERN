import React from 'react'
import {Routes,Route} from "react-router-dom"
import Home from './Pages/Home'
import './App.css'
import Navbar from './Components/common/Navbar'


const App = () => {
  return (
    
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <Navbar/>  
      <Routes>
      <Route path='/' element={<Home/>}></Route>

      </Routes>
    </div>
  )
}

export default App