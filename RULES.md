# 📐 Project Rules — Mulatiyana Restaurant

These rules must be followed by every contributor (human or AI) on every change.

---

## 🔴 CRITICAL RULE

> **Before generating or modifying any code for components, pages, or layouts, read this file.**
> **After any creation or modification, you MUST automatically update:**
> 1. `WORKSPACE.md` — to track sprint progress (move tasks between To-Do / In Progress / Completed)
> 2. `ARCHITECTURE.md` — to reflect the updated component tree and project structure
>
> No PR or task is considered complete until both documents are updated.

---

## 🟡 General Rules

- **Mobile-first**: All UI must be built mobile-first using Tailwind responsive prefixes (`sm:`, `md:`, `lg:`).
- **Component hygiene**: Keep components small and single-responsibility. Extract sub-components when a component exceeds ~80 lines.
- **Currency**: Display all prices in **Sri Lankan Rupees** formatted as `Rs. X,XXX`.
- **Icons**: Use `lucide-react` exclusively for all icons. Do not mix icon libraries.
- **Image fallback**: Every `<img>` tag must include an `onError` handler that sets `e.target.src` to `FALLBACK_IMAGE_URL` imported from `src/utils/constants.js`.
- **Routing**: All new pages must be registered in `src/routes/index.jsx` immediately after creation.
- **Naming**: Pages → `PascalCasePage.jsx`, Layouts → `PascalCaseLayout.jsx`, UI components → `PascalCase.jsx`.
- **No inline styles**: Use Tailwind utility classes only. No `style={{}}` props unless absolutely unavoidable.
- **Dummy data**: Keep all placeholder/dummy data co-located in the page file until a real API is connected.
- **Dark mode**: Apply dark-mode variants (`dark:`) on all new components using the Tailwind `class` strategy.
- **Custom selects**: Never use native `<select>` for visible UI. Use `<ModernSelect />` from `src/components/ui/ModernSelect.jsx`.
- **URL state**: Filter/search/sort state on list pages must be stored in URL search params (`useSearchParams`) for shareability and refresh persistence.
- **Price defaults**: When reading a numeric URL param that may be absent, always use `searchParams.has(key)` before `searchParams.get(key)` to avoid defaulting to `0`.

---

## 🟢 Workflow

1. Pick a task from `WORKSPACE.md` → move it to **In Progress**
2. Read `RULES.md` before writing any code
3. Build the feature following the rules above
4. **UI/UX & RESPONSIVENESS AUDIT**: After generating or modifying any component or page, you MUST ensure it is fully mobile-responsive (using Tailwind's `sm/md/lg` prefixes) and free of overlapping UI issues or console errors.
5. Update `ARCHITECTURE.md` component tree
6. Move the task to **Completed** in `WORKSPACE.md`
7. Commit with a clear message: `feat(web): add FoodCard component`

---

## 🔵 Deployment Rules

- **SPA routing**: `vercel.json` must contain a catch-all rewrite to `/index.html` so React Router handles all routes on Vercel.
- **Environment variables**: Never commit `.env` files. Use Vercel dashboard or `.env.example` for documentation.
- **Build command**: `npm run build` — output goes to `dist/`.
- **Navigation state**: When navigating between pages with `navigate('/path', { state })`, always pass all data the destination page needs (e.g., `discountAmount`, `grandTotal`) — never rely on re-computing from stale store state after `clearCart()`.
