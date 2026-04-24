import { useEffect, useState } from 'react'
import SideHamBurger from '../utils/sideHamBurger'
import { getApiUrl } from '../utils/api'
import './messages.css'

function Messages() {
    const [users, setUsers] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch(getApiUrl('/api/users'))
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load users.")
                }

                setUsers(data.data || [])
            } catch (fetchError) {
                setError(fetchError.message || "Unable to load users.")
            }
        }

        getUsers()
    }, [])

    return (
        <main className="dashboard-shell">
            <SideHamBurger />
            <section className="messages-content">
                <aside className="messages-list" aria-label="Chats">
                    <div className="messages-header">
                        <h1>Messages</h1>
                        <p>{users.length ? `${users.length} conversations` : "No conversations yet"}</p>
                    </div>

                    {error ? <p className="messages-error">{error}</p> : null}

                    <div className="chat-list">
                        {users.map((item) => (
                            <button type="button" className="chat-row" key={item._id || item.email}>
                                <span className="chat-avatar">{item.username?.charAt(0)?.toUpperCase() || "U"}</span>
                                <span className="chat-copy">
                                    <strong>{item.username || "Unknown user"}</strong>
                                    <small>{item.email}</small>
                                </span>
                            </button>
                        ))}
                    </div>
                </aside>

                <section className="message-thread" aria-label="Selected chat">
                    <div className="thread-empty">
                        <h2>Select a chat</h2>
                        <p>Choose a conversation from the left to start messaging.</p>
                    </div>

                    <form className="message-composer">
                        <input type="text" placeholder="Send a message" />
                        <button type="submit">Send</button>
                    </form>
                </section>
            </section>
        </main>
    )
}

export default Messages
