
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Star } from 'lucide-react';
import { useCartContext } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  storeId: string;
  storeName: string;
  category: string;
}

interface ProductCarouselProps {
  storeType: string;
}

const ProductCarousel = ({ storeType }: ProductCarouselProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCartContext();

  useEffect(() => {
    // Mock products - será substituído por dados do Supabase
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Pizza Calabresa',
        price: 45.90,
        image: '/placeholder.svg',
        rating: 4.8,
        storeId: '1',
        storeName: 'Pizzaria Bella Vista',
        category: 'Pizza',
      },
      {
        id: '2',
        name: 'Pizza Margherita',
        price: 42.90,
        image: '/placeholder.svg',
        rating: 4.7,
        storeId: '1',
        storeName: 'Pizzaria Bella Vista',
        category: 'Pizza',
      },
      {
        id: '3',
        name: 'Açaí 500ml',
        price: 18.90,
        image: '/placeholder.svg',
        rating: 4.6,
        storeId: '2',
        storeName: 'Açaí do Morro',
        category: 'Açaí',
      },
    ];

    const filteredProducts = storeType === 'pizzaria' 
      ? mockProducts.filter(p => p.category === 'Pizza')
      : mockProducts;
      
    setProducts(filteredProducts);
  }, [storeType]);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      storeId: product.storeId,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      storeName: product.storeName,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">Produtos Recomendados</h4>
        <Badge variant="secondary" className="text-xs">
          Sugestão da IA
        </Badge>
      </div>
      
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {products.map((product) => (
          <Card key={product.id} className="flex-shrink-0 w-48 hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-24 object-cover rounded-md mb-2"
              />
              
              <h5 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h5>
              
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span>{product.storeName}</span>
                <div className="flex items-center">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{product.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-bold text-green-600">
                  R$ {product.price.toFixed(2)}
                </span>
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
