# UserHub — Angular + Kendo UI Sample Dashboard

**Live demo:** https://dtopalov.github.io/sample-dashboard/
**Repository:** https://github.com/dtopalov/sample-dashboard

---

## The Assignment

Product Managers on our team generate initial wireframes using AI tools. Without a dedicated UI/UX designer, frontend engineers take those rough outputs and turn them into polished, accessible, production-ready interfaces.

This prototype starts from an AI-generated wireframe for a User Management Dashboard, audits its UX flaws, and delivers a corrected implementation.

---

## The Original Wireframe

The wireframe was provided as a starting point. It establishes the basic information architecture — a left-side navigation drawer, a tabbed content area, a user data table, and an edit dialog — but contains a number of deliberate and accidental UX problems typical of raw AI-generated designs.

---

## UX Audit

### Data & Content Issues

- **Text truncation throughout the grid.** Column widths are fixed and too narrow. First names render as "Helr", "Kare", "Manch" — the table destroys the data it's supposed to display. No ellipsis, no tooltip, no resize affordance.

- **Placeholder data leaked into the wireframe.** The Status column shows values like "Nlow" and "Stow" — meaningless strings that appear to be corrupted or auto-generated mock data. A real implementation needs defined, constrained status values with clear semantics.

- **Mixed-language UI.** Some rows in the Actions column show English ("Deactivate", "Permissions") while others show German ("Aktivierungsstatus ändern"). This suggests broken or incomplete i18n — a critical bug in any product with international users.

- **Photo column is all broken-image placeholders.** No fallback state is designed for users without photos. Every row shows the same broken-image icon, which looks like a rendering failure rather than an intentional design.

### Actions Column

- **Inconsistent actions per row.** Row 1 has "Deactivate" + "Permissions". Row 2 has only "Manage Status". Rows 4–5 have German text. There is no consistent action set — the column is undefined and unpredictable.

- **Actions are semantically flat.** "Deactivate", "Permissions", and "Manage Status" are three different operation categories crammed into one column with no visual hierarchy. The most destructive action (deactivation) has the same visual weight as a read-style action (permissions).

- **No Edit action in the grid.** The wireframe shows an Edit dialog, but there is no Edit button in the Actions column — it is unclear what triggers the dialog.

### Edit Dialog

- **First Name field contains the full name.** The field labelled "First Name" shows "John Doe" — the full name — not just the first name. The "Last Name" field shows the placeholder text "Last". The form is pre-populated incorrectly.

- **Validation error with no message.** The Email field has a red border indicating an error, but there is no error message. The user cannot tell what the problem is or how to fix it.

- **Dialog is too small and cuts off.** The Role and Status dropdowns are partially visible; the Team selector is almost entirely off-screen. The user cannot complete the form without scrolling inside a dialog — a pattern that should be avoided.

- **No cancel affordance is visible.** There is no visible Cancel or Close button in the cropped dialog. Users need an unambiguous way to dismiss without saving.

### Navigation & Layout

- **Tab bar overflows without recovery.** The tabs include "All Users", "Roles & Permissions", "Security", "Activity Logs", "Invitations", "Teams", "Workplace Policies", and a fourth tab cut off with "Wh...". There is no overflow control — content is just clipped.

- **Filter panel overlaps the grid.** The "Filter by Team" checkbox panel appears to float over the column headers, obscuring the grid. It is not integrated into the layout — it reads as an afterthought.

- **No pagination.** There is no pager, no row count, no indication of how many users exist beyond what is visible. The design does not scale past a single screen.

- **No search.** With potentially hundreds of users, the only filtering mechanism is the team checkbox panel. There is no global search.

### Accessibility

- **Status is conveyed by text value only.** With values like "Nlow" and "Stow", the original wireframe has no accessible status indicator at all. Even with correct values, color alone (common in wireframes) is insufficient for WCAG compliance.

- **No visible focus management.** The wireframe shows no focus ring, no keyboard navigation path, no skip link. A modal dialog must trap focus; the drawer must be keyboard-navigable.

- **Icon-only or ambiguous action buttons.** Where buttons exist, they rely on label text that is either truncated, in the wrong language, or absent. Screen readers need descriptive labels tied to the specific row.

---

## What We Built Instead

| Wireframe problem | Resolution |
|---|---|
| Column truncation | Resizable grid columns; `kendoGridBinding` auto-fits layout |
| Broken placeholder data | Typed `UserStatus` union, real mock data, no placeholder strings |
| Mixed-language UI | Single locale UI; language switcher in top bar (noop for non-English, explicitly labelled) |
| No avatar fallback | `UserAvatarComponent` — shows photo if available, initials fallback otherwise |
| Inconsistent actions | Uniform Edit + Delete per row; outlined buttons with icon + text label on desktop, icon-only with `aria-label` on mobile |
| Flat action hierarchy | Edit is primary (blue outline), Delete is destructive (red outline), separated visually |
| Dialog pre-population bug | Reactive form correctly maps `firstName` and `lastName` to separate fields |
| Validation with no message | Angular reactive form validators surface error messages inline beneath each field |
| Dialog cuts off | Full-featured Kendo Dialog with scrollable body; all fields accessible without scrolling on desktop |
| Tab overflow | `kendo-tabstrip` handles overflow natively with scroll arrows |
| Filter overlapping grid | Filter removed from layout; Kendo Grid's built-in column menu filter is used instead |
| No pagination | `kendoGridBinding` with configurable pager; responsive button count per breakpoint |
| No search | Kendo Grid column-level filter menu on all text fields |
| Accessibility — status | Kendo Chip with `themeColor="success"/"error"` — color + text, WCAG AA |
| Accessibility — focus | Ocean Blue A11y theme; `aria-label`, `aria-pressed`, focus-trapped dialogs |
| No responsive design | Three breakpoints: desktop (full grid), tablet (fewer columns), phone (stacked layout mode) |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Angular 22 (standalone components, signals, `inject()`) |
| UI library | Kendo UI for Angular v24.1 |
| Theme | Ocean Blue A11y (WCAG AA) |
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

> **Kendo license** — place your `telerik-license.txt` at `~/.telerik/telerik-license.txt`. Never commit it.

To deploy:

```bash
npm run deploy
```

---

## Project Structure

```
src/app/
├── core/
│   ├── data/        # Mock users, teams, CURRENT_USER
│   ├── models/      # User, Team, UserRole, UserStatus
│   └── services/    # UserService (signal-based CRUD)
├── features/users/
│   ├── user-grid/   # Responsive data grid with CRUD triggers
│   ├── user-dialog/ # Add/Edit dialog (reactive form, upload, multiselect)
│   └── tabs/        # Tab placeholders for other sections
├── layout/
│   ├── shell/       # TopBarComponent
│   ├── with-drawer/ # Collapsible Kendo Drawer layout
│   └── no-drawer/   # Minimal layout
└── shared/
    └── user-avatar/ # Photo or initials fallback
```

---

## AI Process

The entire build was done through a **Claude Code** session — no code was written outside of it.

The workflow followed the same pattern a frontend engineer would use in practice:

1. **Audit before building.** Before writing any code, the wireframe was reviewed and a full list of UX problems was documented. Implementation started only after the audit was agreed upon.

2. **Architecture first.** Models, service layer, routing, and shell layout were built and verified before any feature components. This prevented retrofitting decisions later.

3. **Iterative browser review.** After each significant change, the app was served and inspected in the browser. Problems found at runtime (not at compile time) drove the next iteration.

4. **Explicit constraints.** The session operated under strict coding rules: no NgModules, no `@HostListener` decorators, `inject()` over constructor injection, individual Kendo barrel constants only. Claude enforced these consistently throughout.

5. **API verification over assumption.** Where Kendo-specific behavior was uncertain (e.g., `DataLayoutMode` enum values, `kendoGridBinding` auto-databinding, external editing API), type definitions in `node_modules` were read directly before use. No API was assumed from training memory alone.
