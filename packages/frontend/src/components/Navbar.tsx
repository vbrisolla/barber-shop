import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import React from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [visible, setVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className={`bg-gray-900 text-white shadow-lg sticky top-0 z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <img src="/logo.png" alt="BSAR Barbearia" className="h-14 w-auto" />
            <span className="hover:text-brand-400 transition-colors text-sm">BSAR Barbearia</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              aria-label="Alternar tema"
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-brand-400 transition-colors text-sm">
                  Dashboard
                </Link>
                <Link to="/booking" className="hover:text-brand-400 transition-colors text-sm">
                  Agendar
                </Link>
                <Link to="/appointments" className="hover:text-brand-400 transition-colors text-sm">
                  Meus Agendamentos
                </Link>
                {isAdmin && (
                  <div className="flex items-center gap-3 border-l border-gray-700 pl-4">
                    <span className="text-xs text-gray-400">Admin:</span>
                    <Link to="/admin/appointments" className="hover:text-brand-400 transition-colors text-sm">
                      Agendamentos
                    </Link>
                    <Link to="/admin/services" className="hover:text-brand-400 transition-colors text-sm">
                      Serviços
                    </Link>
                    <Link to="/admin/barbers" className="hover:text-brand-400 transition-colors text-sm">
                      Barbeiros
                    </Link>
                  </div>
                )}
                <div className="flex items-center gap-3 border-l border-gray-700 pl-4">
                  <span className="text-sm text-gray-300">{user.name}</span>
                  <button onClick={handleLogout} className="text-sm hover:text-red-400 transition-colors">
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-brand-400 transition-colors text-sm">
                  Entrar
                </Link>
                <Link to="/register" className="btn-primary text-sm py-1.5">
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
