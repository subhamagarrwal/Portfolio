const fs = require('fs');
let file = fs.readFileSync('src/components/GlassDock.tsx', 'utf8');

// Insert drag state
const stateInsertion = 
  const dockContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    const el = dockContainerRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseDown = (e) => {
      // Don't drag if clicking buttons
      if (e.target.closest('button')) return;
      
      e.preventDefault();
      setIsDragging(true);

      const computedStyle = window.getComputedStyle(el);
      const matrix = new DOMMatrixReadOnly(computedStyle.transform);
      currentX = matrix.m41;
      currentY = matrix.m42;

      startX = e.clientX - currentX;
      startY = e.clientY - currentY;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      e.preventDefault();
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;
      
      el.style.transform = \	ranslate(-50%, 0) translate(\px, \px)\;
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    el.addEventListener('mousedown', onMouseDown);
    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);
;
file = file.replace('const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);', 'const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);\n' + stateInsertion);

// Replace the Main Dock container JSX to add the drag styling and apple liquid class
let replaceRegex = /\{\/\* Main Dock \(always visible\) - Direct glass container \*\/\}\s*<div[^>]*className=\{([^]+)\}[^>]*style=\{\{[^}]+\}\}[^>]*>/ms;

let match = file.match(replaceRegex);
if(match) {
  let newDiv =       {/* Main Dock (always visible) - Direct glass container */}
      <div 
        ref={dockContainerRef}
        className={\
          fixed z-[100]
          flex rounded-[999px]
          backdrop-blur-[20px] backdrop-saturate-[180%]
          cursor-grab active:cursor-grabbing select-none
          
          /* Desktop constraints */
          md:bottom-3 md:left-1/2 md:transform md:-translate-x-1/2 md:items-center md:px-2 md:py-0 md:max-w-[calc(100vw-20px)]
          
          /* Mobile constraints */
          max-md:bottom-3 max-md:left-1/2 max-md:transform max-md:-translate-x-1/2 max-md:items-center max-md:px-2 max-md:py-0 max-md:max-w-[calc(100vw-20px)]
          
          \
        \}
        style={{
          background: isDarkTheme 
            ? 'color-mix(in srgb, #000 20%, transparent)' 
            : 'color-mix(in srgb, #fff 20%, transparent)',
        }}
        role="navigation"
        aria-label="Quick navigation dock"
      >;
  file = file.replace(match[0], newDiv);
}

// Modify the button background to extend to top/bottom
// We will replace the hover styling on the dock items
let buttonRegex = /className=\{\[\s\n]*glass-dock-item[\s\n]*relative flex items-center justify-center[\s\n]*rounded-xl[\s\n]*select-none outline-none focus:outline-none[\s\n]*transform hover:scale-105 active:scale-95 transition-all duration-150[\s\n]*\$\{isHoveredOrActive[\s\n]*\? 'bg-white\/25 shadow-lg scale-105'[\s\n]*: 'hover:bg-white\/15'[\s\n]*\}/ms;

file = file.replace(buttonRegex, \className={\\\
                    glass-dock-item
                    relative flex items-center justify-center
                    rounded-lg
                    select-none outline-none focus:outline-none
                    transition-all duration-300
                    h-full my-1
                    \\);

// Remove any inline background styles for hover to let CSS override
let buttonStyleRegex = /style=\{\{[\s\n]+background: isHoveredOrActive[\s\n]+\? isDarkTheme[^}]+\},[\s\n]+boxShadow: isHoveredOrActive[^}]+\},[\s\n]+\}\}/ms;
file = file.replace(buttonStyleRegex, 'style={{}}');

fs.writeFileSync('src/components/GlassDock.tsx', file);
console.log('Dock updated');
