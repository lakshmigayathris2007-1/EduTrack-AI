import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { notifications } from '@/data/mockData';
import { Bell, AlertTriangle, Trophy } from 'lucide-react';

export default function StudentNotifications() {
  const { user } = useAuth();
  const studentNotifs = notifications.filter(n => n.student_id === user!.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Notifications</h1>

      {studentNotifs.length === 0 ? (
        <div className="stat-card text-center py-12">
          <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No notifications at this time</p>
        </div>
      ) : (
        <div className="space-y-3">
          {studentNotifs.map(notif => (
            <div key={notif.notification_id} className={`stat-card flex gap-4 ${!notif.read ? 'border-l-4 border-l-secondary' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                notif.type === 'Warning' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
              }`}>
                {notif.type === 'Warning' ? <AlertTriangle className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed">{notif.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(notif.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
