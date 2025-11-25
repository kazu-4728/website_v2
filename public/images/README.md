# Images Directory

This directory contains all image assets for the website.

## Structure

```
images/
├── hero/           # Hero section images
├── features/       # Feature images
├── topics/         # Topic-specific images
└── bg/            # Background images
```

## Image Guidelines

### Recommended Sizes
- **Hero images**: 1920x1080px (Full HD)
- **Feature images**: 800x600px
- **Topic images**: 1200x800px  
- **Background images**: 1920x1080px

### Format
- Use **WebP** for best performance
- Fallback to **JPG** for compatibility
- Use **PNG** only for images requiring transparency

### Optimization
- Compress images to reduce file size
- Use Next.js Image component for automatic optimization
- Provide alt text for accessibility

## Image Sources

You can use:
1. **Your own images** - Place them in this directory
2. **Unsplash** - Free high-quality stock photos (already integrated)
3. **Generated images** - SVG placeholders for prototyping

## Current System

The image system (`app/lib/image-system.ts`) automatically:
- Tries to load local images first
- Falls back to Unsplash if local image doesn't exist
- Generates placeholder if neither exists

This allows you to gradually replace Unsplash images with your own while the site continues to function.
