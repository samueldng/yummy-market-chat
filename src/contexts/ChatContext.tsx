
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  data?: any;
  suggestions?: string[];
}

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Aqui será integrada a API do Gemini
      const response = await processMessageWithGemini(message);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        intent: response.intent,
        data: response.data,
        suggestions: response.suggestions,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Tente novamente.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const processMessageWithGemini = async (message: string) => {
    // Simulação da resposta da IA - será substituída pela API real do Gemini
    const responses = [
      {
        intent: 'descobrir_lojas',
        message: 'Encontrei algumas opções incríveis para você! Que tal dar uma olhada nestas pizzarias populares?',
        data: { storeType: 'pizzaria' },
        suggestions: ['Ver cardápio', 'Localização', 'Horário de funcionamento']
      },
      {
        intent: 'adicionar_item',
        message: 'Ótima escolha! Adicionei a pizza de calabresa ao seu carrinho. Quer algo para beber também?',
        data: { productId: '1', quantity: 1 },
        suggestions: ['Adicionar bebida', 'Ver carrinho', 'Continuar comprando']
      }
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      isLoading,
      sendMessage,
      clearChat,
    }}>
      {children}
    </ChatContext.Provider>
  );
};
