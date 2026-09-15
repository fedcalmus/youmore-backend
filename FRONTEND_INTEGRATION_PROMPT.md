You are working directly inside an **existing React frontend project**.

Do NOT rewrite the project architecture, routing library, state management, styling system, or HTTP client. First inspect the existing codebase (folder structure, routing setup, existing API service layer, existing auth handling, existing components, existing UI library/design system, existing forms/validation approach) and follow its conventions exactly. Reuse existing patterns instead of introducing new ones.

The backend is an existing Express + Prisma + PostgreSQL API. Do NOT modify or assume anything about the backend — only consume it as described below.

---

# BACKEND API REFERENCE

Base URL: configurable via env (e.g. `VITE_API_URL` / `NEXT_PUBLIC_API_URL` / whatever this project already uses).

Uploaded file URLs returned by the API are relative paths like `/uploads/projects/xxx.png` — they must be prefixed with the API base URL when rendering `<img>` / links.

## Auth

`POST /auth/login`
Body: `{ "username": string, "password": string }`
Response: `{ "token": string, "user": { "id": number, "username": string, "role": "USER" | "SUPER_ADMIN" } }`

- Store the JWT (reuse whatever auth/token storage pattern already exists in this project — e.g. context, cookie, localStorage).
- Send it on all admin requests as header: `Authorization: Bearer <token>`.
- Only `role === "SUPER_ADMIN"` can use admin endpoints. Protect admin routes client-side (redirect to login if no valid token) AND rely on the backend for real enforcement.
- 401 = not authenticated, 403 = authenticated but not admin. Handle both (e.g. redirect to login on 401, show "not authorized" on 403).

## Pagination shape (used by Projects and Volunteers lists only)

Response shape:
```json
{
  "data": [ /* items */ ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalItems": 23,
    "totalPages": 3
  }
}
```
Query param: `?page=<n>` (fixed page size of 10, no sort/filter/search params exist — do not build UI for sorting/filtering/searching these two lists).

## Public endpoints (no auth)

- `GET /api/financing-entities` → array of `{ id, name, image, url, createdAt, updatedAt }`
- `GET /api/financing-entities/:id` → single entity

- `GET /api/team` → array of `{ id, name, surname, email, phoneNumber, image, createdAt, updatedAt }`
- `GET /api/team/:id` → single member

- `GET /api/pages/:slug` — slug is one of: `terms-and-conditions`, `cookies`, `about-us`
  → `{ key, content, updatedAt }` where `content` is sanitized HTML (render with an HTML-safe renderer, e.g. `dangerouslySetInnerHTML` since it's already sanitized server-side)

- `GET /api/contact` → `{ id, address, phone, email, instagram, facebook, linkedin, updatedAt }` (social fields nullable)

- `GET /api/projects?page=1` → paginated list of projects (see Project shape below)
- `GET /api/projects/:slug` → single project by slug (same shape)

- `POST /api/projects/:slug/apply` — public volunteer application submission (see Volunteer Application Form below)
  Response: `{ "message": string, "applicationId": number }`

### Project shape (public & admin read)
```json
{
  "id": 1,
  "title": "string",
  "slug": "string",
  "shortDescription": "string",
  "description": "string (sanitized HTML)",
  "mainImage": "/uploads/projects/xxx.png",
  "documentUrl": "/uploads/documents/xxx.pdf | null",
  "projectCode": "string | null",
  "category": "string | null",
  "status": "ACTIVE | COMPLETED",
  "location": "string | null",
  "startDate": "ISO date | null",
  "endDate": "ISO date | null",
  "beneficiaries": "string | null",
  "funding": "string | null",
  "richContent": {
    "overview": "sanitized HTML (optional)",
    "objectives": "sanitized HTML (optional)",
    "activities": "sanitized HTML (optional)",
    "requirements": "sanitized HTML (optional)",
    "impact": "sanitized HTML (optional)",
    "additionalInfo": "sanitized HTML (optional)"
  } | null,
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```
Admin list/detail responses additionally include `"_count": { "volunteerApplications": number }`.

## Admin endpoints (require `Authorization: Bearer <token>`, SUPER_ADMIN only)

### Financing Bodies
- `POST /api/admin/financing-entities` — multipart/form-data: `name` (string), `url` (string), `image` (file, required)
- `GET /api/admin/financing-entities` → array
- `GET /api/admin/financing-entities/:id` → single
- `PUT /api/admin/financing-entities/:id` — multipart/form-data, all fields optional (partial update), `image` optional to replace
- `DELETE /api/admin/financing-entities/:id` → 204

### Team
- `POST /api/admin/team` — multipart/form-data: `name`, `surname`, `email`, `phoneNumber`, `image` (file, required)
- `GET /api/admin/team` → array
- `GET /api/admin/team/:id` → single
- `PUT /api/admin/team/:id` — multipart/form-data, all fields optional, `image` optional
- `DELETE /api/admin/team/:id` → 204

### Static Content Pages (Terms & Conditions, Cookies, About Us)
- `GET /api/admin/pages` → array of all 3 pages `{ id, key, content, createdAt, updatedAt }`
- `GET /api/admin/pages/:slug` → single page (slug: `terms-and-conditions` | `cookies` | `about-us`)
- `PUT /api/admin/pages/:slug` — body: `{ "content": "<p>HTML from WYSIWYG editor</p>" }` (creates on first save, updates after). Content is sanitized server-side automatically.

Build an admin CMS screen with a WYSIWYG editor (reuse whatever rich text editor already exists in this project, e.g. TipTap/Quill/etc; if none exists, pick the lightest one already available as a dependency, otherwise ask before adding one) for these 3 pages.

### Contact Us (single record)
- `GET /api/admin/contact` → current record (or 404 if never set — handle empty state)
- `PUT /api/admin/contact` — body: `{ "address", "phone", "email", "instagram"?, "facebook"?, "linkedin"? }` (upserts automatically)

### Projects
- `POST /api/admin/projects` — multipart/form-data:
  - `title` (required), `shortDescription` (required), `description` (required, HTML from WYSIWYG)
  - `projectCode`, `category`, `location`, `beneficiaries`, `funding` (optional strings)
  - `status` (optional, `ACTIVE` | `COMPLETED`, defaults to `ACTIVE`)
  - `startDate`, `endDate` (optional, ISO date strings)
  - `richContent` (optional, **stringified JSON** of `{ overview?, objectives?, activities?, requirements?, impact?, additionalInfo? }`, each value is HTML from a WYSIWYG editor)
  - `mainImage` (file, required, image)
  - `document` (file, optional, PDF only — info pack)
  - Slug is auto-generated server-side from title (not submitted by client).
- `GET /api/admin/projects?page=1` → paginated list (includes `_count.volunteerApplications`)
- `GET /api/admin/projects/:id` → single project detail (includes `_count`)
- `PUT /api/admin/projects/:id` — same multipart fields as create, all optional (partial update); omit `mainImage`/`document` to keep existing files
- `DELETE /api/admin/projects/:id` → soft-delete (204). Deleted projects disappear from all lists but their volunteer applications remain accessible.
- `GET /api/admin/projects/:id/volunteers?page=1` → paginated volunteer summaries for that project:
  `{ id, name, surname, email, phoneNumber, city, citizenship, createdAt }`

### Volunteer Applications (admin only — never public)
- `GET /api/admin/volunteers?page=1` → paginated list, each item:
  `{ id, name, surname, email, phoneNumber, city, citizenship, createdAt, project: { id, title, slug } }`
- `GET /api/admin/volunteers/:id` → full application detail:
  ```json
  {
    "id": 1, "projectId": 1, "name": "", "surname": "", "gender": "MALE|FEMALE|OTHER",
    "citizenship": "", "city": "", "dateOfBirth": "ISO date",
    "email": "", "phoneNumber": "",
    "hasPassport": true, "travelDocumentValidForCountry": true,
    "motivation": "", "isFirstExperience": true, "howDidYouFindUs": "",
    "emergencyContact": "", "specialNeeds": "string | null",
    "tshirtSize": "XS|S|M|L|XL|XXL",
    "emailGroupConsent": true, "personalDataConsent": true,
    "consentTimestamp": "ISO datetime", "createdAt": "ISO datetime",
    "project": { "id": 1, "title": "", "slug": "", "status": "ACTIVE|COMPLETED" }
  }
  ```

Build an admin "Volunteers" list page (10/page, pagination only, no filters), and a detail page/modal showing full applicant info + a link to their project. Also add a "Volunteers" tab/section inside the admin Project detail page showing that project's applications (paginated), linking to the volunteer detail page.

## Public Volunteer Application Form (submitted via `POST /api/projects/:slug/apply`)

Fields and validation to implement client-side (server also validates):
- `name`, `surname` — required text
- `gender` — required select: Male / Female / Other (`MALE`/`FEMALE`/`OTHER`)
- `citizenship`, `city` — required text
- `dateOfBirth` — required date, cannot be in the future
- `email` — required, valid email
- `phoneNumber` — required, valid phone
- `hasPassport` — required boolean (yes/no)
- `travelDocumentValidForCountry` — required boolean (yes/no)
- `motivation` — required textarea ("Shortly describe why you want to participate in this project?")
- `isFirstExperience` — required boolean (yes/no)
- `howDidYouFindUs` — required text/select
- `emergencyContact` — required text (name + phone)
- `specialNeeds` — optional textarea
- `tshirtSize` — required select: XS, S, M, L, XL, XXL
- `emailGroupConsent` — required checkbox (opt-in to email group, can be true or false)
- `personalDataConsent` — required checkbox, **must be checked** to submit (block submit client-side if unchecked, show validation error)

On success, show a confirmation message (do not expect/display personal data back). Only submit the form if the project's `status` is `ACTIVE` (hide/disable the Apply button otherwise).

---

# PAGES / ROUTES TO BUILD

Follow the existing routing convention in this project (React Router / Next.js app router / etc — inspect first).

## Public site
- Home
- About Us (`GET /api/pages/about-us`, render sanitized HTML)
- Terms & Conditions (`GET /api/pages/terms-and-conditions`)
- Cookies Policy (`GET /api/pages/cookies`)
- Team page (`GET /api/team`)
- Financing Bodies section/page (`GET /api/financing-entities`)
- Contact Us page (`GET /api/contact`)
- Projects list page (paginated, `GET /api/projects`)
- Project detail page (`GET /api/projects/:slug`) — render description + richContent sections (only the ones present) + an "Apply" form/section (only if `status === "ACTIVE"`)

## Admin panel (protected, SUPER_ADMIN only)
- Login page (`POST /auth/login`)
- Dashboard (optional landing)
- CMS: Terms & Conditions / Cookies / About Us editors (WYSIWYG → PUT `/api/admin/pages/:slug`)
- Financing Bodies: list, create, edit, delete (with image upload)
- Team: list, create, edit, delete (with image upload)
- Contact Us: single edit form
- Projects: list (paginated, 10/page, no sort/filter/search), create, edit (with main image upload, optional PDF upload, WYSIWYG for description + each richContent section, status select, category free-text input, date pickers), delete
- Project detail (admin): project info + "Volunteers" tab (paginated list of applicants for this project)
- Volunteers: list (paginated, 10/page, no sort/filter/search), detail view (full applicant info + linked project)

---

# IMPLEMENTATION RULES

- Reuse the existing HTTP client/service layer, auth context, routing, form library, and UI components already in this project.
- Do not add a new state management library, HTTP client, or CSS framework if one already exists.
- Multipart/form-data requests are required wherever a file upload field is present (financing entities, team, projects create/update). Use `FormData`.
- Never render unsanitized user HTML with anything other than the sanitized `content`/`description`/`richContent` fields already returned by the API (they are pre-sanitized server-side).
- Do not build sorting, filtering, or search UI for Projects or Volunteers lists — pagination only.
- Volunteer personal data must only appear in the admin-authenticated area, never in any public component.
- Handle 401 (redirect to admin login) and 403 (show unauthorized) globally via existing interceptor/middleware pattern if one exists, or add a minimal one consistent with the project's conventions.

After implementation, run the project's existing lint/typecheck/build commands and fix any errors.
