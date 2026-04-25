'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/useStore';
import { ProductCard } from './ui/ProductCard';
import { Product } from '@/types';
import { useTranslation } from 'react-i18next';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
}

export function AIChat() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const { theme } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        products: data.matchedProducts
      }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-36 right-4 md:bottom-6 md:right-6 z-[60] h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
          isOpen 
            ? 'bg-red-500 text-white rotate-90' 
            : 'bg-[#FF8800] text-white hover:bg-[#FF7700] animate-bounce-subtle'
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-7 w-7" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[calc(100vw-3rem)] max-w-[450px] h-[75vh] max-h-[650px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 rounded-3xl border border-white/20 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl">
          <div className="p-5 bg-gradient-to-r from-[#FF8800] to-[#E07000] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Simba AI Assistant</h3>
                <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Powered by Groq</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth"
          >
            {chatHistory.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-100 py-10">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-[#FF8800]" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100">How can I help you today?</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[250px] mx-auto mt-1">
                    Try: "Do you have fresh milk?" or "I need items for breakfast."
                  </p>
                </div>
              </div>
            )}

            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center border ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 border-blue-600 text-white' 
                      : 'bg-orange-500 border-orange-600 text-white'
                  }`}>
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className="space-y-3">
                    <div className={`p-4 rounded-2xl shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>

                    {msg.products && msg.products.length > 0 && (
                      <div className="grid grid-cols-1 gap-3 pt-2">
                        {msg.products.map((product) => (
                          <div key={product.id} className="scale-90 origin-left">
                            <ProductCard product={product} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="shrink-0 h-8 w-8 rounded-full bg-orange-500 border border-orange-600 text-white flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-tl-none shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      <div className="h-2 w-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-md">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask Simba AI..."
                className="flex-1 bg-gray-100/80 dark:bg-gray-800/80 border-none rounded-full h-11 px-5 focus-visible:ring-2 focus-visible:ring-orange-500 transition-all"
              />
              <Button 
                type="submit" 
                disabled={loading || !message.trim()}
                className="h-11 w-11 p-0 rounded-full bg-[#FF8800] hover:bg-[#FF7700] shadow-md transition-transform active:scale-90"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}
