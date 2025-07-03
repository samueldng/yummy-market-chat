
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Smartphone } from 'lucide-react';

const WhatsAppOptimizer = () => {
  const [isWhatsApp, setIsWhatsApp] = useState(false);

  useEffect(() => {
    // Detectar se está sendo acessado via WhatsApp
    const userAgent = navigator.userAgent.toLowerCase();
    const isWhatsAppBrowser = userAgent.includes('whatsapp') || 
                             userAgent.includes('wv') && userAgent.includes('version');
    
    setIsWhatsApp(isWhatsAppBrowser);
    
    // Aplicar estilos otimizados para WhatsApp
    if (isWhatsAppBrowser) {
      document.body.classList.add('whatsapp-optimized');
    }
  }, []);

  if (!isWhatsApp) return null;

  return (
    <Card className="fixed top-4 left-4 right-4 z-50 bg-green-50 border-green-200">
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <div className="bg-green-500 p-2 rounded-full">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">
              Acessando via WhatsApp
            </p>
            <p className="text-xs text-green-600">
              Interface otimizada para mobile
            </p>
          </div>
          <Button size="sm" variant="outline" className="border-green-300 text-green-700">
            <Smartphone className="h-3 w-3 mr-1" />
            OK
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppOptimizer;
