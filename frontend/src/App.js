import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import toast, { Toaster } from 'react-hot-toast';
import MyPost from './pages/all_post/MyPost';


const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/home/*" element={<Home />} />
        <Route exact path="/mypost" element={<MyPost />} />
      </Routes>
    </>
  )
}

export default App
