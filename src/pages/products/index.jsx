import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import Footer from '../../components/ui/Footer';
import { RatingStars } from "../../components/ui/rating-stars";
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import { Button } from '../../components/ui/shadcn/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/shadcn/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/shadcn/select';
import { Search, ShoppingCart, User, Menu, Heart, Star, Eye, ArrowRight, Package, Truck, Shield, Headphones, Share, X, Copy, MessageCircle, Facebook, Twitter, Instagram } from 'lucide-react';

const ProductsPage = () => {
    const navigate = useNavigate();
    const categoriesRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [sortBy, setSortBy] = useState('relevance');
    const [activeCategory, setActiveCategory] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');
    const [favorites, setFavorites] = new useState(new Set());
    const [shareModalOpen, setShareModal] = useState(false);
    const [shareProduct, setShareProduct] = useState(null);

    const PRODUCTS_PER_PAGE = 20;

    const categories = [
        { id: 'all', label: 'Tudo', icon: 'Grid01', image: 'https://images.unsplash.com/photo-1543353071-873f1723fdde?w=400&h=400&fit=crop' },
        { id: 'proteinas', label: 'Proteínas', icon: 'Beef', image: 'https://images.unsplash.com/photo-1628191010214-d2e85923985a?q=80&w=1974&auto=format&fit=crop' },
        { id: 'itens-dia-a-dia', label: 'Itens dia a dia', icon: 'ShoppingBag01', image: 'https://images.unsplash.com/photo-1582268611958-b1181890c9b0?w=400&h=400&fit=crop' },
        { id: 'especialidades', label: 'Especialidades', icon: 'CookingPot', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop' },
        { id: 'suplementos', label: 'Suplementos', icon: 'Pill', image: 'https://images.unsplash.com/photo-1576092768241-118e65e64d8a?q=80&w=1974&auto=format&fit=crop' },
        { id: 'doces-chocolates', label: 'Doces e chocolates', icon: 'Cookie', image: 'https://images.unsplash.com/photo-1511388835266-2396e6d1c1a9?q=80&w=1974&auto=format&fit=crop' },
        { id: 'bebidas', label: 'Bebidas', icon: 'Coffee', image: 'https://images.unsplash.com/photo-1506459296658-ec379e49c951?q=80&w=1974&auto=format&fit=crop' },
        { id: 'snacks', label: 'Snacks', icon: 'Popcorn', image: 'https://images.unsplash.com/photo-1522209798437-12ac52e37452?q=80&w=1974&auto=format&fit=crop' },
        { id: 'congelados', label: 'Congelados', icon: 'Snowflake', image: 'https://images.unsplash.com/photo-1601007823521-0a6b7d7f7e2c?w=400&h=400&fit=crop' },
        { id: 'organicos', label: 'Orgânicos', icon: 'Leaf', image: 'https://images.unsplash.com/photo-1557876229-3c72b535d4d3?w=400&h=400&fit=crop' }
    ];

    const sortOptions = [
        { value: 'relevance', label: 'Relevância', icon: 'ArrowDownWideNarrow' },
        { value: 'price_low', label: 'Menor preço', icon: 'DollarSign' },
        { value: 'price_high', label: 'Maior preço', icon: 'DollarSign' },
        { value: 'rating', label: 'Melhor avaliados', icon: 'Star' },
        { value: 'distance', label: 'Mais próximos', icon: 'MapPin' },
        { value: 'newest', label: 'Mais recentes', icon: 'Clock' }
    ];

    const priceRanges = [
        { value: 'all', label: 'Todos os preços', min: 0, max: Infinity },
        { value: 'up-to-50', label: 'Até R$ 50', min: 0, max: 50 },
        { value: '50-to-150', label: 'R$ 50 a R$ 150', min: 50, max: 150 },
        { value: '150-to-300', label: 'R$ 150 a R$ 300', min: 150, max: 300 },
        { value: 'above-500', label: 'Mais de R$ 300', min: 300, max: Infinity }
    ];

    const mockProducts = [
        {
            id: 1,
            name: "Tomate Orgânico Premium",
            vendor: "Fazenda Verde Orgânicos",
            vendorId: 1,
            vendorDistance: 0.8,
            price: 8.50,
            originalPrice: 10.00,
            discount: 15,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
            rating: 4.8,
            reviewCount: 45,
            isOrganic: true,
            category: "itens-dia-a-dia",
            subCategories: ["Tudo", "Itens dia a dia", "Orgânicos"]
        },
        {
            id: 2,
            name: "Banana Prata Doce",
            vendor: "Sítio das Frutas",
            vendorId: 3,
            vendorDistance: 1.5,
            price: 6.90,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
            rating: 4.5,
            reviewCount: 34,
            isOrganic: false,
            category: "itens-dia-a-dia",
            subCategories: ["Tudo", "Itens dia a dia", "Frutas"]
        },
        {
            id: 3,
            name: "Whey Protein Concentrado",
            vendor: "SupleMax",
            vendorId: 2,
            vendorDistance: 1.2,
            price: 99.90,
            unit: "unidade",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
            rating: 4.6,
            reviewCount: 18,
            isOrganic: false,
            category: "suplementos",
            subCategories: ["Tudo", "Suplementos", "Proteínas"]
        },
        {
            id: 4,
            name: "Chocolate Amargo 70%",
            vendor: "Cacau & Cia",
            vendorId: 5,
            vendorDistance: 2.5,
            price: 15.50,
            originalPrice: 18.00,
            discount: 14,
            unit: "unidade",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
            rating: 4.7,
            reviewCount: 29,
            isOrganic: false,
            category: "doces-chocolates",
            subCategories: ["Tudo", "Doces e chocolates", "Gourmet"]
        },
        {
            id: 5,
            name: "Smoothie de Frutas Vermelhas",
            vendor: "Natural Refresh",
            vendorId: 6,
            vendorDistance: 1.8,
            price: 18.90,
            unit: "garrafa",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
            rating: 4.9,
            reviewCount: 15,
            isOrganic: false,
            category: "bebidas",
            subCategories: ["Tudo", "Bebidas", "Itens dia a dia"]
        },
        {
            id: 6,
            name: "Mix de Nuts e Frutas Secas",
            vendor: "A Granel",
            vendorId: 7,
            vendorDistance: 3.1,
            price: 24.50,
            unit: "pacote",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
            rating: 4.4,
            reviewCount: 41,
            isOrganic: false,
            category: "snacks",
            subCategories: ["Tudo", "Snacks", "Itens dia a dia"]
        },
        {
            id: 7,
            name: "Leite de Aveia Orgânico",
            vendor: "Verde Vida",
            vendorId: 8,
            vendorDistance: 2.2,
            price: 12.00,
            unit: "litro",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
            rating: 4.6,
            reviewCount: 22,
            isOrganic: true,
            category: "bebidas",
            subCategories: ["Tudo", "Bebidas", "Orgânicos"]
        },
        {
            id: 8,
            name: "Kombucha de Gengibre",
            vendor: "Mundo da Fermentação",
            vendorId: 1,
            vendorDistance: 0.8,
            price: 19.90,
            unit: "garrafa",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&auto=format&fit=crop",
            rating: 4.3,
            reviewCount: 8,
            isOrganic: true,
            category: "bebidas",
            subCategories: ["Tudo", "Bebidas", "Especialidades"]
        },
        {
            id: 9,
            name: "Barra de Proteína Vegana",
            vendor: "Vegan Power",
            vendorId: 5,
            vendorDistance: 2.5,
            price: 9.50,
            unit: "unidade",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
            rating: 4.8,
            reviewCount: 67,
            isOrganic: true,
            category: "suplementos",
            subCategories: ["Tudo", "Suplementos", "Proteínas", "Vegano"]
        },
        {
            id: 10,
            name: "Sashimi de Salmão Fresco",
            vendor: "Peixaria Japonesa",
            vendorId: 9,
            vendorDistance: 4.2,
            price: 55.00,
            unit: "porção",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
            rating: 4.7,
            reviewCount: 33,
            isOrganic: false,
            category: "especialidades",
            subCategories: ["Tudo", "Especialidades", "Proteínas"]
        },
        {
            id: 11,
            name: "Picanha Angus",
            vendor: "Açougue do Zé",
            vendorId: 10,
            vendorDistance: 1.1,
            price: 89.90,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
            rating: 4.9,
            reviewCount: 55,
            isOrganic: false,
            category: "proteinas",
            subCategories: ["Tudo", "Proteínas", "Carnes"]
        },
        {
            id: 12,
            name: "Peito de Frango",
            vendor: "Granja da Tia",
            vendorId: 11,
            vendorDistance: 2.4,
            price: 22.50,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
            rating: 4.6,
            reviewCount: 30,
            isOrganic: false,
            category: "proteinas",
            subCategories: ["Tudo", "Proteínas", "Carnes"]
        },
        {
            id: 13,
            name: "Sal Grosso com Alho",
            vendor: "Temperos Naturais",
            vendorId: 12,
            vendorDistance: 1.6,
            price: 12.00,
            unit: "unidade",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
            rating: 4.5,
            reviewCount: 19,
            isOrganic: false,
            category: "itens-dia-a-dia",
            subCategories: ["Tudo", "Itens dia a dia", "Condimentos"]
        },
        {
            id: 14,
            name: "Cebola Roxa",
            vendor: "Hortifruti da Esquina",
            vendorId: 13,
            vendorDistance: 0.9,
            price: 3.50,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1571771894-821ce9b6c11b08e?w=400&h=400&auto=format&fit=crop",
            rating: 4.4,
            reviewCount: 25,
            isOrganic: false,
            category: "itens-dia-a-dia",
            subCategories: ["Tudo", "Itens dia a dia", "Legumes"]
        },
        {
            id: 15,
            name: "Morango Orgânico",
            vendor: "Fazenda das Frutas",
            vendorId: 14,
            vendorDistance: 3.0,
            price: 15.00,
            unit: "bandeja",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
            rating: 4.9,
            reviewCount: 72,
            isOrganic: true,
            category: "itens-dia-a-dia",
            subCategories: ["Tudo", "Itens dia a dia", "Orgânicos"]
        }
    ];

    useEffect(() => {
        setProducts(mockProducts);
        setLoading(false);
    }, []);

    useEffect(() => {
        filterProducts();
    }, [activeCategory, sortBy, priceFilter]);

    // Função de rolagem para mover um card de cada vez
    const scrollCategories = (direction) => {
        if (categoriesRef.current) {
            // Obter a largura de um card incluindo o gap
            const cardElement = categoriesRef.current.querySelector('.category-card');
            if (!cardElement) return;

            const cardWidth = cardElement.offsetWidth;
            const gap = 24; // Corresponde a gap-6
            const scrollAmount = cardWidth + gap;

            categoriesRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const filterProducts = () => {
        let filtered = [...mockProducts];

        if (activeCategory !== 'all') {
            filtered = filtered.filter(product => product.category === activeCategory);
        }

        if (priceFilter !== 'all') {
            const range = priceRanges.find(r => r.value === priceFilter);
            if (range) {
                filtered = filtered.filter(product =>
                    product.price >= range.min &&
                    (range.max === Infinity ? true : product.price <= range.max)
                );
            }
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price_low':
                    return a.price - b.price;
                case 'price_high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'distance':
                    return a.vendorDistance - b.vendorDistance;
                case 'newest':
                case 'relevance':
                default:
                    return b.id - a.id;
            }
        });

        setFilteredProducts(filtered);
    };

    const loadMoreProducts = async () => {
        setLoadingMore(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setProducts(prevProducts => [...prevProducts, ...mockProducts.slice(prevProducts.length, prevProducts.length + PRODUCTS_PER_PAGE)]);
        setLoadingMore(false);
    };

    const handleProductCardClick = (product) => {
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
        setShareModal(true);
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const displayedProducts = filteredProducts.slice(0, PRODUCTS_PER_PAGE);
    const hasMoreToShow = displayedProducts.length < filteredProducts.length;

    const sortedDisplayedProducts = [...displayedProducts].sort((a, b) => {
        const aIsFavorite = favorites.has(a.id);
        const bIsFavorite = favorites.has(b.id);
        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;
        return 0;
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const getCategoryLabel = (id) => {
        const category = categories.find(c => c.id === id);
        return category ? category.label : 'Todos os Produtos';
    };

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

    const ProductCard = ({ product }) => {
        return (
            <div className="group cursor-pointer p-4 bg-white rounded-md border hover:shadow-lg transition-all duration-200" onClick={() => handleProductCardClick(product)}>
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

                <div>
                    <h3 className="font-semibold text-gray-800 text-md duration-200 hover:text-primary mb-2 line-clamp-1 group-hover:group-[.vendor-hover]:text-gray-800">
                        {product.name}
                    </h3>
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
                    <div className="flex items-center gap-1 mb-2">
                        <RatingStars rating={product.rating} className="text-yellow-400" />
                        <span className="text-xs font-body font-medium text-foreground ml-1">
                            {product.rating.toFixed(1)}
                        </span>
                    </div>
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
        );
    };

    const CategoryCard = ({ category, isActive, onClick }) => {
        return (
            // O card em si agora é flex-shrink-0 e tem uma largura e altura fixas para ser quadrado
            // A largura é calculada para que 6 caibam perfeitamente com os gaps no max-w-screen-xl (1280px)
            // 1280px - (6 * 24px gap) = 1280 - 144 = 1136px
            // 1136px / 6 cards = ~189.33px por card. Arredondamos para 180px para ter um controle melhor e um gap maior.
            // A altura é definida como `aspect-square` para garantir que seja sempre quadrado.
            <div
                className={`category-card flex-shrink-0 w-[180px] h-[180px] aspect-square flex flex-col items-center justify-center p-4 bg-white rounded-md border
                transition-all duration-200 transform
                ${isActive ? 'border-primary shadow-lg' : 'border-gray-200 hover:shadow-lg'}`}
                onClick={onClick}
            >
                {/* Imagem circular no topo do card */}
                <div className="relative w-[100px] h-[100px] flex-shrink-0 rounded-full overflow-hidden mb-3">
                    <Image
                        src={category.image}
                        alt={category.label}
                        className={`w-full h-full object-cover rounded-full
                            transition-transform duration-500
                            transform hover:scale-105`}
                    />
                    {isActive && (
                        <div className="absolute inset-0 rounded-full border-2 border-primary ring-2 ring-primary/30"></div>
                    )}
                </div>

                <div className="flex flex-col items-center text-center mt-auto"> {/* mt-auto para empurrar para baixo */}
                    <h3 className="font-semibold text-gray-800 text-md line-clamp-1 mb-1">
                        {category.label}
                    </h3>
                    <div className="text-xs font-semibold text-primary transition-colors hover:text-primary-dark flex items-center">
                        Ver Mais <ArrowRight size={12} className="inline ml-1" />
                    </div>
                </div>
            </div>
        );
    };

    const LoadingSkeleton = () => (
        <div className="bg-white rounded-md p-4 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-md mb-3" />
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-gray-200 rounded-full" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-6 bg-gray-200 rounded w-2/3" />
            </div>
        </div>
    );

    // Estados para controlar a visibilidade dos botões de navegação
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Função para verificar se a rolagem é possível e atualizar os estados dos botões
    const checkScrollability = () => {
        if (categoriesRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
        }
    };

    // Adiciona um event listener para rolagem e também verifica ao montar e redimensionar
    useEffect(() => {
        checkScrollability(); // Verifica na montagem do componente
        const currentRef = categoriesRef.current;
        currentRef.addEventListener('scroll', checkScrollability); // Verifica na rolagem

        // Verifica também em redimensionamentos de tela
        window.addEventListener('resize', checkScrollability);

        return () => {
            currentRef.removeEventListener('scroll', checkScrollability);
            window.removeEventListener('resize', checkScrollability);
        };
    }, [categories]); // Dependência em categories para re-verificar se a lista de categorias muda

    return (
        <div className="min-h-screen bg-white">
            <ResponsiveHeader />

            <ShareModal
                product={shareProduct}
                isOpen={shareModalOpen}
                onClose={() => setShareModal(false)}
            />

            <main className="pt-20">
                {/* Categories Section */}
                <div className="container mx-auto px-4 pt-12">
                    <h2 className="text-xl font-semibold xl:text-2xl text-gray-900 mb-8">Navegue por Categoria</h2>

                    <div className="relative flex items-center justify-center"> {/* Centraliza o contêiner do carrossel */}
                        {/* Botão de rolagem para esquerda */}
                        <Button
                            onClick={() => scrollCategories('left')}
                            variant="ghost"
                            size="icon"
                            className={`z-10 h-10 w-10 p-0 absolute -left-12 hidden md:inline-flex bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white flex-shrink-0 transition-all duration-200 ${!canScrollLeft ? 'opacity-0 cursor-default pointer-events-none' : 'opacity-100'}`}
                            disabled={!canScrollLeft}
                        >
                            <Icon name="ChevronLeft" size={24} />
                        </Button>

                        {/* Contêiner dos Cards - Limitado para 6 cards e centralizado */}
                        {/* max-w-screen-xl (1280px) ou um valor fixo que acomode 6 cards de 180px + 5 gaps de 24px */}
                        {/* 6 * 180px = 1080px | 5 * 24px = 120px | Total = 1200px. */}
                        {/* Ajuste o max-w- para que 6 cards caibam exatamente com o gap. */}
                        <div className="w-full max-w-[1200px] overflow-hidden">
                            <div
                                ref={categoriesRef}
                                className="flex gap-6 overflow-x-scroll scrollbar-hide py-2 pb-6 justify-center" // justify-center para centralizar os cards se houver menos que 6
                            >
                                {categories.map((category) => (
                                    <CategoryCard
                                        key={category.id}
                                        category={category}
                                        isActive={activeCategory === category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Botão de rolagem para direita */}
                        <Button
                            onClick={() => scrollCategories('right')}
                            variant="ghost"
                            size="icon"
                            className={`z-10 h-10 w-10 p-0 absolute -right-12 hidden md:inline-flex bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white flex-shrink-0 transition-all duration-200 ${!canScrollRight ? 'opacity-0 cursor-default pointer-events-none' : 'opacity-100'}`}
                            disabled={!canScrollRight}
                        >
                            <Icon name="ChevronRight" size={24} />
                        </Button>
                    </div>
                </div>

                {/* Products Filters and Grid */}
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-6">
                        <div className="flex items-center gap-2">
                            <h1 className="text-[24px] font-bold text-gray-900">
                                {getCategoryLabel(activeCategory)}
                            </h1>
                            <span className="text-lg text-gray-600">
                                ({filteredProducts.length})
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <div className="w-full md:w-auto">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="rounded-md border-gray-300 h-9">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Icon name={"SwitchVertical01"} size={16} />
                                            <SelectValue placeholder="Ordenar por..." />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-md">
                                        {sortOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full md:w-auto">
                                <Select value={priceFilter} onValueChange={setPriceFilter}>
                                    <SelectTrigger className="rounded-md border-gray-300 h-9">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Icon name="CurrencyDollarCircle" size={16} />
                                            <SelectValue placeholder="Preço" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-md">
                                        {priceRanges.map((range) => (
                                            <SelectItem key={range.value} value={range.value}>
                                                {range.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="pb-10">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                                {[...Array(10)].map((_, index) => (
                                    <LoadingSkeleton key={index} />
                                ))}
                            </div>
                        ) : displayedProducts.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="max-w-md mx-auto">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Icon name="Package" size={24} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Nenhum produto encontrado
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Não encontramos produtos que correspondam aos seus critérios de busca.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Button
                                            onClick={() => {
                                                setActiveCategory('all');
                                                setPriceFilter('all');
                                            }}
                                            variant="outline"
                                            className="rounded-md px-8"
                                        >
                                            Limpar filtros
                                        </Button>
                                        <Button
                                            onClick={() => setActiveCategory('all')}
                                            className="rounded-md bg-green-500 hover:bg-green-600 px-8"
                                        >
                                            Ver todos os produtos
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                    {sortedDisplayedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {hasMoreToShow && (
                                    <div className="text-center mt-12">
                                        <Button
                                            onClick={loadMoreProducts}
                                            disabled={loadingMore}
                                            variant="outline"
                                            className="rounded-md px-8 py-3 border-gray-200 hover:border-green-500 hover:text-green-600"
                                        >
                                            {loadingMore ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                                                    <span>Carregando...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Icon name="Plus" size={16} />
                                                    <span>Carregar mais produtos</span>
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductsPage;