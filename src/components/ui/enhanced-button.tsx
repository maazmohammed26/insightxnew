
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps extends Omit<ButtonProps, 'asChild'> {
  loading?: boolean;
  gradient?: 'purple' | 'blue' | 'green' | 'orange' | 'red';
  effect3d?: boolean;
  glow?: boolean;
  ripple?: boolean;
}

const gradientClasses = {
  purple: 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-purple-500/25',
  blue: 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-blue-500/25',
  green: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/25',
  orange: 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-orange-500/25',
  red: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-red-500/25'
};

const EnhancedButton = React.forwardRef<
  HTMLButtonElement,
  EnhancedButtonProps & Omit<HTMLMotionProps<"button">, keyof EnhancedButtonProps>
>(({ 
  className, 
  children, 
  loading = false, 
  disabled,
  gradient,
  effect3d = false,
  glow = false,
  ripple = false,
  ...props 
}, ref) => {
  const isDisabled = disabled || loading;

  const buttonClasses = cn(
    "relative overflow-hidden transition-all duration-300",
    gradient && gradientClasses[gradient],
    effect3d && "transform-gpu hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl",
    glow && "hover:shadow-2xl hover:shadow-current/25",
    ripple && "before:absolute before:inset-0 before:bg-white before:opacity-0 hover:before:opacity-10 before:transition-opacity",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
    className
  );

  return (
    <motion.div
      whileHover={!isDisabled ? { scale: effect3d ? 1.05 : 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: effect3d ? 0.95 : 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mr-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </motion.div>
        )}
        <motion.span
          initial={{ opacity: loading ? 0 : 1 }}
          animate={{ opacity: loading ? 0.7 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
        {ripple && (
          <motion.div
            className="absolute inset-0 bg-white opacity-0 pointer-events-none"
            whileTap={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.4 }}
          />
        )}
      </Button>
    </motion.div>
  );
});

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton };
