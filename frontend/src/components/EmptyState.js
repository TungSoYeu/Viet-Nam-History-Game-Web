import React from 'react';
import { Ghost, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';

export default function EmptyState({ 
  title = "Không có dự liệu", 
  message = "Hãy liên hệ giáo viên để thêm nội dung nhé!", 
  actionText = "Quay lại", 
  onAction 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]">
      <motion.div 
        animate={{ y: [0, -10, 0] }} 
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6 relative"
        style={{ 
          background: 'rgba(212,160,83,0.1)', 
          border: '1px solid rgba(212,160,83,0.3)',
          boxShadow: '0 0 30px rgba(212,160,83,0.2)'
        }}
      >
        <Ghost size={40} className="text-amber-500" />
        <Sparkles size={20} className="text-amber-300 absolute -top-2 -right-2 opacity-70" />
      </motion.div>
      <h3 className="text-xl font-black text-amber-400 mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-6 max-w-sm">{message}</p>
      {onAction && (
        <Button onClick={onAction} variant="ghost" className="border-white/20">
          {actionText}
        </Button>
      )}
    </div>
  );
}
