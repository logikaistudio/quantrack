import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    FileText,
    Send,
    Download,
    Settings,
    Menu,
    X,
    Shield,
    Plane
} from 'lucide-react'
import { useState, useEffect } from 'react'
import './Layout.css'


const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/pengajuan', icon: FileText, label: 'Pengajuan' },
    { path: '/pengiriman', icon: Send, label: 'Pengiriman' },
    { path: '/penerimaan', icon: Download, label: 'Penerimaan' },
    { path: '/pengaturan', icon: Settings, label: 'Pengaturan' },
]


function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const location = useLocation()

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false)
    }, [location.pathname])

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 769) {
                setIsSidebarOpen(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="layout">
            {/* Mobile Header */}
            <header className="mobile-header hide-desktop">
                <button
                    className="menu-btn"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-label="Toggle menu"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div className="mobile-logo">
                    <Shield size={24} className="logo-icon" />
                    <span className="logo-text">Sitrak</span>
                </div>
                <div className="header-spacer"></div>
            </header>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay hide-desktop"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="logo-container">
                            <Shield size={26} className="logo-icon" />
                        </div>
                        <div className="logo-content">
                            <h1 className="logo-title">Sitrak</h1>
                            <p className="logo-subtitle">
                                <Plane size={12} />
                                Sistim Tracking Karantina
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <span className="nav-section-title">Menu Utama</span>
                        <ul className="nav-list">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `nav-item ${isActive ? 'nav-item-active' : ''}`
                                        }
                                    >
                                        <item.icon size={20} className="nav-icon" />
                                        <span className="nav-label">{item.label}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-footer-content">
                        <div className="footer-avatar">
                            <span>BK</span>
                        </div>
                        <div className="footer-info">
                            <span className="footer-name">Badan Karantina</span>
                            <span className="footer-role">Administrator</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>

            {/* Bottom Navigation (Mobile) */}
            <nav className="bottom-nav hide-desktop">
                {navItems.slice(0, 5).map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`
                        }
                    >
                        <item.icon size={22} />
                        <span>{item.label.split(' ')[0]}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    )
}

export default Layout
