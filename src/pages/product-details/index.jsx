import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import Footer from '../../components/ui/Footer';
import ShareModal from '../../components/ui/ShareModal';
import NutritionalInfoModal from '../../components/ui/NutritionalInfoModal';
import ProductReviewsSection from '../../components/ui/ProductReviewsSection';
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
        },
        guarantees: [
            { icon: "Shield", text: "75-Day Buyer Protection", detail: "Orders from All Item." },
            { icon: "Package", text: "Free Return", detail: "Pay with Multiple Cards" },
            { icon: "Truck", text: "Delivery within 3-5 Working Days", detail: "Pay with Multiple Cards" },
        ],
    };

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
        const whatsappUrl = `https://wa.me/11999999999?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const isFavorite = favoriteProducts.has(product?.id);
    const displayedPrice = product ? formatPrice(product.price) : '';
    const originalPrice = product?.originalPrice ? formatPrice(product.originalPrice) : null;

    if (loading || !product) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando produto...</p>
                </div>
            </div>
        );
    }

    const images = Array.isArray(product.images) ? product.images : [];

    return (
        <div className="min-h-screen bg-white flex flex-col font-body">
            <ResponsiveHeader />

            {/* Corrigido: Envolvendo tudo em uma div principal */}
            <div className="flex-1">
                {/* Main Content */}
                <main className="pt-20">
                    {/* Product Breadcrumb */}
                    <div className="container mx-auto px-4 py-4 md:py-8 text-sm text-gray-500">
                        <span className="cursor-pointer hover:underline" onClick={() => navigate('/home')}>Home</span>
                        <span className="mx-2">&gt;</span>
                        <span className="cursor-pointer hover:underline" onClick={() => navigate('/home-appliance')}>Home Appliance</span>
                        <span className="mx-2">&gt;</span>
                        <span className="text-gray-900 font-semibold">{product.name}</span>
                    </div>

                    <div className="container mx-auto px-4 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
                            {/* Main Content: Product Image and Thumbnails */}
                            <div className="flex flex-col">
                                {/* Product Image */}
                                <div className="relative aspect-square overflow-hidden rounded-lg group">
                                    <Image
                                        src={product.images[currentImageIndex]}
                                        alt={product.name}
                                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-white/50 pointer-events-none" />
                                </div>

                                {/* Thumbnails */}
                                <div className="flex space-x-2 mt-4 overflow-x-auto scrollbar-hide justify-center">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-colors duration-200 ${index === currentImageIndex ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                                        >
                                            <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar: Product Info and Seller Card */}
                            <div className="flex flex-col space-y-6">
                                {/* Product Info */}
                                <div className="space-y-4">
                                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                                    {/* Brand, Rating, Review */}
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <span className="font-semibold text-gray-500">Brand - </span>
                                        <span className="text-primary hover:underline cursor-pointer">{product.brand}</span>
                                        <span className="text-gray-400">•</span>
                                        <RatingStars rating={product.rating} className="text-yellow-400" />
                                        <span className="text-gray-500">({product.reviewCount} Review)</span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline space-x-2 py-2 pb-4 border-b">
                                        <span className="text-xl md:text-2xl font-black text-gray-900">{displayedPrice}</span>
                                        {originalPrice && (
                                            <span className="text-lg text-gray-400 line-through">{originalPrice}</span>
                                        )}
                                    </div>

                                    {/* Options: Storage, Size, Color, Quantity */}
                                    <div className="space-y-4">
                                        {/* Storage */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
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
                                                            ? 'border-primary bg-primary/10 text-primary'
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
                                            <div className="flex items-center justify-between mb-2">
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
                                                            ? 'border-primary bg-primary/10 text-primary'
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
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-gray-800">Color:</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {product.colors.map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setSelectedColor(color)}
                                                        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${selectedColor === color ? 'border-primary ring-2 ring-primary/50' : 'border-gray-300'
                                                            }`}
                                                    >
                                                        <span className="w-6 h-6 rounded-full" style={{ backgroundColor: color }}></span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div className="flex items-center space-x-3">
                                            <span className="font-medium text-gray-800">Quantity</span>
                                            <div className="flex items-center border border-gray-300 rounded-md">
                                                <button
                                                    onClick={() => handleQuantityChange('decrement')}
                                                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                                                >
                                                    <Icon name="Minus" size={16} />
                                                </button>
                                                <span className="w-8 text-center font-semibold text-lg">{quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange('increment')}
                                                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                                                >
                                                    <Icon name="Plus" size={16} />
                                                </button>
                                            </div>
                                            <span className="text-sm text-gray-500">({product.stock} Available)</span>
                                        </div>
                                    </div>

                                    {/* Seller Info Card */}
                                    <div className="p-4 border border-dashed rounded-lg mt-4">
                                        <h3 className="text-gray-900 mb-4 font-bold">Sold by</h3>
                                        <div className="flex items-center space-x-4 mb-4">
                                            <Avatar className="w-16 h-16">
                                                <AvatarImage src={product.vendor.avatar} alt={product.vendor.name} />
                                                <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">{product.vendor.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 flex items-center">{product.vendor.name} <Icon name="CheckCircle" className="ml-1 text-blue-500" /></h4>
                                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                    <RatingStars rating={product.vendor.rating} className="text-yellow-400" />
                                                    <span>({product.vendor.reviewCount} Review )</span>
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
                                                onClick={() => navigate(`/vendor/${product.vendor.id}`)}
                                            >
                                                <Icon name="Eye" size={16} className="mr-2 text-teal-600" /> View Store
                                            </Button>
                                        </div>
                                    </div>
                                </div>
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