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

## From Requirement to App — What We Addressed

### Accessibility

**Concern:** A plain data table with default styling would fail WCAG AA — poor contrast, no focus management, no ARIA semantics.

**Resolution:** The Ocean Blue A11y Kendo theme provides WCAG AA contrast out of the box. The top bar (primary blue background, white text) passes AA at all sizes. Every interactive control has an `aria-label`; the drawer and dialog manage focus automatically. A `<main id="main-content" tabindex="-1">` landmark serves as a skip-navigation target.

### Typography & Visual Quality

**Concern:** The Angular CLI default produces a bare, unstyled shell — system fonts, no visual hierarchy, nothing that reads as a real product.

**Resolution:** Inter (Google Fonts, 400–700) is loaded via preconnect links and applied globally. The top bar uses a strong primary blue, the brand name is weighted at 700, and Kendo's CSS custom properties carry consistent spacing and color throughout.

### Navigation

**Concern:** A sidebar with no active state, no route binding, and a toggle button with no clear label is confusing to use and inaccessible.

**Resolution:** The Kendo Drawer tracks the active route reactively — `toSignal` + `NavigationEnd` feeds a `computed()` that marks the correct item as `selected` on every navigation. The toggle button labels itself "Hide Sidebar" / "Show Sidebar" and carries `aria-pressed`. On mobile the drawer switches to overlay mode and collapses automatically after selecting an item.

### Responsive Layout

**Concern:** A fixed-column data grid is unusable on tablet and broken on phone.

**Resolution:** Three distinct modes driven by a `_width` signal:

| Breakpoint | Mode |
|---|---|
| ≥ 1024px | Full grid — all columns visible, icon + text action buttons |
| 640–1023px | Tablet — Phone and Teams columns hidden, actions icon-only |
| < 640px | Phone — Kendo Grid `dataLayoutMode: 'stacked'` renders each row as a vertical label/value stack |

Pager button count and item-count info scale with the breakpoint. `kendoGridBinding` handles paging, sorting, and filtering automatically against the full dataset.

### CRUD & Data Management

**Concern:** Read-only grids are demos, not prototypes. The requirement was a fully functional management interface.

**Resolution:** Full add / edit / delete flow:
- **Add/Edit** — Kendo Dialog with a reactive form: text inputs, a role dropdown, a multiselect for teams, and an avatar upload (simulated via interceptor).
- **Delete** — confirmation dialog before any destructive action.
- **Notifications** — Kendo Notification toasts confirm every operation (success / warning).
- All state is held in a signal-based `UserService`; the grid reflects changes instantly.

### Actions Column

**Concern:** Icon-only action buttons are ambiguous and inaccessible — users can't tell what they do without hovering, and screen readers have nothing to read.

**Resolution:** Outline buttons with SVG icon + text label on desktop (`themeColor="primary"` for Edit, `themeColor="error"` for Delete). The text label is hidden via CSS on smaller viewports; `aria-label` with the user's full name is always present.

### Teams Column

**Concern:** Using Kendo Chip components for team names looked interactive — users would click expecting to filter or remove a team.

**Resolution:** Replaced with static pill `<span>` elements. Same visual density, no false affordance.

### User Avatars

**Concern:** Initials-only avatars feel placeholder-quality for a management UI.

**Resolution:** Real face photos (downloaded from pravatar.cc) for the first eight users. A shared `UserAvatarComponent` renders the photo when available and falls back to initials — so new records without a photo still look intentional.

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
│   │       ├── user-grid/     # Data grid with responsive layout and CRUD triggers
│   │       ├── user-dialog/   # Add/Edit dialog (reactive form, upload, multiselect)
│   │       └── tabs/          # Coming-soon placeholders for other sections
│   ├── layout/
│   │   ├── shell/         # TopBarComponent
│   │   ├── with-drawer/   # Layout with collapsible Kendo Drawer
│   │   └── no-drawer/     # Minimal layout (accessible via nav toggle)
│   └── shared/
│       └── user-avatar/   # Avatar component: photo or initials fallback
└── public/
    └── avatars/           # Static JPEG avatars
```

---

## AI-Assisted Development

This project was built entirely through a Claude Code session. The workflow:

1. **Architecture first** — models, service layer, routing, and shell were locked in before any feature work.
2. **Iterative UI** — each component was built, served, reviewed in the browser, and refined based on visual and functional feedback.
3. **Constraint-driven** — the session operated under explicit rules (no NgModules, no `@HostListener`, `inject()` only, individual Kendo barrel constants) enforced throughout.
4. **Real debugging** — runtime errors were diagnosed from actual console output and fixed incrementally.
5. **No hallucination policy** — Kendo-specific APIs were verified against actual type definitions in `node_modules` before use, not assumed from training memory.
