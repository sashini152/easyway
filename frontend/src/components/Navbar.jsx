import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
    UtensilsIcon, 
    MenuIcon, 
    XIcon, 
    Home, 
    ShoppingBag, 
    FileText, 
    Percent, 
    User, 
    LogOut,
    CalendarCheck,
    Heart,
    Star,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const dashboardPath = user ? {
        super_admin: '/admin',
        shop_admin: '/dashboard',
        canteen_admin: '/canteen-admin/dashboard',
        canteen_owner: '/canteen-owner/dashboard',
        student: '/canteens'
    }[user.role] : '/login';

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: Home, description: 'Back to homepage' },
        { name: 'Canteens', path: '/canteens', icon: ShoppingBag, description: 'Browse all canteens' },
        { name: 'Blog & News', path: '/blog', icon: FileText, description: 'Read articles and news' },
        { name: 'Offers', path: '/offers', icon: Percent, description: 'Special deals and promotions' },
        { name: 'Reserve Table', path: '/reservation', icon: CalendarCheck, description: 'Book your table' },
    ];

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/')
            return false;
        return location.pathname.startsWith(path);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-surface-0/80 backdrop-blur-md border-b border-surface-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-br from-brand-500 to-warm-500 p-2 rounded-xl text-white shadow-glow-orange group-hover:scale-105 transition-transform">
                            <UtensilsIcon size={20}/>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-surface-900">
                            SLIIT<span className="text-brand-500">Eats</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path} 
                                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-500 ${
                                    isActive(link.path) ? 'text-brand-500' : 'text-surface-600'
                                }`}
                                title={link.description}
                            >
                                <link.icon size={16} />
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-surface-100 px-3 py-1.5 rounded-lg">
                                    <User size={14} />
                                    <span className="text-sm font-medium text-surface-700">
                                        {user.name?.split(" ")[0]}
                                    </span>
                                </div>
                                <Link to={dashboardPath}>
                                    <Button className="bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:from-brand-600 hover:to-brand-500 shadow-soft px-4 py-2 text-sm">
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    onClick={handleLogout}
                                    className="bg-surface-100 text-surface-700 hover:bg-red-50 hover:text-red-600 px-4 py-2 text-sm"
                                >
                                    <LogOut size={14} className="mr-1" />
                                    Log out
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" className="text-surface-700 hover:bg-surface-100 px-3 py-1.5 text-sm">
                                        Log in
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button className="bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:from-brand-600 hover:to-brand-500 shadow-soft px-3 py-1.5 text-sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 text-surface-600 hover:text-brand-500 transition-colors" 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <XIcon size={24}/> : <MenuIcon size={24}/>}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{
                            opacity: 0,
                            height: 0,
                        }} 
                        animate={{
                            opacity: 1,
                            height: 'auto',
                        }} 
                        exit={{
                            opacity: 0,
                            height: 0,
                        }} 
                        className="md:hidden border-t border-surface-200 bg-surface-0 overflow-hidden"
                    >
                        <div className="px-4 py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    to={link.path} 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                                        isActive(link.path) ? 'bg-brand-50 text-brand-600' : 'text-surface-700 hover:bg-surface-50'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        isActive(link.path) ? 'bg-brand-100 text-brand-600' : 'bg-surface-100 text-surface-600'
                                    }`}>
                                        <link.icon size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{link.name}</div>
                                        <div className="text-xs text-surface-500">{link.description}</div>
                                    </div>
                                    <ChevronRight size={16} className="text-surface-400" />
                                </Link>
                            ))}
                            <div className="h-px bg-surface-200 my-2"/>
                            <div className="flex flex-col gap-3 px-4">
                                {user ? (
                                    <>
                                        <div className="bg-surface-50 p-4 rounded-xl border border-surface-200">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-surface-900">{user.name}</div>
                                                    <div className="text-sm text-surface-500">{user.email}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-surface-500">
                                                <span className="bg-brand-100 text-brand-700 px-2 py-1 rounded-full">
                                                    {user.role?.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <Link to={dashboardPath} onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:from-brand-600 hover:to-brand-500 shadow-soft px-5 py-2.5 text-base">
                                                Go to Dashboard
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            onClick={handleLogout}
                                            className="w-full bg-surface-100 text-surface-700 hover:bg-red-50 hover:text-red-600 px-5 py-2.5 text-base"
                                        >
                                            <LogOut size={16} className="mr-2" />
                                            Log out
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center mb-4">
                                            <div className="text-sm text-surface-600 mb-2">
                                                Join SLIIT Eats today!
                                            </div>
                                            <div className="text-xs text-surface-500">
                                                Reserve tables, order ahead, and enjoy delicious meals
                                            </div>
                                        </div>
                                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full bg-surface-0 text-surface-800 border-2 border-surface-200 hover:border-brand-500 hover:text-brand-600 px-5 py-2.5 text-base">
                                                Log in
                                            </Button>
                                        </Link>
                                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:from-brand-600 hover:to-brand-500 shadow-soft px-5 py-2.5 text-base">
                                                Sign Up
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
