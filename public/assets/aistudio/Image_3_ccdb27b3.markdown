---
name: TaskPulse
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464554'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#0058be'
  on-tertiary: '#ffffff'
  tertiary-container: '#2170e4'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.005em
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-xs:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style
The design system embodies a modern, utilitarian aesthetic engineered for high-velocity productivity and focused execution. It targets professionals, teams, and individuals who demand uncompromising clarity, immediate legibility, and distraction-free task orchestration. 

The visual tone merges systematic minimalism with surgical precision: crisp, cool-neutral canvases provide a quiet foundation, while an electric indigo focal point directs intent and user action. Data visualization and operational states rely on distinct status accents (emerald, amber, rose) that communicate priority and completion without cluttering the interface. The emotional response is one of calm control, velocity, and structured efficiency.

## Colors
The palette is built on high-contrast functionality within an airy light-mode environment:

- **Primary (`#6366F1`)**: Electric Indigo. Acts as the primary interactive anchor for focal actions, key navigation markers, selection rings, and high-emphasis controls.
- **Secondary (`#10B981`)**: Emerald. Dedicated to completed tasks, positive velocity metrics, success messages, and active operational states.
- **Tertiary (`#3B82F6`)**: Technical Sky. Serves low-priority indicators, contextual informational chips, and supplementary navigational accents.
- **Neutral (`#64748B`)**: Slate. Anchors structural borders, body copy, icons, and muted supporting metadata against clean canvas surfaces (`#FFFFFF` surfaces and `#F8FAFC` base application backgrounds).

Priority indicators are strictly functional:
- **High Priority**: Rose (`#EF4444`)
- **Medium Priority**: Amber (`#F59E0B`)
- **Low Priority**: Sky (`#3B82F6`)

## Typography
The typography system uses a single, highly legible family—Inter—across all display sizes, interface labels, and analytical readouts.

Negative letter-spacing (tracking) is applied to display and headline roles to keep titles tight and architectural. Intermediate labels and small badges feature neutral to slightly widened letter spacing for optimal scanning at small sizes. Numerical figures in tables, counts, and task trackers should use tabular figures (`font-variant-numeric: tabular-nums`) to maintain vertical alignment during dynamic updates.

## Layout & Spacing
The layout model employs a strict 8pt base grid for component rhythm paired with fluid, responsive containers:

- **Mobile (< 768px)**: 4-column fluid layout with `margin: 1rem` (16px) and `gutter: 1rem` (16px). Bottom sheets, persistent bottom navigation bars, and single-column full-width task cards maximize tap accuracy and vertical scroll efficiency.
- **Tablet (768px – 1024px)**: 8-column layout with `margin-md: 1.5rem` (24px) and `gutter-md: 1.5rem` (24px). Introduces persistent split-view panels for task hierarchies and detail panes.
- **Desktop (> 1024px)**: 12-column layout with `margin-lg: 2.5rem` (40px) and `gutter-lg: 2rem` (32px), bound to a maximum content width of 1440px.

Component padding relies strictly on the `space-*` scale: dense task rows utilize `space-sm` vertical spacing, whereas primary content cards and modal dialogues use `space-lg` to maintain an airy, orderly layout.

## Elevation & Depth
Depth in the design system is achieved through crisp, low-contrast borders combined with gentle, diffused ambient shadows rather than heavy skeuomorphic shading.

- **Base Surfaces**: The primary application background rests at `#F8FAFC`. Elevated elements (cards, sidebars, header blocks) sit on pure `#FFFFFF`.
- **Borders & Separation**: Structural division relies primarily on 1px borders using `#E2E8F0`. Dividers never exceed 1px and maintain continuous alignment with the layout grid.
- **Shadow Scale**:
  - *Resting (Cards, Lists)*: `0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
  - *Interactive Hover / Active*: `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
  - *Floating (Popovers, Dropdowns, Floating Action Buttons)*: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
  - *Overlays (Modals, Slide-over panels)*: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.

## Shapes
A roundedness value of `2` establishes an approachable yet strictly structured geometry. 

- **Default Elements (`0.5rem` / 8px)**: Inputs, checkboxes, standard buttons, dropdown menus, and list items.
- **Large Elements (`rounded-lg`, `1rem` / 16px)**: Standard task cards, summary metric widgets, and contextual sheet containers.
- **Extra-Large Elements (`rounded-xl`, `1.5rem` / 24px)**: High-level workspace cards, modals, and mobile bottom sheet surfaces.
- **Pill Geometry (Fully Rounded / 9999px)**: Reserved exclusively for tags, priority badges, status chips, and primary floating action triggers.

## Components

### Buttons
- **Primary**: Solid `#6366F1` background, white text (`#FFFFFF`), `rounded` (8px), height 40px (desktop) or 44px (touch/mobile). Subtle active scale animation (`scale(0.98)`).
- **Secondary**: `#FFFFFF` background with 1px `#E2E8F0` border, `#0F172A` text, hover state transitions to `#F8FAFC`.
- **Ghost**: Transparent background, `#64748B` text, hover state transitions to `#F1F5F9`.

### Chips & Badges
- **Status Badges**: Pill-shaped (`rounded-full`), padded with 2px vertical and 8px horizontal, using `label-xs` weight.
  - *Completed*: Emerald tint (`#ECFDF5` background, `#059669` text).
  - *High Priority*: Rose tint (`#FEF2F2` background, `#DC2626` text).
  - *Medium Priority*: Amber tint (`#FFFBEB` background, `#D97706` text).
  - *Low Priority*: Sky tint (`#EFF6FF` background, `#2563EB` text).

### Checkboxes & Radio Controls
- **Checkboxes**: 20x20px square with a 6px corner radius (`rounded`). Unchecked state displays a 1.5px `#CBD5E1` border on `#FFFFFF`. Checked state transitions smoothly to solid `#10B981` (emerald) or `#6366F1` (indigo) with a white checkmark icon.

### Input Fields
- Constructed with a `#FFFFFF` fill, 1px `#E2E8F0` border, `rounded` (8px), and 40px total height. Focus states remove default outlines and apply a 2px `#6366F1` focus ring with a 1px offset. Placeholder text rendered in `#94A3B8`.

### Cards & Task Rows
- **Task Rows**: White surfaces with 1px `#E2E8F0` bottom borders or individual micro-cards with `rounded` (8px) corners. Include drag handles on the far left, interactive checkbox, task title (`title-md`), and trailing metadata chips.
- **Metric & Summary Cards**: Bound with `rounded-lg` (16px), subtle border `#E2E8F0`, and minimal resting ambient shadow.