import React, { useEffect, useState } from 'react'
import SideHamBurger from '../utils/sideHamBurger'
import './messages.css'

function Messages() {
    const [user, setuser] = useState([])
    useEffect(() => {
        const getUsers = async () => {
            const response = await fetch('http://localhost:3000/api/users')
            const data = await response.json()
            setuser(data.data)
        }
        getUsers()
    }, [])
    console.log(user)
    return (
        <>
            <main>
                <SideHamBurger />
                <section className="messages-content">
                    <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: 'blue' }}>
                        <div style={{ width: '25%', backgroundColor: 'green' }}>
                            {user.map((user) => (
                                <div key={user._id} className='flex items-center space-x-4 p-2 rounded w-full hover:bg-slate-100 cursor-pointer '>
                                    <div className='bg-pink-400  text-white p-2 rounded-full flex items-center justify-center'>
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <p className='font-semibold text-sm'>{user.username}</p>
                                        <p className='text-sm text-slate-600'>Message</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ width: '75%', backgroundColor: 'red' }}>
                            chats
                        </div>
                    </div>
                </section>

            </main>
        </>
    )
}

export default Messages