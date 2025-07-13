import React from 'react';
import { Zap } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

const PerformanceSettings = () => {
  const [performance, setPerformance] = React.useState(50);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Performance</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Processing Power</Label>
            <span className="text-sm text-muted-foreground">{performance}%</span>
          </div>
          <Slider
            value={[performance]}
            onValueChange={([value]) => setPerformance(value)}
            max={100}
            step={10}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <Label>Auto-Optimization</Label>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  );
};

export default PerformanceSettings;