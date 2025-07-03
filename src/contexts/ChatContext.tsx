
import React, { createContext, useContext, useState } from 'react';
import { processWithGemini } from '@/lib/gemini';

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
  apiKey: string;
  setApiKey: (key: string) => void;
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Sou seu assistente do FoodHub. Como posso ajudar você hoje?',
      timestamp: new Date(),
      intent: 'saudacao',
      suggestions: ['Quero uma pizza', 'Ver açaiterias', 'Buscar hambúrguer']
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const sendMessage = async (message: string) => {
    if (!apiKey.trim()) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Por favor, configure sua chave da API do Gemini primeiro.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    setIsLoading(true);
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      console.log('Enviando mensagem para Gemini:', message);
      const response = await processWithGemini(message, apiKey);
      console.log('Resposta do Gemini:', response);
      
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
      console.error('Erro ao processar mensagem:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Verifique sua chave da API e tente novamente.',
        timestamp: new Date(),
        suggestions: ['Tentar novamente', 'Verificar API key']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Olá! Sou seu assistente do FoodHub. Como posso ajudar você hoje?',
        timestamp: new Date(),
        intent: 'saudacao',
        suggestions: ['Quero uma pizza', 'Ver açaiterias', 'Buscar hambúrguer']
      }
    ]);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      isLoading,
      apiKey,
      setApiKey,
      sendMessage,
      clearChat,
    }}>
      {children}
    </ChatContext.Provider>
  );
};
