
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Clock, Truck } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Peça pelo Chat,
            <br />
            <span className="text-yellow-300">Receba em Casa!</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Converse naturalmente com nossa IA e descubra os melhores pratos da sua região. 
            Múltiplas lojas, um só pedido!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-white text-red-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              <MessageCircle className="mr-2 h-5 w-5" />
              Começar Chat
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-500 px-8 py-4 text-lg">
              Ver Lojas
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Chat Inteligente</h3>
              <p className="opacity-90">Peça naturalmente: "Quero pizza e açaí"</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Entrega Rápida</h3>
              <p className="opacity-90">Múltiplas lojas, entrega coordenada</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Tudo Integrado</h3>
              <p className="opacity-90">Pagamento dividido automaticamente</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
