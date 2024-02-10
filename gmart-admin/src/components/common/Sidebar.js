import React from 'react'
import $ from 'jquery'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Sidebar = function () {
    const menuList = [
        { name: 'Dashboard', link: '/', icon: 'tachometer' },
        { name: 'Users', link: '/users', icon: 'users' },
        { name: 'Categories', link: '/categories', icon: 'list' },
        { name: 'Products', link: '/products', icon: 'bars' },
        { name: 'Banners', link: '/banners', icon: 'picture-o' },
        { name: 'Orders', link: '/orders', icon: 'file-text-o' },
        { name: 'Privacy Policy', link: '/privacy', icon: 'lock' },
        { name: 'Terms & conditions', link: '/terms', icon: 'file-text' },
    ]
    const location = useLocation();
    
    return (
        <nav className="main-sidebar">
            <section className="sidebar">
                <div className="sidebar-header d-none d-lg-block">
                    <img src="/logo.png" alt="logo" className="header-logo d-block"></img>
                    <img src="/favicon.png" alt="logo" className="header-logo-small d-none"></img>
                </div>
                <div className="d-flex justify-content-end d-lg-none">
                    <span onClick={e => $('body').removeClass('sidebar-collapse')} className="pointer p-3">
                        <i className="fa fa-close fs-5 text-white" />
                    </span>
                </div>
                <ul className="sidebar-menu">
                    <li className="header">MENU</li>
                    {menuList.map((menu, index) => (
                        <li key={index}>
                            <Link to={menu.link} className={location?.pathname === menu.link ? 'active' : ''}>
                                <i className={`fa fa-${menu.icon} fs-6 p-2`}></i>
                                <span className="nav-text">{menu.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </nav>
    )
}

export default Sidebar
