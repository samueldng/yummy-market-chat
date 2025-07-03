
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Truck, MapPin } from 'lucide-react';

interface DeliveryTrackerProps {
  orders: any[];
}

const DeliveryTracker = ({ orders }: DeliveryTrackerProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'preparing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'out_for_delivery':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'delivered':
        return <MapPin className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Aguardando confirmação';
      case 'confirmed':
        return 'Pedido confirmado';
      case 'preparing':
        return 'Preparando';
      case 'out_for_delivery':
        return 'Saiu para entrega';
      case 'delivered':
        return 'Entregue';
      default:
        return 'Status desconhecido';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="h-5 w-5 mr-2" />
          Acompanhamento do Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">{order.storeName}</h4>
              <Badge variant="outline">
                {getStatusIcon(order.status)}
                <span className="ml-2">{getStatusText(order.status)}</span>
              </Badge>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <p>Pedido: #{order.id.slice(-8)}</p>
              <p>Total: R$ {order.total.toFixed(2)}</p>
              <p>Tempo estimado: 25-35 min</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DeliveryTracker;
