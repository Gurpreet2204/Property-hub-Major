import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, []);

  return (
    <header className='bg-gradient-to-r from-red-950 via-blue-400 to-blue-800 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-extrabold text-lg sm:text-2xl flex flex-wrap text-white'>
            <span className='text-blue-600'>Property</span>
            <span className='text-white'>Hub</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className='bg-white p-3 rounded-lg flex items-center'
        >
          <input
            type='search'
            placeholder='Search...'
            className='bg-transparent text-gray-800 focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit' className='text-blue-950'>
            <FaSearch />
          </button>
        </form>
        <ul className='flex gap-4'>
          <li className='text-white hover:text-blue-800 transition duration-300'>
            <Link to='/'>Home</Link>
          </li>
          <li className='text-white hover:text-blue-800 transition duration-300'>
            <Link to='/Mortgage-calculator'>Mortgage Calculator</Link>
          </li>
          <li className='text-white hover:text-blue-800 transition duration-300'>
            <Link to='/Budget-Investor'>Budget Investor</Link>
          </li>
          <li className='text-white hover:text-blue-800 transition duration-300'>
            <Link to='/about'>About</Link>
          </li>
          <li className='text-white hover:text-blue-800 transition duration-300'>
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
      </div>
    </header>
  );
}
