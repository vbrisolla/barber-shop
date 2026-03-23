import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BookingPage from './pages/BookingPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminBarbersPage from './pages/admin/AdminBarbersPage';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        <div>
          <img src="/logo.png" alt="BSAR Barbearia" className="h-12 w-auto mb-3" />
          <p className="text-sm text-gray-400">
            Premium Grooming & Style. O melhor corte da cidade, com agendamento online rápido e fácil.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Horário de Funcionamento</h3>
          <ul className="text-sm space-y-1 text-gray-400">
            <li>Segunda a Sexta: 09h às 19h</li>
            <li>Sábado: 09h às 18h</li>
            <li>Domingo: Fechado</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Localização</h3>
          <p className="text-sm text-gray-400 mb-2">
            Rua XV de Novembro, 542<br />
            Centro, Curitiba - PR<br />
            CEP: 80020-310
          </p>
          <a
            href="https://www.google.com/maps/search/Rua+XV+de+Novembro+542+Curitiba+PR"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 text-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Ver no Google Maps
          </a>
        </div>

      </div>

      <div className="max-w-6xl mx-auto border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} BSAR Barbearia. Todos os direitos reservados.
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking"
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <AppointmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/appointments"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <AdminAppointmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <AdminServicesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/barbers"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <AdminBarbersPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}