import SideHamBurger from "../utils/sideHamBurger"
import { logout } from "../assets/icons"
import { useNavigate } from "react-router-dom"
import { clearAuthToken } from "../utils/auth"
function Profile() {
    const navigate = useNavigate();
    const handleSignOut = () => {
        clearAuthToken();
        navigate("/login", { replace: true });
    }

    return (
        <main className="dashboard-shell">
            <SideHamBurger>
                <button type="button" className="sidebar-link sidebar-signout" onClick={handleSignOut} aria-label="Sign out">
                    <span className="sidebar-icon-wrap">
                        <img src={logout} alt="" className="sidebar-icon" />
                    </span>
                    <h3 className="sidebar-label">Sign out</h3>
                </button>
            </SideHamBurger>
            <section className="dashboard-content">
                <h1>Profile</h1>
            </section>
        </main>
    )
}

export default Profile