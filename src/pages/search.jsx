import SideHamBurger from '../utils/sideHamBurger'

function Search() {
    return (
        <main className="dashboard-shell">
            <SideHamBurger />
            <section className="dashboard-content">
                <div className="search-bar">
                    <input type="text" placeholder="Search" />
                </div>
            </section>
        </main>
    )
}

export default Search