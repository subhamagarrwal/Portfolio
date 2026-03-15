const fs = require('fs');
let code = fs.readFileSync('src/components/SkillsSection.tsx', 'utf8');
code = code.replace(/text-4xl(.*?)synthwave-text-glow.*?\}/, 'text-4xl text-center mb-12 transition-colors duration-300 \');
let match = code.match(/<span\s*key=\{skill\}[\s\S]*?<\/span>/);
if (match) {
  code = code.replace(/<span\s*key=\{skill\}[\s\S]*?<\/span>/g, '<div key={skill} className=\'liquid-glass-card px-4 py-2 rounded-full text-black text-sm font-medium transition-transform hover:scale-105\'>{skill}</div>');
}
fs.writeFileSync('src/components/SkillsSection.tsx', code);
