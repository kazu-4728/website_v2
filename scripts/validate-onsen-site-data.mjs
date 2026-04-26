#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataPath = path.join(root, 'data', 'directory-site.json');
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
requireStringArray(data.site?.keywords, 'site.keywords');

if (!Array.isArray(data.areas) || data.areas.length === 0) {
  fail('areas must be a non-empty array');
}

if (!Array.isArray(data.onsens) || data.onsens.length === 0) {
  fail('onsens must be a non-empty array');
}

if (!Array.isArray(data.purposes) || data.purposes.length === 0) {
  fail('purposes must be a non-empty array');
}

const areaIds = new Set();
const areaSlugs = new Set();
const onsenSlugs = new Set();
const purposeIds = new Set();

(data.areas || []).forEach((area, index) => {
  const base = `areas[${index}]`;
  ['id', 'slug', 'name', 'summary'].forEach((key) => requireString(area[key], `${base}.${key}`));
  requireStringArray(area.prefectures, `${base}.prefectures`);
  requireStringArray(area.onsenSlugs, `${base}.onsenSlugs`);
  validateImage(area.image, `${base}.image`);

  if (areaIds.has(area.id)) fail(`${base}.id is duplicated: ${area.id}`);
  if (areaSlugs.has(area.slug)) fail(`${base}.slug is duplicated: ${area.slug}`);
  areaIds.add(area.id);
  areaSlugs.add(area.slug);
});

(data.purposes || []).forEach((purpose, index) => {
  const base = `purposes[${index}]`;
  ['id', 'slug', 'name', 'shortLabel', 'description'].forEach((key) => requireString(purpose[key], `${base}.${key}`));
  requireStringArray(purpose.recommendedSlugs, `${base}.recommendedSlugs`);
  if (purposeIds.has(purpose.id)) fail(`${base}.id is duplicated: ${purpose.id}`);
  purposeIds.add(purpose.id);
});

(data.onsens || []).forEach((onsen, index) => {
  const base = `onsens[${index}]`;
  ['slug', 'name', 'kind', 'areaId', 'prefecture', 'officialName', 'officialUrl', 'verifiedAt', 'summary', 'catchcopy', 'access'].forEach((key) => {
    requireString(onsen[key], `${base}.${key}`);
  });
  requireStringArray(onsen.tags, `${base}.tags`);
  requireStringArray(onsen.springTypes, `${base}.springTypes`);
  requireStringArray(onsen.useCases, `${base}.useCases`);
  validateImage(onsen.image, `${base}.image`);

  if (onsenSlugs.has(onsen.slug)) fail(`${base}.slug is duplicated: ${onsen.slug}`);
  onsenSlugs.add(onsen.slug);
  if (!areaIds.has(onsen.areaId)) fail(`${base}.areaId references missing area: ${onsen.areaId}`);
  if (typeof onsen.officialUrl === 'string' && !onsen.officialUrl.startsWith('https://')) {
    fail(`${base}.officialUrl must be https URL`);
  }
  onsen.useCases?.forEach((purposeId) => {
    if (!purposeIds.has(purposeId)) fail(`${base}.useCases references missing purpose: ${purposeId}`);
  });
});

(data.areas || []).forEach((area, index) => {
  area.onsenSlugs?.forEach((slug) => {
    if (!onsenSlugs.has(slug)) fail(`areas[${index}].onsenSlugs references missing onsen: ${slug}`);
  });
});

(data.purposes || []).forEach((purpose, index) => {
  purpose.recommendedSlugs?.forEach((slug) => {
    if (!onsenSlugs.has(slug)) fail(`purposes[${index}].recommendedSlugs references missing onsen: ${slug}`);
  });
});

(data.home?.featuredAreaIds || []).forEach((areaId) => {
  if (!areaIds.has(areaId)) fail(`home.featuredAreaIds references missing area: ${areaId}`);
});

(data.home?.featuredOnsenSlugs || []).forEach((slug) => {
  if (!onsenSlugs.has(slug)) fail(`home.featuredOnsenSlugs references missing onsen: ${slug}`);
});

(data.articles || []).forEach((article, index) => {
  ['slug', 'title', 'excerpt', 'date', 'category', 'imageSlug'].forEach((key) => requireString(article[key], `articles[${index}].${key}`));
  if (!onsenSlugs.has(article.imageSlug)) fail(`articles[${index}].imageSlug references missing onsen: ${article.imageSlug}`);
  if (!Array.isArray(article.sections) || article.sections.length === 0) fail(`articles[${index}].sections must be a non-empty array`);
});

if (errors.length > 0) {
  console.error('Directory site data validation failed:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Directory site data validation passed.');
