---
name: rtl-styling
description: Bidirectional (LTR/RTL) styling rules for this project. Use when writing any sx/CSS or reviewing layout code, since Hebrew flips the whole app.
---

# RTL styling rules

The app runs in English (LTR) and Hebrew (RTL). Direction is applied in `src/theme/AppThemeProvider.tsx`: the `he` language switches `document.dir`, the MUI theme direction, and the emotion cache to one with `stylis-plugin-rtl`, which mirrors most styles automatically.

## Rules

1. Never use physical properties or values in `sx`/CSS:
   - `marginLeft`/`ml` → `marginInlineStart`/`ms` (or the shorthand MUI accepts in the current version)
   - `paddingRight`/`pr` → `paddingInlineEnd`/`pe`
   - `left: 0` → `insetInlineStart: 0`
   - `textAlign: 'left'` → `textAlign: 'start'`
   - `borderLeft` → `borderInlineStart` (see `StatTile.tsx` for the accent border example)
2. Trust the RTL emotion cache for MUI internals — do not add manual `direction`-conditional styles unless something visibly breaks in Hebrew.
3. Icons: MUI flips `startIcon`/`endIcon` positions automatically. Directional icons (arrows, chevrons) that indicate flow need conditional flipping; icons that indicate objects do not.
4. dnd-kit drag transforms are pixel-based and direction-agnostic — never mirror them manually.
5. ECharts does not auto-flip. Keep charts LTR (numbers and time axes read the same); translated labels come from i18n.
6. User-facing strings only from i18next (`useTranslation`). Add keys to both `en.json` and `he.json` in the same change.

## Verify

Toggle the language button in the app bar and check the changed screen in both directions before finishing. `document.documentElement.dir` must be `rtl` when Hebrew is active.
