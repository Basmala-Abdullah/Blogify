import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './components/Auth/AuthContext';
import Navbar from './components/Navbar';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ResetPassword from './components/Auth/ResetPassword';
import PostList from './components/Posts/PostList';
import PostCreate from './pages/PostCreate'
import PostEdit from './pages/PostEdit'
import UserPosts from './pages/UserPosts'
import NotFound from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginForm/>}/>
          <Route path="/register" element={<RegisterForm/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>
          <Route path="/" element={<PostList/>}/>
          <Route path="/create" element={<PostCreate/>}/>
          <Route path="/edit/:id" element={<PostEdit />} />
          <Route path="/my-posts" element={<UserPosts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;