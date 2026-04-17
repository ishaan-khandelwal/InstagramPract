import logo from '../assets/instagram-logo.svg'
import '../components/authentication.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Signup() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    async function handleCreateAccount(e) {
        e.preventDefault();
        const trimmedUsername = username.trim()
        const trimmedEmail = email.trim()
        const trimmedPassword = password.trim()

        if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
            setError("Please fill all the fields.")
            return;
        }

        try {
            setIsSubmitting(true)
            setError("")

            const response = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: trimmedUsername,
                    email: trimmedEmail,
                    password: trimmedPassword
                })
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.message || "Unable to create account.")
                return;
            }

            setEmail("")
            setPassword("")
            setUsername("")
            navigate("/login")
        } catch (fetchError) {
            console.error(fetchError)
            setError("Could not reach the server. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className='auth'>
            <div className='auth-panel'>
                <img src={logo} alt="Instagram logo" className='auth-logo' />
                <div className='auth-copy'>
                    <h2>Create account</h2>
                    <p>Sign up to start sharing moments, following friends, and exploring your feed.</p>
                </div>
                <form onSubmit={handleCreateAccount}>
                    <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="email" placeholder='Email address' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <p className='form-error'>{error}</p>}
                    <button type="submit" className='primary-btn' disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create account"}
                    </button>
                    <div className='form-row'>
                        <span></span>
                        <p>or</p>
                        <span></span>
                    </div>
                    <button type="button" className='secondary-btn' onClick={() => navigate("/login")}>Back to login</button>
                </form>
            </div>
            <div className='auth-glow'></div>
            <div className='auth-glow auth-glow-bottom'></div>
        </section>
    )
}

export default Signup
