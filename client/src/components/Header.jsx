import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-gray-900 text-white py-4">
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/' className='text-blue-800 font-extrabold text-lg sm:text-2xl flex items-center'>
          <span>Property</span>
          <span className='text-red-600'>Hub</span>
        </Link>
        <form
          onSubmit={handleSubmit}
          className='bg-gray-100 p-2 rounded-lg flex items-center'
        >
          <input
            type='search'
            placeholder='Search...'
            className='bg-transparent text-gray-800 focus:outline-none w-24 sm:w-64 px-2'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit' className='text-blue-800 px-2'>
            <FaSearch />
          </button>
        </form>
        <nav>
          <ul className='flex gap-4 text-white'>
            <li className='hover:text-blue-800 transition duration-300'>
              <Link to='/'>Home</Link>
            </li>
            <li className='hover:text-blue-800 transition duration-300'>
              <Link to='/Mortgage-calculator'>Mortgage Calculator</Link>
            </li>
            <li className='hover:text-blue-800 transition duration-300'>
              <Link to='/Budget-Investor'>Budget Investor</Link>
            </li>
            <li className='hover:text-blue-800 transition duration-300'>
              <Link to='/about'>About</Link>
            </li>
            <li className='hover:text-blue-800 transition duration-300'>
              <Link to='/profile'>
                {currentUser ? (
                  <img
                    className='rounded-full h-7 w-7 object-cover'
                    src={currentUser.avatar}
                    alt='profile'
                  />
                ) : (
                  'Sign in'
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}