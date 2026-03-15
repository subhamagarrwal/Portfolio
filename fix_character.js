const fs = require('fs');
let content = fs.readFileSync('src/components/JourneySection.tsx', 'utf8');
content = content.replace(/\{item\.location \? \.*?\ : ''\}/g, '{item.location ? \ • \\ : \'\'}');
fs.writeFileSync('src/components/JourneySection.tsx', content);
