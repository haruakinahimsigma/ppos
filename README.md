# PPOS

A macOS-style web desktop.

## Features

- macOS-style desktop
- Menu bar
- Dock
- Memo application
- Persistent memo storage
- Memo search
- Create/delete memos
- Opera GX-style browser
- Address bar
- Back/forward
- Reload
- Embedded proxy

## Run

Open `index.html` in a modern browser.

No build system is required.

## Storage

Memos are stored using browser `localStorage`.

The data survives page refreshes and reopening the app in the same browser profile.

## Proxy

The browser starts at:

https://iwannapoop.up.railway.app

If the proxy refuses to load inside the iframe, its server may have iframe restrictions such as CSP or X-Frame-Options.
