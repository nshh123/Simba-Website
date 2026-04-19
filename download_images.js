const https = require('https');
const fs = require('fs');

const items = [
  { id: 'prod-001', keyword: 'milk' },
  { id: 'prod-002', keyword: 'coffee,beans' },
  { id: 'prod-003', keyword: 'avocado' },
  { id: 'prod-004', keyword: 'beer' },
  { id: 'prod-005', keyword: 'flour' },
  { id: 'prod-006', keyword: 'coffee,drink' },
  { id: 'prod-007', keyword: 'banana' },
  { id: 'prod-008', keyword: 'honey' }
];

if (!fs.existsSync('./public/products')) fs.mkdirSync('./public/products', { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, response => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = new URL(response.headers.location, url).toString();
        download(redirectUrl, dest).then(resolve).catch(reject);
      } else {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }
    });
    request.on('error', reject);
  });
}

async function run() {
  for (const item of items) {
    const url = `https://loremflickr.com/400/400/${item.keyword}/all`;
    console.log(`Downloading ${item.id}...`);
    try {
      await download(url, `./public/products/${item.id}.jpg`);
    } catch (e) {
      console.error(`Failed ${item.id}`, e);
    }
  }
  console.log('Done!');
}

run();
