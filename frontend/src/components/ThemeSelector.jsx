import { useEffect, useState } from 'react';

export default function ThemeSelector() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('selectedTheme') || 'ocean';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('selectedTheme', theme);
    }, [theme]);

    const themes = [
        { id: 'ocean', name: 'Ocean' },
        { id: 'sunset', name: 'Sunset' },
        { id: 'forest', name: 'Forest' },
        { id: 'midnight', name: 'Midnight' },
    ];

    return (
        <div className="theme-selector-panel glass-panel">
            <h4>🎨 Themes</h4>
            <div className="theme-options">
                {themes.map((t) => (
                    <div
                        key={t.id}
                        className={`theme-dot ${t.id} ${theme === t.id ? 'active' : ''}`}
                        title={t.name}
                        onClick={() => setTheme(t.id)}
                    ></div>
                ))}
            </div>
        </div>
    );
}
