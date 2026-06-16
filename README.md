# UserHub — Angular + Kendo UI Sample Dashboard

A production-quality User Management Dashboard prototype built with **Angular 22** and **Kendo UI for Angular v24**, demonstrating modern Angular patterns, responsive design, full CRUD, and accessibility compliance.

**Live demo:** https://dtopalov.github.io/sample-dashboard/

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Angular 22 (standalone components, signals, `inject()`) |
| UI library | Kendo UI for Angular v24.1 |
| Theme | Ocean Blue A11y (WCAG AA accessibility) |
| Styling | SCSS + Kendo CSS custom properties |
| Font | Inter (Google Fonts) |
| State | Angular signals (`signal`, `computed`, `toSignal`) |
| Build | Angular CLI 22 |

---

## Getting Started

```bash
npm install
ng serve
```

Open `http://localhost:4200`.

> **Kendo license** — place your `telerik-license.txt` at `~/.telerik/telerik-license.txt` before running. Never commit it to the repo.

---

## UX & Technical Audit

### Initial Concerns

The following concerns were identified before a single line of code was written — some raised by the product owner, others surfaced during technical planning.

#### Accessibility & Contrast

**Concern (product owner):** The default Kendo theme doesn't guarantee WCAG AA contrast on all UI surfaces, particularly the top bar.

**Concern (engineering):** Accessibility isn't just contrast — it covers focus management, ARIA roles, keyboard navigation, and semantic markup.

**Resolution:**
- Selected the **Ocean Blue A11y** Kendo theme, which ships with WCAG AA contrast ratios baked in.
- Top bar uses `background: var(--kendo-color-primary)` (deep blue) with `color: #fff` — passes AA at all tested sizes.
- All interactive controls carry `aria-label`, `aria-pressed` where appropriate.
- Dialog and drawer manage focus automatically via Kendo's built-in a11y support.
- `<main id="main-content" tabindex="-1">` as a skip-navigation target.

#### Typography

**Concern (product owner):** The default system font feels amateurish and inconsistent across platforms.

**Resolution:** Loaded **Inter** (400/500/600/700) from Google Fonts via `<link rel="preconnect">` in `index.html`. Applied globally via `font-family: 'Inter', system-ui, sans-serif` in `styles.scss`. Inter is a neutral, highly legible sans-serif designed specifically for screen UI.

#### Navigation Clarity

**Concern (product owner):** The sidebar toggle button didn't clearly communicate its state or purpose.

**Resolution:**
- Button label switches between `"Hide Sidebar"` / `"Show Sidebar"` based on current state.
- `aria-pressed` attribute reflects toggle state for screen readers.
- On mobile (< 600px), the label is hidden to save space — only the hamburger icon remains, which is universally understood.

#### Language Switcher

**Concern (product owner):** Globe icon + "EN" text as separate elements looked disconnected.

**Resolution:** Single `kendo-dropdownbutton` combining the globe SVG icon and language label. Dropdown lists four locales with flag emoji. Non-implemented locales are marked `noop` — transparent about prototype scope without being misleading.

#### User Profile Menu

**Concern (product owner):** No profile/account access was available in the top bar.

**Resolution:** `kendo-dropdownbutton` with the current user's avatar, name, and a chevron. Dropdown includes My Profile, Account Settings, Notifications, Help & Support, and Sign Out (styled in error/danger red). Current user data comes from a typed `CURRENT_USER` constant — ready to be replaced with a real auth context.

#### Drawer Navigation & Active State

**Concern (engineering):** Custom drawer item templates break Kendo's internal mini-mode geometry, causing icon misalignment at the 50px collapsed width.

**Concern (product owner):** Navigating between drawer items didn't update the content area or reflect the active route.

**Resolution:**
- Removed the custom `kendoDrawerItemTemplate` entirely — Kendo renders items natively from the `[items]` binding.
- Active state is driven reactively: `toSignal(router.events.pipe(filter(NavigationEnd), map(url)))` feeds a `computed()` that marks the matching item as `selected`.
- `(select)` event calls `Router.navigate([item.path])` and collapses the drawer on mobile.

#### Responsive Grid — Three Breakpoints

**Concern (product owner):** The grid needs to work on desktop, tablet, and phone without degrading to an unusable table on small screens.

**Resolution:** Three modes driven by `_width` signal:

| Breakpoint | Mode | Behaviour |
|---|---|---|
| ≥ 1024px | Desktop | Full grid — all columns, icon + text action buttons, paginator with 5 page buttons + item count |
| 640–1023px | Tablet | Phone/Teams columns hidden, actions icon-only, 3 page buttons |
| < 640px | Phone | Kendo Grid `dataLayoutMode: 'stacked'` — each row renders as a label/value stack, 1 page button |

`kendoGridBinding` is used for auto-databinding — paging, sorting, and filtering are handled entirely by the grid without manual data slicing.

#### Actions Column

**Concern (product owner):** Icon-only buttons are inaccessible and visually ambiguous.

**Resolution:**
- Desktop: `fillMode="outline"` buttons with SVG icon + text label ("Edit", "Delete"), colored by intent (`themeColor="primary"` / `themeColor="error"`).
- Tablet/phone: label hidden via CSS (`.action-label { display: none }`), `aria-label` always present for screen readers.

#### Teams Column — False Interactivity

**Concern (product owner):** Kendo Chip components in the Teams column looked like interactive filters — users might click expecting something to happen.

**Resolution:** Replaced chips with static `.team-badge` `<span>` elements styled as pills (rounded, subtle background). Visually scannable, clearly non-interactive.

#### Grid Vertical Scrolling

**Concern (product owner):** With many rows, the grid expanded to push the pager below the viewport.

**Resolution:** `[height]="gridHeight()"` on `kendo-grid`, where `gridHeight` is a computed signal: `viewportHeight - 225px` (accounts for top bar, toolbar, pager). Recalculates on `window:resize` via `host: { '(window:resize)': 'onResize()' }`.

#### Content Width & Left-Side Clipping

**Concern (product owner):** App content wasn't filling the full viewport width; on mobile, the mini drawer (overlay mode, 50px wide) was covering the left edge of the content.

**Resolution:**
- Full-width flex chain: `app-root → .shell → .shell__body → kendo-drawer-container`, each with `width: 100%`.
- On mobile (`max-width: 768px`), `padding-left: 62px` on `.main-content` clears the 50px mini drawer plus a 12px gap.

---

### Runtime & Framework Issues

#### `$localize` ReferenceError

`ng add @angular/localize` inserts only a TypeScript type reference (`/// <reference types="@angular/localize" />`), which doesn't initialize the runtime. Fixed by replacing it with a proper runtime import as the **first line** of `main.ts`:

```typescript
import '@angular/localize/init';
```

The `polyfills` entry was removed from `angular.json` to avoid double-initialization.

#### Kendo `i18n-on` Bug (Angular 22)

Kendo Angular Inputs' fesm2022 bundle references an `i18n-on` attribute that doesn't exist in Angular 22, crashing at compile time. Fixed with `patch-package`: a one-line patch removes the attribute reference from the built bundle, applied automatically via `postinstall` in `package.json`.

#### Angular 22 Standalone Conventions

Angular v20+ makes `standalone: true` the default — setting it explicitly is a no-op at best and noise at worst. All components follow the current convention: no `standalone` flag, no NgModules anywhere.

#### `@HostListener` / `@HostBinding` Prohibition

Project rules forbid `@HostListener` and `@HostBinding` decorators. All host event bindings use the `host` object on `@Component`:

```typescript
@Component({
  host: { '(window:resize)': 'onResize()' }
})
```

#### Constructor Injection

All services use Angular's `inject()` function — no constructor injection anywhere in the codebase.

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── data/          # Mock users, teams, CURRENT_USER
│   │   ├── models/        # User, Team, UserRole, UserStatus
│   │   └── services/      # UserService (signal-based CRUD)
│   ├── features/
│   │   └── users/
│   │       ├── user-grid/     # Main data grid with responsive layout
│   │       ├── user-dialog/   # Add/Edit dialog (reactive form, upload, multiselect)
│   │       └── tabs/          # Coming-soon placeholders for other sections
│   ├── layout/
│   │   ├── shell/         # TopBarComponent
│   │   ├── with-drawer/   # Layout with collapsible Kendo Drawer
│   │   └── no-drawer/     # Minimal layout (accessible via nav toggle)
│   └── shared/
│       └── user-avatar/   # Avatar component: photo or initials fallback
└── public/
    └── avatars/           # Static JPEG avatars (pravatar.cc)
```

---

## AI-Assisted Development

This project was built entirely through a Claude Code session. The workflow:

1. **Architecture first** — models, service layer, routing, and shell were locked in before any feature work.
2. **Iterative UI** — each component was built, served, reviewed in the browser, and refined based on visual and functional feedback.
3. **Constraint-driven** — the session operated under explicit rules (no NgModules, no `@HostListener`, `inject()` only, individual Kendo barrel constants) enforced throughout.
4. **Real debugging** — runtime errors (`$localize`, `i18n-on` patch, type mismatches, Kendo API edge cases) were diagnosed from actual console output and fixed incrementally.
5. **No hallucination policy** — Kendo-specific APIs were verified against actual type definitions in `node_modules` before use, not assumed from training memory.
