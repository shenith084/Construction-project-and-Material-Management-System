const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk('backend/app/api');

files.forEach(file => {
  if (file.endsWith('route.js')) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove CORS_HEADERS definition
    content = content.replace(/const CORS_HEADERS = \{[\s\S]*?\};\n+/g, '');
    
    // Remove OPTIONS handler
    content = content.replace(/export async function OPTIONS\(\) \{[\s\S]*?\}\n+/g, '');
    
    // Remove headers: CORS_HEADERS from NextResponse
    // E.g., { status: 404, headers: CORS_HEADERS } -> { status: 404 }
    content = content.replace(/, headers: CORS_HEADERS/g, '');
    content = content.replace(/headers: CORS_HEADERS/g, '');
    
    // Clean up empty objects if left behind e.g., NextResponse.json({ ... }, { })
    content = content.replace(/, \{\s*\}/g, '');
    
    fs.writeFileSync(file, content);
    console.log('Processed', file);
  }
});
