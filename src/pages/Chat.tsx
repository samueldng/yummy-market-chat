
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, Settings, Eye, EyeOff, Mic, MicOff, ArrowLeft, Share2 } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';
import ProductCarousel from '@/components/ProductCarousel';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { messages, isLoading, apiKey, setApiKey, sendMessage, clearChat } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTempApiKey(apiKey);
  }, [apiKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isLoading) {
      await sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    setShowSettings(false);
  };

  const handleShareToWhatsApp = () => {
    const text = encodeURIComponent("Olá! Estou usando o FoodHub para fazer pedidos. Que tal você também? 🍕🍔");
    const url = encodeURIComponent(window.location.origin + '/chat');
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Aqui seria implementado o reconhecimento de voz
  };

  const renderMessageContent = (message: any) => {
    if (message.intent === 'descobrir_lojas' && message.data?.storeType) {
      return (
        <div className="space-y-3">
          <p className="animate-fade-in">{message.content}</p>
          <ProductCarousel storeType={message.data.storeType} />
        </div>
      );
    }
    return <p className="text-sm leading-relaxed animate-fade-in">{message.content}</p>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 shadow-lg flex-shrink-0">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Bot className="h-8 w-8 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold">Assistente FoodHub</h1>
                <p className="text-sm opacity-90">Online • Pronto para ajudar</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShareToWhatsApp}
              className="text-white hover:bg-white/20 p-2"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white/20 p-2"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b shadow-sm animate-slide-down flex-shrink-0">
          <div className="max-w-4xl mx-auto p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Chave da API Gemini:
                  </label>
                  <div className="relative">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="Cole sua API key do Google Gemini aqui"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Compartilhar:
                  </label>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleShareToWhatsApp}
                      className="bg-green-500 hover:bg-green-600 text-white flex-1"
                    >
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleSaveApiKey} className="flex-1">
                  Salvar Configurações
                </Button>
                <Button size="sm" variant="outline" onClick={clearChat}>
                  Limpar Chat
                </Button>
              </div>
              {!apiKey && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    ⚠️ Configure sua API key do Gemini para usar o chat
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        <div className="space-y-6 min-h-full">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-[80%] md:max-w-[70%] ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl rounded-br-lg'
                    : 'bg-white text-gray-800 rounded-3xl rounded-bl-lg shadow-lg border'
                } p-4 relative`}
              >
                {message.role === 'assistant' && (
                  <div className="absolute -left-2 top-4 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div className={`${message.role === 'assistant' ? 'ml-4' : ''}`}>
                  {renderMessageContent(message)}
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs opacity-70 font-medium">Sugestões rápidas:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="ghost"
                            size="sm"
                            className="text-xs h-8 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-full px-3 hover-scale"
                            onClick={() => sendMessage(suggestion)}
                            disabled={isLoading}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="absolute -bottom-1 right-2 text-xs opacity-50">
                  {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white rounded-3xl rounded-bl-lg shadow-lg border p-4 relative">
                <div className="absolute -left-2 top-4 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-500">Digitando...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t shadow-lg p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={apiKey ? "Digite sua mensagem..." : "Configure a API key primeiro..."}
              disabled={isLoading || !apiKey}
              className="flex-1 border-0 bg-transparent focus:ring-0 text-base"
            />
            <Button
              onClick={toggleRecording}
              disabled={!apiKey}
              variant="ghost"
              size="icon"
              className={`rounded-full ${isRecording ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !apiKey}
              size="icon"
              className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          {isRecording && (
            <div className="flex items-center justify-center mt-2 text-red-600 animate-pulse">
              <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
              <span className="text-sm">Gravando áudio...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
