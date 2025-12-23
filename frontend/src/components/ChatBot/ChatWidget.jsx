import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Sparkles,
  ShoppingBag,
  RefreshCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosClient from '../../store/axiosClient';
import useAuthStore from '../../store/useAuthStore';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // --- STATE MỚI: Để tùy chỉnh dòng chữ loading ---
  const [loadingText, setLoadingText] = useState('AI đang tìm kiếm...');

  const { isAuthenticated } = useAuthStore();
  const prevAuthRef = useRef(isAuthenticated);
  const [isVisible, setIsVisible] = useState(false);

  // Message chào mặc định
  const welcomeMessage = {
    id: 'welcome',
    content:
      'Chào bạn! Tôi là trợ lý ảo AI của VTV Key Sellers. Tôi có thể giúp bạn tìm key bản quyền hoặc giải đáp thắc mắc nào?',
    sender: 'bot',
    timestamp: new Date(),
  };

  const [messages, setMessages] = useState([welcomeMessage]);
  const messagesEndRef = useRef(null);

  // 1. Animation Logic
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (!sessionId) {
        initializeSession();
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 2. Logic Reset khi Logout (User A -> User B)
  useEffect(() => {
    if (prevAuthRef.current === true && isAuthenticated === false) {
      handleResetSession(false);
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // 3. Initialize Session
  const initializeSession = async () => {
    try {
      const storedSessionId = localStorage.getItem('chat_session_id');

      if (storedSessionId) {
        try {
          const res = await axiosClient.get(`/chat/history/${storedSessionId}`);
          setSessionId(parseInt(storedSessionId));

          if (res && res.length > 0) {
            const historyMessages = res.map((msg) => ({
              id: msg.id.toString(),
              content: msg.content,
              sender: msg.role === 'user' ? 'user' : 'bot',
              timestamp: new Date(msg.createdAt),
              products: [],
            }));
            setMessages(historyMessages);
          }
          return;
        } catch (err) {
          console.warn('Session expired or not found, creating new one...');
        }
      }
      createNewSession();
    } catch (error) {
      console.error('Error initializing chat session:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const res = await axiosClient.post('/chat/session');
      const newSessionId = res.sessionId;
      setSessionId(newSessionId);
      localStorage.setItem('chat_session_id', newSessionId);
    } catch (error) {
      console.error('Failed to create session', error);
    }
  };

  // --- LOGIC RESET SESSION (Đã sửa loading text) ---
  const handleResetSession = async (shouldCreateNew = true) => {
    setSessionId(null);
    localStorage.removeItem('chat_session_id');
    setMessages([welcomeMessage]);

    if (shouldCreateNew && isOpen) {
      // Set text riêng cho việc Reset
      setLoadingText('Xin chờ xíu nhaa...');
      setIsLoading(true);

      // Giả lập delay một chút cho mượt (nếu API quá nhanh)
      await new Promise((r) => setTimeout(r, 500));
      await createNewSession();

      setIsLoading(false);
      // Trả lại text mặc định
      setLoadingText('AI đang tìm kiếm...');
    }
  };

  // 4. Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isVisible, isLoading]);

  // 5. Handle Send Message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const res = await axiosClient.post('/chat/session');
      currentSessionId = res.sessionId;
      setSessionId(currentSessionId);
      localStorage.setItem('chat_session_id', currentSessionId);
    }

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Set text mặc định khi chat
    setLoadingText('AI đang tìm kiếm...');
    setIsLoading(true);

    try {
      const response = await axiosClient.post('/chat/send', {
        sessionId: currentSessionId,
        content: userMessage.content,
      });

      const data = response;
      const botMessage = {
        id: data.message.id.toString(),
        content: data.message.content,
        sender: 'bot',
        timestamp: new Date(),
        products: data.products || [],
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage = {
        id: Date.now().toString(),
        content: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sub-component Product Card
  const ChatProductCard = ({ product }) => (
    <div className="min-w-[160px] w-[160px] bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col shadow-lg mr-3 snap-start">
      <div className="h-24 w-full bg-slate-900 relative">
        <img
          src={product.thumbnail || 'https://via.placeholder.com/150'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-2 flex flex-col flex-1">
        <h4 className="text-white text-xs font-bold line-clamp-2 mb-1">
          {product.name}
        </h4>
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
    <div className="fixed bottom-6 right-6 z-50 flex items-end font-sans">
      {/* Dùng flex-row-reverse để đảo vị trí: 
          Nút bấm (phần tử đầu tiên trong code) sẽ nằm bên trái.
          Khung chat (phần tử thứ hai) sẽ nằm bên phải.
      */}
      <div className="flex flex-row-reverse items-end gap-4 relative">
        
        {/* Nút X to / Mở Chat */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`
            w-14 h-14 rounded-full shadow-2xl flex items-center justify-center 
            text-black transition-all duration-300 transform hover:scale-110 active:scale-95
            border-2 border-vtv-dark flex-shrink-0 z-50
            ${isOpen ? 'bg-slate-700 text-white rotate-90' : 'bg-vtv-green hover:bg-green-400 animate-bounce-slow'}
          `}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
        </button>

        {/* Cửa sổ Chat */}
        <div
          className={`
                w-[380px] h-[500px] 
                bg-vtv-card border border-slate-700 
                rounded-2xl shadow-2xl flex flex-col overflow-hidden 
                transition-all duration-300 ease-out origin-bottom-right
                ${isOpen ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 translate-x-10 pointer-events-none absolute'}
            `}
        >
          {/* Header */}
          <div className="bg-vtv-dark/95 backdrop-blur-md p-4 border-b border-vtv-green/30 flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-vtv-green/50 overflow-hidden">
                  <img
                    src="/Fairy.gif"
                    alt="AI Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-vtv-green rounded-full border-2 border-vtv-dark animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Trợ Lý AI - FAIRY</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-vtv-green animate-pulse"></span>
                  <p className="text-xs text-gray-300 font-medium">
                    Sẵn sàng hỗ trợ
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleResetSession(true)}
                title="Tạo cuộc trò chuyện mới"
                className="text-gray-400 hover:text-vtv-green hover:bg-slate-800 rounded-full p-2 transition-colors"
              >
                <RefreshCcw size={18} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-slate-800 rounded-full p-2 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* List tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#0B1221] flex flex-col space-y-4 custom-scrollbar">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id || index}
                  className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                      isUser
                        ? 'bg-vtv-green text-black font-medium rounded-tr-none'
                        : 'bg-slate-700 text-gray-100 rounded-tl-none border border-slate-600'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>

                  {!isUser && msg.products && msg.products.length > 0 && (
                    <div className="mt-3 w-full max-w-[95%]">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag size={12} className="text-vtv-green" />
                        <span className="text-[10px] text-gray-400 uppercase font-bold">
                          Gợi ý cho bạn
                        </span>
                      </div>
                      <div className="flex overflow-x-auto pb-2 snap-x scrollbar-hide">
                        {msg.products.map((product) => (
                          <ChatProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`text-[10px] mt-1 ${isUser ? 'text-gray-500 mr-1' : 'text-gray-500 ml-1'}`}
                  >
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 p-3 rounded-2xl rounded-tl-none flex items-center space-x-2 border border-slate-600">
                  <Loader2 size={16} className="animate-spin text-vtv-green" />
                  <span className="text-gray-400 text-xs">{loadingText}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-vtv-card border-t border-slate-700 flex items-center space-x-2"
          >
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
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>

          <div className="bg-vtv-card py-1 text-center border-t border-slate-800">
            <p className="text-[10px] text-gray-500">Powered by VTV AI System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;