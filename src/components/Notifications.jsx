// src/components/NavbarNotifications.jsx
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { format, parseISO } from 'date-fns'     // ← add parseISO here
export default function NavbarNotifications() {
  const { notifications, markAsSeen } = useNotifications();
  const [open, setOpen] = useState(false);

  const unseenCount = notifications.filter(n => !n.seen).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell />
        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unseenCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded">
          {notifications.length === 0
            ? <div className="p-4 text-gray-500">No notifications</div>
            : notifications.map(n => (
                <div
                  key={n.id}
                  className={`p-3 border-b ${n.seen ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{n.title}</div>
                      <div className="text-sm text-gray-600">
                        starts at {format(parseISO(n.start), 'p')}
                      </div>
                    </div>
                    {!n.seen && (
                      <button
                        onClick={() => markAsSeen(n.id)}
                        className="text-blue-500 text-sm"
                      >
                        Mark seen
                      </button>
                    )}
                  </div>
                </div>
              ))
          }
        </div>
      )}
    </div>
  );
}
