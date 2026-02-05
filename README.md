# Crytch - Visual Cryptography

A modern rebuild of Crytch, a visual cryptography tool that allows you to create, encrypt, and share secret visual messages.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: SQLite with Drizzle ORM
- **Drawing**: Paper.js
- **Testing**: Vitest
- **Deployment**: Vercel-ready

## Features

- ✏️ **Drawing Tool**: Create messages using pen, text, and move tools
- 🔐 **Visual Encryption**: Encrypt drawings with a password
- 🔗 **Shareable URLs**: Save and share encrypted messages via unique URLs
- 🔓 **Decryption**: Restore original messages with the correct password
- 🌐 **Multi-language**: English, German, and Dutch
- 📱 **Responsive**: Works on desktop (mobile optimization pending)

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone and install
pnpm install

# Generate database
pnpm db:generate
pnpm db:push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start creating messages.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm migrate:mysql` | Migrate from old MySQL database |

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── page.tsx           # Drawing tool (home)
│   ├── m/[id]/page.tsx    # Message viewer
│   ├── about/page.mdx     # About page
│   ├── blog/page.tsx      # Blog page
│   └── api/messages/      # API routes
├── components/
│   ├── canvas/            # Drawing canvas component
│   ├── ui/                # UI components (Button, Menu, Modal)
│   └── layout/            # Layout components
├── lib/
│   ├── encryption/        # Encryption algorithm (v1 & v2)
│   ├── typeface/          # Custom character definitions
│   ├── drawing/           # Grid and style utilities
│   ├── i18n/              # Translations
│   └── db/                # Database schema and client
└── types/                 # TypeScript definitions
```

## How Encryption Works

1. Every message consists of anchor points connected by lines
2. When encrypted, each point is shifted according to a displacement matrix
3. The password determines how much and in what direction points shift
4. The same password reverses the shifts during decryption

## Migration from Old Database

If you have an existing MySQL database from the original Crytch:

```bash
# Set environment variables
export MYSQL_HOST=localhost
export MYSQL_USER=crytch
export MYSQL_PASSWORD=your_password
export MYSQL_DATABASE=crytch

# Install mysql2 (one-time)
pnpm add -D mysql2

# Run migration
pnpm migrate:mysql
```

## Deployment

The project is configured for Vercel deployment:

1. Push to GitHub
2. Import to Vercel
3. Deploy!

For SQLite persistence on Vercel, consider using [Turso](https://turso.tech/) or configure a persistent volume.

## License

MIT

---

Original project by Moritz Ebeling, rebuilt with modern tooling.
