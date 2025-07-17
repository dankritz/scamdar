# Scamdar Extension Icons

This directory should contain the following icon files:

- `icon16.png` - 16x16 pixels (toolbar icon)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Icon Design

The icons should feature:
- A shield (🛡️) symbol representing security
- Color scheme: Blue/purple gradient background with white shield
- Simple, clean design that's recognizable at small sizes

## Creating the Icons

You can create these icons using:
1. Any image editor (GIMP, Photoshop, Figma, etc.)
2. Online icon generators
3. Convert the SVG below to PNG at different sizes

## SVG Template

```svg
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea"/>
      <stop offset="100%" style="stop-color:#764ba2"/>
    </linearGradient>
  </defs>
  
  <!-- Background Circle -->
  <circle cx="64" cy="64" r="60" fill="url(#bg)" stroke="#fff" stroke-width="3"/>
  
  <!-- Shield Shape -->
  <path d="M64 20 L50 30 L50 55 Q50 75 64 85 Q78 75 78 55 L78 30 Z" fill="#fff"/>
  
  <!-- Checkmark -->
  <path d="M58 55 L62 60 L72 45" stroke="#667eea" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>
```

## Quick Online Conversion

1. Copy the SVG code above
2. Go to an online SVG to PNG converter
3. Convert to 16px, 48px, and 128px PNG files
4. Save them as icon16.png, icon48.png, and icon128.png 