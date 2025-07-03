
import React from 'react';
import { ChatProvider } from '@/contexts/ChatContext';
import { CartProvider } from '@/contexts/CartContext';
import { OrderProvider } from '@/contexts/OrderContext';
import MarketplaceHeader from '@/components/MarketplaceHeader';
import HeroSection from '@/components/HeroSection';
import StoreGrid from '@/components/StoreGrid';
import ChatInterface from '@/components/ChatInterface';
import CartSidebar from '@/components/CartSidebar';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  return (
    <ChatProvider>
      <CartProvider>
        <OrderProvider>
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
            <MarketplaceHeader />
            <HeroSection />
            <StoreGrid />
            <ChatInterface />
            <CartSidebar />
            <Toaster />
          </div>
        </OrderProvider>
      </CartProvider>
    </ChatProvider>
  );
};

export default Index;
