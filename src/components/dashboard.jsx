import { Outlet } from "react-router-dom";
import SideHamBurger from "../utils/sideHamBurger";
import "./dashboard.css";

function Dashboard() {
    return (
        <main className="dashboard-shell">
            <SideHamBurger />
            <section className="dashboard-content">

            </section>
        </main>
    )
}

export default Dashboard
