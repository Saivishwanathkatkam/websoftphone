# WebRTC Softphone

A modern, responsive WebRTC softphone built with React and JsSIP. This application enables seamless SIP calling directly from your browser over WebSocket connections.

---

## ⚠️ Security Notice

> **This implementation supports WS (plain WebSocket) only.**
> WSS (Secure WebSocket) support has not been implemented yet.
> Do **not** deploy this over a public network without securing the WebSocket transport. Modern browsers also restrict `getUserMedia` (microphone access) to HTTPS origins — use a localhost environment for development.

---

## Features

- **Call Handling** — Make and receive SIP calls directly from the browser.
- **Dual Call Management** — Handles simultaneous active calls.
- **Call Controls:**
  - Hold / Unhold
  - Mute / Unmute
- **Call Transfers:**
  - **Blind Transfer** — Transfer a call directly to a target without consultation.
  - **Warm (Attended) Transfer** — Speak with the transfer target before completing the transfer.
- **Responsive UI** — Optimized for various screen sizes and devices.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React |
| SIP / WebSocket | JsSIP |
| Build Tool | Vite |

---

## Prerequisites

- **Node.js** (v16 or later) and **npm**
- A SIP server (e.g., FreeSWITCH, Asterisk) configured for **WebSocket (WS) transport**
- A modern browser (Chrome or Firefox recommended)

---

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-org/websoftphone.git
cd websoftphone
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure your SIP connection** (see [Configuration](#configuration) below).

4. **Start the development server:**

```bash
npm run dev
```

---

## Browser Support

| Browser | Supported |
|---------|-----------|
| Chrome (latest) | ✅ |
| Firefox (latest) | ✅ |
| Safari | ⚠️ Partial (WebRTC limitations) |
| Edge (Chromium) | ✅ |

> **Note:** Microphone access via `getUserMedia` requires a **secure context** (HTTPS or localhost). Plain HTTP deployments on remote hosts will be blocked by the browser.

---

## Deployment

1. **Build the application:**

```bash
npm run build
```

2. Serve the contents of the `dist/` folder using any static file server or CDN.

3. **Important:** Ensure your SIP server and this app are accessible via the same protocol. Since WSS is not yet supported, a **reverse proxy** (e.g., Nginx) that terminates TLS and forwards plain WS to your SIP server is recommended for production setups.

---

## Technical Details

The project is divided into two main parts:

1. **Frontend** — React-based UI for call management and user interaction.
2. **Call Handling** — Powered by JsSIP to handle SIP signaling over WebSocket.

### Core Implementation

#### 1. WebSocket Interface Initialization

```javascript
const socket = new JsSIP.WebSocketInterface(`ws://${host}:${port}`);
```

#### 2. User Agent (UA) Registration

```javascript
const ua = new JsSIP.UA(configuration);
ua.start();
```

#### 3. Making an Outbound Call

```javascript
const session = ua.call(`sip:${target}@${this.ua.configuration.uri.host}`, options);
```

#### 4. Handling Inbound Calls

The application listens for the `newRTCSession` event to detect and handle incoming calls:

```javascript
this.ua.on('newRTCSession', (data) => {
    const { session } = data;
    this.sessions.set(session.id, session);
    if (session.direction === 'incoming') {
        console.log('Incoming call');
        this.callbacks.onNewCall(session);
    }
});
```

#### 5. Answering an Inbound Call

```javascript
session.answer({
    mediaConstraints: { audio: true, video: false },
    sessionTimersExpires: 600,
    pcConfig: {
        iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
    }
});
```

> **Note:** Outbound calls do not require manual answering — they are confirmed automatically via a `200 OK` SIP response.

#### 6. Call Operations

```javascript
session.terminate(); // End call
session.hold();      // Place on hold
session.unhold();    // Resume call
session.mute();      // Mute microphone
session.unmute();    // Unmute microphone
session.refer();     // Execute call transfer
```

---

## Known Limitations

- WSS (Secure WebSocket) is not yet implemented.
- No video call support.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

