# Supastar - Figma Design System Specifications

> **Reverse-engineered design tokens and component specifications from the Supastar codebase**
>
> Use this document to recreate the design system in Figma with pixel-perfect accuracy.

---

## 📐 Design System Overview

**Framework:** Shadcn UI (Radix UI primitives + Tailwind CSS)
**Primary Font:** Inter (Google Fonts)
**Color System:** HSL-based semantic color tokens
**Theming:** Light mode + Dark mode support
**Base Spacing Unit:** 4px (0.25rem)

---

## 🎨 Color Palette

### Light Mode Colors

| Token | HSL Value | HEX Equivalent | Usage |
|-------|-----------|----------------|-------|
| **Background** | `0 0% 100%` | `#FFFFFF` | Main background |
| **Foreground** | `222.2 84% 4.9%` | `#020817` | Main text color |
| **Primary** | `222.2 47.4% 11.2%` | `#09090B` | Primary actions, CTA buttons |
| **Primary Foreground** | `210 40% 98%` | `#F8FAFC` | Text on primary background |
| **Secondary** | `210 40% 96.1%` | `#F1F5F9` | Secondary buttons, backgrounds |
| **Secondary Foreground** | `222.2 47.4% 11.2%` | `#09090B` | Text on secondary |
| **Muted** | `210 40% 96.1%` | `#F1F5F9` | Disabled states, subtle backgrounds |
| **Muted Foreground** | `215.4 16.3% 46.9%` | `#64748B` | Subtle text, descriptions |
| **Accent** | `210 40% 96.1%` | `#F1F5F9` | Hover states, highlights |
| **Accent Foreground** | `222.2 47.4% 11.2%` | `#09090B` | Text on accent |
| **Destructive** | `0 84.2% 60.2%` | `#EF4444` | Error states, delete actions |
| **Destructive Foreground** | `210 40% 98%` | `#F8FAFC` | Text on destructive |
| **Border** | `214.3 31.8% 91.4%` | `#E2E8F0` | Borders, dividers |
| **Input** | `214.3 31.8% 91.4%` | `#E2E8F0` | Input borders |
| **Ring** | `222.2 84% 4.9%` | `#020817` | Focus rings |
| **Card** | `0 0% 100%` | `#FFFFFF` | Card backgrounds |
| **Card Foreground** | `222.2 84% 4.9%` | `#020817` | Card text |
| **Popover** | `0 0% 100%` | `#FFFFFF` | Popover backgrounds |
| **Popover Foreground** | `222.2 84% 4.9%` | `#020817` | Popover text |

### Dark Mode Colors

| Token | HSL Value | HEX Equivalent | Usage |
|-------|-----------|----------------|-------|
| **Background** | `222.2 84% 4.9%` | `#020817` | Main background |
| **Foreground** | `210 40% 98%` | `#F8FAFC` | Main text color |
| **Primary** | `210 40% 98%` | `#F8FAFC` | Primary actions |
| **Primary Foreground** | `222.2 47.4% 11.2%` | `#09090B` | Text on primary |
| **Secondary** | `217.2 32.6% 17.5%` | `#1E293B` | Secondary elements |
| **Secondary Foreground** | `210 40% 98%` | `#F8FAFC` | Text on secondary |
| **Muted** | `217.2 32.6% 17.5%` | `#1E293B` | Muted backgrounds |
| **Muted Foreground** | `215 20.2% 65.1%` | `#94A3B8` | Muted text |
| **Accent** | `217.2 32.6% 17.5%` | `#1E293B` | Accent backgrounds |
| **Accent Foreground** | `210 40% 98%` | `#F8FAFC` | Text on accent |
| **Destructive** | `0 62.8% 30.6%` | `#991B1B` | Destructive actions |
| **Destructive Foreground** | `210 40% 98%` | `#F8FAFC` | Text on destructive |
| **Border** | `217.2 32.6% 17.5%` | `#1E293B` | Borders |
| **Input** | `217.2 32.6% 17.5%` | `#1E293B` | Input borders |
| **Ring** | `212.7 26.8% 83.9%` | `#CBD5E1` | Focus rings |

---

## 🔤 Typography

### Font Family
- **Primary Font:** Inter (sans-serif)
- **Font Variable:** `--font-inter`
- **Fallback:** System sans-serif stack

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| **H1** | 36px (2.25rem) | 700 (Bold) | 1.2 | -0.02em |
| **H2** | 30px (1.875rem) | 600 (Semibold) | 1.3 | -0.01em |
| **H3 / Card Title** | 24px (1.5rem) | 600 (Semibold) | 1.2 | -0.025em |
| **H4** | 20px (1.25rem) | 600 (Semibold) | 1.4 | Normal |
| **Body Large** | 16px (1rem) | 400 (Regular) | 1.5 | Normal |
| **Body (Default)** | 14px (0.875rem) | 400 (Regular) | 1.5 | Normal |
| **Small** | 12px (0.75rem) | 400 (Regular) | 1.4 | Normal |
| **Button** | 14px (0.875rem) | 500 (Medium) | 1.2 | Normal |
| **Card Description** | 14px (0.875rem) | 400 (Regular) | 1.5 | Normal |
| **Input/Form** | 14px (0.875rem) | 400 (Regular) | 1.5 | Normal |

---

## 📏 Spacing System

Based on Tailwind's default 4px spacing scale:

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | 0px | No spacing |
| `space-1` | 4px | Tight spacing |
| `space-2` | 8px | Close spacing |
| `space-3` | 12px | Compact spacing |
| `space-4` | 16px | Default spacing |
| `space-5` | 20px | Medium spacing |
| `space-6` | 24px | Card padding, section spacing |
| `space-8` | 32px | Large spacing |
| `space-10` | 40px | Component height (buttons, inputs) |
| `space-12` | 48px | Extra large spacing |
| `space-16` | 64px | Section spacing |

---

## 🔘 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | 0.3rem (4.8px) | Base radius |
| `radius-sm` | ~1px (--radius - 4px) | Small elements |
| `radius-md` | ~3px (--radius - 2px) | Medium elements |
| `radius-lg` | 5px (--radius) | Cards, buttons, inputs |
| `radius-full` | 9999px | Pills, avatars |

---

## 🧩 Component Specifications

### Button Component

**Variants:**

#### Default Button
- **Background:** `hsl(var(--primary))`
- **Text:** `hsl(var(--primary-foreground))`
- **Hover:** `bg-primary/90` (10% opacity reduction)
- **Border Radius:** `rounded-md` (5px)
- **Font:** 14px Medium
- **Padding:** See sizes below
- **Focus Ring:** 2px ring with ring color, 2px offset

**Sizes:**
- **Default:** Height 40px, padding 8px 16px
- **Small:** Height 36px, padding 12px, rounded-md
- **Large:** Height 44px, padding 32px, rounded-md
- **Icon:** 16px × 16px (margin-right: 8px)

**Additional Variants:**
- **Destructive:** `bg-destructive`, `text-destructive-foreground`, hover at 90%
- **Outline:** Border with `border-input`, hover with `bg-accent` + `text-accent-foreground`
- **Secondary:** `bg-secondary`, `text-secondary-foreground`, hover at 80%
- **Ghost:** Transparent, hover with `bg-accent` + `text-accent-foreground`
- **Link:** Underline on hover, `text-primary`, underline offset 4px

**States:**
- **Disabled:** 50% opacity, no pointer events
- **Focus:** Ring with 2px width, 2px offset

---

### Card Component

**Structure:**
```
Card Container
├── CardHeader (padding: 24px, flex-col, space-y: 6px)
│   ├── CardTitle (h3, 24px semibold, tracking-tight)
│   └── CardDescription (14px, muted-foreground)
├── CardContent (padding: 24px, padding-top: 0)
└── CardFooter (padding: 24px, padding-top: 0, flex items-center)
```

**Specs:**
- **Background:** `bg-card`
- **Text Color:** `text-card-foreground`
- **Border:** 1px solid `border`
- **Border Radius:** `rounded-lg` (5px)
- **Shadow:** `shadow-sm` (subtle shadow)
- **Header Padding:** 24px
- **Content Padding:** 24px horizontal, 0 top
- **Title Space:** 6px between title and description

---

### Input Component

**Specs:**
- **Height:** 40px
- **Width:** Full width (100%)
- **Padding:** 12px horizontal, 8px vertical
- **Border:** 1px solid `border-input`
- **Border Radius:** `rounded-md` (5px)
- **Background:** `bg-background`
- **Font Size:** 14px
- **Text Color:** `foreground`
- **Placeholder:** `text-muted-foreground`

**States:**
- **Focus:**
  - Outline: none
  - Ring: 2px `ring-ring`
  - Ring offset: 2px
- **Disabled:**
  - Cursor: not-allowed
  - Opacity: 50%

**File Input Styling:**
- Border: 0
- Background: transparent
- Font: 14px medium

---

## 🎯 Interactive States

### Focus States
- **Focus Ring:** 2px solid `ring` color
- **Ring Offset:** 2px
- **Outline:** None (removed default)

### Hover States
- **Primary Button:** 10% opacity reduction (90%)
- **Secondary Button:** 20% opacity reduction (80%)
- **Ghost/Outline:** Background transition to `accent`
- **Links:** Underline appears

### Disabled States
- **Opacity:** 50%
- **Cursor:** not-allowed
- **Pointer Events:** none

---

## 🌓 Dark Mode Implementation

**Method:** Class-based theming
**Toggle:** `.dark` class on root element
**System Support:** Enabled
**Transition:** Instant (no transition on change)

**How to implement in Figma:**
1. Create separate color styles for light/dark mode
2. Use Figma's Variables feature for dynamic theming
3. Name convention: `color/[light|dark]/[token-name]`

---

## 📦 Component Inventory

The design system includes these components:

- Avatar
- Button (6 variants, 4 sizes)
- Card (5 sub-components)
- Command Menu
- Dialog/Modal
- Dropdown Menu
- Input
- Label
- Navigation Menu
- Popover
- Select
- Separator
- Switch/Toggle
- Table
- Tabs
- Textarea

---

## 🎨 Figma Setup Guide

### 1. Create Color Styles

**Light Mode:**
```
Supastar/Light/Background → hsl(0, 0%, 100%)
Supastar/Light/Foreground → hsl(222.2, 84%, 4.9%)
Supastar/Light/Primary → hsl(222.2, 47.4%, 11.2%)
... (continue for all tokens)
```

**Dark Mode:**
```
Supastar/Dark/Background → hsl(222.2, 84%, 4.9%)
Supastar/Dark/Foreground → hsl(210, 40%, 98%)
... (continue for all tokens)
```

### 2. Create Text Styles

```
Supastar/Heading/H1 → Inter Bold 36px
Supastar/Heading/H2 → Inter Semibold 30px
Supastar/Heading/H3 → Inter Semibold 24px
Supastar/Body/Large → Inter Regular 16px
Supastar/Body/Default → Inter Regular 14px
Supastar/Body/Small → Inter Regular 12px
```

### 3. Create Effect Styles

**Shadows:**
```
Supastar/Shadow/SM → Subtle card shadow
```

**Focus Ring:**
```
Supastar/Focus → 2px solid ring color, 2px offset
```

### 4. Create Component Variants

Use Figma's component variants for:
- Button: variant × size matrix (6 × 4 = 24 variants)
- Card: Different layouts
- Input: States (default, hover, focus, disabled)

### 5. Use Auto Layout

All components use Figma Auto Layout:
- **Spacing Mode:** Space between
- **Padding:** Match component specs
- **Alignment:** Stretch for full-width, center for buttons
- **Direction:** Horizontal for buttons, vertical for cards

---

## 📊 Grid & Layout

**Container Max Width:**
- Small: 640px
- Medium: 768px
- Large: 1024px
- XL: 1280px
- 2XL: 1536px

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Column System:** 12-column grid
**Gutter:** 24px (1.5rem)

---

## 🔗 Animation & Transitions

**Default Transition:**
- Property: colors
- Duration: 150ms
- Easing: ease-in-out

**Custom Animations:**
```
fadeIn:
  0%: opacity 0
  100%: opacity 1
  Duration: 700ms
  Easing: ease-in-out
```

**Focus Transitions:**
- Ring appears instantly
- No transition on focus

---

## 📝 Design Tokens Summary

**Export Format for Figma Variables:**

```json
{
  "colors": {
    "light": {
      "background": "hsl(0, 0%, 100%)",
      "foreground": "hsl(222.2, 84%, 4.9%)",
      "primary": "hsl(222.2, 47.4%, 11.2%)",
      "primary-foreground": "hsl(210, 40%, 98%)"
      // ... all light tokens
    },
    "dark": {
      "background": "hsl(222.2, 84%, 4.9%)",
      "foreground": "hsl(210, 40%, 98%)"
      // ... all dark tokens
    }
  },
  "spacing": {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "6": "24px",
    "8": "32px"
  },
  "radius": {
    "sm": "1px",
    "md": "3px",
    "lg": "5px"
  },
  "typography": {
    "font-family": "Inter",
    "sizes": {
      "sm": "12px",
      "base": "14px",
      "lg": "16px",
      "xl": "20px",
      "2xl": "24px",
      "3xl": "30px"
    }
  }
}
```

---

## 🚀 Quick Start Checklist

- [ ] Install Inter font in Figma
- [ ] Create color palette (light + dark)
- [ ] Set up text styles
- [ ] Create spacing/layout grid
- [ ] Build button component with all variants
- [ ] Build card component
- [ ] Build form components (input, select, etc.)
- [ ] Set up auto layout for all components
- [ ] Add focus/hover/disabled states
- [ ] Test with actual content
- [ ] Export to Figma Tokens (optional)

---

## 📚 References

- **Shadcn UI Docs:** https://ui.shadcn.com
- **Radix UI Docs:** https://radix-ui.com
- **Tailwind CSS Docs:** https://tailwindcss.com
- **Inter Font:** https://fonts.google.com/specimen/Inter

---

**Last Updated:** 2025-12-30
**Extracted From:** Supastar GitHub Repository
**Branch:** claude/vibecode-BC4BO
**Commit:** ff712bf
