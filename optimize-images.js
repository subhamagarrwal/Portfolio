import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'public/photos');
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    const filePath = path.join(dir, file);
    const parsed = path.parse(filePath);
    const outPath = path.join(dir, `${parsed.name}.webp`);
    
    sharp(filePath)
      .resize(800) // downscale
      .webp({ quality: 80 })
      .toFile(outPath)
      .then(() => {
        console.log(`Converted ${file} to WebP`);
        fs.unlinkSync(filePath);
      })
      .catch(err => console.error(err));
  }
});
