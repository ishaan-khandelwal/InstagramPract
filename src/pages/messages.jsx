import { useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import SideHamBurger from '../utils/sideHamBurger'
import { API_BASE_URL, getApiUrl } from '../utils/api'
import { getAuthToken } from '../utils/auth'
import './messages.css'

function Messages() {
    const authToken = useMemo(() => getAuthToken(), [])
    const [users, setUsers] = useState([])
    const [currentUserId, setCurrentUserId] = useState("")
    const [selectedUser, setSelectedUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [messageBody, setMessageBody] = useState("")
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [socketStatus, setSocketStatus] = useState("disconnected")
    const [error, setError] = useState(() => authToken ? "" : "Please log in to use messages.")
    const [sendError, setSendError] = useState("")
    const socketRef = useRef(null)
    const threadRef = useRef(null)
    const selectedUserRef = useRef(null)
    const currentUserIdRef = useRef("")

    useEffect(() => {
        selectedUserRef.current = selectedUser
    }, [selectedUser])

    useEffect(() => {
        currentUserIdRef.current = currentUserId
    }, [currentUserId])

    useEffect(() => {
        if (!authToken) {
            return
        }

        const socket = io(API_BASE_URL, {
            auth: { token: authToken },
            transports: ["websocket", "polling"]
        })

        socketRef.current = socket

        socket.on("connect", () => {
            setSocketStatus("connected")
        })

        socket.on("disconnect", () => {
            setSocketStatus("disconnected")
        })

        socket.on("connect_error", () => {
            setSocketStatus("disconnected")
            setError("Unable to connect to chat.")
        })

        socket.on("chat:message", (incomingMessage) => {
            setMessages((previousMessages) => {
                const activeUserId = selectedUserRef.current?._id
                const myUserId = currentUserIdRef.current
                const belongsToActiveChat = activeUserId && (
                    String(incomingMessage.sender) === String(activeUserId) ||
                    String(incomingMessage.recipient) === String(activeUserId)
                ) && (
                        String(incomingMessage.sender) === String(myUserId) ||
                        String(incomingMessage.recipient) === String(myUserId)
                    )

                if (!belongsToActiveChat) {
                    return previousMessages
                }

                const alreadyExists = previousMessages.some((item) => item._id === incomingMessage._id)

                if (alreadyExists) {
                    return previousMessages
                }

                return [...previousMessages, incomingMessage]
            })
        })

        return () => {
            socket.disconnect()
        }
    }, [authToken])

    useEffect(() => {
        const getUsers = async () => {
            try {
                const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined
                const [userResponse, usersResponse] = await Promise.all([
                    fetch(getApiUrl('/api/verify-token'), { headers }),
                    fetch(getApiUrl('/api/users'), { headers })
                ])
                const userData = await userResponse.json()
                const data = await usersResponse.json()

                if (!userResponse.ok) {
                    throw new Error(userData.message || "Please log in again.")
                }

                if (!usersResponse.ok) {
                    throw new Error(data.message || "Unable to load users.")
                }

                setCurrentUserId(userData.userId)
                setUsers((data.data || []).filter((item) => item._id !== userData.userId))
            } catch (fetchError) {
                setError(fetchError.message || "Unable to load users.")
            }
        }

        getUsers()
    }, [authToken])

    useEffect(() => {
        const getMessages = async () => {
            if (!selectedUser || !authToken) {
                return
            }

            setIsLoadingMessages(true)
            setSendError("")
            socketRef.current?.emit("chat:join", { recipientId: selectedUser._id })

            try {
                const response = await fetch(getApiUrl(`/api/messages/${selectedUser._id}`), {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                })
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load messages.")
                }

                setMessages(data.data || [])
            } catch (fetchError) {
                setSendError(fetchError.message || "Unable to load messages.")
            } finally {
                setIsLoadingMessages(false)
            }
        }

        getMessages()
    }, [authToken, selectedUser])

    useEffect(() => {
        threadRef.current?.scrollTo({
            top: threadRef.current.scrollHeight,
            behavior: "smooth"
        })
    }, [messages])

    const handleSendMessage = (event) => {
        event.preventDefault()

        if (!selectedUser || !messageBody.trim()) {
            return
        }

        setSendError("")
        socketRef.current?.emit(
            "chat:send",
            {
                recipientId: selectedUser._id,
                body: messageBody
            },
            (response) => {
                if (!response?.ok) {
                    setSendError(response?.message || "Unable to send message.")
                }
            }
        )
        setMessageBody("")
    }

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
                            <button
                                type="button"
                                className={`chat-row ${selectedUser?._id === item._id ? "is-active" : ""}`}
                                key={item._id || item.email}
                                onClick={() => setSelectedUser(item)}
                            >
                                <span className="chat-avatar">{item.username?.charAt(0)?.toUpperCase() || "U"}</span>
                                <span className="chat-copy">
                                    <strong>{item.username || "Unknown user"}</strong>
                                </span>
                            </button>
                        ))}
                    </div>
                </aside>

                <section className="message-thread" aria-label="Selected chat">
                    {selectedUser ? (
                        <>
                            <header className="thread-header">
                                <span className="chat-avatar">{selectedUser.username?.charAt(0)?.toUpperCase() || "U"}</span>
                                <span>
                                    <h2>{selectedUser.username || "Unknown user"}</h2>
                                    <p>{socketStatus === "connected" ? "Active now" : "Connecting..."}</p>
                                </span>
                            </header>

                            <div className="thread-messages" ref={threadRef}>
                                {isLoadingMessages ? <p className="thread-note">Loading messages...</p> : null}
                                {!isLoadingMessages && messages.length === 0 ? (
                                    <p className="thread-note">Start the conversation.</p>
                                ) : null}
                                {messages.map((message) => {
                                    const isMine = String(message.sender) === String(currentUserId)

                                    return (
                                        <article className={`message-bubble ${isMine ? "is-mine" : ""}`} key={message._id}>
                                            <p>{message.body}</p>
                                            <time dateTime={message.createdAt}>
                                                {new Date(message.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </time>
                                        </article>
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="thread-empty">
                            <h2>Select a chat</h2>
                            <p>Choose a conversation from the left to start messaging.</p>
                        </div>
                    )}

                    {sendError ? <p className="messages-error">{sendError}</p> : null}

                    <form className="message-composer" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder={selectedUser ? "Send a message" : "Select a chat first"}
                            value={messageBody}
                            onChange={(event) => setMessageBody(event.target.value)}
                            disabled={!selectedUser || socketStatus !== "connected"}
                        />
                        <button type="submit" disabled={!selectedUser || !messageBody.trim() || socketStatus !== "connected"}>
                            Send
                        </button>
                    </form>
                </section>
            </section>
        </main>
    )
}

export default Messages
