# @8bitbish/tooltips

Tooltips for React, Figma plugins, Framer, and vanilla JS.

- Positions above or below the trigger automatically
- Stays within the viewport
- After the first tooltip in a session, subsequent ones appear instantly

## Install

```sh
npm install @8bitbish/tooltips
```

---

## React

Import the component and stylesheet — the stylesheet only needs to be imported once at your app root:

```tsx
import { Tooltip } from '@8bitbish/tooltips'
import '@8bitbish/tooltips/dist/tooltip.css'
```

Wrap any single element:

```tsx
<Tooltip text="Save file" shortcut="⌘S">
  <button>Save</button>
</Tooltip>
```

> `children` must be a single element that accepts a `ref`. Function components need `forwardRef`.

### Props

| Prop       | Type                 | Default | Description                                   |
|------------|----------------------|---------|-----------------------------------------------|
| `text`     | `string`             | —       | Tooltip label (required)                      |
| `shortcut` | `string`             | —       | Keyboard shortcut shown on the right          |
| `delay`    | `number`             | `900`   | Delay in ms before the tooltip appears        |
| `children` | `React.ReactElement` | —       | The element that triggers the tooltip         |

---

## Vanilla JS

For Chrome extensions, plain HTML, or any non-React environment:

```js
import '@8bitbish/tooltips/vanilla'
import '@8bitbish/tooltips/dist/tooltip.css'
```

Add `data-tooltip` to any element — no wrapping needed:

```html
<button data-tooltip="Save file" data-shortcut="⌘S">Save</button>
<button data-tooltip="Delete">🗑</button>
```

Dynamically added elements are picked up automatically via MutationObserver.

### Attributes

| Attribute       | Description                                   |
|-----------------|-----------------------------------------------|
| `data-tooltip`  | Tooltip label (required)                      |
| `data-shortcut` | Keyboard shortcut shown on the right          |
| `data-delay`    | Delay in ms before appearing (default `900`)  |

---

## Customisation

Set these CSS variables once in your global stylesheet — applies to both React and vanilla:

```css
:root {
  --tooltip-bg:          #1c1c1c; /* background colour */
  --tooltip-radius:      6px;     /* corner radius     */
  --tooltip-font-size:   11px;    /* font size         */
  --tooltip-font-weight: 350;     /* font weight       */
}
```
