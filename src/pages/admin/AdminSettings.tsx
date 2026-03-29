import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [minAttendance, setMinAttendance] = useState(70);
  const [warningThreshold, setWarningThreshold] = useState(75);
  const [motivationThreshold, setMotivationThreshold] = useState(95);
  const [autoNotify, setAutoNotify] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">System Settings</h1>

      <div className="stat-card max-w-2xl space-y-6">
        <h3 className="font-heading font-semibold flex items-center gap-2">
          <Settings className="w-4 h-4 text-secondary" />
          Attendance Rules
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Minimum Attendance Threshold (%)</label>
            <input type="number" value={minAttendance} onChange={e => setMinAttendance(Number(e.target.value))} min={0} max={100}
              className="w-full px-4 py-3 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50" />
            <p className="text-xs text-muted-foreground mt-1">Students below this will be marked as Critical</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Warning Threshold (%)</label>
            <input type="number" value={warningThreshold} onChange={e => setWarningThreshold(Number(e.target.value))} min={0} max={100}
              className="w-full px-4 py-3 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50" />
            <p className="text-xs text-muted-foreground mt-1">Students between min and warning will be in Warning status</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Motivation Message Threshold (%)</label>
            <input type="number" value={motivationThreshold} onChange={e => setMotivationThreshold(Number(e.target.value))} min={0} max={100}
              className="w-full px-4 py-3 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50" />
            <p className="text-xs text-muted-foreground mt-1">Students above this get motivational messages</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setAutoNotify(!autoNotify)}
              className={`w-12 h-6 rounded-full transition ${autoNotify ? 'bg-secondary' : 'bg-muted'} relative`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${autoNotify ? 'left-6' : 'left-0.5'}`} />
            </button>
            <span className="text-sm font-medium">Auto-send notifications</span>
          </div>
        </div>

        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-lg gradient-secondary text-secondary-foreground font-semibold hover:opacity-90 transition">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
