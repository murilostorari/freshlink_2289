import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import { Search, ShoppingCart, User, Menu, Heart, Star, Eye, ArrowRight, Package, Truck, Shield, Headphones, Share, X, Copy, MessageCircle, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '../../components/ui/shadcn/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/shadcn/avatar';
import Icon from '../../components/AppIcon';
import { RatingStars } from "../../components/ui/rating-stars";

const ConsumerHomeSearch = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState(new Set());
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareProduct, setShareProduct] = useState(null);

    const heroProducts = [
        {
            id: 1,
            name: "iPhone 16 Pro - 8/128GB",
            discount: 30,
            image: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1745925660/hero-sliders/notrn8jsgb1jfd0yfma2.png",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the"
        },
        {
            id: 2,
            name: "iPhone 16 Pro - 8/128GB",
            discount: 20,
            image: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1745925702/hero-sliders/calhxdo8l2s8fxgusail.png",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the"
        },
        {
            id: 3,
            name: "MacBook Air M1 chip, 8/256GB",
            discount: 29,
            image: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1745925532/hero-sliders/rqunuf3xfnayj7whsfaj.png",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at ipsum at risus euismod lobortis in"
        }
    ];

    const sideBanners = [
        {
            id: 1,
            title: "iPhone 16 Pro & 16 Pro Max",
            subtitle: "Get your desired phon from featured category",
            price: "$600",
            originalPrice: "$898",
            image: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1745922672/hero-banners/e6g6slkel5i7nfxt4pbv.png"
        },
        {
            id: 2,
            title: "Mackbook Pro M4",
            subtitle: "14-core CPU with 10 and 4 efficiency cores",
            price: "$600",
            originalPrice: "$699",
            image: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1745922631/hero-banners/v7bxpz6iiv9sg0shlbei.png"
        }
    ];

    const categories = [
        { name: "Laptop & PC", icon: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1740985505/categories/swuffjmk6doqfwfwfwfwfwfwqfwfwfwfwf fwqfwfwfwfqfwfwfwfwqfwfwfwfwfwfwfwfwfwfwfwfwqfwfwfwfwqfwfwfqfwfwfqfwfwqfwfqfqfwfqfqd qd.png" },
        { name: "Watches", icon: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1740985607/categories/meemu8n6yp0lyyzmsd6n.png" },
        { name: "Mobile & Tablets", icon: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1741162140/categories/qgjmrbh5fkv74rlealrm.png" },
        { name: "Health & Sports", icon: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1741162298/categories/crahtfaukrdujwa73enm.png" },
        { name: "Home Appliances", icon: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1741162332/categories/rnvnefwu4efmxvcp0nu7.png" },
        { name: "Games & Videos", icon: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1741162401/categories/pacp6ecrtdbmtrq9afnw.png" },
        { name: "Televisions", icon: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1741162446/categories/szon3y1gapmy2drdgo7l.png" },
    ];

    const newArrivals = [
        {
            id: 1,
            name: "Macbook Pro - 512/16GB",
            vendor: "Apple Store",
            vendorDistance: 2.1,
            price: 500,
            unit: "unidade",
            image: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1744194678/products/ulprc1ztllvgexgucrlo.png",
            rating: 4.8,
            reviewCount: 25
        },
        {
            id: 2,
            name: "Apple iMac M4 24-inch 2025",
            vendor: "Tech Solutions",
            vendorDistance: 1.5,
            price: 333,
            originalPrice: 555,
            discount: 40,
            unit: "unidade",
            image: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1747047333/products/wxr0bhxthtz0mxispkyj.png",
            rating: 4.6,
            reviewCount: 18
        },
        {
            id: 3,
            name: "Indoor Steel Adjustable Silent Treadmill Home Fitness",
            vendor: "Fitness Pro",
            vendorDistance: 3.2,
            price: 888,
            originalPrice: 999,
            discount: 11,
            unit: "unidade",
            image: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1744195188/products/xwboie8zzhmp3nrvagv3.png",
            rating: 4.3,
            reviewCount: 42
        },
        {
            id: 4,
            name: "iPhone 16 Pro - 8/128GB",
            vendor: "Mobile World",
            vendorDistance: 0.8,
            price: 600,
            originalPrice: 898,
            discount: 33,
            unit: "unidade",
            image: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1744188809/products/agkmo8qveetfbkt36m9v.png",
            rating: 4.9,
            reviewCount: 67
        },
        {
            id: 5,
            name: "MacBook Air M1 chip, 8/256GB",
            vendor: "Apple Store",
            vendorDistance: 2.1,
            price: 899,
            originalPrice: 930,
            discount: 3,
            unit: "unidade",
            image: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1746523401/products/mgfdvctipdrfxboyygqy.png",
            rating: 4.7,
            reviewCount: 33
        },
        {
            id: 6,
            name: "Rangs 43 Inch Frameless FHD Double Glass Android TV",
            vendor: "Electronics Hub",
            vendorDistance: 4.1,
            price: 700,
            originalPrice: 799,
            discount: 12,
            unit: "unidade",
            image: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1744195460/products/gchbhwtqnqy5dtdqqzwy.png",
            rating: 4.5,
            reviewCount: 29
        },
        {
            id: 7,
            name: "Portable Electric Grinder Maker",
            vendor: "Kitchen Pro",
            vendorDistance: 1.9,
            price: 777,
            originalPrice: 888,
            discount: 13,
            unit: "unidade",
            image: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1744195828/products/djwihdjeov0s09dg8qoh.png",
            rating: 4.4,
            reviewCount: 15
        },
        {
            id: 8,
            name: "MacBook Air M4 chip, 16/256GB",
            vendor: "Apple Store",
            vendorDistance: 2.1,
            price: 600,
            originalPrice: 699,
            discount: 14,
            unit: "unidade",
            image: "https://res.cloudinary.com/dc6svbdh9/image/upload/v1744193064/products/qcric0kigfnmqivgu5rv.png",
            rating: 4.8,
            reviewCount: 51
        }
    ];

    const testimonials = [
        {
            id: 1,
            text: "Lorem ipsum dolor sit amet, adipiscing elit. Donec malesuada justo vitaeaugue suscipit beautiful vehicula",
            name: "Davis Dorwart",
            title: "Serial Entrepreneur",
            image: "https://placehold.co/128x128/e9e9e9/333333?text=User+1"
        },
        {
            id: 2,
            text: "Lorem ipsum dolor sit amet, adipiscing elit. Donec malesuada justo vitaeaugue suscipit beautiful vehicula",
            name: "Wilson Dias",
            title: "Backend Developer",
            image: "https://placehold.co/128x128/e9e9e9/333333?text=User+2"
        },
        {
            id: 3,
            text: "Lorem ipsum dolor sit amet, adipiscing elit. Donec malesuada justo vitaeaugue suscipit beautiful vehicula",
            name: "Jane Smith",
            title: "Marketing Manager",
            image: "https://placehold.co/128x128/e9e9e9/333333?text=User+3"
        }
    ];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
        };
        loadData();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const handleProductClick = (product) => {
        navigate(`/product-details/${product.id}`, { state: { product } });
    };

    const handleVendorClick = (vendorId, e) => {
        e.stopPropagation();
        navigate(`/vendor/${vendorId}`);
    };

    const toggleFavorite = (productId, e) => {
        e.stopPropagation();
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(productId)) {
                newFavorites.delete(productId);
            } else {
                newFavorites.add(productId);
            }
            return newFavorites;
        });
    };

    const handleShare = (product, e) => {
        e.stopPropagation();
        setShareProduct(product);
        setShareModalOpen(true);
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            // Aqui você pode adicionar uma notificação de sucesso
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    // Ordenar produtos para mostrar favoritos primeiro
    const sortedNewArrivals = [...newArrivals].sort((a, b) => {
        const aIsFavorite = favorites.has(a.id);
        const bIsFavorite = favorites.has(b.id);
        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;
        return 0;
    });

    const ShareModal = ({ product, isOpen, onClose }) => {
        if (!isOpen || !product) return null;

        const shareUrl = `${window.location.origin}/product-details/${product.id}`;
        const shareText = `Confira este produto: ${product.name}`;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Compartilhar Produto</h3>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1">
                            <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                            <p className="text-xs text-gray-600">{formatPrice(product.price)}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => copyToClipboard(shareUrl)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                        >
                            <Copy size={20} className="text-gray-600" />
                            <span>Copiar Link</span>
                        </button>

                        <button
                            onClick={() => window.open(`whatsapp://send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                        >
                            <MessageCircle size={20} className="text-green-600" />
                            <span>WhatsApp</span>
                        </button>

                        <button
                            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                        >
                            <Facebook size={20} className="text-blue-600" />
                            <span>Facebook</span>
                        </button>

                        <button
                            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                        >
                            <Twitter size={20} className="text-blue-400" />
                            <span>Twitter</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans text-gray-800">
            <ResponsiveHeader />

            {/* Share Modal */}
            <ShareModal
                product={shareProduct}
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
            />

            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <section className="overflow-hidden pb-12 pt-40 bg-gray-100">
                    <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                            {/* Main Banner (No Swiper as it's an external library) */}
                            <div className="w-full xl:col-span-2">
                                <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-10">
                                    <div className="flex flex-col-reverse items-center pt-6 sm:pt-0 sm:flex-row">
                                        <div className="max-w-[394px] py-10 pl-4 sm:pl-7.5 lg:pl-12.5">
                                            <div className="flex items-center gap-4 mb-5">
                                                <span className="block font-semibold text-5xl sm:text-[58px] text-primary">{heroProducts[2].discount}%</span>
                                                <span className="block text-sm uppercase text-gray-800 sm:text-xl sm:leading-6">Sale<br />Off</span>
                                            </div>
                                            <h1 className="mb-3 text-xl font-semibold text-gray-800 sm:text-3xl">{heroProducts[2].name}</h1>
                                            <p className="text-base text-gray-600">{heroProducts[2].description}</p>
                                            <button className="inline-flex py-3 mt-10 font-medium text-white duration-200 ease-out rounded-lg text-sm bg-gray-800 px-9 hover:bg-gray-900">Shop Now</button>
                                        </div>
                                        <div>
                                            <img src={heroProducts[2].image} alt={heroProducts[2].name} className="w-full h-auto object-cover" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Side Banners */}
                            <div className="flex flex-col justify-between w-full gap-5 xl:col-span-1 sm:flex-row xl:flex-col">
                                {sideBanners.map(banner => (
                                    <div key={banner.id} className="relative w-full px-6 bg-white border rounded-2xl border-gray-200">
                                        <div className="flex items-center justify-between gap-5">
                                            <div className="w-1/2">
                                                <div className="pt-5 mb-10">
                                                    <h2 className="max-w-[153px] font-semibold text-gray-800 text-xl hover:text-primary">{banner.title}</h2>
                                                    <p className="text-sm text-gray-600">{banner.subtitle}</p>
                                                </div>
                                                <div className="pb-6">
                                                    <p className="font-medium text-gray-500 text-xs mb-1.5 uppercase">limited time offer</p>
                                                    <span className="flex items-center gap-2.5">
                                                        <span className="font-bold text-lg text-gray-800">{banner.price}</span>
                                                        <span className="text-sm font-medium line-through text-gray-500">{banner.originalPrice}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-1/2">
                                                <img src={banner.image} alt={banner.title} className="w-full h-auto" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="overflow-hidden pt-17.5">
                    <div className="w-full px-4 pb-16 mx-auto border-b max-w-7xl sm:px-8 xl:px-0 ">
                        <div className="flex items-center justify-between mb-16">
                            <div>
                                <h2 className="text-xl font-semibold xl:text-3xl text-gray-800">Browse by Category</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Navigation buttons (static, no functionality) */}
                                <button className="transition-opacity opacity-50 pointer-events-none p-2 rounded-full hover:bg-gray-200">
                                    <ArrowRight size={24} className="transform rotate-180" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-200">
                                    <ArrowRight size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {categories.map((category, index) => (
                                <button key={index} className="flex flex-col items-center group">
                                    <div className="w-[130px] h-[130px] bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                        <img src={category.icon} alt={category.name} className="w-20 h-20" />
                                    </div>
                                    <div className="flex justify-center">
                                        <h3 className="inline-block text-base font-medium text-center duration-500 text-gray-800 group-hover:text-primary">{category.name}</h3>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* New Arrivals Section */}
                <section className="overflow-hidden mt-8">
                    <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 xl:px-0">
                        <div className="flex items-center justify-between mb-7">
                            <div>
                                <h2 className="text-[24px] font-heading font-semibold text-foreground">New Arrivals</h2>
                            </div>
                            <Button variant="outline" className="font-medium text-sm py-2.5 px-7 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-800 hover:text-white">
                                View All
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            {sortedNewArrivals.map(product => (
                                <div key={product.id} className="group cursor-pointer p-4 bg-white border rounded-md hover:shadow-lg transition-all duration-200" onClick={() => handleProductClick(product)}>
                                    {/* Image Container - Square aspect ratio */}
                                    <div className="relative aspect-square overflow-hidden bg-muted rounded-md mb-3">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 group-hover:group-[.vendor-hover]:scale-100"
                                        />
                                        <div className={`absolute top-2 right-2 flex flex-col items-center gap-1 transition-opacity duration-200 ${favorites.has(product.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`h-8 w-8 rounded-full p-0 ${favorites.has(product.id) ? 'bg-primary text-white hover:bg-accent' : 'bg-white/70 text-foreground hover:bg-primary'}`}
                                                onClick={(e) => toggleFavorite(product.id, e)}
                                            >
                                                <Heart size={16} className={favorites.has(product.id) ? 'fill-current' : ''} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 rounded-full bg-white/70 text-foreground hover:bg-primary p-0"
                                                onClick={(e) => handleShare(product, e)}
                                            >
                                                <Share size={16} />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div>
                                        {/* Product Name */}
                                        <h3 className="font-semibold text-gray-800 text-md duration-200 hover:text-primary mb-2 line-clamp-1 group-hover:group-[.vendor-hover]:text-gray-800">
                                            {product.name}
                                        </h3>

                                        {/* Vendor */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={product.vendorAvatar} alt={product.vendor} />
                                                <AvatarFallback className="text-[8px]">{product.vendor.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex items-center gap-1 min-w-0 flex-1">
                                                <span
                                                    className="text-xs text-gray-500 line-clamp-1 font-semibold hover:text-primary cursor-pointer vendor-hover transition-all duration-200"
                                                    onClick={(e) => handleVendorClick(product.vendorId, e)}
                                                    onMouseEnter={(e) => e.currentTarget.closest('.group').classList.add('vendor-hover')}
                                                    onMouseLeave={(e) => e.currentTarget.closest('.group').classList.remove('vendor-hover')}
                                                >
                                                    {product.vendor}
                                                </span>
                                                <span className="text-xs text-gray-400">•</span>
                                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                                    {product.vendorDistance}km
                                                </span>
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center mb-2 gap-1 mb-4">
                                            <RatingStars rating={product.rating} className="text-yellow-400" />
                                            <span className="text-xs font-body font-medium text-foreground ml-1">
                                                {product.rating.toFixed(1)}
                                            </span>
                                        </div>

                                        {/* Price */}
                                        <div className="flex flex-col">
                                            {product.originalPrice && (
                                                <div className="flex items-center gap-1">
                                                    <span className="text-xs text-gray-400 line-through">
                                                        De: {formatPrice(product.originalPrice)}
                                                    </span>
                                                    {product.discount && (
                                                        <span className="text-[10px] font-body text-primary font-bold bg-secondary px-1 py-0.5 rounded-sm">
                                                            -{product.discount}%
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <span className="text-lg font-bold font-body text-gray-900">
                                                    {formatPrice(product.price)}
                                                </span>
                                                <span className="text-xs text-gray-500">/{product.unit}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-12.5">
                            <Button variant="outline" className="font-medium text-sm py-3 px-7 sm:px-12.5 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-800 hover:text-white">
                                View All
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Flash Sale Section */}
                <section className="py-20 overflow-hidden bg-gray-100">
                    <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
                        <div className="relative overflow-hidden z-1 rounded-2xl bg-white p-4 sm:p-7.5 lg:p-10 xl:p-15">
                            <div className="max-w-[422px] w-full">
                                <span className="block font-medium lg text-primary mb-2.5">Don't Miss!!</span>
                                <h2 className="mb-3 text-xl font-semibold text-gray-800 lg:text-3xl xl:text-4xl">Enhance Your Music Experience</h2>
                                <p className="text-base font-normal text-gray-600">MacBook Air M1 chip, 8/256GB</p>
                                <div className="flex flex-wrap gap-3 mt-6 sm:gap-6">
                                    <div>
                                        <span className="flex items-center justify-center w-16 h-16 px-4 mb-2 text-xl font-semibold bg-white rounded-lg lg:text-3xl text-gray-800 shadow-lg">06</span>
                                        <span className="block text-center text-sm text-gray-800">Days</span>
                                    </div>
                                    <div>
                                        <span className="flex items-center justify-center w-16 h-16 px-4 mb-2 text-xl font-semibold bg-white rounded-lg lg:text-3xl text-gray-800 shadow-lg">10</span>
                                        <span className="block text-center text-sm text-gray-800">Hours</span>
                                    </div>
                                    <div>
                                        <span className="flex items-center justify-center w-16 h-16 px-4 mb-2 text-xl font-semibold bg-white rounded-lg lg:text-3xl text-gray-800 shadow-lg">44</span>
                                        <span className="block text-center text-sm text-gray-800">Minutes</span>
                                    </div>
                                    <div>
                                        <span className="flex items-center justify-center w-16 h-16 px-4 mb-2 text-xl font-semibold bg-white rounded-lg lg:text-3xl text-gray-800 shadow-lg">38</span>
                                        <span className="block text-center text-sm text-gray-800">Seconds</span>
                                    </div>
                                </div>
                                <Button className="font-medium text-sm text-white bg-primary py-3 px-9 rounded-lg hover:bg-blue-700 mt-8">
                                    Check it Out!
                                </Button>
                            </div>
                            <img src="https://res.cloudinary.com/dc6svbdh9/image/upload/v1745827747/countdowns/cuw7ed2xsmuhjhfjyufk.png" alt="product" className="mx-auto mt-10 lg:mt-0 lg:absolute lg:block right-4 xl:right-26 bottom-4 xl:bottom-14" />
                        </div>
                    </div>
                </section>

                {/* User Feedbacks Section */}
                <section className="pb-[60px]">
                    <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 xl:px-0 ">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-xl font-semibold xl:text-3xl text-gray-800">User Feedbacks</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="transition-opacity opacity-50 pointer-events-none p-2 rounded-full hover:bg-gray-200">
                                    <ArrowRight size={24} className="transform rotate-180" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-200">
                                    <ArrowRight size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {testimonials.map(testimonial => (
                                <div key={testimonial.id} className="p-2 border rounded-2xl border-gray-200 bg-gray-50">
                                    <div className="bg-white rounded-xl py-7.5 px-4 sm:px-8.5">
                                        <div className="flex items-center gap-1 mb-5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={15} className="text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                        <p className="mb-6 text-gray-800">{testimonial.text}</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                                <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">{testimonial.name}</h3>
                                                <p className="text-sm text-gray-600">{testimonial.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="pb-[60px]">
                    <div className="px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
                        <div className="relative overflow-hidden z-1 rounded-xl bg-gray-200 py-11" style={{ backgroundImage: `url('https://res.cloudinary.com/dc6svbdh9/image/upload/v1745926520/shapes/newsletter-bg.jpg')`, backgroundSize: 'cover' }}>
                            <div className="absolute -z-10 max-w-[523px] max-h-[243px] w-full h-full right-0 top-0 bg-gradient-to-l from-gray-900 to-transparent opacity-50"></div>
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 px-4 sm:px-7.5 xl:pl-12.5 xl:pr-14">
                                <div className="max-w-[491px] w-full">
                                    <h2 className="max-w-[399px] text-white font-semibold text-lg sm:text-xl xl:text-3xl mb-3">Don't Miss Out Latest Trends & Offers</h2>
                                    <p className="text-white">Register to receive news about the latest offers & discount codes</p>
                                </div>
                                <div className="max-w-[477px] w-full">
                                    <form className="flex flex-col gap-4 sm:flex-row">
                                        <input id="email" placeholder="Enter your email" className="w-full px-5 py-3 border rounded-lg bg-gray-100 border-gray-300 outline-hidden placeholder:text-gray-500" type="email" name="email" />
                                        <Button type="submit" className="py-3 font-medium text-white rounded-lg px-7 bg-primary hover:bg-blue-700">
                                            Subscribe
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Badges */}
                <section className="pb-[60px]">
                    <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                        <div className="flex flex-wrap items-center justify-between gap-7.5 xl:gap-12.5">
                            <div className="flex items-center gap-4">
                                <Package className="w-10 h-10 text-gray-800" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Free Shipping</h3>
                                    <p className="text-sm text-gray-600">For all orders $200</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Truck className="w-10 h-10 text-gray-800" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">1 & 1 Returns</h3>
                                    <p className="text-sm text-gray-600">Cancellation after 1 day</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Shield className="w-10 h-10 text-gray-800" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">100% Secure Payments</h3>
                                    <p className="text-sm text-gray-600">Gurantee secure payments</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Headphones className="w-10 h-10 text-gray-800" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">24/7 Dedicated Support</h3>
                                    <p className="text-sm text-gray-600">Anywhere & anytime</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ConsumerHomeSearch;