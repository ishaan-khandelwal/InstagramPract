import Login from "./components/login"
import Signup from "./components/signup"
import { SideScreenProvider } from "./components/sideScreen.context"
import Dashboard from "./components/dashboard"
import Reel from "./pages/reel"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SideScreenProvider />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reel" element={<Reel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App