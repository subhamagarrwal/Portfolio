const fs=require('fs'); 
let f = fs.readFileSync('src/components/MountainLandscape.tsx', 'utf8'); 
f = f.replace(/style\.setProperty\('--sun-x',[^;]*;/g, 'style.setProperty(\'--sun-x\', \\%\);');
f = f.replace(/style\.setProperty\('--sun-y',[^;]*;/g, 'style.setProperty(\'--sun-y\', \\%\);');
f = f.replace(/style\.setProperty\('--sun-angle',[^;]*;/g, 'style.setProperty(\'--sun-angle\', \\deg\);');
f = f.replace(/style\.setProperty\('--moon-x',[^;]*;/g, 'style.setProperty(\'--moon-x\', \\%\);');
f = f.replace(/style\.setProperty\('--moon-y',[^;]*;/g, 'style.setProperty(\'--moon-y\', \\%\);');
fs.writeFileSync('src/components/MountainLandscape.tsx', f);
