const fs = require('fs');
let file = fs.readFileSync('src/index.css', 'utf8');
file = file.replace(/box-shadow: 0 10px 30px rgba\(0, 0, 0, 0\.2\);\s*\.liquid-glass-button/ms, 'box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);\n}\n\n.liquid-glass-button');
fs.writeFileSync('src/index.css', file);
console.log('CSS fixed');
