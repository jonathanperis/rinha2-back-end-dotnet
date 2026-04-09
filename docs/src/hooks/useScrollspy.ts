import { useState, useEffect } from 'react';

export function useScrollspy(sectionIds: string[]) {
    const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '');

    useEffect(() => {
        const sections = document.querySelectorAll<HTMLElement>('section.doc-section');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { root: null, rootMargin: '-80px 0px -60% 0px', threshold: 0 },
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const activeItem = document.querySelector('.nav-item.active');
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [activeSection]);

    return { activeSection };
}
