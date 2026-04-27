import SideHamBurger from "../utils/sideHamBurger";
import "./dashboard.css";

const statusItems = ["You", "Meta", "Google", "Vite", "React"];

function Dashboard() {
    return (

        <main className="dashboard-shell">
            <SideHamBurger />
            <section className="dashboard-content">
                <div className="dashboard-placeholder">
                    <div className="dashboard-status">
                        {statusItems.map((name) => (
                            <button className="dashboard-status-item" type="button" key={name}>
                                <span className="dashboard-status-avatar">{name.slice(0, 1)}</span>
                                <span className="dashboard-status-name">{name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="dashboard-post">
                    <div className="dashboard-post-card">
                        <div className="dashboard-post-profile">
                            <div className="dashboard-post-profile-image">
                                G
                            </div>
                            <p className="dashboard-post-profile-name">Google</p>
                            <button className="dashboard-post-profile-options" type="button" aria-label="Post options">...</button>
                        </div>
                        <div className="dashboard-post-image">
                            <span>Post</span>
                        </div>
                        <div className="dashboard-post-footer">
                            <div className="dashboard-post-footer-icons">
                                <p>like</p>
                                <p>comment</p>
                                <p>share</p>
                            </div>
                            <div className="dashboard-post-footer-likes">
                                <p>30,000 likes</p>
                            </div>
                            <div className="dashboard-post-footer-caption">
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Dashboard
