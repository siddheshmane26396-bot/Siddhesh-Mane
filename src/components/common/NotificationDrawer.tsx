import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCheck, Bell, AlertCircle, Calendar, Receipt, BookOpen, MessageSquare } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, currentRole } = useApp();

  if (!isOpen) return null;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Attendance':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'Fee':
        return <Receipt className="w-4 h-4 text-amber-500" />;
      case 'Exam':
        return <Calendar className="w-4 h-4 text-indigo-500" />;
      case 'Homework':
        return <BookOpen className="w-4 h-4 text-emerald-500" />;
      case 'Enquiry':
        return <MessageSquare className="w-4 h-4 text-sky-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900">Institute Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                  item.isRead
                    ? 'bg-white border-slate-200 text-slate-600'
                    : 'bg-sky-50/50 border-sky-200 text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-slate-100 shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold truncate">{item.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.date}</span>
                    </div>
                    <p className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Category: {item.category}</span>
                      {!item.isRead && (
                        <span className="text-sky-600 font-medium hover:underline">Mark as read</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{notifications.filter((n) => !n.isRead).length} unread alerts</span>
          <button
            onClick={() => notifications.forEach((n) => markNotificationRead(n.id))}
            className="text-sky-600 hover:text-sky-700 font-medium"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};
