
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, MessageCircle, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketplaceHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              FoodHub
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar lojas, produtos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/chat')}
              className="relative hover:bg-orange-50 hover:text-orange-600"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                •
              </span>
            </Button>
            
            <Button variant="ghost" size="icon" className="hover:bg-orange-50 hover:text-orange-600">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="hover:bg-orange-50 hover:text-orange-600">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MarketplaceHeader;
