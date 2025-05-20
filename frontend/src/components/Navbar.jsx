import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';
import { logout } from '../services/supabaseClient';
import pencilIcon from '../assets/pencil.svg';
function Navbar() {
  const { user, isAuthenticated } = useAuth();
   const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await logout();
    if (!error) {
      navigate('/login');
    }
  };

  return (
    <>    <div className="navbar bg-white shadow-sm">
      <div className="navbar-start">
  

        <Link to="/" className="text-xl font-bold text-transparent bg-clip-text   bg-gradient-to-r from-blue-700 to-fuchsia-500 ml-5"><img src={pencilIcon} alt="Edit" className="w-5 h-5 inline-block" />Blogify</Link>
      </div>   
    <div className="flex-none navbar-end">
      <ul className="menu menu-horizontal px-1 mr-11">
        <li><Link to="/"  className='font-bold'>Home</Link></li>
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost gap-1 normal-case">
              <div className="">
                <div className="bg-gradient-to-r from-blue-700 to-fuchsia-500 text-white rounded-full w-5">
                  <span>{user.email?.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><Link to="/my-posts" className="font-bold">My Posts</Link></li>
              <li><button onClick={handleSignOut} className="font-bold">Sign Out</button></li>
            </ul>
          </div>
        ) : (
          <li >
          <details>
            <summary>👤</summary>
            <ul className="bg-base-100 rounded-t-none p-2">
              <li><Link to="/login" className="font-bold">Login</Link></li>
              <li><Link to="/register" className="font-bold">Register</Link></li>
            </ul>
          </details>
        </li>
        )}
      </ul>
    </div>

    </div>

  </>

  );
}

export default Navbar;