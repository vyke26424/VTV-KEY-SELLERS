import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosClient from '../../store/axiosClient';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  
  // State for animation
  const [isVisible, setIsVisible] = useState(false);

  // Initial dummy message
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      content: 'Chào bạn! Tôi là trợ lý ảo AI của VTV Key Sellers. Tôi có thể giúp bạn tìm key bản quyền hoặc giải đáp thắc mắc nào?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef(null);

  // 1. Animation Logic
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Initialize session when chat opens
      if (!sessionId) {
        initializeSession();
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 2. Initialize Session (Load history or Create new)
  const initializeSession = async () => {
    try {
      const storedSessionId = localStorage.getItem('chat_session_id');
      
      if (storedSessionId) {
        // Try to fetch history
        try {
          const res = await axiosClient.get(`/chat/history/${storedSessionId}`);
          setSessionId(parseInt(storedSessionId));
          
          // Map history to UI format
          if (res && res.length > 0) {
            const historyMessages = res.map(msg => ({
              id: msg.id.toString(),
              content: msg.content,
              sender: msg.role === 'user' ? 'user' : 'bot',
              timestamp: new Date(msg.createdAt),
              products: [] // History might not save products, or you need to update backend to return them
            }));
            setMessages(historyMessages);
          }
          return;
        } catch (err) {
            console.warn("Session expired or not found, creating new one...");
        }
      }

      // Create new session if no history or fetch failed
      const res = await axiosClient.post('/chat/session');
      const newSessionId = res.sessionId;
      setSessionId(newSessionId);
      localStorage.setItem('chat_session_id', newSessionId);

    } catch (error) {
      console.error("Error initializing chat session:", error);
    }
  };

  // 3. Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isVisible, isLoading]);

  // 4. Handle Send Message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    if (!sessionId) {
        // Retry creating session if missing
        await initializeSession();
    }

    // Optimistic Update: Show user message immediately
    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
        // Call Backend API
        const response = await axiosClient.post('/chat/send', {
            sessionId: sessionId,
            content: userMessage.content
        });

        const data = response; // { intent, message, products }

        // Create Bot Message Object
        const botMessage = {
            id: data.message.id.toString(),
            content: data.message.content,
            sender: 'bot',
            timestamp: new Date(),
            products: data.products || [] // Attach recommended products
        };
        
        setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
        console.error("Chat Error:", error);
        const errorMessage = {
            id: Date.now().toString(),
            content: "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.",
            sender: 'bot',
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  // --- SUB-COMPONENT: Product Card in Chat ---
  const ChatProductCard = ({ product }) => (
    <div className="min-w-[160px] w-[160px] bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col shadow-lg mr-3 snap-start">
        <div className="h-24 w-full bg-slate-900 relative">
             <img 
                src={product.thumbnail || "https://via.placeholder.com/150"} 
                alt={product.name} 
                className="w-full h-full object-cover"
            />
        </div>
        <div className="p-2 flex flex-col flex-1">
            <h4 className="text-white text-xs font-bold line-clamp-2 mb-1">{product.name}</h4>
            <div className="mt-auto">
                <p className="text-vtv-green text-xs font-bold">
                    {product.variants?.[0]?.price?.toLocaleString()}đ
                </p>
                <Link 
                    to={`/product/${product.slug || product.id}`} 
                    className="mt-2 block w-full text-center bg-white/10 hover:bg-white/20 text-white text-[10px] py-1 rounded transition"
                >
                    Xem ngay
                </Link>
            </div>
        </div>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
        
        {/* --- Cửa sổ Chat --- */}
        <div 
            className={`
                mb-4 w-[380px] h-[600px] 
                bg-vtv-card border border-slate-700 
                rounded-2xl shadow-2xl flex flex-col overflow-hidden 
                transition-all duration-300 ease-out origin-bottom-right
                ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none absolute'}
            `}
        >
            {/* Header */}
            <div className="bg-vtv-dark/95 backdrop-blur-md p-4 border-b border-vtv-green/30 flex justify-between items-center shadow-md">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-vtv-green/50">
                            <Sparkles size={20} className="text-vtv-green" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-vtv-green rounded-full border-2 border-vtv-dark animate-pulse"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-base">Trợ Lý AI</h3>
                        <p className="text-xs text-vtv-green font-medium">
                            {sessionId ? `Session #${sessionId}` : 'Đang kết nối...'}
                        </p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white rounded-full p-2">
                    <X size={20} />
                </button>
            </div>

            {/* List tin nhắn */}
            <div className="flex-1 p-4 overflow-y-auto bg-[#0B1221] flex flex-col space-y-4 custom-scrollbar">
                {messages.map((msg, index) => {
                    const isUser = msg.sender === 'user';
                    return (
                        <div key={msg.id || index} className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'}`}>
                            {/* Bong bóng chat */}
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                                isUser 
                                    ? 'bg-vtv-green text-black font-medium rounded-tr-none' 
                                    : 'bg-slate-700 text-gray-100 rounded-tl-none border border-slate-600'
                            }`}>
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            
                            {/* Product Recommendations (Only for Bot) */}
                            {!isUser && msg.products && msg.products.length > 0 && (
                                <div className="mt-3 w-full max-w-[95%]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ShoppingBag size={12} className="text-vtv-green"/>
                                        <span className="text-[10px] text-gray-400 uppercase font-bold">Gợi ý cho bạn</span>
                                    </div>
                                    {/* Horizontal Scroll List */}
                                    <div className="flex overflow-x-auto pb-2 snap-x scrollbar-hide">
                                        {msg.products.map(product => (
                                            <ChatProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Timestamp */}
                            <span className={`text-[10px] mt-1 ${isUser ? 'text-gray-500 mr-1' : 'text-gray-500 ml-1'}`}>
                                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                        </div>
                    );
                })}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-700 p-3 rounded-2xl rounded-tl-none flex items-center space-x-2 border border-slate-600">
                            <Loader2 size={16} className="animate-spin text-vtv-green" />
                            <span className="text-gray-400 text-xs">AI đang tìm kiếm...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-vtv-card border-t border-slate-700 flex items-center space-x-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Hỏi về sản phẩm..."
                    className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-vtv-green focus:ring-1 focus:ring-vtv-green transition placeholder-gray-500"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className={`p-3 rounded-xl transition-all shadow-lg flex-shrink-0 flex items-center justify-center ${
                        isLoading || !inputValue.trim() 
                            ? 'bg-slate-800 text-gray-500 cursor-not-allowed' 
                            : 'bg-vtv-green text-black hover:bg-green-400'
                    }`}
                >
                   {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
            </form>
            
            <div className="bg-vtv-card py-1 text-center border-t border-slate-800">
                <p className="text-[10px] text-gray-500">Powered by VTV AI System</p>
            </div>
        </div>

      {/* Button Mở Chat */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
            w-14 h-14 rounded-full shadow-2xl flex items-center justify-center 
            text-black transition-all duration-300 transform hover:scale-110 active:scale-95
            border-2 border-vtv-dark
            ${isOpen ? 'bg-slate-700 text-white rotate-90' : 'bg-vtv-green hover:bg-green-400 animate-bounce-slow'}
        `}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default ChatWidget;