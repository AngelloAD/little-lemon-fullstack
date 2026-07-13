import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface MenuItem {
    id: number;
    name: string;
    price: string | number;
    description: string;
    category: string;
    image?: string;
}

export interface CartItem extends MenuItem {
    quantity: number;
    notasCustom?: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: MenuItem, notas?: string) => void;
    removeFromCart: (id: number, notas?: string) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: MenuItem, notas?: string) => {
        const notasLimpias = notas || '';

        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id && i.notasCustom === notasLimpias);

            if (existing) {
                return prev.map((i) =>
                    i.id === item.id && i.notasCustom === notasLimpias
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...item, quantity: 1, notasCustom: notasLimpias }];
        });
    };

    const removeFromCart = (id: number, notas?: string) => {
        const notasLimpias = notas || '';
        setCart((prev) =>
            prev.filter((item) => !(item.id === id && item.notasCustom === notasLimpias))
        );
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
    return context;
};