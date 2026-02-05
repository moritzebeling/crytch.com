We want to rebuild the project from scratch.

## Stack

- pnpm
- Next.js 16 (app router)
- Tailwind CSS v4
- Hosting on Vercel
- SQLite database
- Drizzle ORM
- TypeScript
- Paper.js for drawing tool
- Unit testing with Vitest

## Features

- Match the visual style, UI and menues
- Drawing tool (pen, text, move, grid snapping, keyboard shortcuts)
- Encrypt and save (get sharable URL)
- Decrypt and view
- Support for multiple languages (English, German, Dutch) but we dont need different urls/paths for that, we can simply click a button and swich the lang variables. Translation strings should be in a typed ts file.
- About and blog subpages (german text)
- We want to write static content in markdown, not html
- we need to implement encryption version 1 and 2

We don’t need:

- Dont invent anything that is not in the current codebase (Authentication, real-time collaboration, websockets, stats, etc.)
- Send stuff via email
- Listen for messages from other clients (that was a "Summaery" exhibition feature)
- Also the leaking and everything related to the "Public Keys" exhibition

## Coding style:

- write clean, modern, readable, maintainable code
- instead of the existing codebase, write professional code
- give meaningful names to variables and functions
- consistent coding style throughout the codebase
- objects, functions, ... must be typed
- unit tests should be as simple as possible but still cover the main functionality
- use the latest features of the language and the stack
- divide ui components into reusable parts

## Compability:

- The website frontend should look more or less the same
- we need a transform script that can import the existing database, transform it to the new schema and save it to the new database
- after that, the old messages should still be visible and usable
