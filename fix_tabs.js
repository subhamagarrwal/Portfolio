const fs = require('fs');
const path = require('path');
const file = 'src/components/JourneySection.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/data-\[state=active\]:text-white/g, "data-[state=active]:text-[var(--btn-text-color)]");
fs.writeFileSync(file, c);
