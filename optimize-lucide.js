import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const toKebabCase = str => str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

const files = walk(path.join(process.cwd(), 'src'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const regex = /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]lucide-react['"];?/g;
  let matches;
  let modified = false;
  
  while ((matches = regex.exec(content)) !== null) {
    const importTokens = matches[1].split(',').map(s => s.trim()).filter(Boolean);
    const newImports = importTokens.map(t => {
      // Handle aliasing like "Menu as MenuIcon"
      if (t.includes(' as ')) {
        const [orig, alias] = t.split(' as ').map(s => s.trim());
        return `import ${alias} from 'lucide-react/dist/esm/icons/${toKebabCase(orig)}';`;
      }
      return `import ${t} from 'lucide-react/dist/esm/icons/${toKebabCase(t)}';`;
    }).join('\n');
    
    content = content.replace(matches[0], newImports);
    modified = true;
    regex.lastIndex = 0; // reset
  }
  
  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
