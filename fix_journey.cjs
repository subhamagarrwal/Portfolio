const fs = require('fs');
let content = fs.readFileSync('src/components/JourneySection.tsx', 'utf8');
const lines = content.split('\n');
const newLines = lines.map(line => {
  if (line.includes('item.duration') && line.includes('item.location')) {
    return '                            {item.duration} {item.location ? \ • \\ : \'\'}';
  }
  return line;
});
fs.writeFileSync('src/components/JourneySection.tsx', newLines.join('\n'));
