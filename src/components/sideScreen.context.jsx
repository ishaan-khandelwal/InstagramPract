import { useState, createContext } from "react";
import logo from '../assets/instagram-logo.svg'
import img from '../assets/image.png'
import { Outlet } from "react-router-dom";

const SideScreenContext = createContext()

function SideScreenProvider({ children }) {
    const [showSideScreen, setShowSideScreen] = useState(true)

    return (
        <SideScreenContext.Provider value={{ showSideScreen, setShowSideScreen }}>
            <div className='login-box'>
                {showSideScreen && (
                    <section className='dis'>
                        <img src={logo} alt="Instagram logo" className='logo' />
                        <h1>See everyday moments from your</h1>
                        <h3>close friends.</h3>
                        <img src={img} alt="Instagram close friends preview" className='img' />
                    </section>
                )}
                <Outlet />
                {children}
            </div>
        </SideScreenContext.Provider>
    )
}

export { SideScreenContext, SideScreenProvider }
