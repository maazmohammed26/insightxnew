import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crop } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardCropDialogProps {
  onCropChange: (dimensions: { width: number; height: number }) => void;
}

const DashboardCropDialog = ({ onCropChange }: DashboardCropDialogProps) => {
  const [width, setWidth] = useState<number>(300);
  const [height, setHeight] = useState<number>(200);

  const handleApply = () => {
    onCropChange({ width, height });
    toast.success('Widget dimensions updated');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Crop className="w-4 h-4" />
          Resize
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Custom Dimensions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Width (px)</Label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={100}
              max={1200}
            />
          </div>
          <div className="space-y-2">
            <Label>Height (px)</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={100}
              max={800}
            />
          </div>
          <Button onClick={handleApply} className="w-full">
            Apply Dimensions
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardCropDialog;