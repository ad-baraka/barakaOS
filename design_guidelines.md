# Baraka Perform - Design Guidelines

## Design Approach

**Selected Approach:** Design System + Reference Hybrid
- **Primary Reference:** Linear (clean, modern productivity aesthetics)
- **Secondary Reference:** Notion (organized content structures)
- **System Foundation:** Material Design principles for form-heavy interfaces

**Rationale:** Baraka Perform is a utility-focused productivity tool requiring clarity, efficiency, and professional polish. The design must support quick task completion (<30 minute cycles) while maintaining visual sophistication appropriate for B2B SaaS.

---

## Typography

**Font Stack:**
- **Primary:** Inter (via Google Fonts CDN)
- **Monospace:** JetBrains Mono (for IDs, timestamps)

**Hierarchy:**
- **Page Titles:** 2xl-3xl, font-semibold
- **Section Headers:** xl, font-semibold
- **Card Titles:** lg, font-medium
- **Body Text:** base, font-normal
- **Metadata/Labels:** sm, font-medium, uppercase tracking
- **Help Text:** sm, font-normal

---

## Layout System

**Spacing Scale:** Tailwind units of **2, 4, 6, 8, 12, 16, 20**
- Standard padding: `p-6` or `p-8`
- Component gaps: `gap-4` or `gap-6`
- Section margins: `mb-8` or `mb-12`
- Page container: `max-w-7xl mx-auto px-6`

**Grid Patterns:**
- Dashboard cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Form layouts: Two-column forms on desktop `grid-cols-1 md:grid-cols-2 gap-6`
- List items: Single column with consistent internal spacing

---

## Core Components

### Navigation
**Top Navigation Bar:**
- Fixed header with logo left, navigation center, user menu right
- Height: `h-16`
- Icons from Heroicons (outline style)
- Active state: subtle border-bottom indicator

**Sidebar (Admin/Manager Views):**
- Fixed left sidebar, width: `w-64`
- Collapsible on mobile
- Section groupings with dividers
- Icon + label navigation items

### Dashboard Elements
**Status Cards:**
- Rounded corners: `rounded-lg`
- Padding: `p-6`
- Border: `border` with subtle treatment
- Contains: large number (3xl), label (sm), trend indicator

**Progress Indicators:**
- Linear progress bars with percentage labels
- Circular progress for cycle completion
- Status badges: `rounded-full px-3 py-1 text-sm font-medium`

### Forms
**Input Fields:**
- Height: `h-12` for text inputs
- Padding: `px-4`
- Rounded: `rounded-md`
- Border focus states with ring treatment
- Labels: `text-sm font-medium mb-2`

**Text Areas:**
- Minimum height: `min-h-[120px]`
- Auto-expanding for self-review responses
- Character counter in bottom-right corner

**Rating Scales:**
- 1-5 scale as horizontal button group
- Each option: square buttons with number and label
- Active state clearly indicated
- Gap between options: `gap-2`

**Form Sections:**
- Separated by dividers
- Section headers with optional helper text
- Autosave indicator: small text with checkmark icon

### Review Interface
**Consolidated Review Panel:**
- Two-column layout on desktop (self-review left, manager review right)
- Collapsible sections with expand/collapse icons
- Previous cycle summary in expandable accordion
- Sticky action buttons at bottom

**Comment Boxes:**
- Rounded containers: `rounded-lg p-6`
- Author metadata at top (avatar, name, timestamp)
- Content with proper text formatting
- Border-left accent for different comment types

### Data Tables
**Review Tracking Table:**
- Fixed header with sort indicators
- Row height: `h-16`
- Alternating row treatments
- Status pill inline in status column
- Action menu (three-dot) in final column
- Hover state on rows

### Buttons & Actions
**Primary Actions:** 
- Height: `h-12`, padding: `px-6`
- Rounded: `rounded-md`
- Font: `text-base font-medium`

**Secondary Actions:**
- Border treatment, same dimensions as primary
- Icon + text combinations where appropriate

**Icon Buttons:**
- Size: `w-10 h-10`
- Rounded: `rounded-md`
- Icon size: `w-5 h-5`

### Notifications & Alerts
**Toast Notifications:**
- Position: top-right
- Width: `w-96`
- Icon + message + dismiss button
- Auto-dismiss after 5 seconds

**Alert Banners:**
- Full-width below header
- Padding: `p-4`
- Icon left, message center, action right
- Dismissible with X button

---

## Page-Specific Layouts

### Login/Authentication
- Centered card on full viewport
- Max-width: `max-w-md`
- Logo above card
- Social login buttons with icons
- Minimal footer with links

### Dashboard (Employee)
- Hero section with welcome message and current cycle status
- Three-column grid of status cards
- Upcoming reviews list
- Recent activity timeline on right sidebar

### Dashboard (Manager/Admin)
- Top stats row: completion rate, pending reviews, overdue count
- Filterable employee list with search
- Bulk actions toolbar when items selected
- Export button in top-right corner

### Review Form (Self-Review)
- Sticky header with cycle name, due date, save status
- Linear progression through sections
- Section navigation sidebar (desktop only)
- Floating save & submit buttons
- Progress indicator at top

### Review Form (Manager)
- Split view: employee self-review (60%) | manager form (40%)
- Sticky summary panel showing key ratings
- Comment threading for discussion points
- Final rating and development plan at bottom
- Share review modal with confirmation

### Admin Cycle Setup
- Multi-step wizard interface
- Step indicator at top
- Form content in center (max-w-3xl)
- Back/Next buttons at bottom
- Preview panel for template selection

---

## Icons
**Library:** Heroicons (outline style) via CDN
- Navigation: home, users, clipboard, chart-bar, cog
- Actions: plus, trash, pencil, eye, download
- Status: check-circle, exclamation-circle, clock
- UI: chevron-down, x-mark, bars-3

---

## Images
**No hero images** - This is a productivity application focused on function over form. Keep visuals minimal and professional.

**Avatar Images:**
- User avatars throughout: circular, sizes `w-8 h-8` (small), `w-10 h-10` (medium), `w-16 h-16` (large)
- Placeholder initials for users without photos

**Empty States:**
- Simple illustrations for empty review lists, no cycles created
- Centered layout with illustration, heading, description, CTA button

---

## Responsive Behavior
- Desktop (lg+): Full sidebar navigation, multi-column layouts
- Tablet (md): Collapsible sidebar, two-column grids reduce to single
- Mobile (base): Hamburger menu, all content stacks single column, sticky mobile header with menu toggle