const fs = require('fs');
const path = require('path');
const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
files.forEach(file => {
  const p = path.join(dir, file);
  let orig = fs.readFileSync(p, 'utf8');
  let c = orig;
  c = c.replace(/return palettes\.preDawn\.bottom;[^\n]*\n/g, "return '#a78bfa';\n");
  c = c.replace(/return palettes\.morning\.top;[^\n]*\n/g, "return '#1d4ed8';\n");
  c = c.replace(/return '#7c3aed';[^\n]*\n/g, "return '#ffffff';\n");
  if (c !== orig) fs.writeFileSync(p, c);
});
