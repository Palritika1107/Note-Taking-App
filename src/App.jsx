import { useState } from 'react'
import './App.css'
import NoteForm from './components/NoteForm'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './components/Home'



function App() {


  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<NoteForm />} />
          </Routes>
        </BrowserRouter>
      
    </>
  )
}

export default App
