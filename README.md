# WebRTC Softphone

A modern, responsive WebRTC softphone built with React and JsSIP. This application allows for seamless SIP calling directly from your browser over WebSocket connections.

## Features

- **Call Handling**: Effortlessly make and receive SIP calls.
- **Dual Call Management**: Support for handling up to 2 simultaneous calls.
- **Call Controls**:
  - **Hold/Unhold**: Toggle call hold status.
  - **Mute/Unmute**: Control audio input during calls.
- **Call Transfers**:
  - **Blind Transfer**: Transfer calls directly to a target.
  - **Warm (Attended) Transfer**: Consult with the target before completing the transfer.
- **Responsive UI**: Optimized for various screen sizes and devices.
- **Easy Deployment**: Get up and running in seconds.

## Getting Started

### Prerequisites

- Node.js and npm installed.
- A SIP server (e.g., FreeSWITCH, Asterisk) configured for WebSocket (WS) transport.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd websoftphone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm run dev
   ```

### Important Note
The current implementation supports **WS (WebSocket)** only. **WSS (Secure WebSocket)** support has not been implemented yet.

## Technical Details

The project is divided into two main parts:
1. **Frontend**: React-based UI for call management and user interaction.
2. **Call Handling**: Powered by **JsSIP** to handle SIP over WebSocket signaling.

### Core Implementation Snippets

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
*Note: Outbound calls do not require manual answering as they are confirmed via 200 OK responses.*

#### 6. Call Operations
```javascript
session.terminate(); // End call
session.hold();      // Place on hold
session.unhold();    // Resume call
session.mute();      // Mute microphone
session.unmute();    // Unmute microphone
session.refer();     // Execute call transfer
```
