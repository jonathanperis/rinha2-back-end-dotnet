import { useState, useCallback, useEffect } from 'react';
import { useScrollspy } from '@/hooks/useScrollspy';
import Sidebar, { type NavItem } from './Sidebar';

const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'challenge', label: 'Challenge' },
    { id: 'ci-cd-pipeline', label: 'CI/CD Pipeline' },
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'performance', label: 'Performance' },
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export default function DocPageIsland() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { activeSection } = useScrollspy(SECTION_IDS);
    const toggleMenu = useCallback(() => setMenuOpen((p) => !p), []);

    useEffect(() => {
        if (!searchQuery) {
            SECTION_IDS.forEach((id) => {
                document.getElementById(id)?.classList.remove('hidden-section');
            });
            return;
        }
        const q = searchQuery.toLowerCase();
        SECTION_IDS.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            const visible = el.textContent?.toLowerCase().includes(q) ?? true;
            el.classList.toggle('hidden-section', !visible);
        });
    }, [searchQuery]);

    return (
        <>
            <div className="mobile-header">
                <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
                    <span /><span /><span />
                </button>
                <div className="repo-title">rinha2-back-end-dotnet</div>
            </div>
            <div
                className={`overlay${menuOpen ? ' open' : ''}`}
                onClick={toggleMenu}
            />
            <Sidebar
                menuOpen={menuOpen}
                toggleMenu={toggleMenu}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                items={NAV_ITEMS}
                activeSection={activeSection}
            />
        </>
    );
}
