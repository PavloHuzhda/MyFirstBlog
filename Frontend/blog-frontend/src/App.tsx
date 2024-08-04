import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import BlogList from './Components/BlogList'
import Home from './Components/Home';

const App: React.FC = () => {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <div>
        <h1>My Blogs</h1>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path='/' element={<BlogList />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
