#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataPath = path.join(root, 'data', 'onsen-site.json');
const errors = [];

function fail(message) {
  errors.push(message);
}

function requireString(value, pathLabel) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail(`${pathLabel} must be a non-empty string`);
  }
}

function requireStringArray(value, pathLabel) {
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== 'string' || item.trim().length === 0)) {
    fail(`${pathLabel} must be a non-empty string array`);
  }
}

function validateImage(image, pathLabel) {
  if (!image || typeof image !== 'object') {
    fail(`${pathLabel} must be an object`);
    return;
  }

  ['src', 'alt', 'credit', 'license', 'sourceUrl'].forEach((key) => {
    requireString(image[key], `${pathLabel}.${key}`);
  });

  if (typeof image.src === 'string' && /placeholder|dummy|sample/i.test(image.src)) {
    fail(`${pathLabel}.src must not use placeholder-like image paths`);
  }

  if (typeof image.src === 'string' && !image.src.startsWith('https://') && !image.src.startsWith('/')) {
    fail(`${pathLabel}.src must be https URL or local public path`);
  }
}

if (!fs.existsSync(dataPath)) {
  console.error(`Missing data file: ${dataPath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

requireString(data.site?.name, 'site.name');
requireString(data.site?.tagline, 'site.tagline');
requireString(data.site?.description, 'site.description');
requireString(data.site?.baseUrl, 'site.baseUrl');
validateImage(data.home?.hero?.image, 'home.hero.image');

if (!Array.isArray(data.onsenSpots) || data.onsenSpots.length === 0) {
  fail('onsenSpots must be a non-empty array');
} else {
  const slugs = new Set();

  data.onsenSpots.forEach((spot, index) => {
    const base = `onsenSpots[${index}]`;
    ['slug', 'name', 'prefecture', 'area', 'catchcopy', 'summary', 'access', 'stayStyle', 'season'].forEach((key) => {
      requireString(spot[key], `${base}.${key}`);
    });
    requireStringArray(spot.tags, `${base}.tags`);
    requireStringArray(spot.springTypes, `${base}.springTypes`);
    requireStringArray(spot.bestFor, `${base}.bestFor`);
    validateImage(spot.image, `${base}.image`);

    if (spot.slug) {
      if (slugs.has(spot.slug)) {
        fail(`${base}.slug is duplicated: ${spot.slug}`);
      }
      slugs.add(spot.slug);
    }
  });

  const slugSet = new Set(data.onsenSpots.map((spot) => spot.slug));

  data.home?.sections?.forEach((section, sectionIndex) => {
    section.spotSlugs?.forEach((slug) => {
      if (!slugSet.has(slug)) {
        fail(`home.sections[${sectionIndex}].spotSlugs references missing slug: ${slug}`);
      }
    });
  });

  data.purposes?.forEach((purpose, purposeIndex) => {
    purpose.recommendedSlugs?.forEach((slug) => {
      if (!slugSet.has(slug)) {
        fail(`purposes[${purposeIndex}].recommendedSlugs references missing slug: ${slug}`);
      }
    });
  });

  data.articles?.forEach((article, articleIndex) => {
    ['slug', 'title', 'excerpt', 'date', 'category', 'imageSlug'].forEach((key) => {
      requireString(article[key], `articles[${articleIndex}].${key}`);
    });

    if (!slugSet.has(article.imageSlug)) {
      fail(`articles[${articleIndex}].imageSlug references missing slug: ${article.imageSlug}`);
    }

    if (!Array.isArray(article.sections) || article.sections.length === 0) {
      fail(`articles[${articleIndex}].sections must be a non-empty array`);
    }
  });
}

if (errors.length > 0) {
  console.error('Onsen site data validation failed:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Onsen site data validation passed.');
