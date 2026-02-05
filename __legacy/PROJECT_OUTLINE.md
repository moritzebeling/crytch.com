# Crytch.com - Project Outline

> **Project**: Crytch - "Encrypt a Sketch"  
> **Authors**: Moritz Ebeling (Code) & Leon Lukas Plum (Typeface/Concept)  
> **Origin**: Bauhaus University Weimar, 2016-2017  
> **Context**: Art school semester project for "Private Conversation" course  
> **Exhibition**: "Public Keys" at Spinnerei Leipzig, September 2017  
> **Awards**: TDC New York Certificate of Typographic Excellence, TDC Tokyo Annual Book 2017

---

## 1. Project Overview

Crytch is a web-based visual cryptography tool that allows users to:
1. **Draw** vector-based sketches and messages on a canvas
2. **Write** text using a custom monospace typeface designed for encryption
3. **Encrypt** the visual content using password-based point manipulation
4. **Share** encrypted messages via unique URLs
5. **Decrypt** messages by entering the correct password

The encryption is **visual** - as users type a password, they can watch the drawing distort/restore in real-time. The human eye acts as the verification mechanism rather than cryptographic hashes.

---

## 2. Tech Stack

### Backend
- **Language**: PHP (vanilla, no framework)
- **Database**: MySQL 5.6.19
- **Server**: Apache with mod_rewrite (URL routing via `.htaccess` assumed)

### Frontend
- **JavaScript Libraries**:
  - **Paper.js** (v1.0+) - Vector graphics & canvas manipulation (`_/paper-full.min.js`)
  - **jQuery 3.2.1** - DOM manipulation & AJAX (CDN loaded)
- **Fonts**: Google Fonts - Roboto Mono
- **Styling**: Vanilla CSS (single `ui/style.css` file)

### External Services
- None (self-hosted, no third-party APIs)

---

## 3. Directory Structure

```
crytch.com/
├── _config.php              # Main configuration (DB credentials, constants)
├── index.php                # Main drawing tool (create/encrypt)
├── tool_open.php            # Message viewer (decrypt)
├── page_about.php           # About page (static content)
├── page_blog.php            # Blog listing page
├── page_info.php            # Info/stats page
│
├── _/                       # Backend helpers & API endpoints
│   ├── connect.php          # Client-to-client connection setup
│   ├── debug.php            # Debug utilities
│   ├── functions.php        # Core PHP functions & validation
│   ├── languages_*.php      # i18n strings (en, de, nl)
│   ├── listen.php           # Long-polling for new messages
│   ├── paper-full.min.js    # Paper.js library
│   ├── savemessage.php      # API: Save encrypted message
│   ├── sendtoclient.php     # API: Send to connected client
│   ├── sendviaemail.php     # API: Send via email (exhibition mode)
│   └── summaery.php         # Exhibition mode activation
│
├── v/                       # Versioned JavaScript
│   ├── 1/                   # Version 1 (legacy)
│   │   ├── characters.js    # Typeface data (original)
│   │   ├── crytch.js        # Main app logic v1
│   │   └── decrypt.js       # Decryption logic v1
│   └── 2/                   # Version 2 (current)
│       ├── characters.js    # Typeface data (expanded)
│       ├── characters_basis.js
│       ├── crytch.js        # Main app logic
│       ├── crytch_debug.js  # Debug version
│       ├── crytch.min.js    # Minified version
│       └── decrypt.js       # Decryption logic
│
├── ui/                      # UI components & assets
│   ├── header.php           # HTML head
│   ├── footer.php           # HTML close
│   ├── popups.php           # Modal dialogs
│   ├── style.css            # All styles
│   ├── piwik.php            # Analytics (optional)
│   ├── robots.txt
│   ├── sitemap.txt
│   ├── favicon/             # Favicons
│   ├── img/                 # Static images
│   └── og_image.jpg         # Open Graph image
│
├── blogposts/               # Blog content (PHP includes)
│   ├── YYYY-MM-DD.php       # Individual posts
│   └── img/                 # Blog images
│
├── publickeys/              # Exhibition feature (standalone)
│   ├── index.html
│   ├── publickeys.js
│   └── ...
│
├── publickeys_*.php         # Exhibition admin pages
└── README.md
```

---

## 4. Database Schema

### Table: `Messages`

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (auto) | Primary key |
| `version` | INT | Crytch version used (1 or 2) |
| `client_id` / `client` | VARCHAR(32) | Creator's client ID (MD5 hash) |
| `client_sendto` | VARCHAR(32) | Recipient's client ID (optional) |
| `message_url` | VARCHAR(32) | Unique URL identifier (MD5 hash) |
| `message` | LONGTEXT | Paper.js JSON export of drawing |
| `grid_size` | INT | Grid size in pixels (default: 15) |
| `grid_width` | INT | Canvas width in grid units |
| `grid_height` | INT | Canvas height in grid units |
| `window_width` | INT | Browser window width |
| `window_height` | INT | Browser window height |
| `style_color` | VARCHAR(7) | Stroke color (hex) |
| `style_background` | VARCHAR(7) | Background color (hex) |
| `style_stroke` | INT | Stroke width (default: 2-3) |
| `language` | VARCHAR(2) | User's language (en/de/nl) |
| `public_key` | VARCHAR(32) | Password (only for exhibition mode!) |
| `settings` | JSON | Bounds info `{x, y, w, h}` |
| `created` | TIMESTAMP | Creation time |
| `opened` | INT | View count |
| `readbyreciever` | INT | Receiver view count |
| `recievernotified` | INT | Notification count |

### Table: `SentViaMail` (Exhibition Mode)

| Column | Type | Description |
|--------|------|-------------|
| `client` | VARCHAR(32) | Sender's client ID |
| `msgurl` | VARCHAR(256) | Message URL |
| `email` | VARCHAR(256) | Recipient email |

---

## 5. Routes & Pages

### URL Structure (via .htaccess rewrite assumed)

| URL Pattern | Handler | Description |
|-------------|---------|-------------|
| `/` or `/new` | `index.php` | Main drawing tool |
| `/m/{message_id}` | `tool_open.php` | View/decrypt message |
| `/about` | `page_about.php` | About page |
| `/blog` | `page_blog.php` | Blog listing |
| `/info` | `page_info.php` | Statistics |

### Defined URL Constants
```php
BASEURL = 'https://crytch.com'
URL_MESSAGE = BASEURL.'/m/'
URL_ABOUT = BASEURL.'/about'
URL_NEW = BASEURL.'/new'
URL_BLOG = BASEURL.'/blog'
```

---

## 6. API Endpoints

All endpoints return JSON wrapped in array: `[{...}]`

### POST `/_/savemessage.php`
Save an encrypted message to the database.

**Request Parameters:**
```javascript
{
  grid_size: number,      // Grid size in pixels
  grid_width: number,     // Canvas width in grid units
  grid_height: number,    // Canvas height in grid units
  window_width: number,   // Browser window width
  window_height: number,  // Browser window height
  message: string,        // Paper.js JSON export
  style_color: string,    // Stroke color (hex)
  style_background: string, // Background color (hex/rgb)
  style_stroke: number,   // Stroke width
  language: string,       // 'en'|'de'|'nl'
  bounds: {x, y, w, h},   // Drawing bounds
  public_key?: string     // Password (exhibition mode only!)
}
```

**Response:**
```javascript
[{
  status: 'success' | 'error',
  url: 'https://crytch.com/m/{unique_id}',
  color: '#ffffff',
  report?: string
}]
```

### POST `/_/sendtoclient.php`
Mark message as sent to connected client.

**Request:** `{ messageurl: string }`  
**Response:** `[{ status: 'success' | 'error' }]`

### POST `/_/listen.php`
Long-polling endpoint to check for new messages from connected client.

**Request:** `{ hey: 'hello. someone there?' }`  
**Response:**
```javascript
[{
  status: 'success' | 'alone',
  num: number,          // Count of new messages
  0: 'url1',           // Message URLs
  1: 'url2',
  // ...
}]
```

### POST `/_/sendviaemail.php`
Send message URL via email (exhibition mode only).

**Request:** `{ messageurl: string, sendtoemail: string }`  
**Response:** `[{ status: 'success' | 'error' }]`

---

## 7. Feature List

### Core Drawing Features
- **Pen Tool**: Click/drag to draw vector paths with anchor points
- **Text Tool**: Type text using custom single-stroke typeface
- **Move Tool**: Drag paths or individual anchor points
- **Grid Snapping**: All points snap to configurable grid (default 15px)
- **Path Operations**: Close path (C key), delete last point, start new path

### Customization
- **Stroke Color**: Black, White, Red, Blue, Random
- **Background Color**: Black, White, Red, Blue, Random
- **Stroke Width**: 1-99px (adjustable)
- **Light/Dark Theme**: Auto-switches based on background

### Encryption
- **Password-based**: Alphanumeric only (A-Z, a-z, 0-9), max 32 chars
- **Real-time Preview**: Watch encryption/decryption as you type
- **No Password Storage**: Password never saved (except exhibition mode)

### Sharing
- **Unique URL**: Generated via MD5 hash
- **Email Integration**: Send link via email client or server-side
- **SVG Export**: Download drawing as SVG file

### Client-to-Client Messaging
- **Client ID**: Persistent browser ID via cookies
- **Peer Connection**: Connect two browsers for direct messaging
- **Real-time Notifications**: Polling for new messages every 7.5 seconds

### Internationalization
- **Languages**: English (default), German, Dutch
- **Browser Detection**: Auto-detects preferred language
- **Cookie Persistence**: Remembers language choice

### Exhibition Mode ("Public Keys" / "Summaery")
- **Leak Mode**: Special mode for art exhibition
- **Password Collection**: Stores passwords for live decryption performance
- **Anonymous Submissions**: Crowdsourced secret messages

---

## 8. Drawing Tool Architecture

### Paper.js Layers
```javascript
layer_interface  // UI elements (cursor, preview lines, highlights)
layer_pen        // Freehand drawings
layer_text       // Typed characters
layer_conserve   // Backup copy before encryption
```

### Tool Modes
1. **pen** - Draw paths by clicking/dragging
2. **text** - Type characters, cursor movement
3. **move** - Select and move paths/points
4. **encrypt** - Password input mode
5. **send** - After saving, shows share options
6. **notool** - Disabled state (menus open)

### Grid System
```javascript
grid = {
  size: 15,     // Pixels per grid unit
  width: null,  // Calculated from window
  height: null  // Calculated from window
}

// Helper functions
snap(x)   // Round to nearest grid point
blow(x)   // Multiply by grid size (grid → pixels)
shrink(x) // Divide by grid size (pixels → grid)
```

### Key Data Structures

**Path Style:**
```javascript
style.path = {
  strokeColor: '#000000',
  strokeWidth: 2,
  strokeCap: 'round',
  strokeJoin: 'round'
}
```

**Message State:**
```javascript
message = {
  unique_url: null,      // Generated URL after save
  publickey: null,       // Password (temp during encryption)
  c4secrets: false,      // Exhibition mode flag
  is_compressed: false,  // After compression
  is_encrypted: false,   // After encryption applied
  maxpaths: 160,         // Warning threshold
  bounds: {x, y, w, h}   // Drawing bounds
}
```

---

## 9. Encryption Algorithm

### Overview
The encryption works by **displacing anchor points** of all paths based on the password characters. Each character maps to an (x, y) displacement vector via a lookup matrix.

### The Matrix
```javascript
var matrix = {
  0: [-4, 3], 1: [3, 5], 2: [4, 2], 3: [3, -4], 4: [-3, -4],
  5: [-1, 3], 6: [4, -1], 7: [1, 3], 8: [-3, 2], 9: [-4, 4],
  a: [-1, 5], b: [2, 3], c: [1, 3], d: [-2, 4], e: [1, -4],
  // ... continues for A-Z, a-z, 0-9
};
// Each character maps to [x_offset, y_offset] in grid units
```

### Encryption Process

```javascript
function encrypt(key) {
  // 1. Validate password (alphanumeric only)
  var pw = key.replace(/[^a-z0-9]/gi, '');
  
  // 2. Split password into characters
  var pw_c = pw.split('');
  var pw_l = pw_c.length;
  
  // 3. For each password character...
  for (var i = 0; i < pw_l; i++) {
    var key = pw_c[i];
    
    // 4. For each path in the drawing...
    for (var p = 0; p < countpaths; p++) {
      var thispath = layer_pen._children[p];
      
      // 5. For each segment (starting offset varies by char index)
      for (var s = (i % 4); s < pathlength; s++) {
        var manip = { x: 1, y: 1 };
        
        // 6. Apply matrix displacement with modifiers
        if (s % 5 > 0) manip.x = matrix[key][0];
        if (s % 5 < 3) manip.y = matrix[key][1];
        
        // 7. Apply salt-based sign flipping
        if (salt % 4 > 2) manip.x *= -1;
        if ((salt + s) % 4 > 2) { /* swap x/y */ }
        
        // 8. Scale based on character position
        if (i < 2) {
          manip.x = Math.floor(manip.x * 0.5);
          manip.y = Math.floor(manip.y * 0.5);
        } else if (i > 10) {
          manip.x = Math.floor(manip.x * (i * 0.1));
          manip.y = Math.floor(manip.y * (i * 0.1));
        }
        
        // 9. Apply displacement (in pixels)
        thispath._segments[s].point.x += blow(manip.x);
        thispath._segments[s].point.y += blow(manip.y);
        
        salt++;
      }
    }
  }
}
```

### Decryption Process
Decryption is **identical** but with **subtraction** instead of addition:
```javascript
// In decrypt.js:
thispath._segments[s].point.x -= blow(manip.x);
thispath._segments[s].point.y -= blow(manip.y);
```

### Key Security Properties
1. **Visual Verification**: No hash/checksum - human eye validates correct password
2. **Progressive Distortion**: Longer passwords = more distorted image
3. **Character Order Matters**: "abc" ≠ "cba" due to position-based scaling
4. **No Salt Storage**: Salt is deterministic from iteration order
5. **Brute-Force Resistant**: No programmatic way to verify correct decryption

⚠️ **Note**: This is artistic cryptography, not secure encryption. The security comes from visual ambiguity, not mathematical hardness.

---

## 10. Custom Typeface System

### Character Definition
Each character is defined as a **single continuous path** with fixed anchor point count (14 points for consistency).

```javascript
var letters = {
  a: {
    span: 3,      // Width in grid units
    points: [     // Path coordinates [x, y] in grid units
      [0,3], [1,2], [2,2], [3,3], [3,7], [3,6],
      [2,7], [1,7], [0,6], [0,5], [1,4], [2,4],
      [3,4], [2,4]  // 14 points total
    ]
  },
  // ... more characters
};
```

### Supported Characters
- **Uppercase**: A-Z
- **Lowercase**: a-z
- **Numbers**: 0-9
- **German**: ä, ö, ü, ß, Ä, Ö, Ü
- **French/Dutch**: æ, œ, ç, é, è, á, à
- **Punctuation**: . , : ; ? ! - _ ' " @ # & * + / \ | ( ) [ ] { }
- **Currency**: € $ £
- **Special**: AE, OE, UE (ligatures)

### Text Rendering
```javascript
function printCharacter(char) {
  var character = new Path(letters[char]['p']);
  character.style = style.path;
  character.pivot = new Point(0, 0);
  character.position = type.cursor.position;
  character.scale(blow(type.scale));
  
  // Advance cursor
  Cursor('move', blow(letters[char]['s'] * type.scale));
}
```

### Typography Settings
```javascript
type = {
  cursor: null,          // Paper.js Path object
  cursor_home: {x: 4, y: 6},  // Starting position (grid)
  scale: 1,              // Character scale multiplier
  leading: 1,            // Inter-character spacing adjustment
  whitespace: 2,         // Space width (grid units)
  lineheight: 7          // Line height (grid units)
}
```

---

## 11. State Management

### Cookies Used
| Cookie | Purpose | Duration |
|--------|---------|----------|
| `CLIENT` | Unique browser ID (MD5) | 1 year |
| `CLIENTOTHER` | Connected peer's ID | 1 year |
| `CLIENTOTHERNAME` | Connected peer's nickname | 1 year |
| `language` | Preferred language | 50 days |
| `toollastused` | Last active tool | 5 days |
| `SUMMAERY` | Exhibition mode flag | 100 days |
| `DEBUG` | Debug mode flag | Session |

### PHP Constants
```php
define('BASEDOMAIN', 'crytch.com');
define('BASEURL', 'https://crytch.com');
define('CRYTCH_VERSION', 2);
define('PAGETITLE', 'Crytch');

// Database
define('DBHOST', 'localhost');
define('DBUSER', 'crytch');
define('DBPASS', '***');
define('DBDATA', 'crytch');

// Feature flags
define('SUMMAERY', 0|1);  // Exhibition mode
define('DEBUG', 0|1);      // Debug mode
define('C4SECRETS', 0|1);  // "Call for Secrets" feature
define('LISTEN', 0|1);     // Client listening enabled
```

---

## 12. UI Components

### Menu Structure
```
┌─────────────────────────────────────────────────────────────┐
│ [Crytch ▼]  [? ▼]  [Public Keys ▼]      [Draw][Write] [Move]│
│    │          │          │                    └── top right │
│    │          │          └── exhibition menu (if enabled)   │
│    │          └── help menu                                 │
│    └── main menu (about, settings, export)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      < C A N V A S >                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [status]                           [Encrypt ▼]  [Send ▼]    │
│ └── bottom left                    └── bottom right         │
└─────────────────────────────────────────────────────────────┘
```

### Popup Dialogs
- `change-on-reload` - Language change confirmation
- `message-recieved` - New message notification
- `confirm-clear-canvas` - Clear drawing confirmation
- `alert-mobile` - Mobile device warning
- `max-paths` - Too many paths warning

### CSS Themes
- **Light Theme** (default): White background, black UI
- **Dark Theme** (`.bl` class): Black background, white UI
- Auto-switches based on `style_background`

---

## 13. Known Issues & Technical Debt

### Security Concerns
1. **SQL Injection**: Direct string concatenation in queries (no prepared statements)
2. **XSS Risk**: Limited output escaping in some places
3. **Exposed Credentials**: DB password in `_config.php` (should use env vars)
4. **No CSRF Protection**: Forms lack CSRF tokens

### Code Quality
1. **Global Variables**: Heavy use of globals in JS
2. **Mixed Concerns**: PHP files mix logic with presentation
3. **No Build System**: Manual minification, no bundling
4. **Inconsistent Naming**: Mix of camelCase and snake_case
5. **Dead Code**: Some unused functions remain

### Browser Support
1. **Mobile**: Basic support, reduced features on small screens
2. **Touch**: Limited touch event handling (mostly mouse-based)

---

## 14. Rebuild Recommendations

### Modern Stack Suggestions

**Frontend:**
- Framework: React, Vue 3, or Svelte
- Canvas: Konva.js, Fabric.js, or Paper.js (still excellent)
- State: Zustand, Pinia, or similar
- Styling: Tailwind CSS or CSS Modules
- TypeScript for type safety

**Backend:**
- Node.js with Express/Fastify, or
- Go with Fiber/Echo, or
- Python with FastAPI
- REST API or GraphQL

**Database:**
- PostgreSQL or SQLite
- Optional: Redis for session/cache
- Schema migration tool (Prisma, Drizzle, etc.)

### Key Architecture Changes
1. **Separate API & Frontend**: Headless backend + SPA frontend
2. **Environment Variables**: No hardcoded secrets
3. **Prepared Statements**: Parameterized queries everywhere
4. **Authentication**: JWT or session-based auth
5. **Real-time**: WebSockets instead of polling
6. **Type Safety**: TypeScript for all code
7. **Testing**: Unit tests for encryption algorithm

### Feature Priorities for Rebuild
1. Core drawing tool (Pen, Move)
2. Custom typeface rendering
3. Encryption/decryption algorithm (port exactly!)
4. Message persistence & sharing
5. UI theming (light/dark)
6. Responsive design
7. Optional: Real-time collaboration

---

## 15. Glossary

| Term | Meaning |
|------|---------|
| **Public Keys** | Exhibition title (Spinnerei Leipzig 2017) |
| **Summaery** | Weimar art school annual exhibition ("Summaery") |
| **C4Secrets** | "Call for Secrets" - crowdsourced submission mode |
| **Leak Mode** | Exhibition mode where passwords are stored |
| **Client** | Browser instance identified by cookie |
| **Grid** | Snap-to grid, default 15px |
| **Blow** | Multiply grid units by grid size → pixels |
| **Shrink** | Divide pixels by grid size → grid units |
| **Snap** | Round to nearest grid point |
| **Matrix** | Character-to-displacement lookup table |

---

*Last updated: February 2026*
*Original code: 2016-2017*
