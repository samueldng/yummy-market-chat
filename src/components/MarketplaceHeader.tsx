
import React from 'react';
import { ShoppingCart, MessageCircle, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartContext } from '@/contexts/CartContext';

const MarketplaceHeader = () => {
  const { totalItems } = useCartContext();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              FoodHub
            </h1>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar lojas, pratos ou produtos..." 
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-5 w-5" />
              <span className="ml-2 hidden sm:inline">Chat</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="ml-2 hidden sm:inline">Carrinho</span>
            </Button>

            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
              <span className="ml-2 hidden sm:inline">Perfil</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MarketplaceHeader;
