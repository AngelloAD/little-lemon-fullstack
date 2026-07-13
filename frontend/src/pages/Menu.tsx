import { useEffect, useState } from 'react';
import API from '../services/api';
import { useCart } from '../context/CartContext';

type CategoryKey = 'starters' | 'mains' | 'desserts' | 'drinks';

const CATEGORIES: Record<CategoryKey, string> = {
    starters: 'Entradas',
    mains: 'Platos principales',
    desserts: 'Postres',
    drinks: 'Bebidas',
};

interface MenuItem {
    id: number;
    name: string;
    price: string | number;
    description: string;
    category: string;
    image?: string;
}

const Menu = () => {
    const { addToCart } = useCart();

    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // Implementación moderna con async/await dentro de useEffect
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                // Hacemos la petición asíncrona esperando la respuesta de forma secuencial
                const res = await API.get<MenuItem[]>('menu/');
                setMenu(res.data);
            } catch (err) {
                console.error('Error al cargar el menú:', err);
            } finally {
                // Se ejecuta siempre, garantizando que el loader desaparezca
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const filtered: MenuItem[] =
        activeCategory === 'all'
            ? menu
            : menu.filter((item: MenuItem) => item.category === activeCategory);

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h1 className="font-display text-5xl text-lemon-green font-semibold text-center mb-4">
                Nuestro Menú
            </h1>
            <p className="text-center text-gray-500 mb-10">
                Preparado con ingredientes frescos cada día
            </p>

            {/* Filtros */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-5 py-2 rounded-full font-medium transition-colors cursor-pointer ${activeCategory === 'all'
                        ? 'bg-lemon-green text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Todos
                </button>
                {Object.entries(CATEGORIES).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setActiveCategory(key)}
                        className={`px-5 py-2 rounded-full font-medium transition-colors cursor-pointer ${activeCategory === key
                            ? 'bg-lemon-green text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-lemon-green border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <p className="text-center text-gray-400 py-20">
                    No hay items en esta categoría.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((item: MenuItem) => (
                        <div key={item.id} className="card">
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-48 object-cover"
                                />
                            ) : (
                                <div className="w-full h-48 bg-lemon-gray flex items-center justify-center text-5xl">
                                    🍽️
                                </div>
                            )}
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-lg text-lemon-dark">{item.name}</h3>
                                    <span className="font-bold text-lemon-green text-lg">
                                        ${Number(item.price).toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm">{item.description}</p>

                                <span className="inline-block mt-3 text-xs px-3 py-1 bg-lemon-gray text-lemon-green rounded-full font-medium">
                                    {item.category in CATEGORIES
                                        ? CATEGORIES[item.category as CategoryKey]
                                        : item.category}
                                </span>

                                <button
                                    onClick={() => addToCart(item, "Pedido web")}
                                    className="w-full mt-4 btn-primary text-xs py-2.5 font-bold cursor-pointer"
                                >
                                    🛒 Añadir al carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Menu;