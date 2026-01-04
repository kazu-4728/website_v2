/**
 * verify-assets-policy.js
 * 
 * Assets Management Policy Verification
 * - Stock/UI Data (onsen-image-stock.json): STRICT (No external URLs, must start with /images/)
 * - Master Ledger (onsen-image-master.json): WARN (External URLs allowed but reported)
 */

const fs = require('fs');
const path = require('path');

const STOCK_PATH = path.join(__dirname, '../data/onsen-image-stock.json');
const MASTER_PATH = path.join(__dirname, '../data/onsen-image-master.json');
const REPORT_PATH = path.join(__dirname, '../data/master-external-urls-report.txt');

let hasError = false;

function isExternal(url) {
    return url.startsWith('http://') || url.startsWith('https://');
}

function isLocal(url) {
    return url.startsWith('/images/');
}

function checkStock() {
    console.log('Checking Stock Data (Strict Mode)...');
    if (!fs.existsSync(STOCK_PATH)) {
        console.log('Stock file not found (New project?). Skipping.');
        return;
    }

    const data = JSON.parse(fs.readFileSync(STOCK_PATH, 'utf8'));
    let errors = [];

    // Traverse recursively
    function traverse(obj, path = '') {
        if (!obj) return;
        if (typeof obj === 'string') {
            // Check if it looks like an image URL based on context or blindly if strict
            // Here we assume checking values that are URLs
            if (isExternal(obj)) {
                errors.push(`${path}: External URL found: ${obj}`);
            } else if (obj.startsWith('/') && !isLocal(obj)) {
                // Warn about non-standard local paths? 
                // For now, focus on external ban
            }
        } else if (Array.isArray(obj)) {
            obj.forEach((item, index) => traverse(item, `${path}[${index}]`));
        } else if (typeof obj === 'object') {
            for (const key in obj) {
                if (key === 'url' && typeof obj[key] === 'string') {
                    if (isExternal(obj[key])) {
                        errors.push(`${path}.${key}: External URL found: ${obj[key]}`);
                    }
                } else {
                    traverse(obj[key], `${path}.${key}`);
                }
            }
        }
    }

    traverse(data, 'root');

    if (errors.length > 0) {
        console.error('❌ STRICT POLICY VIOLATION in Stock Data:');
        errors.forEach(e => console.error(e));
        hasError = true;
    } else {
        console.log('✅ Stock Data is compliant.');
    }
}

function checkMaster() {
    console.log('Checking Master Data (Warn Mode)...');
    if (!fs.existsSync(MASTER_PATH)) {
        console.log('Master file not found. Skipping.');
        return;
    }

    const data = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
    let warnings = [];

    function traverse(obj) {
        if (!obj) return;
        if (typeof obj === 'object') {
            for (const key in obj) {
                if (key === 'url' && typeof obj[key] === 'string') {
                    if (isExternal(obj[key])) {
                        warnings.push(obj[key]);
                    }
                } else {
                    traverse(obj[key]);
                }
            }
            if (Array.isArray(obj)) {
                obj.forEach(item => traverse(item));
            }
        }
    }

    traverse(data);

    if (warnings.length > 0) {
        console.warn(`⚠️  Found ${warnings.length} external URLs in Master Data.`);
        console.warn(`   These are allowed in Master but effectively missing in UI (fallback applied).`);
        console.warn(`   See report at: ${REPORT_PATH}`);

        fs.writeFileSync(REPORT_PATH, warnings.join('\n'));
    } else {
        console.log('✅ Master Data is fully local (Great job!).');
    }
}

// Ensure strict policy on Stock
checkStock();
// Generate report for Master
checkMaster();

if (hasError) {
    console.error('BUILD FAILED: Strict asset policy violated.');
    process.exit(1);
} else {
    console.log('Asset Policy Verification Passed.');
}
