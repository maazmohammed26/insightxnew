
import React from 'react';
import { Moon, Sun, Laptop, Palette, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';

const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean and bright interface' },
    { value: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Easy on the eyes' },
    { value: 'system', label: 'System Default', icon: Monitor, desc: 'Follows your device settings' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-semibold">Appearance & Theme</h3>
      </div>
      
      <div className="space-y-4">
        <div className="grid gap-3">
          {themeOptions.map((option, index) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={theme === option.value ? "default" : "outline"}
                className={`w-full justify-start h-16 ${
                  theme === option.value 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700' 
                    : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/20 dark:hover:to-purple-950/20'
                }`}
                onClick={() => setTheme(option.value)}
              >
                <option.icon className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{option.label}</div>
                  <div className={`text-xs ${theme === option.value ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                    {option.desc}
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <Sun className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <Label className="font-medium">Auto Theme Toggle</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Quick light/dark switch</p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
