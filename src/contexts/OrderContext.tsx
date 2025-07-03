
import React, { createContext, useContext, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CartItem {
  id: string;
  productId: string;
  storeId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  storeName: string;
}

interface Order {
  id: string;
  storeId: string;
  storeName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  masterOrderId?: string;
}

interface MasterOrder {
  id: string;
  orders: Order[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed';
  createdAt: Date;
}

interface OrderContextType {
  currentOrder: MasterOrder | null;
  createOrder: (cartItems: CartItem[]) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentOrder, setCurrentOrder] = useState<MasterOrder | null>(null);

  const createOrder = async (cartItems: CartItem[]) => {
    try {
      // Agrupar itens por loja
      const itemsByStore = cartItems.reduce((acc, item) => {
        if (!acc[item.storeId]) {
          acc[item.storeId] = [];
        }
        acc[item.storeId].push(item);
        return acc;
      }, {} as { [storeId: string]: CartItem[] });

      const orders: Order[] = [];
      let totalAmount = 0;

      // Criar um pedido para cada loja
      for (const [storeId, storeItems] of Object.entries(itemsByStore)) {
        const subtotal = storeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = 5.99; // Taxa fixa por enquanto
        const total = subtotal + deliveryFee;
        
        const order: Order = {
          id: `order_${Date.now()}_${storeId}`,
          storeId,
          storeName: storeItems[0].storeName,
          items: storeItems,
          subtotal,
          deliveryFee,
          total,
          status: 'pending',
        };
        
        orders.push(order);
        totalAmount += total;
      }

      const masterOrder: MasterOrder = {
        id: `master_${Date.now()}`,
        orders,
        totalAmount,
        status: 'pending',
        createdAt: new Date(),
      };

      // Vincular orders ao master order
      masterOrder.orders = masterOrder.orders.map(order => ({
        ...order,
        masterOrderId: masterOrder.id,
      }));

      setCurrentOrder(masterOrder);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    if (!currentOrder) return;

    const updatedOrders = currentOrder.orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );

    setCurrentOrder({
      ...currentOrder,
      orders: updatedOrders,
    });
  };

  return (
    <OrderContext.Provider value={{
      currentOrder,
      createOrder,
      updateOrderStatus,
    }}>
      {children}
    </OrderContext.Provider>
  );
};
