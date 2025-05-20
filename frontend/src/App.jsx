import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './components/Auth/AuthContext';
// import Layout from './components/Layout/Layout';
// import Home from './pages/Home';
// import CreatePost from './pages/CreatePost';
// import EditPost from './pages/EditPost';
// import PostDetails from './pages/PostDetails';
// import ProtectedRoute from './components/Auth/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import PostList from './components/Posts/PostList';
import PostCreate from './pages/PostCreate'
import PostEdit from './pages/PostEdit'
import UserPosts from './pages/UserPosts'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginForm/>}/>
          <Route path="/register" element={<RegisterForm/>}/>
          <Route path="/" element={<PostList/>}/>
          <Route path="/create" element={<PostCreate/>}/>
          <Route path="/edit/:id" element={<PostEdit />} />
          <Route path="/my-posts" element={<UserPosts />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;