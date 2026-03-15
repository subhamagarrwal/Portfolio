const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      content = content.split('synthwave-text-glow').join('');
      content = content.split('hover:synthwave-glow').join('');
      content = content.split('synthwave-glow').join('');
      
      if(content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Cleaned: ' + fullPath);
      }
    }
  }
}

processDir('src');
