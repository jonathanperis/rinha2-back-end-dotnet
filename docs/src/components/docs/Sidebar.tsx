export interface NavItem {
    id: string;
    label: string;
}

interface SidebarProps {
    menuOpen: boolean;
    toggleMenu: () => void;
    searchQuery: string;
    onSearchChange: (v: string) => void;
    items: NavItem[];
    activeSection: string;
}

export default function Sidebar({
    menuOpen,
    toggleMenu,
    searchQuery,
    onSearchChange,
    items,
    activeSection,
}: SidebarProps) {
    const base = (import.meta.env?.BASE_URL ?? '').replace(/\/$/, '');
    return (
        <aside className={`sidebar${menuOpen ? ' open' : ''}`}>
            <div className="sidebar-header">
                <h1 className="repo-title">rinha2-back-end-dotnet</h1>
                <p className="repo-description">
                    .NET 9 Native AOT implementation of Rinha de Backend 2024/Q1 — fictional bank API built
                    for performance under constraints
                </p>
                <input
                    type="text"
                    className="search-box"
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className="sidebar-nav-container">
                <ul>
                    {items.map((item) => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                className={`nav-item${activeSection === item.id ? ' active' : ''}`}
                                onClick={() => {
                                    if (window.innerWidth <= 768) toggleMenu();
                                }}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="sidebar-footer">
                <a href={`${base}/`} className="back-home">← Back to home</a>
                <a
                    href="https://github.com/jonathanperis/rinha2-back-end-dotnet"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View on GitHub
                </a>
                <div>Built by Jonathan Peris</div>
            </div>
        </aside>
    );
}
