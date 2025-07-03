
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { useCartContext } from '@/contexts/CartContext';
import { useOrderContext } from '@/contexts/OrderContext';

const CartSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, totalPrice, updateQuantity, removeItem, getItemsByStore, clearCart } = useCartContext();
  const { createOrder } = useOrderContext();

  const itemsByStore = getItemsByStore();
  const storeCount = Object.keys(itemsByStore).length;

  const handleCheckout = async () => {
    if (items.length > 0) {
      await createOrder(items);
      clearCart();
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Cart Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg z-50"
        size="icon"
      >
        <ShoppingCart className="h-6 w-6" />
        {items.length > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
            {items.length}
          </Badge>
        )}
      </Button>

      {/* Cart Sidebar */}
      {isOpen && (
        <Card className="fixed bottom-24 left-6 w-96 h-96 flex flex-col shadow-2xl z-40 animate-scale-in">
          <CardHeader className="bg-green-500 text-white rounded-t-lg py-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Seu Carrinho
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-green-600 h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Seu carrinho está vazio</p>
                  <p className="text-sm mt-2">Adicione produtos pelo chat!</p>
                </div>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {storeCount > 1 && (
                    <Badge variant="outline" className="mb-4">
                      {storeCount} lojas diferentes
                    </Badge>
                  )}
                  
                  {Object.entries(itemsByStore).map(([storeId, storeItems]) => (
                    <div key={storeId} className="space-y-3">
                      <h4 className="font-semibold text-sm text-gray-700 border-b pb-1">
                        {storeItems[0].storeName}
                      </h4>
                      
                      {storeItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                          <img
                            src={item.image || '/placeholder.svg'}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{item.name}</h5>
                            <p className="text-green-600 font-semibold text-sm">
                              R$ {item.price.toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-6 w-6"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-6 w-6"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeItem(item.id)}
                              className="h-6 w-6 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {Object.keys(itemsByStore).length > 1 && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            Subtotal: R$ {storeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="border-t p-4 bg-gray-50">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>R$ {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxa de entrega (estimada)</span>
                      <span>R$ {(storeCount * 5.99).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>R$ {(totalPrice + (storeCount * 5.99)).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    Finalizar Pedido
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CartSidebar;
