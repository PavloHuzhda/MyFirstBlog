import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import BlogList from './Components/BlogList'
import Home from './Components/Home';
import Register from './Components/Register';
import Login from './Components/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthProvider } from './Contexts/AuthContext';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';

const App: React.FC = () => {
  // const [count, setCount] = useState(0)

  return (
    
      <>
        <h1>My Blogs</h1>
        <AuthProvider>
            <Router>
                <Header />
                <div className='main-content'>
                    <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route path='/register' element={<Register />} />
                      <Route path='/login' element={<Login />} />
                      <Route 
                          path='/blogs' 
                          element={
                              <ProtectedRoute>
                                  <BlogList />
                              </ProtectedRoute>                  
                          } 
                      />
                    </Routes>
                </div>
                <Footer />
            </Router>
        </AuthProvider>
        </>
  )
}

export default App;
