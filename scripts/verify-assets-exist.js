/**
 * verify-assets-exist.js
 * 
 * Verifies that all local image paths cited in data files actually exist in 'public/'.
 * Prevents "missing image" 404s at runtime.
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const DATA_FILES = [
    '../data/onsen-image-stock.json',
    '../data/onsen-image-master.json'
];

let hasError = false;

function checkFile(relativePath) {
    const fullPath = path.join(__dirname, relativePath);
    if (!fs.existsSync(fullPath)) return;

    console.log(`Scanning ${relativePath}...`);
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

    function traverse(obj) {
        if (!obj) return;
        if (typeof obj === 'object') {
            if (obj.url && typeof obj.url === 'string') {
                checkUrl(obj.url);
            }
            for (const key in obj) {
                if (typeof obj[key] === 'object') {
                    traverse(obj[key]);
                }
            }
        } else if (Array.isArray(obj)) {
            obj.forEach(traverse);
        }
    }

    function checkUrl(url) {
        if (!url.startsWith('/')) return; // Ignore http:// or relative without slash (unlikely)
        if (url.startsWith('http')) return; // Ignore external

        const localPath = path.join(PUBLIC_DIR, url);
        if (!fs.existsSync(localPath)) {
            console.error(`❌ MISSING ASSET: ${url}`);
            hasError = true;
        }
    }

    traverse(data);
}

// Check placeholder specifically
const PLACEHOLDER = '/images/placeholder/onsen.svg';
const placeholderPath = path.join(PUBLIC_DIR, PLACEHOLDER);
if (!fs.existsSync(placeholderPath)) {
    console.error(`❌ CRITICAL: Placeholder missing at ${PLACEHOLDER}`);
    hasError = true;
}

DATA_FILES.forEach(checkFile);

if (hasError) {
    console.error('BUILD FAILED: Missing assets detected.');
    process.exit(1);
} else {
    console.log('✅ All referenced assets exist.');
}
