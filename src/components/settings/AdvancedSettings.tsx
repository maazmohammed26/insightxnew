import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Zap, 
  Shield, 
  Download, 
  Upload, 
  Bell, 
  Database, 
  HardDrive,
  Cpu
} from 'lucide-react';

const AdvancedSettings = () => {
  const [autoBackup, setAutoBackup] = React.useState(false);
  const [encryption, setEncryption] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [compression, setCompression] = React.useState(50);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <Label>Auto Backup</Label>
          </div>
          <Switch 
            checked={autoBackup} 
            onCheckedChange={setAutoBackup}
          />
        </div>

        <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <Label>Data Encryption</Label>
          </div>
          <Switch 
            checked={encryption} 
            onCheckedChange={setEncryption}
          />
        </div>

        <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <Label>Notifications</Label>
          </div>
          <Switch 
            checked={notifications} 
            onCheckedChange={setNotifications}
          />
        </div>

        <div className="space-y-2 bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-primary" />
              <Label>Data Compression</Label>
            </div>
            <span className="text-sm text-muted-foreground">{compression}%</span>
          </div>
          <Slider
            value={[compression]}
            onValueChange={([value]) => setCompression(value)}
            max={100}
            step={10}
          />
        </div>

        <div className="space-y-2 bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <Label>Processing Power</Label>
            </div>
            <span className="text-sm text-muted-foreground">Auto</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Automatically adjusts based on system resources
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;