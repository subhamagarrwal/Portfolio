const fs = require('fs');
let file = fs.readFileSync('src/components/JourneySection.tsx', 'utf8');

// Replace TabsList
file = file.replace(
  /<TabsList className="flex flex-col sm:grid w-full sm:grid-cols-3 mb-8 bg-transparent gap-2 p-1 border rounded-\[2rem\] sm:rounded-full backdrop-blur-sm shadow-inner overflow-hidden mx-auto max-w-3xl h-auto"/g,
  '<TabsList className="grid w-full grid-cols-3 mb-8 bg-transparent gap-1 sm:gap-2 p-1 border rounded-full backdrop-blur-sm shadow-inner overflow-hidden mx-auto max-w-3xl h-auto"'
);

// Replace TabsTrigger classNames to allow text wrapping on mobile
file = file.replace(
  /className={\ounded-full flex-1 w-full data-\[state=active\]:bg-\[var\(--theme-color\)\] data-\[state=active\]:text-white transition-all duration-300 \$\{textClass\}\}/g,
  'className={\ounded-full flex-1 w-full text-[11px] sm:text-sm whitespace-normal sm:whitespace-nowrap px-1 sm:px-3 py-2 data-[state=active]:bg-[var(--theme-color)] data-[state=active]:text-white transition-all duration-300 \\}'
);

fs.writeFileSync('src/components/JourneySection.tsx', file);
