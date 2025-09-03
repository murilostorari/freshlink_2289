import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import Footer from '../../components/ui/Footer';
import ShareModal from '../../components/ui/ShareModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import { RatingStars } from "../../components/ui/rating-stars";
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/shadcn/avatar';

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [product, setProduct] = useState(null);
    const [vendor, setVendor] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showShareModal, setShowShareModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [favoriteProducts, setFavoriteProducts] = useState(new Set());
    const [selectedColor, setSelectedColor] = useState('#0a0a0a');
    const [selectedSize, setSelectedSize] = useState('6.5"');
    const [selectedStorage, setSelectedStorage] = useState('128 GB');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    // Mock product data
    const mockProduct = {
        id: "amazfit-pop-3s",
        name: "Amazfit Pop 3s Smart Watch Dual-Band",
        brand: "Amazfit",
        rating: 4.8,
        reviewCount: "1.4K",
        price: 130.0,
        originalPrice: 160.0,
        discount: 20,
        images: [
            'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop',
            "https://images.unsplash.com/photo-1620000780183-5095039f60f6?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1620000780183-5095039f60f6?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1620000780183-5095039f60f6?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1620000780183-5095039f60f6?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1620000780183-5095039f60f6?q=80&w=1974&auto=format&fit=crop"
        ],
        colors: ["#0a0a0a", "#1d4ed8", "#f43f5e", "#f59e0b"],
        sizes: ['6.5"', '24.15"', '11.5"'],
        storage: ['256 GB', '128 GB', '64 GB'],
        stock: 966,
        sold: 40,
        totalSold: 100,
        countdown: '06:24:01',
        description: "For Samsung Galaxy S21 FE 5G 6.4 inch Phone PU Leather Case Shockproof Protective Wallet Card Slots Holders Kickstand Flip Folio Cover Brown Coffee",
        vendor: {
            id: 1,
            name: "Amazfit LTD",
            avatar: "https://images.unsplash.com/photo-1600001000000-00000000000?w=100&h=100",
            rating: 4.8,
            reviewCount: "1.4K",
            sellerRating: "90%",
            totalProducts: "10K+",
            chatResponse: "99%",
            phone: "11999999999"
        },
        guarantees: [
            { icon: "Shield", text: "75-Day Buyer Protection", detail: "Orders from All Item." },
            { icon: "Package", text: "Free Return", detail: "Pay with Multiple Cards" },
            { icon: "Truck", text: "Delivery within 3-5 Working Days", detail: "Pay with Multiple Cards" },
        ],
    };

    // Mock similar products
    const similarProducts = [
        {
            id: 2,
            name: "Wilson Ultra Power XL 112 Tennis Racket",
            vendor: "Motion View",
            price: 1899.00,
            originalPrice: 1994.05,
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop",
            rating: 4.5,
            reviewCount: 2,
            badge: "Sale"
        },
        {
            id: 3,
            name: "Wilson Ultra Power XL 112 Tennis Racket",
            vendor: "Motion View",
            price: 1899.00,
            originalPrice: 1994.05,
            image: "https://images.unsplash.com/photo-1620000780183-5095039f60f6?w=300&h=300&fit=crop",
            rating: 4.5,
            reviewCount: 2,
            badge: "Sale"
        },
        {
            id: 4,
            name: "Wilson Ultra Power XL 112 Tennis Racket",
            vendor: "Motion View",
            price: 1899.00,
            originalPrice: 1994.05,
            image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop",
            rating: 4.5,
            reviewCount: 2,
            badge: "Sale"
        },
        {
            id: 5,
            name: "Wilson Ultra Power XL 112 Tennis Racket",
            vendor: "Motion View",
            price: 1899.00,
            originalPrice: 1994.05,
            image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&h=300&fit=crop",
            rating: 4.5,
            reviewCount: 2,
            badge: "Sale"
        },
        {
            id: 6,
            name: "Wilson Ultra Power XL 112 Tennis Racket",
            vendor: "Motion View",
            price: 1899.00,
            originalPrice: 1994.05,
            image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
            rating: 4.5,
            reviewCount: 2,
            badge: "Sale"
        }
    ];

    useEffect(() => {
        setLoading(true);
        // Simulate API call
        const foundProduct = mockProduct;
        setProduct(foundProduct);
        setVendor(foundProduct.vendor);
        setLoading(false);

        const savedFavorites = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
        setFavoriteProducts(new Set(savedFavorites));
    }, [productId, location.state]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(price);
    };

    const handleFavoriteToggle = () => {
        const newFavorites = new Set(favoriteProducts);
        if (newFavorites.has(product.id)) {
            newFavorites.delete(product.id);
        } else {
            newFavorites.add(product.id);
        }
        setFavoriteProducts(newFavorites);
        localStorage.setItem('favoriteProducts', JSON.stringify(Array.from(newFavorites)));
    };

    const handleQuantityChange = (type) => {
        if (!product) return;
        if (type === 'increment') {
            setQuantity(prev => (prev < product.stock ? prev + 1 : prev));
        } else if (type === 'decrement') {
            setQuantity(prev => (prev > 1 ? prev - 1 : prev));
        }
    };

    const handleWhatsAppContact = () => {
        if (!product) return;
        const message = encodeURIComponent(`Hello! I'm interested in the product: ${product.name}. Is it available?`);
        const whatsappUrl = `https://wa.me/55${vendor?.phone}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: `Check out this product: ${product.name}`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const isFavorite = favoriteProducts.has(product?.id);
    const displayedPrice = product ? formatPrice(product.price) : '';
    const originalPrice = product?.originalPrice ? formatPrice(product.originalPrice) : null;

    if (loading || !product) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading product...</p>
                </div>
            </div>
        );
    }

    const images = Array.isArray(product.images) ? product.images : [];

    const tabs = [
        { id: 'description', label: 'Description' },
        { id: 'additional', label: 'Additional Information' },
        { id: 'reviews', label: `Reviews (${product.reviewCount})` },
        { id: 'shipping', label: 'Shipping Returns' }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col font-body">
            <ResponsiveHeader />

            <div className="flex-1">
                {/* Main Content */}
                <main className="pt-32">
                    {/* Product Breadcrumb */}
                    <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                            <Icon name="Home" size={16} />
                            <span className="cursor-pointer hover:underline" onClick={() => navigate('/consumer-home-search')}>Home</span>
                            <Icon name="ChevronRight" size={14} />
                            <span className="cursor-pointer hover:underline" onClick={() => navigate('/products')}>Home Appliance</span>
                            <Icon name="ChevronRight" size={14} />
                            <span className="text-gray-900 font-semibold">{product.name}</span>
                        </div>
                    </div>

                    {/* Flash Sale Banner */}
                    <div className="container mx-auto px-4 mb-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Icon name="Zap" size={20} className="text-red-500" />
                                <span className="text-red-600 font-semibold">Flash Sale 20% Discount</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">Ends in - 06:24:01</span>
                                <span className="text-sm text-gray-600">Sold On: 40/100</span>
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-4 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Left Column: Product Images */}
                            <div className="flex flex-col">
                                {/* Main Image */}
                                <div className="relative aspect-square overflow-hidden rounded-lg group mb-4">
                                    <Image
                                        src={product.images[currentImageIndex]}
                                        alt={product.name}
                                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 bg-gray-50"
                                    />
                                </div>

                                {/* Thumbnails */}
                                <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-colors duration-200 flex-shrink-0 ${index === currentImageIndex ? 'border-teal-600' : 'border-gray-300 hover:border-gray-400'}`}
                                        >
                                            <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column: Product Info */}
                            <div className="flex flex-col space-y-6">
                                {/* Product Title and Rating */}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
                                        {product.name}
                                    </h1>

                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Brand -</span>
                                            <span className="text-teal-600 hover:underline cursor-pointer font-semibold">{product.brand}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <RatingStars rating={product.rating} className="text-yellow-400" />
                                            <span className="text-sm text-gray-600">({product.reviewCount} Review)</span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline space-x-3 py-4 border-b border-gray-200">
                                        <span className="text-sm text-gray-500 line-through">{originalPrice}</span>
                                        <span className="text-3xl font-bold text-gray-900">{displayedPrice}</span>
                                    </div>
                                </div>

                                {/* Product Options */}
                                <div className="space-y-6">
                                    {/* Storage */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-medium text-gray-800">
                                                Storage: <span className="text-gray-500">{selectedStorage}</span>
                                            </span>
                                            <button className="text-sm text-gray-400 hover:underline">Clear</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {product.storage.map((storage) => (
                                                <button
                                                    key={storage}
                                                    onClick={() => setSelectedStorage(storage)}
                                                    className={`px-4 py-2 rounded-md border text-sm font-semibold transition-colors duration-200 ${selectedStorage === storage
                                                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                                                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {storage}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Size */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-medium text-gray-800">
                                                Size: <span className="text-gray-500">{selectedSize}</span>
                                            </span>
                                            <button className="text-sm text-gray-400 hover:underline">Clear</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {product.sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-4 py-2 rounded-md border text-sm font-semibold transition-colors duration-200 ${selectedSize === size
                                                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                                                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Color */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-medium text-gray-800">Color:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {product.colors.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${selectedColor === color ? 'border-teal-600 ring-2 ring-teal-200' : 'border-gray-300'
                                                        }`}
                                                >
                                                    <span className="w-6 h-6 rounded-full" style={{ backgroundColor: color }}></span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="flex items-center space-x-4">
                                        <span className="font-medium text-gray-800">Quantity</span>
                                        <div className="flex items-center border border-gray-300 rounded-md">
                                            <button
                                                onClick={() => handleQuantityChange('decrement')}
                                                className="p-3 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                                            >
                                                <Icon name="Minus" size={16} />
                                            </button>
                                            <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange('increment')}
                                                className="p-3 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                                            >
                                                <Icon name="Plus" size={16} />
                                            </button>
                                        </div>
                                        <span className="text-sm text-gray-500">({product.stock} Available)</span>
                                    </div>
                                </div>

                                {/* Seller Info Card */}
                                <div className="p-6 border border-dashed border-gray-300 rounded-lg">
                                    <h3 className="text-gray-900 mb-4 font-bold">Sold by</h3>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <Avatar className="w-16 h-16">
                                            <AvatarImage src={product.vendor.avatar} alt={product.vendor.name} />
                                            <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">{product.vendor.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 flex items-center">
                                                {product.vendor.name} 
                                                <Icon name="CheckCircle" className="ml-2 text-blue-500" size={16} />
                                            </h4>
                                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                <RatingStars rating={product.vendor.rating} className="text-yellow-400" />
                                                <span>({product.vendor.reviewCount} Review)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 text-center mb-4">
                                        <div>
                                            <span className="block font-bold text-gray-900 text-lg">{product.vendor.sellerRating}</span>
                                            <span className="block text-xs text-gray-500">Seller Ratings</span>
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gray-900 text-lg">{product.vendor.totalProducts}</span>
                                            <span className="block text-xs text-gray-500">Total Products</span>
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gray-900 text-lg">{product.vendor.chatResponse}</span>
                                            <span className="block text-xs text-gray-500">Chat Response</span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1 rounded-md py-2 border-gray-300 hover:bg-gray-100"
                                            onClick={handleWhatsAppContact}
                                        >
                                            <Icon name="MessageCircle" size={16} className="mr-2 text-teal-600" /> Live Chat
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 rounded-md py-2 border-gray-300 hover:bg-gray-100"
                                            onClick={() => navigate(`/vendor-profile-products`, { state: { vendorId: product.vendor.id } })}
                                        >
                                            <Icon name="Eye" size={16} className="mr-2 text-teal-600" /> View Store
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Details Tabs */}
                        <div className="mt-16">
                            {/* Tab Navigation */}
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                                activeTab === tab.id
                                                    ? 'border-teal-600 text-teal-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="py-8">
                                {activeTab === 'description' && (
                                    <div className="prose max-w-none">
                                        <p className="text-gray-600 leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>
                                )}
                                {activeTab === 'additional' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="font-medium text-gray-900">Brand:</span>
                                                <span className="ml-2 text-gray-600">{product.brand}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900">Model:</span>
                                                <span className="ml-2 text-gray-600">Pop 3s</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900">Connectivity:</span>
                                                <span className="ml-2 text-gray-600">Dual-Band</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900">Warranty:</span>
                                                <span className="ml-2 text-gray-600">1 Year</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'reviews' && (
                                    <div className="space-y-6">
                                        <div className="text-center py-8">
                                            <Icon name="MessageSquare" size={48} className="text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                                            <p className="text-gray-600">Be the first to review this product!</p>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'shipping' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {product.guarantees.map((guarantee, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <Icon name={guarantee.icon} size={24} className="text-teal-600 mt-1" />
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{guarantee.text}</h4>
                                                        <p className="text-sm text-gray-600">{guarantee.detail}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Similar Products Section */}
                        <div className="mt-16">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Products</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {similarProducts.map((similarProduct) => (
                                    <div key={similarProduct.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer">
                                        {/* Product Image */}
                                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                                            <Image
                                                src={similarProduct.image}
                                                alt={similarProduct.name}
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                                            />
                                            
                                            {/* Sale Badge */}
                                            {similarProduct.badge && (
                                                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                    {similarProduct.badge}
                                                </div>
                                            )}

                                            {/* Action Icons */}
                                            <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                                                    <Icon name="Heart" size={14} className="text-gray-600" />
                                                </button>
                                                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                                                    <Icon name="BarChart3" size={14} className="text-gray-600" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <div className="text-xs text-gray-500 mb-1">Home Appliance</div>
                                            <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                                                {similarProduct.name}
                                            </h3>
                                            
                                            <div className="flex items-center space-x-1 mb-2">
                                                <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                                                <span className="text-xs text-gray-600">{similarProduct.vendor}</span>
                                            </div>

                                            <div className="flex items-center space-x-2 mb-3">
                                                <span className="font-bold text-gray-900">{formatPrice(similarProduct.price)}</span>
                                                <span className="text-sm text-gray-500 line-through">{formatPrice(similarProduct.originalPrice)}</span>
                                            </div>

                                            <div className="flex items-center space-x-1 mb-3">
                                                <RatingStars rating={similarProduct.rating} className="text-yellow-400" />
                                                <span className="text-xs text-gray-600">({similarProduct.reviewCount})</span>
                                            </div>

                                            <Button
                                                onClick={() => navigate(`/product-details/${similarProduct.id}`)}
                                                className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md py-2 text-sm font-medium"
                                            >
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Carousel Dots */}
                            <div className="flex justify-center mt-8 space-x-2">
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer e modais */}
            <Footer />
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                product={product}
                type="product"
            />
        </div>
    );
};

export default ProductDetails;