import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';

// Importando componentes do Shadcn UI
import { Button } from '../../components/ui/shadcn/button';
import { Input } from '../../components/ui/shadcn/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/shadcn/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../components/ui/shadcn/dropdown-menu';

const ResponsiveHeader = ({ className = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userAuth, setUserAuth] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const clientAuth = localStorage.getItem('clientAuth');
        const vendorAuth = localStorage.getItem('vendorAuth');
        if (clientAuth) {
            setUserAuth({ ...JSON.parse(clientAuth), type: 'client' });
        } else if (vendorAuth) {
            setUserAuth({ ...JSON.parse(vendorAuth), type: 'vendor' });
        }
    }, [location]);

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY || currentScrollY < 10) {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    controlNavbar();
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleLogoClick = () => {
        navigate('/consumer-home-search');
    };

    const handleLogout = () => {
        localStorage.removeItem('clientAuth');
        localStorage.removeItem('vendorAuth');
        setUserAuth(null);
        navigate('/consumer-home-search');
    };

    const handleProfileClick = () => {
        if (userAuth?.type === 'vendor') {
            navigate('/vendor-profile');
        } else {
            navigate('/client-profile');
        }
    };

    const getProfileImage = () => {
        if (userAuth?.profileImage) {
            return userAuth.profileImage;
        }
        return userAuth?.type === 'vendor'
            ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
            : 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face';
    };

    const getUserName = () => {
        return userAuth?.name || userAuth?.businessName || 'Usuário';
    };

    const getNavLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-body transition-colors duration-200 ${isActive
            ? 'text-foreground bg-muted shadow-sm font-semibold'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60 font-medium'
            }`;
    };

    return (
        <header
            className={`bg-white fixed top-0 left-0 right-0 z-50 transition-transform duration-200 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${className}`}
        >
            {/* Main Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-none0">
                        <Button onClick={handleLogoClick} variant="ghost" className="p-0 h-auto">
                            <Image src="/path-to-your-logotext.png" alt="PioMart" className="h-10" />
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl hidden md:block px-8">
                        <div className="relative flex w-full max-w-sm items-center">
                            <Input
                                type="text"
                                placeholder="Search in Product"
                                className="pl-12 pr-28 py-6 rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Icon name="Search" size={20} className="text-gray-400" />
                            </div>
                            <Button className="absolute right-0 top-0 h-full rounded-l-none bg-[#ff8000] hover:bg-[#ff8000]/90">
                                Search
                            </Button>
                        </div>
                    </div>

                    {/* Icons and Login */}
                    <div className="flex items-center space-x-4">
                        {/* Wishlist */}
                        <Button variant="ghost" className="relative p-2 h-10 w-10">
                            <Icon name="Heart" size={24} className="text-gray-600" />
                            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full ring-2 ring-white bg-[#ff8000]" />
                        </Button>

                        {/* Cart */}
                        <Button variant="ghost" className="relative p-2 h-10 w-10">
                            <Icon name="ShoppingBag" size={24} className="text-gray-600" />
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 rounded-full bg-[#ff8000] text-white text-xs font-bold items-center justify-center">
                                0
                            </span>
                        </Button>

                        {/* User Profile or Login */}
                        {userAuth ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-2 p-2 h-10">
                                        <Avatar className="w-9 h-9">
                                            <AvatarImage src={getProfileImage()} alt="Perfil" />
                                            <AvatarFallback>{userAuth.name?.[0] || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div className="hidden md:flex flex-col text-left leading-tight">
                                            <span className="text-xs font-medium text-gray-500">Hello,</span>
                                            <span className="text-sm font-semibold text-gray-900">{getUserName()}</span>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-60" align="end">
                                    <DropdownMenuLabel>
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage src={getProfileImage()} alt="Perfil" />
                                                <AvatarFallback>{userAuth.name?.[0] || 'U'}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{getUserName()}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{userAuth?.type || 'Usuário'}</p>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                                        <Icon name="User" size={18} className="mr-2 text-muted-foreground" />
                                        <span>Meu Perfil</span>
                                    </DropdownMenuItem>
                                    {userAuth?.type === 'vendor' && (
                                        <>
                                            <DropdownMenuItem onClick={() => navigate('/vendor-dashboard')} className="cursor-pointer">
                                                <Icon name="BarChart3" size={18} className="mr-2 text-muted-foreground" />
                                                <span>Dashboard</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate('/product-management')} className="cursor-pointer">
                                                <Icon name="Package" size={18} className="mr-2 text-muted-foreground" />
                                                <span>Gerenciar Produtos</span>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                                        <Icon name="LogOut" size={18} className="mr-2" />
                                        <span>Sair</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                onClick={() => navigate('/auth')}
                                variant="ghost"
                                className="flex items-center space-x-2 p-2 h-10"
                            >
                                <Icon name="User" size={24} className="text-gray-600" />
                                <div className="hidden md:flex flex-col text-left leading-tight">
                                    <span className="text-xs font-medium text-gray-500">Hello,</span>
                                    <span className="text-sm font-semibold text-gray-900">Login/Sign Up</span>
                                </div>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="bg-white border-b border-gray-200 hidden md:block">
                <div className="container mx-auto px-4 flex items-center space-x-6 h-12">
                    {/* Browse Categories button */}
                    <Button
                        className="flex items-center space-x-2 px-4 h-full bg-[#1e4a2c] text-white rounded-none rounded-b-md font-semibold text-sm hover:bg-[#1e4a2c]/90"
                    >
                        <Icon name="Menu" size={18} />
                        <span>Browse Categories</span>
                        <Icon name="ChevronDown" size={16} />
                    </Button>

                    {/* Navigation links */}
                    <nav className="flex items-center space-x-6">
                        <Button variant="ghost" className="p-0 h-auto text-sm font-medium text-gray-700 hover:text-gray-900">
                            Shop
                            <Icon name="ChevronDown" size={14} className="ml-1" />
                        </Button>
                        <Button variant="ghost" className="p-0 h-auto text-sm font-medium text-gray-700 hover:text-gray-900">
                            Supper Deals
                            <Icon name="ChevronDown" size={14} className="ml-1" />
                        </Button>
                        <Button variant="ghost" className="p-0 h-auto text-sm font-medium text-gray-700 hover:text-gray-900">
                            Find Store
                        </Button>
                        <Button variant="ghost" className="p-0 h-auto text-sm font-medium text-gray-700 hover:text-gray-900">
                            What's New
                            <Icon name="ChevronDown" size={14} className="ml-1" />
                        </Button>
                        <Button variant="ghost" className="p-0 h-auto text-sm font-medium text-orange-500 hover:text-orange-700">
                            <Icon name="Flame" size={16} className="mr-1" />
                            <span>Special Offer</span>
                        </Button>
                        <Button variant="ghost" className="p-0 h-auto text-sm font-medium text-gray-700 hover:text-gray-900">
                            Page
                            <Icon name="ChevronDown" size={14} className="ml-1" />
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default ResponsiveHeader;