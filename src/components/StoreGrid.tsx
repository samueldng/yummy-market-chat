
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, Truck } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  isOpen: boolean;
  featured: boolean;
}

const StoreGrid = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Dados mock - será substituído por dados do Supabase
    const mockStores: Store[] = [
      {
        id: '1',
        name: 'Pizzaria Bella Vista',
        category: 'Pizza',
        rating: 4.8,
        deliveryTime: '25-35 min',
        deliveryFee: 5.99,
        image: '/placeholder.svg',
        isOpen: true,
        featured: true,
      },
      {
        id: '2',
        name: 'Açaí do Morro',
        category: 'Açaí',
        rating: 4.6,
        deliveryTime: '15-25 min',
        deliveryFee: 3.99,
        image: '/placeholder.svg',
        isOpen: true,
        featured: false,
      },
      {
        id: '3',
        name: 'Burguer House',
        category: 'Hambúrguer',
        rating: 4.7,
        deliveryTime: '30-40 min',
        deliveryFee: 4.99,
        image: '/placeholder.svg',
        isOpen: true,
        featured: true,
      },
      {
        id: '4',
        name: 'Doces da Vovó',
        category: 'Confeitaria',
        rating: 4.9,
        deliveryTime: '20-30 min',
        deliveryFee: 6.99,
        image: '/placeholder.svg',
        isOpen: false,
        featured: false,
      },
    ];
    
    setStores(mockStores);
  }, []);

  const categories = ['all', 'Pizza', 'Açaí', 'Hambúrguer', 'Confeitaria', 'Restaurante'];
  
  const filteredStores = selectedCategory === 'all' 
    ? stores 
    : stores.filter(store => store.category === selectedCategory);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Lojas Parceiras
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra os melhores estabelecimentos da sua região
          </p>
        </div>

        {/* Filtros de Categoria */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === 'all' ? 'Todas' : category}
            </Button>
          ))}
        </div>

        {/* Grid de Lojas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStores.map((store) => (
            <Card 
              key={store.id} 
              className={`hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer ${
                !store.isOpen ? 'opacity-60' : ''
              }`}
            >
              <CardHeader className="p-0">
                <div className="relative">
                  <img 
                    src={store.image} 
                    alt={store.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {store.featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                      Destaque
                    </Badge>
                  )}
                  {!store.isOpen && (
                    <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                      <Badge variant="destructive">Fechado</Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">{store.name}</h3>
                <Badge variant="secondary" className="mb-3">
                  {store.category}
                </Badge>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{store.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{store.deliveryTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="h-4 w-4 mr-1" />
                    <span>R$ {store.deliveryFee.toFixed(2)}</span>
                  </div>
                  <Button size="sm" disabled={!store.isOpen}>
                    Ver Cardápio
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreGrid;
