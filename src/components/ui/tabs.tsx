
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex w-full items-center justify-center rounded-lg bg-muted p-1 relative",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

const TabsScrollable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    showScrollButtons?: boolean;
  }
>(({ className, children, showScrollButtons = true, ...props }, ref) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = React.useState(false);
  const [showRightScroll, setShowRightScroll] = React.useState(true);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const scrollInterval = React.useRef<NodeJS.Timeout | null>(null);

  const checkScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Ensure we show left scroll button even with minimal scroll
      setShowLeftScroll(scrollLeft > 5);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  React.useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      // Initial check
      checkScroll();
      
      // Check after a delay to ensure everything has rendered
      const timeout = setTimeout(checkScroll, 500);
      
      currentRef.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      
      return () => {
        currentRef.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
        clearTimeout(timeout);
      };
    }
  }, [checkScroll]);

  const startScroll = (direction: 'left' | 'right') => {
    if (scrollInterval.current) clearInterval(scrollInterval.current);
    setIsScrolling(true);
    
    // Initial scroll
    scroll(direction);
    
    // Continue scrolling while button is pressed
    scrollInterval.current = setInterval(() => {
      scroll(direction);
    }, 100);
  };

  const stopScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
    setIsScrolling(false);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -40 : 40; // Increased for better mobile navigation
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={cn("relative w-full overflow-hidden", className)} {...props}>
      {showScrollButtons && showLeftScroll && (
        <button 
          onClick={() => scroll('left')}
          onMouseDown={() => startScroll('left')}
          onMouseUp={stopScroll}
          onMouseLeave={stopScroll}
          onTouchStart={() => startScroll('left')}
          onTouchEnd={stopScroll}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-purple-500/90 to-purple-600/80 backdrop-blur-sm rounded-l-full p-1.5 shadow-md hover:from-purple-600/90 hover:to-purple-700/80 transition-all animate-fade-in border border-r-0 border-purple-400/30 dark:border-purple-500/30 text-white"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left h-4 w-4">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
      )}
      
      <div 
        ref={scrollRef}
        className="overflow-x-auto theme-scrollbar py-2 px-3 scroll-smooth"
      >
        {children}
      </div>
      
      {showScrollButtons && showRightScroll && (
        <button 
          onClick={() => scroll('right')}
          onMouseDown={() => startScroll('right')}
          onMouseUp={stopScroll}
          onMouseLeave={stopScroll}
          onTouchStart={() => startScroll('right')}
          onTouchEnd={stopScroll}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-l from-purple-500/90 to-purple-600/80 backdrop-blur-sm rounded-r-full p-1.5 shadow-md hover:from-purple-600/90 hover:to-purple-700/80 transition-all animate-fade-in border border-l-0 border-purple-400/30 dark:border-purple-500/30 text-white"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right h-4 w-4">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      )}
    </div>
  );
});
TabsScrollable.displayName = "TabsScrollable";

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsScrollable }
