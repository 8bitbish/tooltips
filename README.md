# @8bitbish/tooltips

A tooltip component for React, Figma plugins, Framer, and vanilla JS.

- Positions itself above or below the trigger automatically
- Stays within the viewport
- Shows instantly after the first tooltip in a session

## Install

```sh
npm install @8bitbish/tooltips
```

## Usage

Import the component and the stylesheet once at your app root:

```tsx
import { Tooltip } from '@8bitbish/tooltips'
import '@8bitbish/tooltips/dist/tooltip.css'
```

Wrap any element:

```tsx
<Tooltip text="Save file" shortcut="⌘S">
  <button>Save</button>
</Tooltip>
```

## Customisation

Set any of these CSS variables once in your global stylesheet to style all tooltips:

```css
:root {
  --tooltip-bg:          #1c1c1c; /* background colour */
  --tooltip-radius:      6px;     /* corner radius     */
  --tooltip-font-size:   11px;    /* font size         */
  --tooltip-font-weight: 350;     /* font weight       */
}
```

## Vanilla JS (no React)

For plain HTML pages, Chrome extensions, or any non-React environment:

```js
import '@8bitbish/tooltips/vanilla'
import '@8bitbish/tooltips/dist/tooltip.css'
```

Then add `data-tooltip` to any element — no wrapping needed:

```html
<button data-tooltip="Save file" data-shortcut="⌘S">Save</button>
<button data-tooltip="Delete">🗑</button>
```

Dynamically added elements are picked up automatically.

| Attribute        | Description                                    |
|------------------|------------------------------------------------|
| `data-tooltip`   | Tooltip label (required)                       |
| `data-shortcut`  | Optional keyboard shortcut shown on the right  |
| `data-delay`     | Delay in ms before appearing (default `900`)   |

Same CSS variables apply — set them once and both React and vanilla tooltips share the same look.

---

## Props

| Prop       | Type              | Default | Description                                  |
|------------|-------------------|---------|----------------------------------------------|
| `text`     | `string`          | —       | Tooltip label (required)                     |
| `shortcut` | `string`          | —       | Optional keyboard shortcut shown on the right |
| `delay`    | `number`          | `900`   | Delay in ms before the tooltip appears       |
| `children` | `React.ReactElement` | —     | A single element that triggers the tooltip   |
