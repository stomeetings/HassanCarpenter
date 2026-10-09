# Hassan Carpenter — Design Spec (Phase 2 Blueprint)

> Audience: the engineering agent implementing Phase 2. Follow this document literally.
> Anything not specified here is **out of scope**. When in doubt, build less.

---

## 0. Ground Rules

| Rule | Detail |
|---|---|
| Scope | One public landing page (`/`) + one admin page (`/admin`). Nothing else. |
| Forbidden | Cost estimators, calculators, FAQ accordions, carousels/sliders, animation libraries, CMS libraries, state libraries (Redux/Zustand), UI kits, lightbox libraries, form libraries. |
| Dependencies | Use only what is in `package.json` plus `@tailwindcss/vite` (see §6.1). Do not add others. |
| Native first | `<dialog>` for lightbox + admin modal, `<select>`, `<input type="file">`, `window.confirm` for delete, CSS `aspect-ratio`, `loading="lazy"`. |
| Content | Portfolio (projects) is dynamic from Supabase. Services, contact details, hero copy are static constants in code. |

### Current repo state (verified)
- Vite 8 + React 19 + `react-router-dom` 7 + `@supabase/supabase-js` 2 + `lucide-react` + `tailwindcss` 4.
- `@tailwindcss/vite` is **not** installed; `postcss`/`autoprefixer` are present but unnecessary under Tailwind v4.
- `src/App.css`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, and the contents of `src/index.css` are Vite boilerplate → delete/replace.

---

## 1. Design System

### 1.1 Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `navy` | `#0F172A` | Header bg, footer bg, headings, hero overlay, text on green buttons |
| `brand` | `#2563EB` | Links, active filter tab, primary buttons (Call), focus rings |
| `brand-dark` | `#1D4ED8` | Hover/active state of `brand` |
| `white` | `#FFFFFF` | Page bg (primary sections), text on navy/brand |
| `soft` | `#F8FAFC` | Alternating section bg (Services, Gallery), card placeholders |
| `line` | `#E2E8F0` | Card borders, dividers, input borders |
| `muted` | `#475569` | Body copy, descriptions |
| `whatsapp` | `#22C55E` | WhatsApp button fill |
| `whatsapp-dark` | `#16A34A` | WhatsApp hover |
| `danger` | `#DC2626` | Admin delete button, form errors |

**Contrast rule (accessibility, non-negotiable):** white text on `#22C55E` is ~2.3:1 and fails WCAG AA. WhatsApp buttons therefore use **`#22C55E` fill + `#0F172A` (navy) text/icon** (~8:1). White on `#2563EB` is 5.2:1 → OK.

### 1.2 Tailwind v4 theme (`src/index.css` — full file replacement)

```css
@import "tailwindcss";

@theme {
  --color-navy: #0F172A;
  --color-brand: #2563EB;
  --color-brand-dark: #1D4ED8;
  --color-soft: #F8FAFC;
  --color-line: #E2E8F0;
  --color-muted: #475569;
  --color-whatsapp: #22C55E;
  --color-whatsapp-dark: #16A34A;
  --color-danger: #DC2626;
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

html { scroll-behavior: smooth; }
body { @apply bg-white text-navy antialiased; }
/* Reserve space for the mobile sticky bar so it never covers content */
@media (max-width: 767px) { body { padding-bottom: calc(4rem + env(safe-area-inset-bottom)); } }
dialog::backdrop { background: rgb(15 23 42 / 0.9); }
```

No dark mode. No web fonts (system stack = zero font download).

### 1.3 Typography

| Element | Mobile | ≥ md (768px) | Weight |
|---|---|---|---|
| Hero H1 | `text-3xl` | `text-5xl` | `font-extrabold`, `tracking-tight` |
| Section H2 | `text-2xl` | `text-4xl` | `font-bold` |
| Card title H3 | `text-lg` | `text-lg` | `font-semibold` |
| Body | `text-base` | `text-lg` | normal, `text-muted` |
| Button | `text-base` | `text-base` | `font-semibold` |

### 1.4 Spacing, Shape, Elevation
- Container: `mx-auto max-w-6xl px-4 md:px-6`.
- Section vertical padding: `py-16 md:py-24`.
- Radius: buttons `rounded-lg`, cards `rounded-xl`, tabs `rounded-full`.
- Shadow: cards `shadow-sm`, hover `shadow-md`. No other elevation levels.
- Tap targets: every interactive element **min 44×44px** (`min-h-11`).
- Focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand` on all buttons/links/tabs.

### 1.5 Buttons (one component, three variants — see `CtaButtons.jsx`)

| Variant | Classes |
|---|---|
| `call` | `bg-brand hover:bg-brand-dark text-white` + `Phone` icon |
| `whatsapp` | `bg-whatsapp hover:bg-whatsapp-dark text-navy` + WhatsApp icon (inline SVG; lucide has no brand icons — use `MessageCircle` if no SVG is supplied) |
| `ghost` (admin only) | `border border-line bg-white hover:bg-soft text-navy` |

Base: `inline-flex items-center justify-center gap-2 rounded-lg px-5 min-h-11 font-semibold transition-colors`.

### 1.6 Icons
`lucide-react` only: `Phone`, `MessageCircle`, `Play`, `X`, `ChevronLeft`, `ChevronRight`, `ChefHat` (kitchen), `Armchair` (furniture), `DoorOpen` (doors), `Hammer` (repair), `Plus`, `Pencil`, `Trash2`, `LogOut`, `Loader2`, `ImageOff`.

---

## 2. Static Configuration — `src/lib/config.js`

Single source for contact info and categories. Every CTA reads from here.

```js
export const BUSINESS = {
  name: 'Hassan Carpenter',
  phone: '+923000000000',          // TODO(owner): real number, E.164
  phoneDisplay: '0300 000 0000',
  whatsapp: '923000000000',        // digits only, no +, for wa.me
  whatsappText: 'Hi Hassan Carpenter, I saw your work online and want a quote.',
  city: 'Lahore, Pakistan',        // TODO(owner)
}

export const telHref = `tel:${BUSINESS.phone}`
export const waHref = (text = BUSINESS.whatsappText) =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`

// value = DB value (must match CHECK constraint in §4.1), label = UI text
export const CATEGORIES = [
  { value: 'kitchen',   label: 'Kitchen' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'doors',     label: 'Doors' },
  { value: 'repair',    label: 'Repair' },
]
```

---

## 3. Component Hierarchy & Layout

### 3.1 Route Map

```
/        → HomePage   (public, eagerly loaded)
/admin   → AdminPage  (React.lazy — admin code never ships in the public bundle)
*        → redirect to /
```

### 3.2 HomePage Tree

```
<HomePage>
├── <Header/>             sticky, navy
├── <main>
│   ├── <Hero/>           id="top"
│   ├── <Services/>       id="services"   bg-soft
│   ├── <Gallery/>        id="work"       bg-white
│   │   ├── filter tabs
│   │   ├── project grid (cards)
│   │   └── <Lightbox/>   native <dialog>
│   │       └── <YouTubeEmbed/>  (for video items)
│   └── <ContactBand/>    final CTA strip, navy bg (inline in HomePage, ~15 lines — no separate file)
├── <Footer/>
└── <MobileCtaBar/>       fixed bottom, < md only
```

---

### 3.3 Header — `components/Header.jsx`

```
┌───────────────────────────────────────────────────────────┐
│ [🪚] Hassan Carpenter          Services  Work   [📞 Call Now] │  ≥ md
└───────────────────────────────────────────────────────────┘
┌──────────────────────────────────────┐
│ [🪚] Hassan Carpenter      [📞 Call]  │  < md  (nav links hidden)
└──────────────────────────────────────┘
```

- `<header class="sticky top-0 z-40 bg-navy text-white">`, height `h-16`.
- Logo: text wordmark `Hassan Carpenter` (`font-bold text-lg`) linking to `#top`. Optional `public/logo.svg` left of it if the owner supplies one.
- Nav (≥ md only): anchor links `#services`, `#work`. `text-white/80 hover:text-white`.
- Right: `call` button → `telHref`. Label "Call Now" ≥ md, "Call" < md.
- No hamburger menu (only 2 links; mobile users use the bottom bar).

**Acceptance:** stays pinned on scroll; tapping Call opens the dialer on mobile.

---

### 3.4 Hero — `components/Hero.jsx`

```
┌───────────────────────────────────────────────┐
│ ░░░░░░ full-bleed workshop photo ░░░░░░░░░░░░ │
│ ░ navy overlay 70% ░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                               │
│   Custom Kitchens & Woodwork,                 │
│   Built to Last.                              │
│                                               │
│   Expert carpentry in {city} — kitchens,      │
│   furniture, doors & polish. Free site visit. │
│                                               │
│   [💬 WhatsApp Us]   [📞 Call Now]            │
│                                               │
│   ✓ 15+ years  ✓ Free quotes  ✓ On-time       │
└───────────────────────────────────────────────┘
```

- Section: `relative min-h-[80svh] md:min-h-[70vh] flex items-center text-white`.
- Background: `<img src="/hero.webp" alt="" class="absolute inset-0 h-full w-full object-cover" fetchpriority="high">` (NOT lazy — it's the LCP element) + `<div class="absolute inset-0 bg-navy/70">`.
- Owner supplies `public/hero.webp` (≤ 200 KB, 1920px wide). Until then, the navy overlay alone on `bg-navy` is the fallback — layout must not break without the image.
- Content `relative max-w-2xl`; H1, paragraph (`text-white/85`), button row `flex flex-col sm:flex-row gap-3` (buttons full-width on mobile).
- Trust row: 3 short items with check icons, `text-sm text-white/80`. Static copy; owner edits in code.

**Acceptance:** both buttons visible above the fold on a 360×640 screen.

---

### 3.5 Services — `components/Services.jsx`

```
         What We Build
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ [photo]  │ │ [photo]  │ │ [photo]  │ │ [photo]  │
│ 🍳       │ │ 🪑       │ │ 🚪       │ │ 🔨       │
│ Kitchens │ │ Custom   │ │ Doors &  │ │ Wood     │
│          │ │ Furniture│ │ Windows  │ │ Polish & │
│ 1-line   │ │ 1-line   │ │ 1-line   │ │ Repair   │
│ View →   │ │ View →   │ │ View →   │ │ View →   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

- Static array inside the component:

| title | category | icon | image | blurb |
|---|---|---|---|---|
| Kitchens | `kitchen` | `ChefHat` | `/services/kitchen.webp` | Modular & custom kitchens, cabinets, and shelving. |
| Custom Furniture | `furniture` | `Armchair` | `/services/furniture.webp` | Beds, wardrobes, sofas, tables — made to measure. |
| Doors & Windows | `doors` | `DoorOpen` | `/services/doors.webp` | Solid wood doors, frames, and window work. |
| Wood Polish & Repair | `repair` | `Hammer` | `/services/repair.webp` | Polish, restoration, and repair of old woodwork. |

- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6`.
- Card: `<button>` (whole card clickable), `bg-white rounded-xl border border-line overflow-hidden text-left`. Image `aspect-[4/3] object-cover loading="lazy"`; if image missing show `bg-soft` with the large icon centered.
- **Click behavior:** sets the Gallery filter to that category and scrolls to `#work`. Implement via URL hash: `location.hash = 'work-kitchen'`; Gallery reads `work-<category>` from `hashchange` (see §3.6). No shared context needed.

---

### 3.6 Gallery — `components/Gallery.jsx`

```
                 Our Recent Work
 ( All ) ( Kitchen ) ( Furniture ) ( Doors ) ( Repair ) ( ▶ Videos )
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ img    │ │ img    │ │ ▶ thumb│ │ img    │
│        │ │        │ │        │ │        │
├────────┤ ├────────┤ ├────────┤ ├────────┤
│Title   │ │Title   │ │Title   │ │Title   │
│Kitchen │ │Doors   │ │Repair  │ │Kitchen │
└────────┘ └────────┘ └────────┘ └────────┘
```

**Data fetch** (once on mount):

```js
supabase.from('projects')
  .select('id,title,description,image_url,video_url,category,created_at')
  .order('created_at', { ascending: false })
  .limit(200) // ponytail: no pagination; add range() paging past ~200 projects
```

**Filter tabs:** `All`, the 4 `CATEGORIES`, `Videos`.
- Tabs are `<button role="tab" aria-selected>` in a `flex gap-2 overflow-x-auto` row (horizontal scroll on mobile, no wrap). `-mx-4 px-4` so the row bleeds to screen edges on mobile.
- Active: `bg-brand text-white`. Inactive: `bg-soft text-navy border border-line`.
- Filter logic (pure, client-side):
  - `all` → all rows
  - `videos` → `rows.filter(r => r.video_url)` (**Videos is not a category** — it's any project that has a video)
  - category → `rows.filter(r => r.category === filter)`
- Initial filter: parse `location.hash` → `#work-<value>` sets filter; else `all`. Listen to `hashchange`.

**Grid:** `grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5` (2 columns even on phones — visual density sells).

**Card** (`<button>` element, opens lightbox at that index):
- Thumbnail `aspect-square object-cover w-full`, `loading="lazy" decoding="async"`, `alt={title}`.
- Thumbnail source: `image_url ?? youtubeThumb(video_url)`.
- If `video_url`: overlay centered `Play` icon in a `bg-white/90 rounded-full p-3` circle.
- Below image (`p-3`): title (`font-semibold line-clamp-1`), category label (`text-sm text-muted`).
- Hover (desktop): `hover:shadow-md` and image `group-hover:scale-105 transition-transform`.

**States:**
| State | UI |
|---|---|
| Loading | 8 skeleton cards: `aspect-square bg-soft animate-pulse rounded-xl` |
| Error | Centered text "Couldn't load projects." + `whatsapp` button "See our work on WhatsApp". Log error to console. |
| Empty (filter has 0 items) | "No projects here yet." + `whatsapp` button. |

---

### 3.7 Lightbox — `components/Lightbox.jsx`

Native `<dialog>` opened with `showModal()` (gives Esc-to-close, focus trap, backdrop for free).

```
┌─────────────────────────────────────────────┐
│                                         [X] │
│  [<]      ┌───────────────────────┐    [>]  │
│           │  image  OR  YouTube   │         │
│           │  (contain, max 85vh)  │         │
│           └───────────────────────┘         │
│           Title — Category                  │
│           Description (if any)              │
│           [💬 Ask about this project]       │
│                   3 / 12                    │
└─────────────────────────────────────────────┘
```

- Props: `items` (the **currently filtered** list), `index`, `onClose`, `onIndexChange`.
- `index === null` → dialog closed. Use a `ref` + `useEffect` to call `showModal()` / `close()`; listen to the dialog `close` event → `onClose()`.
- Dialog classes: `m-auto w-full max-w-5xl bg-transparent p-4 text-white` (backdrop styled in index.css).
- Media:
  - Video item → `<YouTubeEmbed url={video_url} autoplay />`
  - Image item → `<img class="max-h-[75vh] w-full object-contain">`
- Prev/Next: `ChevronLeft`/`ChevronRight` buttons (44px, `bg-white/10 rounded-full`), wrap around. Keyboard `ArrowLeft`/`ArrowRight` via `keydown` listener on the dialog. Hidden when `items.length === 1`.
- Close: `X` button top-right + Esc (native) + click on backdrop (`onClick={e => e.target === e.currentTarget && close()}`).
- "Ask about this project" → `waHref(\`Hi, I'm interested in a project like "${title}".\`)`. This is the conversion hook.
- Counter `{index+1} / {items.length}`, `text-sm text-white/70`.
- `// ponytail: no swipe gestures; buttons cover it. Add touchstart/touchend delta if users ask.`

---

### 3.8 YouTubeEmbed — `components/YouTubeEmbed.jsx`

Facade pattern: a YouTube iframe costs ~500 KB+ of JS. Never render the iframe until the user asks.

- Props: `url`, `autoplay` (bool).
- `const id = youtubeId(url)`; if `null` → render `ImageOff` + "Video unavailable".
- Wrapper: `relative w-full aspect-video bg-black rounded-xl overflow-hidden`.
- Initial state (when `autoplay` is false): thumbnail `youtubeThumb(url)` + big centered `Play` button. Click → set `playing=true`.
- When `playing || autoplay`: render
  ```html
  <iframe
    src="https://www.youtube-nocookie.com/embed/{id}?autoplay=1&rel=0"
    title="{title or 'Project video'}"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    class="absolute inset-0 h-full w-full border-0">
  ```
- In the Lightbox it is always rendered with `autoplay` (the card click already was the user's intent). Unmounts when the dialog closes or index changes → playback stops automatically.

---

### 3.9 MobileCtaBar — `components/MobileCtaBar.jsx`

```
┌────────────────────┬────────────────────┐
│     📞 Call         │   💬 WhatsApp       │
└────────────────────┴────────────────────┘
```

- `fixed inset-x-0 bottom-0 z-50 md:hidden grid grid-cols-2 gap-2 bg-white border-t border-line p-2`, plus `padding-bottom: calc(0.5rem + env(safe-area-inset-bottom))` (iPhone home bar).
- Two buttons, full width, `min-h-12`: `call` → `telHref`, `whatsapp` → `waHref()`.
- `index.html` viewport meta must include `viewport-fit=cover` for `env(safe-area-inset-bottom)` to work.
- Body bottom padding is already reserved in index.css (§1.2).
- Hidden when the Lightbox is open? **No** — dialog's top layer already covers it. No extra logic.

---

### 3.10 Footer — `components/Footer.jsx`

Navy bg, `text-white/70 text-sm`, `py-10`. Three short columns (stack on mobile): brand name + one-line tagline · phone (tel link) + WhatsApp link · city/service area. Bottom line: `© {new Date().getFullYear()} Hassan Carpenter`. No admin link (admins bookmark `/admin`).

### 3.11 ContactBand (inline in HomePage)

Navy section before footer: H2 "Ready to start your project?", one line "Free site visit and quote — message us now.", the same two CTA buttons. Exists so desktop users (no bottom bar) have a final CTA.

---

### 3.12 CtaButtons — `components/CtaButtons.jsx`

Exports two small components used by Header, Hero, ContactBand, Lightbox, MobileCtaBar, Gallery empty state:

```jsx
export function CallButton({ label = 'Call Now', className = '' }) // <a href={telHref}>
export function WhatsAppButton({ label = 'WhatsApp Us', text, className = '' }) // <a href={waHref(text)} target="_blank" rel="noopener">
```

They are `<a>` tags (not buttons) — they navigate. Admin `ghost`/`danger` buttons are plain Tailwind classes inline in admin components; no generic `<Button>` abstraction.

---

## 4. Database & Storage Architecture

Run the SQL below **once** in Supabase → SQL Editor. Save it in the repo as `supabase/schema.sql` for reproducibility.

### 4.1 `projects` table

```sql
create table public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 120),
  description text check (char_length(description) <= 1000),
  image_url   text,
  video_url   text check (
                video_url ~ '^https://(www\.|m\.)?(youtube\.com|youtu\.be)/'
              ),
  category    text not null check (category in ('kitchen','furniture','doors','repair')),
  created_at  timestamptz not null default now(),
  constraint projects_has_media check (image_url is not null or video_url is not null)
);

create index projects_created_at_idx on public.projects (created_at desc);
```

Design notes:
- `category` uses a CHECK constraint, not a Postgres enum or lookup table — 4 fixed values, trivially editable with one `alter table`. Must stay in sync with `CATEGORIES` in `config.js`.
- `projects_has_media`: every project has a photo, a video, or both. Video-only projects use the YouTube thumbnail.
- `video_url` stores the full URL the admin pastes; the 11-char video ID is parsed client-side (§5.3).
- `image_url` stores the **public URL** of the Storage object. The object path for deletion is derived from it (§5.3) — no extra column.
- No `updated_at`, `sort_order`, `is_published`: not required. Newest first by `created_at`.

### 4.2 Who is "admin"

Two layers, both required:
1. **Supabase Dashboard → Authentication → Sign In / Providers → disable "Allow new users to sign up".** Create the owner account manually (Authentication → Users → Add user, email + password, auto-confirm).
2. Mark that user as admin via `app_metadata` (only the service role/SQL can write it; users cannot self-assign):

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
where email = 'owner@example.com';   -- TODO(owner)
```

The admin must sign out and back in after this so the JWT carries the claim.

Why both: with only `to authenticated` policies, if sign-ups are ever re-enabled (or a magic link leaks), any signed-up user could delete the portfolio. The role claim closes that.

### 4.3 RLS policies — `projects`

```sql
alter table public.projects enable row level security;

-- Anyone (including anon visitors) can read
create policy "projects_public_read"
  on public.projects for select
  to anon, authenticated
  using (true);

-- Only admin can insert / update / delete
create policy "projects_admin_write"
  on public.projects for all
  to authenticated
  using      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
```

Resulting matrix:

| Role | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| anon | ✅ | ❌ | ❌ | ❌ |
| authenticated (non-admin) | ✅ | ❌ | ❌ | ❌ |
| authenticated + `role=admin` | ✅ | ✅ | ✅ | ✅ |

### 4.4 Storage bucket — `portfolio-images`

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-images',
  'portfolio-images',
  true,                                        -- public URLs, no signed URLs needed
  2097152,                                     -- 2 MB hard cap (client compresses first, §5.4)
  array['image/webp','image/jpeg','image/png']
);

-- Admin-only writes. Public reads need no policy: public bucket URLs bypass RLS.
create policy "portfolio_images_admin_write"
  on storage.objects for all
  to authenticated
  using      (bucket_id = 'portfolio-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check (bucket_id = 'portfolio-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
```

Object naming: `projects/{crypto.randomUUID()}.webp` — flat, collision-free, no user input in paths. Upload with `{ cacheControl: '31536000', contentType: 'image/webp', upsert: false }` (immutable names → cache forever).

### 4.5 Data lifecycle

| Action | DB | Storage |
|---|---|---|
| Create | `insert` row | upload new object **first**; if insert fails, delete the just-uploaded object |
| Edit, image unchanged | `update` row | — |
| Edit, image replaced | `update` row with new URL | upload new first → update row → delete old object (best-effort; log on failure) |
| Edit, image removed | `update image_url = null` (DB CHECK rejects if no video either → show error) | delete old object after successful update |
| Delete | `delete` row | then delete object (best-effort) |

Order rule: **never delete a file before the DB stops pointing at it.** An orphaned file costs bytes; a broken image costs trust.

---

## 5. Application Architecture

### 5.1 Folder Structure

```
.
├── DESIGN_SPEC.md
├── .env.local                    # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (gitignored)
├── .env.example                  # same keys, empty values (committed)
├── index.html                    # meta/SEO/viewport-fit (§6.3)
├── vite.config.js                # + tailwindcss() plugin
├── supabase/
│   └── schema.sql                # all SQL from §4, in order
├── public/
│   ├── favicon.svg
│   ├── hero.webp                 # owner-supplied
│   ├── og.jpg                    # 1200×630 share image, owner-supplied
│   └── services/{kitchen,furniture,doors,repair}.webp
└── src/
    ├── main.jsx                  # createRoot + <BrowserRouter> + <App/>
    ├── App.jsx                   # <Routes>: "/", lazy "/admin", "*" → Navigate
    ├── index.css                 # Tailwind import + @theme (§1.2)
    ├── components/
    │   ├── Header.jsx
    │   ├── Hero.jsx
    │   ├── Services.jsx
    │   ├── Gallery.jsx
    │   ├── Lightbox.jsx
    │   ├── YouTubeEmbed.jsx
    │   ├── MobileCtaBar.jsx
    │   ├── Footer.jsx
    │   ├── CtaButtons.jsx
    │   └── admin/
    │       ├── LoginForm.jsx
    │       ├── ProjectList.jsx
    │       └── ProjectForm.jsx
    ├── pages/
    │   ├── HomePage.jsx          # composes public sections + ContactBand
    │   └── AdminPage.jsx         # AuthProvider + guard + dashboard
    ├── context/
    │   └── AuthContext.jsx       # session state, signIn, signOut
    └── lib/
        ├── supabase.js           # createClient singleton
        ├── config.js             # BUSINESS, telHref, waHref, CATEGORIES (§2)
        └── media.js              # youtubeId, youtubeThumb, toWebp, storagePathFromUrl
```

Delete: `src/App.css`, `src/assets/` (whole folder), `postcss`/`autoprefixer` from devDependencies.

### 5.2 `lib/supabase.js`

```js
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
if (!url || !key) throw new Error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env.local')

export const supabase = createClient(url, key)
```

The anon/publishable key is safe in the browser **because** RLS (§4.3) is on. Never put the service-role key in any `VITE_` variable.

### 5.3 `lib/media.js`

```js
// Accepts youtube.com/watch?v=, youtu.be/, /embed/, /shorts/, m.youtube.com
export function youtubeId(url) {
  return url?.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/)?.[1] ?? null
}

export const youtubeThumb = (url) => {
  const id = youtubeId(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}

// "https://x.supabase.co/storage/v1/object/public/portfolio-images/projects/a.webp" → "projects/a.webp"
export const storagePathFromUrl = (url) => url?.split('/portfolio-images/')[1] ?? null
```

Required self-check (`src/lib/media.check.js`, run with `node src/lib/media.check.js`; uses `node:assert`, no test framework):

```js
import assert from 'node:assert/strict'
import { youtubeId, storagePathFromUrl } from './media.js'

const ID = 'dQw4w9WgXcQ'
for (const u of [
  `https://www.youtube.com/watch?v=${ID}`,
  `https://youtu.be/${ID}`,
  `https://youtu.be/${ID}?si=abc`,
  `https://m.youtube.com/watch?feature=share&v=${ID}`,
  `https://www.youtube.com/embed/${ID}`,
  `https://www.youtube.com/shorts/${ID}`,
]) assert.equal(youtubeId(u), ID, u)
assert.equal(youtubeId('https://vimeo.com/123'), null)
assert.equal(youtubeId(null), null)
assert.equal(storagePathFromUrl('https://x.supabase.co/storage/v1/object/public/portfolio-images/projects/a.webp'), 'projects/a.webp')
console.log('media ok')
```

(`toWebp` uses browser-only APIs but only at call time, so importing `media.js` in Node is safe; it is not covered by this check.)

### 5.4 Client-side image compression — `toWebp` in `lib/media.js`

Phone photos are 3–8 MB; the bucket caps at 2 MB and the gallery must load fast. Resize in the browser before upload — no library, no paid Supabase image transforms.

```js
export async function toWebp(file, max = 1600, quality = 0.82) {
  const bmp = await createImageBitmap(file)          // honours EXIF orientation
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height))
  const canvas = new OffscreenCanvas(Math.round(bmp.width * scale), Math.round(bmp.height * scale))
  canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height)
  bmp.close()
  return canvas.convertToBlob({ type: 'image/webp', quality })
}
```
`// ponytail: one 1600px size serves both grid and lightbox; add a 600px thumb variant if grid LCP suffers.`

### 5.5 Authentication State Flow

```
                 ┌────────────────────────────────┐
  /admin  ──────▶│ AdminPage                       │
                 │  <AuthProvider>                 │
                 │    getSession() on mount        │
                 │    onAuthStateChange(sub)       │
                 └───────────────┬────────────────┘
                                 ▼
                        loading === true ?
                       ┌──── yes ───┴─── no ────┐
                       ▼                         ▼
                  <Spinner/>              session === null ?
                                    ┌──── yes ───┴─── no ─────┐
                                    ▼                          ▼
                              <LoginForm/>        app_metadata.role === 'admin' ?
                                    │              ┌──── no ───┴──── yes ───┐
                    signInWithPassword             ▼                         ▼
                    → onAuthStateChange    "Not authorized"         <Dashboard>
                      fires → re-render     + Sign out button        ProjectList
                                                                     ProjectForm
```

`context/AuthContext.jsx`:

```jsx
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const value = {
    session,
    loading,
    isAdmin: session?.user?.app_metadata?.role === 'admin',
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
```

Rules:
- `AuthProvider` wraps **only** the admin route (inside `AdminPage`). The public site never touches auth.
- `isAdmin` is a UX gate only. **Security is enforced by RLS**; a tampered client still can't write.
- Session persistence: supabase-js default (localStorage, auto-refresh). No custom handling.
- Protected route = the conditional render in `AdminPage`. No separate `<ProtectedRoute>` component, no `/admin/login` route.

### 5.6 State Strategy

| State | Where | Why |
|---|---|---|
| Auth session | `AuthContext` (admin subtree only) | Needed by guard + sign-out button + form |
| Public projects list | `useState` in `Gallery` | Only consumer; fetched once |
| Active filter | `useState` in `Gallery`, seeded from `location.hash` | Services sets it via hash — no context |
| Lightbox index | `useState` in `Gallery` | Lightbox is Gallery's child |
| Admin projects list | `useState` in `AdminPage`; `reload()` passed down | Refetch after every mutation — simplest correct cache |
| Admin form | `useState` in `ProjectForm` (controlled inputs) | — |

No global store, no React Query, no realtime subscription. A visitor sees new projects on next page load — fine for a portfolio.

---

## 6. Admin Panel (`/admin`)

### 6.1 Screens

**A. Login**
```
┌────────────────────────────────┐
│        Hassan Carpenter        │
│          Admin Login           │
│                                │
│  Email    [________________]   │
│  Password [________________]   │
│                                │
│  [        Sign in         ]    │
│  ⚠ Invalid login credentials   │
└────────────────────────────────┘
```
- Centered card `max-w-sm`, page `bg-soft min-h-svh grid place-items-center`.
- `<form>` with `type="email" required autoComplete="username"` and `type="password" required autoComplete="current-password"`.
- Submit disables + shows `Loader2 animate-spin` while pending. Show `error.message` from Supabase in `text-danger`.
- No sign-up link, no password reset (owner resets via Supabase dashboard). `<meta name="robots" content="noindex">` is not possible per-route in an SPA → disallow `/admin` in `public/robots.txt` instead.

**B. Dashboard**
```
┌───────────────────────────────────────────────────────────┐
│ Hassan Carpenter · Admin          View site ↗   [⎋ Log out]│  navy bar
├───────────────────────────────────────────────────────────┤
│ Projects (24)                           [ + Add project ] │
│ ( All ) ( Kitchen ) ( Furniture ) ( Doors ) ( Repair )    │
│ ┌──────┬──────────────────────┬──────────┬──────┬───────┐ │
│ │ img  │ Walnut kitchen       │ Kitchen  │ ▶    │ ✏ 🗑  │ │
│ │ img  │ Teak front door      │ Doors    │      │ ✏ 🗑  │ │
│ └──────┴──────────────────────┴──────────┴──────┴───────┘ │
└───────────────────────────────────────────────────────────┘
```
- Desktop: table rows (64px thumb, title, category, video indicator, actions).
- Mobile: same data as stacked cards (`md:` breakpoint switches; one component, responsive classes).
- Admin category filter: same filter logic as public gallery (copy the 3-line filter; don't abstract for 2 users).
- Empty state: "No projects yet. Add your first one." + Add button.

**C. Add / Edit modal** (native `<dialog>`, `ProjectForm.jsx`)
```
┌──────────────────────────────────────────┐
│ Add project                          [X] │
│                                          │
│ Title *        [______________________]  │
│ Category *     [ Kitchen          ▾ ]    │
│ Description    [______________________]  │
│                [______________________]  │
│ Photo          [Choose file]             │
│                ┌────────┐                │
│                │preview │  [Remove]      │
│                └────────┘                │
│ YouTube link   [https://youtu.be/...  ]  │
│                ┌──── video thumb ────┐   │
│                └─────────────────────┘   │
│ ⚠ Add a photo or a YouTube link.         │
│                                          │
│              [Cancel]  [Save project]    │
└──────────────────────────────────────────┘
```

Fields & validation (validate client-side for UX; DB CHECKs are the real guard):

| Field | Input | Rule | Error text |
|---|---|---|---|
| Title | `text`, `maxLength=120`, `required` | trimmed, 1–120 | "Title is required." |
| Category | `<select>` from `CATEGORIES`, `required` | one of 4 | — |
| Description | `<textarea rows=3 maxLength=1000>` | optional | — |
| Photo | `type="file" accept="image/*"` | optional; show preview via `URL.createObjectURL` (revoke on change/unmount) | "Couldn't process that image." |
| YouTube link | `type="url"` | optional; if filled, `youtubeId()` must be non-null | "Paste a valid YouTube link." |
| (form) | — | photo OR video required | "Add a photo or a YouTube link." |

Save flow (`handleSubmit`):
1. Validate → set errors → abort if any.
2. `saving = true` (disable all inputs, spinner on Save).
3. If new file: `blob = await toWebp(file)`; `path = projects/${crypto.randomUUID()}.webp`; `storage.from('portfolio-images').upload(path, blob, {...})`; `image_url = getPublicUrl(path).data.publicUrl`.
4. `insert` (new) or `update().eq('id', id)` (edit) with `{ title, category, description: description || null, image_url, video_url: video_url || null }`.
5. On DB error: delete the object uploaded in step 3 (if any), show error, `saving = false`.
6. On success: if edit replaced/removed an image, `storage.remove([storagePathFromUrl(oldUrl)])` (ignore errors). Close dialog, call `reload()`.

Delete flow (`ProjectList`): `if (!confirm(\`Delete "${title}"? This cannot be undone.\`)) return` → `delete().eq('id', id)` → on success remove image object (best-effort) → `reload()`.

Edit mode pre-fills all fields; existing image shown as preview with "Remove" button (sets `image_url` to null on save). Choosing a new file replaces the preview.

### 6.2 UX Rules
- Every async button shows a spinner and is disabled while pending (prevents double-submits).
- Errors render inline in red text near the cause; no toast library.
- After save/delete the list refetches — no optimistic updates.
- Dialog closes on Esc (native) **only when not saving**: `onCancel={e => saving && e.preventDefault()}`.

---

## 7. Setup & Platform

### 7.1 Tooling changes
```bash
npm i -D @tailwindcss/vite
npm rm postcss autoprefixer
```
`vite.config.js`:
```js
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({ plugins: [react(), tailwindcss()] })
```

### 7.2 Environment
`.env.example` (commit) and `.env.local` (gitignored — verify `.gitignore` covers `*.local`):
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### 7.3 `index.html`
```html
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="theme-color" content="#0F172A" />
  <title>Hassan Carpenter — Custom Kitchens, Furniture & Woodwork</title>
  <meta name="description" content="Expert carpenter for custom kitchens, furniture, doors and wood polish. Free site visit. Call or WhatsApp for a quote." />
  <meta property="og:title" content="Hassan Carpenter" />
  <meta property="og:description" content="Custom kitchens, furniture, doors & wood polish." />
  <meta property="og:image" content="/og.jpg" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preconnect" href="https://YOUR-PROJECT.supabase.co" />
  <script type="application/ld+json">
  { "@context": "https://schema.org", "@type": "HomeAndConstructionBusiness",
    "name": "Hassan Carpenter", "telephone": "+923000000000",
    "areaServed": "Lahore", "url": "https://YOUR-DOMAIN" }
  </script>
</head>
```
(Placeholders marked `YOUR-…` / phone must match `config.js`.)

### 7.4 Hosting (SPA fallback)
`/admin` deep links must serve `index.html`:
- Vercel: `vercel.json` → `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`
- Netlify: `public/_redirects` → `/*  /index.html  200`

`public/robots.txt`:
```
User-agent: *
Disallow: /admin
```

---

## 8. Performance & Accessibility Budget

| Item | Target |
|---|---|
| Public JS (gzip) | < 120 KB (React + router + supabase-js; admin is lazy) |
| LCP (4G mobile) | < 2.5 s — hero image preloaded via `fetchpriority="high"`, all others `loading="lazy"` |
| CLS | ≈ 0 — every image box has `aspect-*` set before load |
| Uploaded images | ≤ ~300 KB each (1600px WebP q0.82) |
| YouTube | zero iframe until user clicks |
| a11y | all images `alt` (decorative hero `alt=""`), tabs `role="tab"`/`aria-selected`, icon-only buttons have `aria-label`, focus-visible rings, 44px targets, AA contrast (§1.1) |

---

## 9. Implementation Order (Phase 2)

1. Tooling (§7.1), env (§7.2), delete boilerplate, `index.css` theme, `index.html`.
2. `lib/config.js`, `lib/supabase.js`, `lib/media.js` + run `node src/lib/media.check.js`.
3. Run `supabase/schema.sql`; disable sign-ups; create admin user; set role (§4.2).
4. `CtaButtons` → `Header` → `Hero` → `Services` → `Footer` → `MobileCtaBar` → `HomePage` (static, verify on 360px width).
5. `YouTubeEmbed` → `Lightbox` → `Gallery` (insert 2–3 rows manually in Supabase table editor to test).
6. `AuthContext` → `AdminPage` + `LoginForm` → `ProjectList` → `ProjectForm`.
7. End-to-end check: add photo project, add video-only project, edit (replace image), delete — confirm Storage has no orphans and public site reflects changes; confirm a logged-out `supabase.from('projects').delete()` from the browser console is rejected.

---

## 10. Explicitly Out of Scope

Cost estimator · calculators · FAQ/accordions · testimonials carousel · blog · multi-language · contact form/email backend (WhatsApp + phone are the contact channels) · project detail pages · drag-to-reorder · multiple images per project · video upload (YouTube links only) · analytics · dark mode · PWA/offline · swipe gestures (noted in §3.7).
