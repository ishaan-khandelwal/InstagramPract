import SideHamBurger from "../utils/sideHamBurger";
import "./dashboard.css";

function Dashboard() {
    return (
        <main className="dashboard-shell">
            <SideHamBurger />
            <section className="dashboard-content">
                <div className="dashboard-placeholder">
                    <h1>Welcome to your feed</h1>
                    <p>Select an option from the sidebar to open reels, messages, search, explore, notifications, create, or profile.</p>
                </div>
            </section>
        </main>
    )
}

export default Dashboard
