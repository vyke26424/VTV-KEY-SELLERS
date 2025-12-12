import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, ShoppingCart, 
  Users, FolderTree, Settings, Menu, X, Package 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SIDEBAR_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Sản phẩm', icon: ShoppingBag, path: '/admin/products' },
  { name: 'Danh mục', icon: FolderTree, path: '/admin/categories' },
  { name: 'Đơn hàng', icon: ShoppingCart, path: '/admin/orders' },
  { name: 'Kho hàng', icon: Package, path: '/admin/stock' }, // Map với admin-stockitem
  { name: 'Khách hàng', icon: Users, path: '/admin/customers' },
  { name: 'Cài đặt', icon: Settings, path: '/admin/settings' },
];

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div 
      animate={{ width: isCollapsed ? 80 : 250 }}
      className="bg-slate-900 border-r border-slate-800 h-screen sticky top-0 flex flex-col z-20 transition-all duration-300 shadow-xl"
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-xl font-black text-white tracking-tighter"
          >
            VTV<span className="text-vtv-green">ADMIN</span>
          </motion.span>
        )}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-slate-800 text-gray-400 hover:text-white transition"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        <nav className="space-y-1 px-2">
          {SIDEBAR_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'} // Chỉ active chính xác path cho Dashboard
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                ${isActive 
                  ? 'bg-vtv-green text-black font-bold shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                  : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <item.icon size={22} className="flex-shrink-0" />
              
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}

              {/* Tooltip khi collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg">
            AD
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">Super Admin</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;