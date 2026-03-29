import JsSIP from 'jssip';

JsSIP.debug.enable('JsSIP:*');
console.log('SipService Version 1.1 Loaded');

class SipService {
    constructor() {
        this.ua = null;
        this.sessions = new Map(); // Store sessions by their ID
        this.callbacks = {
            onRegistered: () => { },
            onUnregistered: () => { },
            onRegistrationFailed: () => { },
            onNewCall: () => { },
            onCallEnded: () => { },
            onCallConfirmed: () => { },
            onCallFailed: () => { },
            onRemoteStream: () => { },
        };
    }

    setCallbacks(callbacks) {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }

    start(config) {
        const { host, port, user, password, displayName } = config;
        const socket = new JsSIP.WebSocketInterface(`ws://${host}:${port}`);

        const configuration = {
            sockets: [socket],
            uri: `sip:${user}@${host}`,
            password: password,
            display_name: displayName || user,
            session_timers_expires: 600,
        };

        try {
            this.ua = new JsSIP.UA(configuration);

            this.ua.on('registered', () => {
                console.log('SIP Registered');
                this.callbacks.onRegistered();
            });

            this.ua.on('unregistered', () => {
                console.log('SIP Unregistered');
                this.callbacks.onUnregistered();
            });

            this.ua.on('registrationFailed', (e) => {
                console.error('SIP Registration Failed:', e.cause);
                this.callbacks.onRegistrationFailed(e.cause);
            });

            this.ua.on('newRTCSession', (data) => {
                console.log('New RTC Session');
                const session = data.session;
                this.sessions.set(session.id, session);

                if (session.direction === 'incoming') {
                    console.log('Incoming call');
                    this.callbacks.onNewCall(session);
                }

                session.on('confirmed', () => {
                    console.log('Call confirmed', session.id);
                    this.callbacks.onCallConfirmed(session);
                });

                session.on('ended', () => {
                    console.log('Call ended', session.id);
                    this.sessions.delete(session.id);
                    this.callbacks.onCallEnded(session);
                });

                session.on('failed', (e) => {
                    console.error('Call failed:', e.cause, session.id);
                    this.sessions.delete(session.id);
                    this.callbacks.onCallFailed(session, e.cause);
                });

                const setupPC = (pc) => {
                    console.log('Setup PeerConnection', pc);
                    pc.addEventListener('track', (event) => {
                        console.log('Remote track event:', event.track.kind, event.streams);
                        if (event.streams && event.streams[0]) {
                            this.callbacks.onRemoteStream(session, event.streams[0]);
                        }
                    });
                };

                if (session.connection) {
                    setupPC(session.connection);
                } else {
                    session.on('peerconnection', (data) => {
                        setupPC(data.peerconnection);
                    });
                }
            });

            this.ua.start();
        } catch (err) {
            console.error('Error starting SIP UA:', err);
        }
    }

    stop() {
        if (this.ua) {
            this.ua.stop();
        }
    }

    makeCall(target) {
        if (!this.ua) return;

        const options = {
            mediaConstraints: { audio: true, video: false },
            sessionTimersExpires: 600,
            pcConfig: {
                iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
            }
        };

        const session = this.ua.call(`sip:${target}@${this.ua.configuration.uri.host}`, options);
        this.sessions.set(session.id, session);

        // Events are handled in the 'newRTCSession' listener in start()
        return session;
    }

    terminateCall(session) {
        if (session) {
            try {
                session.terminate();
            } catch (e) {
                console.error("Error terminating session", e);
            }
        }
    }

    answerCall(session) {
        if (session && session.direction === 'incoming') {
            session.answer({
                mediaConstraints: { audio: true, video: false },
                sessionTimersExpires: 600,
                pcConfig: {
                    iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
                }
            });
        }
    }

    holdCall(session) {
        if (session) {
            session.hold();
        }
    }

    unholdCall(session) {
        if (session) {
            session.unhold();
        }
    }

    muteCall(session) {
        if (session) {
            session.mute({ audio: true });
        }
    }

    unmuteCall(session) {
        if (session) {
            session.unmute({ audio: true });
        }
    }

    transferCall(session, target) {
        if (session) {
            console.log(`Transferring call to: ${target}`);
            session.refer(target);
        }
    }

    attendedTransfer(sessionToTransfer, sessionToReplace) {
        if (sessionToTransfer && sessionToReplace) {
            console.log(`Attended transfer: ${sessionToTransfer.id} to ${sessionToReplace.id}`);
            // In Attended Transfer, we refer the held session to the target of the active session
            // and we state that it "replaces" the active session.
            const target = sessionToReplace.remote_identity.uri.toString();
            sessionToTransfer.refer(target, { replaces: sessionToReplace });
        }
    }
}

const sipService = new SipService();
export default sipService;
