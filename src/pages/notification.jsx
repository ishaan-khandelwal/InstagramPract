import SideHamBurger from '../utils/sideHamBurger'

function Notification() {
    return (
        <main className="dashboard-shell">
            <SideHamBurger />
            <section className='dashboard-content'>
                <h1>Notifications</h1>
            </section>
        </main>
    )
}

export default Notification