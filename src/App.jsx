import Login from "./components/login"
import Signup from "./components/signup"
import { SideScreenProvider } from "./components/sideScreen.context"
import Dashboard from "./components/dashboard"
import Reel from "./pages/reel"
import Messages from "./pages/messages"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { isAuthenticated } from "./utils/auth"
import Search from "./pages/search"
import Explore from "./pages/explore"
import Notification from "./pages/notification"
import Profile from "./pages/profile"

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children
}

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SideScreenProvider />}>
          <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        </Route>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/reel" element={<ProtectedRoute><Reel /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
