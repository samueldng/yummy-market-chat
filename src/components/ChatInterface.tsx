
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, Bot, Settings, Eye, EyeOff } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';
import ProductCarousel from '@/components/ProductCarousel';

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const { messages, isLoading, apiKey, setApiKey, sendMessage, clearChat } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const renderMessageContent = (message: any) => {
    if (message.intent === 'descobrir_lojas' && message.data?.storeType) {
      return (
        <div className="space-y-3">
          <p>{message.content}</p>
          <ProductCarousel storeType={message.data.storeType} />
        </div>
      );
    }
    return <p className="text-sm leading-relaxed">{message.content}</p>;
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Interface */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] flex flex-col shadow-2xl z-50 animate-scale-in bg-white border">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg py-3 flex-shrink-0">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                Assistente FoodHub
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          
          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 border-b bg-gray-50 flex-shrink-0">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Chave da API Gemini:
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="Cole sua API key do Google Gemini aqui"
                      className="pr-10 bg-white"
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
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSaveApiKey} className="flex-1">
                    Salvar
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearChat}>
                    Limpar Chat
                  </Button>
                </div>
                {!apiKey && (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    Configure sua API key do Gemini para usar o chat
                  </p>
                )}
              </div>
            </div>
          )}
          
          <CardContent className="flex-1 flex flex-col p-0 bg-white overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg shadow-sm ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 border'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-orange-500" />
                      )}
                      <div className="flex-1">
                        {renderMessageContent(message)}
                        
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                className="text-xs h-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50 mr-1 mb-1 bg-blue-50/50"
                                onClick={() => sendMessage(suggestion)}
                                disabled={isLoading}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg border shadow-sm">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-orange-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4 bg-white flex-shrink-0">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={apiKey ? "Digite sua mensagem..." : "Configure a API key primeiro..."}
                  disabled={isLoading || !apiKey}
                  className="flex-1 bg-white"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || !apiKey}
                  size="icon"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChatInterface;
