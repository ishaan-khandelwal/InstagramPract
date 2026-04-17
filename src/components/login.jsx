import logo from '../assets/instagram-logo.svg'
import '../components/authentication.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { SideScreenContext } from './sideScreen.context'
import { getApiUrl } from '../utils/api'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { showSideScreen } = useContext(SideScreenContext)
    async function handleLogin(e) {
        e.preventDefault();

        const trimmedEmail = email.trim()
        const trimmedPassword = password.trim()

        if (!trimmedEmail || !trimmedPassword) {
            setError("Please fill all the fields.")
            return;
        }

        try {
            setError("")

            const res = await fetch(getApiUrl("/api/login"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: trimmedEmail,
                    password: trimmedPassword
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Login failed.")
                return;
            }

            console.log(data.message || "Login successful")
            setEmail("")
            setPassword("")
            navigate("/dashboard")
        } catch (fetchError) {
            console.error(fetchError)
            setError("Could not reach the server. Please try again.")
        }
    }
    return (
        <>
            {showSideScreen}
            <section className='auth'>
                <div className='auth-panel'>
                    <img src={logo} alt="Instagram logo" className='auth-logo' />

                    <div className='auth-copy'>
                        <h2>Welcome back</h2>
                        <p>Log in to check stories, messages, and your close friends updates.</p>
                    </div>

                    <form onSubmit={handleLogin}>

                        <input
                            type="email"
                            placeholder='email, or phone'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && <p className='form-error'>{error}</p>}

                        <button type="submit" className='primary-btn'>
                            Log in
                        </button>

                        <div className='form-row'>
                            <span></span>
                            <p>or</p>
                            <span></span>
                        </div>

                        <button
                            type="button"
                            className='secondary-btn'
                            onClick={() => navigate("/signup")}
                        >
                            Create new account
                        </button>

                    </form>

                    <p className='auth-footer'>
                        By continuing, you agree to our Terms, Privacy Policy, and Cookies Policy.
                    </p>
                </div>

                <div className='auth-glow'></div>
                <div className='auth-glow auth-glow-bottom'></div>
            </section>
        </>
    )
}

export default Login
