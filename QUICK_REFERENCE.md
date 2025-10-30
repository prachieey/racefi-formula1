# 🏁 Motorsport Color Palette - Quick Reference

## Color Hex Codes

| Color | Hex | Usage |
|-------|-----|-------|
| **Jet Black** | `#0f0f0f` | Deep backgrounds |
| **Charcoal** | `#2a2a2a` | Cards, containers |
| **Charcoal Light** | `#3d3d3d` | Hover states |
| **Pure White** | `#ffffff` | Text, accents |
| **Fiery Red** | `#dc2626` | Primary accent |
| **Red Bright** | `#ef4444` | Emphasis |
| **Red Dark** | `#991b1b` | Pressed states |
| **Racing Yellow** | `#fbbf24` | Secondary accent |
| **Yellow Bright** | `#fcd34d` | Highlights |
| **Yellow Dark** | `#d97706` | Pressed states |
| **Burnt Orange** | `#ea580c` | Tertiary accent |
| **Orange Bright** | `#f97316` | Emphasis |
| **Orange Dark** | `#c2410c` | Pressed states |
| **Metallic Silver** | `#e5e7eb` | Premium details |
| **Silver Light** | `#f3f4f6` | Light highlights |
| **Silver Dark** | `#d1d5db` | Borders, shadows |

## CSS Classes

### Background Colors
```css
.bg-motorsport-jet
.bg-motorsport-charcoal
.bg-motorsport-charcoal-light
.bg-motorsport-white
.bg-motorsport-red
.bg-motorsport-red-bright
.bg-motorsport-yellow
.bg-motorsport-yellow-bright
.bg-motorsport-orange
.bg-motorsport-orange-bright
.bg-motorsport-silver
```

### Text Colors
```css
.text-motorsport-white
.text-motorsport-charcoal
.text-motorsport-red
.text-motorsport-red-bright
.text-motorsport-yellow
.text-motorsport-orange
.text-motorsport-silver
```

### Border Colors
```css
.border-motorsport-red
.border-motorsport-yellow
```

## Effects

### Glow Effects
```css
.glow-motorsport-red
.glow-motorsport-red-strong
.glow-motorsport-yellow
.glow-motorsport-orange
.glow-motorsport-multi
```

### Text Effects
```css
.stroke-motorsport-red
.stroke-motorsport-yellow
```

### Speed Lines
```css
.speed-lines-horizontal
.speed-lines-vertical
```

### Texture Effects
```css
.matte-charcoal
.glossy-accent
.asphalt-texture
.burnout-smoke
```

### Pattern Effects
```css
.pit-lane-stripes
.pit-lane-stripes-h
.checkered-flag
```

### Gradients
```css
.gradient-race-red-to-orange
.gradient-race-yellow-to-orange
.gradient-race-dark
.gradient-race-charcoal-to-black
.metallic-silver
```

## Animations

```css
.animate-pulse-race      /* Heartbeat effect */
.animate-drift           /* Lateral movement */
.animate-engine-rev      /* Scale pulse */
.animate-tire-screech    /* Rotation */
.animate-acceleration    /* Skew effect */
.animate-pit-stop-flash  /* Brightness pulse */
.animate-checkered-wave  /* Wave motion */
```

## Interactive States

### Hover Effects
```css
.hover-race-glow
.hover-race-lift
.hover-race-scale
.hover-race-spin
```

### Other States
```css
.focus-race-ring
.active-race
.disabled-race
```

## Common Patterns

### Primary Button
```html
<button class="bg-motorsport-red hover-race-glow text-motorsport-white px-6 py-3 rounded font-bold">
  Launch
</button>
```

### Secondary Button
```html
<button class="bg-motorsport-charcoal border-2 border-motorsport-yellow text-motorsport-yellow hover-race-lift px-6 py-3 rounded font-bold">
  Learn More
</button>
```

### Card
```html
<div class="bg-motorsport-charcoal matte-charcoal border-l-4 border-motorsport-red p-6 rounded">
  <h3 class="text-motorsport-yellow">Title</h3>
  <p class="text-motorsport-white">Content</p>
</div>
```

### Badge
```html
<span class="bg-motorsport-red text-motorsport-white px-3 py-1 rounded glow-motorsport-red font-bold">
  Live
</span>
```

### Hero Section
```html
<section class="bg-motorsport-jet text-motorsport-white">
  <h1 class="stroke-motorsport-red text-5xl font-bold">Title</h1>
  <p class="text-motorsport-yellow text-xl">Subtitle</p>
</section>
```

## Tailwind Config Access

All colors are available via Tailwind's `extend` theme:

```javascript
// In Tailwind classes:
bg-motorsport[jet]
bg-motorsport[charcoal]
bg-motorsport[red]
bg-motorsport[yellow]
bg-motorsport[orange]
bg-motorsport[silver]
// etc.
```

## Design Tips

✅ **High Contrast Combinations**
- Jet Black + Pure White
- Charcoal + Yellow
- Charcoal + Red

✅ **Energy Combinations**
- Red + Yellow (Speed & Heat)
- Red + Orange (Intensity)
- Yellow + Orange (Warmth)

✅ **Premium Combinations**
- Charcoal + Silver (Luxury)
- Jet Black + Silver (Elegance)
- Charcoal + Red + Silver (Performance)

❌ **Avoid**
- Too many bright colors at once
- Low contrast text on backgrounds
- Overusing animations (use sparingly)

## Performance Notes

- All effects are CSS-only (no JavaScript)
- Animations use GPU-accelerated transforms
- Mobile-optimized with reduced complexity
- Glow effects use efficient box-shadows
- Patterns use efficient gradients

## View Demo

Import and use the `ColorPaletteDemo` component to see all colors and effects in action:

```typescript
import ColorPaletteDemo from './components/ColorPaletteDemo';

// In your app:
<ColorPaletteDemo />
```

## Documentation

See `MOTORSPORT_COLOR_PALETTE.md` for comprehensive documentation with detailed usage examples.
