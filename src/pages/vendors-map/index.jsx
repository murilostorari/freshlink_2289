import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/shadcn/button';
import Input from '../../components/ui/shadcn/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/shadcn/select';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import Footer from '../../components/ui/Footer';
import LocationSelector from '../../components/ui/LocationSelector';

// Fix for default markers in react-leaflet
const L = window.L || {};
if (L.Icon) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

// Custom marker icons
const createCustomIcon = (vendor) => {
    const color = vendor.isOpen ? '#10B981' : '#EF4444';
    const svgIcon = `
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="3"/>
            <circle cx="16" cy="16" r="8" fill="white"/>
        </svg>
    `;

    return L.divIcon ? L.divIcon({
        html: svgIcon,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    }) : null;
};

// Component to handle map events
const MapController = ({ center }) => {
    const map = useMap();

    useEffect(() => {
        if (map && center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);

    return null;
};

const VendorsMap = () => {
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: -23.5505, lng: -46.6333 });
    const [userLocation, setUserLocation] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentLocation, setCurrentLocation] = useState({ id: 1, name: "São Paulo, SP", distance: "Atual" });
    const [sortBy, setSortBy] = useState('distance');
    const [activeCategory, setActiveCategory] = useState('all');
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [onlyOpen, setOnlyOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [favoriteVendors, setFavoriteVendors] = useState([]);

    const categoriesRef = useRef(null);
    const [showCategoryArrows, setShowCategoryArrows] = useState(false);

    const categories = [
        { id: 'all', label: 'Todos', icon: 'Grid3X3' },
        { id: 'organicos', label: 'Orgânicos', icon: 'Leaf' },
        { id: 'frutas', label: 'Frutas', icon: 'Apple' },
        { id: 'verduras', label: 'Verduras', icon: 'Carrot' },
        { id: 'legumes', label: 'Legumes', icon: 'Wheat' },
        { id: 'temperos', label: 'Temperos', icon: 'Flower2' },
        { id: 'laticinios', label: 'Laticínios', icon: 'Milk' },
        { id: 'carnes', label: 'Carnes', icon: 'Beef' }
    ];

    const sortOptions = [
        { value: 'distance', label: 'Mais próximos' },
        { value: 'rating', label: 'Melhor avaliados' },
        { value: 'name', label: 'Nome A-Z' },
        { value: 'products', label: 'Mais produtos' },
        { value: 'reviews', label: 'Mais avaliações' }
    ];

    const locationOptions = [
        { id: 1, name: 'São Paulo, SP', distance: 'Atual' },
        { id: 2, name: 'Rio de Janeiro, RJ', distance: '430km' },
        { id: 3, name: 'Belo Horizonte, MG', distance: '586km' },
        { id: 4, name: 'Salvador, BA', distance: '1448km' },
        { id: 5, name: 'Curitiba, PR', distance: '408km' }
    ];

    // Mock vendors data with coordinates
    const mockVendors = [
        {
            id: 1,
            name: "Fazenda Verde Orgânicos",
            image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop",
            rating: 4.8,
            reviewCount: 127,
            location: "Vila Madalena",
            address: "Rua Harmonia, 123 - Vila Madalena",
            coordinates: { lat: -23.5505, lng: -46.6333 },
            categories: ["Orgânicos", "Frutas", "Verduras"],
            isOpen: true,
            hours: "6:00 - 18:00",
            phone: "11987654321",
            productCount: 24,
            distance: 0.8,
            description: "Produtos orgânicos frescos direto da fazenda",
            category: "organicos",
            isSponsored: true
        },
        {
            id: 2,
            name: "Hortifruti do João",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
            rating: 4.6,
            reviewCount: 89,
            location: "Pinheiros",
            address: "Av. Faria Lima, 456 - Pinheiros",
            coordinates: { lat: -23.5629, lng: -46.6825 },
            categories: ["Frutas", "Verduras", "Legumes"],
            isOpen: true,
            hours: "7:00 - 19:00",
            phone: "11987654322",
            productCount: 18,
            distance: 1.2,
            description: "Tradição em qualidade há mais de 20 anos",
            category: "frutas",
            isSponsored: false
        },
        {
            id: 3,
            name: "Sítio das Frutas",
            image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop",
            rating: 4.9,
            reviewCount: 156,
            location: "Butantã",
            address: "Rua do Matão, 789 - Butantã",
            coordinates: { lat: -23.5732, lng: -46.7234 },
            categories: ["Frutas", "Sucos", "Polpas"],
            isOpen: false,
            hours: "8:00 - 17:00",
            phone: "11987654323",
            productCount: 32,
            distance: 2.5,
            description: "As melhores frutas da região com entrega rápida",
            category: "frutas",
            isSponsored: true
        },
        {
            id: 4,
            name: "Mercado da Terra",
            image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
            rating: 4.4,
            reviewCount: 73,
            location: "Perdizes",
            address: "Rua Cardoso de Almeida, 321 - Perdizes",
            coordinates: { lat: -23.5365, lng: -46.6731 },
            categories: ["Verduras", "Legumes", "Temperos"],
            isOpen: true,
            hours: "6:30 - 18:30",
            phone: "11987654324",
            productCount: 15,
            distance: 1.8,
            description: "Produtos frescos colhidos diariamente",
            category: "verduras",
            isSponsored: false
        },
        {
            id: 5,
            name: "Fazenda Orgânica São José",
            image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
            rating: 4.7,
            reviewCount: 112,
            location: "Lapa",
            address: "Rua Clélia, 654 - Lapa",
            coordinates: { lat: -23.5280, lng: -46.7042 },
            categories: ["Orgânicos", "Laticínios", "Ovos"],
            isOpen: true,
            hours: "7:00 - 17:00",
            phone: "11987654325",
            productCount: 28,
            distance: 3.1,
            description: "Fazenda familiar com certificação orgânica",
            category: "laticinios",
            isSponsored: false
        }
    ];

    // Header visibility tracking
    useEffect(() => {
        const controlHeader = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsHeaderVisible(false);
            } else if (currentScrollY < lastScrollY) {
                setIsHeaderVisible(true);
            }

            if (currentScrollY < 10) {
                setIsHeaderVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    controlHeader();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Check if category arrows are needed
    useEffect(() => {
        const checkCategoryOverflow = () => {
            if (categoriesRef.current) {
                const container = categoriesRef.current;
                const isOverflowing = container.scrollWidth > container.clientWidth;
                setShowCategoryArrows(isOverflowing);
            }
        };

        checkCategoryOverflow();
        window.addEventListener('resize', checkCategoryOverflow);
        return () => window.removeEventListener('resize', checkCategoryOverflow);
    }, []);

    useEffect(() => {
        loadVendors();
        const savedFavorites = JSON.parse(localStorage.getItem('favoriteVendors') || '[]');
        setFavoriteVendors(savedFavorites);
    }, []);

    useEffect(() => {
        filterAndSortVendors();
    }, [vendors, searchQuery, activeCategory, sortBy, onlyOpen]);

    const loadVendors = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVendors(mockVendors);
        setFilteredVendors(mockVendors);

        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    setMapCenter({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
        setLoading(false);
    };

    const filterAndSortVendors = () => {
        let filtered = [...vendors];

        // Search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(vendor =>
                vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vendor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vendor.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Category filter
        if (activeCategory !== 'all') {
            filtered = filtered.filter(vendor => vendor.category === activeCategory);
        }

        // Open filter
        if (onlyOpen) {
            filtered = filtered.filter(vendor => vendor.isOpen);
        }

        // Sort vendors
        filtered.sort((a, b) => {
            // Sponsored vendors first
            if (a.isSponsored && !b.isSponsored) return -1;
            if (!a.isSponsored && b.isSponsored) return 1;

            switch (sortBy) {
                case 'distance':
                    return a.distance - b.distance;
                case 'rating':
                    return b.rating - a.rating;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'products':
                    return b.productCount - a.productCount;
                case 'reviews':
                    return b.reviewCount - a.reviewCount;
                default:
                    return a.distance - b.distance;
            }
        });

        setFilteredVendors(filtered);
    };

    const handleVendorClick = (vendor) => {
        setSelectedVendor(vendor);
        setMapCenter(vendor.coordinates);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const handleLocationChange = (location) => {
        setCurrentLocation(location);
    };

    const handleWhatsAppContact = (vendor, e) => {
        e?.stopPropagation();
        const message = encodeURIComponent(`Olá ${vendor.name}! Vi seu perfil no FreshLink e gostaria de saber mais sobre seus produtos.`);
        const whatsappUrl = `https://wa.me/55${vendor.phone}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleVendorProfileClick = (vendor, e) => {
        e?.stopPropagation();
        window.open(`/perfil-vendedor/${vendor.id}`, '_blank');
    };

    const handleFavoriteToggle = (vendorId, e) => {
        e?.stopPropagation();
        const updatedFavorites = favoriteVendors.includes(vendorId)
            ? favoriteVendors.filter(id => id !== vendorId)
            : [...favoriteVendors, vendorId];

        setFavoriteVendors(updatedFavorites);
        localStorage.setItem('favoriteVendors', JSON.stringify(updatedFavorites));
    };

    const scrollCategories = (direction) => {
        if (categoriesRef.current) {
            const scrollAmount = 200;
            categoriesRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Icon key={i} name="Star" size={14} className="text-yellow-400 fill-current" />
            );
        }

        if (hasHalfStar && stars.length < 5) {
            stars.push(
                <Icon key="half" name="StarHalf" size={14} className="text-yellow-400 fill-current" />
            );
        }

        while (stars.length < 5) {
            stars.push(
                <Icon key={`empty-${stars.length}`} name="Star" size={14} className="text-gray-300" />
            );
        }

        return stars;
    };

    const LoadingSkeleton = () => (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden animate-pulse">
            <div className="p-4">
                <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 rounded-xl bg-gray-200 flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                        <div className="space-y-2">
                            <div className="h-5 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                        <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
                            ))}
                        </div>
                        <div className="flex space-x-2">
                            <div className="h-6 bg-gray-200 rounded w-16" />
                            <div className="h-6 bg-gray-200 rounded w-20" />
                        </div>
                        <div className="flex space-x-3 mt-4">
                            <div className="flex-1 h-10 bg-gray-200 rounded-xl" />
                            <div className="w-24 h-10 bg-gray-200 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const VendorCard = ({ vendor }) => {
        const [hoverImage, setHoverImage] = useState(false);
        const [hoverVendorName, setHoverVendorName] = useState(false);

        const imageScale = hoverImage && !hoverVendorName ? 'scale(1.05)' : 'scale(1)';
        const vendorNameColor = hoverVendorName ? '#3b82f6' : '#374151';

        return (
            <div
                className={`bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md hover:shadow-gray-900/10 transition-all duration-200 cursor-pointer group backdrop-blur-sm ${selectedVendor?.id === vendor.id ? 'ring-2 ring-primary shadow-lg shadow-primary/25' : ''
                    }`}
                onClick={() => handleVendorClick(vendor)}
            >
                <div className="p-4">
                    <div className="flex items-start space-x-4">
                        {/* Vendor Image */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
                            <Image
                                src={vendor.image}
                                alt={vendor.name}
                                className="w-full h-full object-cover transition-transform duration-200"
                                style={{ transform: imageScale }}
                                onMouseEnter={() => setHoverImage(true)}
                                onMouseLeave={() => setHoverImage(false)}
                            />
                            {/* Status badge */}
                            <div className={`absolute top-1.5 right-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${vendor.isOpen ? 'bg-green-500' : 'bg-red-500'
                                }`} />

                            {/* Sponsored badge */}
                            {vendor.isSponsored && (
                                <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                                    ★
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            {/* Vendor name and location */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3
                                        className="font-bold text-gray-900 text-base leading-tight mb-1 transition-colors duration-200 cursor-pointer line-clamp-1"
                                        style={{ color: vendorNameColor }}
                                        onMouseEnter={() => setHoverVendorName(true)}
                                        onMouseLeave={() => setHoverVendorName(false)}
                                    >
                                        {vendor.name}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <Icon name="MapPin" size={14} className="text-gray-400 flex-shrink-0" />
                                        <span className="text-sm text-gray-600 font-medium">{vendor.location}</span>
                                        <span className="text-sm font-bold text-primary">• {vendor.distance}km</span>
                                    </div>
                                </div>

                                <div className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${vendor.isOpen
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                    {vendor.isOpen ? 'Aberto' : 'Fechado'}
                                </div>
                            </div>

                            {/* Rating and products */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1">{renderStars(vendor.rating)}</div>
                                    <span className="text-sm font-bold text-gray-900">{vendor.rating.toFixed(1)}</span>
                                    <span className="text-xs text-gray-500 font-medium">({vendor.reviewCount})</span>
                                </div>
                                <span className="text-sm text-gray-600 font-medium">{vendor.productCount} produtos</span>
                            </div>

                            {/* Categories */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {vendor.categories.slice(0, 3).map((category, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium"
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-4 font-medium leading-relaxed line-clamp-2">{vendor.description}</p>

                            {/* Action buttons */}
                            <div className="flex space-x-3">
                                <Button
                                    onClick={(e) => handleVendorProfileClick(vendor, e)}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 rounded-xl font-medium"
                                >
                                    Ver Produtos
                                </Button>
                                <Button
                                    onClick={(e) => handleWhatsAppContact(vendor, e)}
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl flex items-center space-x-2"
                                >
                                    <Icon name="Phone" size={16} />
                                    <span>WhatsApp</span>
                                </Button>
                                <Button
                                    onClick={(e) => handleFavoriteToggle(vendor.id, e)}
                                    variant="outline"
                                    size="sm"
                                    className={`aspect-square p-0 w-10 h-10 rounded-xl transition-all duration-200 ${favoriteVendors.includes(vendor.id)
                                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                                        : 'border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200'
                                        }`}
                                >
                                    <Icon
                                        name="Star"
                                        size={16}
                                        className={favoriteVendors.includes(vendor.id) ? 'fill-current' : ''}
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const VendorGridCard = ({ vendor }) => {
        const [hoverImage, setHoverImage] = useState(false);

        return (
            <div
                className={`bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md hover:shadow-gray-900/10 transition-all duration-200 cursor-pointer group backdrop-blur-sm ${selectedVendor?.id === vendor.id ? 'ring-2 ring-primary shadow-lg shadow-primary/25' : ''
                    }`}
                onClick={() => handleVendorClick(vendor)}
            >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <Image
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover transition-transform duration-200"
                        style={{ transform: hoverImage ? 'scale(1.05)' : 'scale(1)' }}
                        onMouseEnter={() => setHoverImage(true)}
                        onMouseLeave={() => setHoverImage(false)}
                    />
                    <div className={`absolute top-3 right-3 w-3 h-3 rounded-full border-2 border-white shadow-sm ${vendor.isOpen ? 'bg-green-500' : 'bg-red-500'
                        }`} />

                    {/* Distance badge */}
                    <div className="absolute top-3 left-3 bg-accent text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                        {vendor.distance}km
                    </div>

                    {/* Sponsored badge */}
                    {vendor.isSponsored && (
                        <div className="absolute bottom-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                            Destaque
                        </div>
                    )}

                    {/* Status overlay */}
                    {!vendor.isOpen && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                            <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-4 py-2 rounded-full">
                                Fechado
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-1">
                        {vendor.name}
                    </h3>

                    <div className="flex items-center space-x-2 mb-2">
                        <Icon name="MapPin" size={12} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-600 font-medium">{vendor.location}</span>
                        <span className="text-xs font-bold text-primary">• {vendor.distance}km</span>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1">{renderStars(vendor.rating).slice(0, 5)}</div>
                        <span className="text-xs font-bold text-gray-900">{vendor.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-500 font-medium">({vendor.reviewCount})</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                        {vendor.categories.slice(0, 2).map((category, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium"
                            >
                                {category}
                            </span>
                        ))}
                    </div>

                    <div className="flex space-x-2">
                        <Button
                            onClick={(e) => handleVendorProfileClick(vendor, e)}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs rounded-xl"
                        >
                            Ver Produtos
                        </Button>
                        <Button
                            onClick={(e) => handleWhatsAppContact(vendor, e)}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                        >
                            <Icon name="Phone" size={14} />
                        </Button>
                        <Button
                            onClick={(e) => handleFavoriteToggle(vendor.id, e)}
                            variant="outline"
                            size="sm"
                            className={`w-9 h-9 rounded-xl border transition-all duration-200 flex items-center justify-center ${favoriteVendors.includes(vendor.id)
                                ? 'border-red-200 text-red-600 hover:bg-red-50'
                                : 'border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200'
                                }`}
                        >
                            <Icon name="Star" size={14} className={favoriteVendors.includes(vendor.id) ? 'fill-current' : ''} />
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
            <ResponsiveHeader />

            <main className="pt-16 flex-1">
                {/* Modern Fixed Search and Filter Bar */}
                <div className={`bg-white border-b border-gray-200/50 sticky z-40 transition-all duration-200 ease-in-out shadow-sm ${isHeaderVisible ? 'top-16' : 'top-0'
                    }`}>
                    <div className="container mx-auto px-4 py-4">
                        {/* Categories with modern styling */}
                        <div className="relative mb-4">
                            {showCategoryArrows && (
                                <button
                                    onClick={() => scrollCategories('left')}
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200"
                                >
                                    <Icon name="ChevronLeft" size={18} />
                                </button>
                            )}

                            <div
                                ref={categoriesRef}
                                className="flex space-x-3 overflow-x-auto scrollbar-hide pb-1"
                                style={{
                                    paddingLeft: showCategoryArrows ? '3rem' : '0',
                                    paddingRight: showCategoryArrows ? '3rem' : '0'
                                }}
                            >
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={`flex items-center space-x-3 px-6 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-sm hover:shadow-md border ${activeCategory === category.id
                                                ? 'bg-primary text-white border-primary shadow-primary/25 hover:shadow-primary/40'
                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-primary hover:border-primary/30 hover:shadow-lg'
                                            }`}
                                    >
                                        <Icon name={category.icon} size={18} />
                                        <span>{category.label}</span>
                                    </button>
                                ))}
                            </div>

                            {showCategoryArrows && (
                                <button
                                    onClick={() => scrollCategories('right')}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200"
                                >
                                    <Icon name="ChevronRight" size={18} />
                                </button>
                            )}
                        </div>

                        {/* Search and Filter controls with responsive design */}
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                            {/* Enhanced Search Bar */}
                            <div className="flex-1 lg:max-w-md">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Icon name="Search" size={20} />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Buscar vendedores frescos..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-12 pr-12 py-3 bg-white border-gray-200 rounded-2xl shadow-sm hover:shadow-md focus:shadow-md placeholder:text-gray-400"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={handleClearSearch}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
                                        >
                                            <Icon name="X" size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Filter Controls Container */}
                            <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
                                {/* Sort Select */}
                                <div className="min-w-[140px] lg:min-w-[190px] flex-1 lg:flex-none">
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="bg-white border-gray-200 rounded-2xl shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 py-3 font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Icon name="ArrowUpDown" size={18} className="text-primary" />
                                                <SelectValue placeholder="Ordenar por..." />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-xl">
                                            {sortOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                    className="py-3 px-8 hover:bg-gray-50 focus:bg-primary/10 focus:text-primary rounded-md transition-colors duration-200"
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Location Selector */}
                                <LocationSelector
                                    currentLocation={currentLocation}
                                    onLocationChange={handleLocationChange}
                                />

                                {/* View Mode Toggle */}
                                <div className="flex bg-white border border-gray-200 rounded-2xl p-1 shadow-sm hover:shadow-md transition-all duration-200">
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${viewMode === 'list'
                                                ? 'bg-primary text-white shadow-md'
                                                : 'text-gray-500 hover:text-primary hover:bg-primary/10'
                                            }`}
                                    >
                                        <Icon name="List" size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${viewMode === 'grid'
                                                ? 'bg-primary text-white shadow-md'
                                                : 'text-gray-500 hover:text-primary hover:bg-primary/10'
                                            }`}
                                    >
                                        <Icon name="Grid3X3" size={18} />
                                    </button>
                                </div>

                                {/* Only Open Filter */}
                                <Button
                                    onClick={() => setOnlyOpen(!onlyOpen)}
                                    variant={onlyOpen ? "default" : "outline"}
                                    size="sm"
                                    className={`flex items-center space-x-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${onlyOpen
                                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon name="Clock" size={18} />
                                    <span className="hidden sm:inline">Apenas abertos</span>
                                    <span className="sm:hidden">Abertos</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Vendors List/Grid */}
                        <div className="lg:col-span-2">
                            <div className="bg-white border border-gray-100 rounded-xl shadow-sm backdrop-blur-sm">
                                <div className="p-6">
                                    {/* Results header */}
                                    {!loading && (
                                        <div className="mb-8">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                                {activeCategory === 'all' ? 'Todos os Vendedores' : categories.find(c => c.id === activeCategory)?.label}
                                            </h2>
                                            <p className="text-gray-600 font-medium">
                                                {filteredVendors.length} {filteredVendors.length === 1 ? 'vendedor encontrado' : 'vendedores encontrados'}
                                                {searchQuery && <span className="text-primary"> para "{searchQuery}"</span>}
                                                {onlyOpen && <span className="text-green-600"> • Apenas abertos</span>}
                                            </p>
                                        </div>
                                    )}

                                    {/* Vendors List/Grid */}
                                    {loading ? (
                                        <div className={viewMode === 'grid'
                                            ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                                            : 'space-y-6'
                                        }>
                                            {[...Array(6)].map((_, index) => (
                                                <LoadingSkeleton key={index} />
                                            ))}
                                        </div>
                                    ) : filteredVendors.length === 0 ? (
                                        <div className="text-center py-20">
                                            <div className="max-w-md mx-auto">
                                                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                                    <Icon name="Store" size={32} className="text-gray-400" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                    Nenhum vendedor encontrado
                                                </h3>
                                                <p className="text-gray-600 mb-6 leading-relaxed font-medium">
                                                    Não encontramos vendedores que correspondam aos seus critérios de busca.
                                                    Tente ajustar os filtros ou expandir o raio de busca.
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                                    <Button
                                                        onClick={handleClearSearch}
                                                        variant="outline"
                                                        className="rounded-xl font-medium"
                                                    >
                                                        Limpar busca
                                                    </Button>
                                                    <Button
                                                        onClick={() => setActiveCategory('all')}
                                                        className="rounded-xl font-medium bg-primary hover:bg-primary/90"
                                                    >
                                                        Ver todos os vendedores
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={viewMode === 'grid'
                                            ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                                            : 'space-y-6'
                                        }>
                                            {filteredVendors.map((vendor) => (
                                                <div key={vendor.id}>
                                                    {viewMode === 'grid' ? (
                                                        <VendorGridCard vendor={vendor} />
                                                    ) : (
                                                        <VendorCard vendor={vendor} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Map Container */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden backdrop-blur-sm">
                                <div className="h-96 lg:h-[600px] relative">
                                    <MapContainer
                                        center={[mapCenter.lat, mapCenter.lng]}
                                        zoom={13}
                                        style={{ height: '100%', width: '100%' }}
                                        className="z-10 rounded-xl"
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                        <MapController center={[mapCenter.lat, mapCenter.lng]} />

                                        {/* User Location Marker */}
                                        {userLocation && L.divIcon && (
                                            <Marker
                                                position={[userLocation.lat, userLocation.lng]}
                                                icon={L.divIcon({
                                                    html: `
                                                        <div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                                                        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary/20 rounded-full animate-ping"></div>
                                                    `,
                                                    className: 'user-location-marker',
                                                    iconSize: [16, 16],
                                                    iconAnchor: [8, 8],
                                                })}
                                            >
                                                <Popup>
                                                    <div className="text-center p-2">
                                                        <div className="flex items-center space-x-2">
                                                            <Icon name="MapPin" size={16} className="text-primary" />
                                                            <span className="font-bold text-gray-900">Sua localização</span>
                                                        </div>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        )}

                                        {/* Vendor Markers */}
                                        {filteredVendors.map((vendor) => {
                                            const icon = createCustomIcon(vendor);
                                            return icon ? (
                                                <Marker
                                                    key={vendor.id}
                                                    position={[vendor.coordinates.lat, vendor.coordinates.lng]}
                                                    icon={icon}
                                                    eventHandlers={{
                                                        click: () => handleVendorClick(vendor),
                                                    }}
                                                >
                                                    <Popup>
                                                        <div className="p-3 min-w-72">
                                                            <div className="flex items-start space-x-3">
                                                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
                                                                    <Image
                                                                        src={vendor.image}
                                                                        alt={vendor.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="font-bold text-gray-900 text-base mb-1">
                                                                        {vendor.name}
                                                                    </h3>
                                                                    <div className="flex items-center space-x-2 mb-2">
                                                                        <Icon name="MapPin" size={12} className="text-gray-400 flex-shrink-0" />
                                                                        <span className="text-xs text-gray-600 font-medium">{vendor.location}</span>
                                                                        <span className="text-xs font-bold text-primary">• {vendor.distance}km</span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2 mb-2">
                                                                        <div className="flex items-center space-x-1">{renderStars(vendor.rating).slice(0, 5)}</div>
                                                                        <span className="text-xs font-bold text-gray-900">{vendor.rating.toFixed(1)}</span>
                                                                        <span className="text-xs text-gray-500 font-medium">({vendor.reviewCount})</span>
                                                                    </div>
                                                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-3 shadow-sm ${vendor.isOpen
                                                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                                                            : 'bg-red-50 text-red-700 border border-red-200'
                                                                        }`}>
                                                                        {vendor.isOpen ? 'Aberto' : 'Fechado'}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <p className="text-sm text-gray-600 mb-3 font-medium leading-relaxed">{vendor.description}</p>

                                                            <div className="flex space-x-2">
                                                                <Button
                                                                    onClick={(e) => handleVendorProfileClick(vendor, e)}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="flex-1 text-sm rounded-xl"
                                                                >
                                                                    Ver Produtos
                                                                </Button>
                                                                <Button
                                                                    onClick={(e) => handleWhatsAppContact(vendor, e)}
                                                                    size="sm"
                                                                    className="bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center space-x-1"
                                                                >
                                                                    <Icon name="Phone" size={14} />
                                                                    <span>WhatsApp</span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                            ) : null;
                                        })}
                                    </MapContainer>

                                    {/* Map Controls */}
                                    <div className="absolute top-4 right-4 z-20">
                                        <Button
                                            onClick={() => setMapCenter(userLocation || { lat: -23.5505, lng: -46.6333 })}
                                            variant="outline"
                                            size="sm"
                                            className="w-12 h-12 bg-white border border-gray-200 rounded-xl shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                                            title="Centralizar no meu local"
                                        >
                                            <Icon name="MapPin" size={20} className="text-primary" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Selected Vendor Details Bottom Bar */}
                    {selectedVendor && (
                        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 shadow-2xl z-40">
                            <div className="container mx-auto px-4 py-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
                                            <Image
                                                src={selectedVendor.image}
                                                alt={selectedVendor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">
                                                {selectedVendor.name}
                                            </h3>
                                            <div className="flex items-center space-x-3 text-sm text-gray-600 mb-1 font-medium">
                                                <div className="flex items-center space-x-1">
                                                    <Icon name="MapPin" size={14} />
                                                    <span>{selectedVendor.location}</span>
                                                </div>
                                                <span>•</span>
                                                <span className="font-bold text-primary">{selectedVendor.distance}km</span>
                                                <span>•</span>
                                                <span className={selectedVendor.isOpen ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                                    {selectedVendor.isOpen ? 'Aberto' : 'Fechado'}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center space-x-1">
                                                    {renderStars(selectedVendor.rating)}
                                                    <span className="text-sm font-bold text-gray-900 ml-1">{selectedVendor.rating.toFixed(1)}</span>
                                                    <span className="text-sm text-gray-500 font-medium">({selectedVendor.reviewCount} avaliações)</span>
                                                </div>
                                                <span className="text-sm text-gray-600 font-medium">• {selectedVendor.productCount} produtos</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Button
                                            onClick={(e) => handleVendorProfileClick(selectedVendor, e)}
                                            variant="outline"
                                            className="rounded-xl font-medium"
                                        >
                                            Ver Produtos
                                        </Button>
                                        <Button
                                            onClick={(e) => handleWhatsAppContact(selectedVendor, e)}
                                            className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl flex items-center space-x-2"
                                        >
                                            <Icon name="Phone" size={18} />
                                            <span>Contatar no WhatsApp</span>
                                        </Button>
                                        <Button
                                            onClick={() => setSelectedVendor(null)}
                                            variant="outline"
                                            size="sm"
                                            className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl"
                                        >
                                            <Icon name="X" size={18} className="text-gray-600" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default VendorsMap;