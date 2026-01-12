import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import ToastContainer from './components/common/ToastContainer'
import ScrollToTop from './components/common/ScrollToTop'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import DashboardLayout from './components/layout/DashboardLayout'
import ClientLayout from './components/layout/ClientLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Pricing from './pages/Pricing'
import CreatorProfile from './pages/CreatorProfile'
import ProjectView from './pages/ProjectView'
import PublicProfile from './pages/PublicProfile'
import Dashboard from './pages/dashboard/Dashboard'
import Galleries from './pages/dashboard/Galleries'
import PublicProfileEdit from './pages/dashboard/PublicProfile'
import Chat from './pages/dashboard/Chat'
import Services from './pages/dashboard/Services'
import Settings from './pages/dashboard/Settings'
import Calendar from './pages/dashboard/Calendar'
import ClientDashboard from './pages/client/ClientDashboard'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <Router>
              <ScrollToTop />
        <Routes>
          {/* Public Routes with Header/Footer */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow pt-14">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/architect/:id" element={<CreatorProfile />} />
                    <Route path="/project/:id" element={<ProjectView />} />
                    <Route path="/portfolio/:username" element={<PublicProfile />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />

          {/* Dashboard Routes - Architect */}
          <Route
            path="/architect/*"
            element={
              <ProtectedRoute allowedRoles={['arquiteto']}>
                <DashboardLayout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projects" element={<Galleries />} />
                    <Route path="/profile" element={<PublicProfileEdit />} />
                    <Route path="/messages" element={<Chat />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Dashboard Routes - Client */}
          <Route
            path="/client/*"
            element={
              <ProtectedRoute allowedRoles={['cliente']}>
                <ClientLayout>
                  <Routes>
                    <Route path="/dashboard" element={<ClientDashboard />} />
                    <Route path="/projects" element={<div className="p-8 text-center text-stone-400">Meus Projetos (em desenvolvimento)</div>} />
                    <Route path="/favorites" element={<div className="p-8 text-center text-stone-400">Arquitetos Favoritos (em desenvolvimento)</div>} />
                    <Route path="/messages" element={<div className="p-8 text-center text-stone-400">Mensagens (em desenvolvimento)</div>} />
                    <Route path="/bookings" element={<div className="p-8 text-center text-stone-400">Agendamentos (em desenvolvimento)</div>} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </ClientLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
            </Router>
            <ToastContainer />
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
