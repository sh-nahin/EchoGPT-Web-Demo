# EchoGPT Chatbot — Web

A React + TypeScript frontend based on the supplied EchoGPT chat screenshot. The app opens directly into chat. There is no landing page, pricing page, authentication screen, or unrelated studio.

## Run

Use Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173`.

```bash
npm run build    # TypeScript checks + production build
npm run preview  # Preview the production build
```

## Frontend features

- New chats; saved history with search, rename, and delete.
- Searchable model selection and two-model response comparison.
- Prompt starters and a reusable prompt library.
- Text-file attachments (`.txt` / `.md`, up to 100 KB; first 12,000 characters used).
- Send/stop responses, copy answers, and export conversations as Markdown.
- Light/dark mode, Enter-to-send preference, and confirmed history clearing.
- Responsive layout, keyboard focus styles, labelled controls, reduced-motion support, and a native mobile navigation dialog.

Responses are **local examples**, not live AI. Attached-text responses show excerpts and say so. The frontend needs no account, API key, or backend. Conversations and preferences stay in this browser's local storage.

## Structure

| Folder / file | Purpose |
| --- | --- |
| `src/App.tsx` | Theme and chatbot entry point |
| `src/pages/ChatPage.tsx` | Chat screen and frontend actions |
| `src/components/` | Sidebar, composer, model picker, messages, dialog, and brand |
| `src/hooks/` | Conversation state and local persistence |
| `src/lib/demo.ts` | Prepared responses |
| `src/data.ts`, `src/types.ts` | Model/prompt data and shared types |
| `src/styles/` | Shared styles and responsive chat layout |
| `public/` | Favicon |

The source archive excludes dependencies, generated builds, test scaffolding, and reference screenshots. The lockfile is included.

## Design and checks

Reference: [EchoGPT](https://echogpt.live/) and the supplied screenshot. The redesign keeps the chat, model, prompt, and history workflow, using a navy sidebar, blue accents, and a composer beside the initial task suggestions. Unrelated navigation was removed.

TypeScript and production builds passed. Component checks cover navigation, models, chat, comparison, renaming, attachments, settings, and history. The browser preview service was unavailable; rendered breakpoints and actual browser focus behavior still need visual review. No WCAG certification is claimed.
