import React, { useState, useEffect, useRef } from 'react';
import sipService from './services/SipService';
import './App.css';

const CloudIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19c.3 0 .5 0 .8-.1a4.7 4.7 0 0 0 .2-9.4 6.7 6.7 0 0 0-12.8-1.5 5 5 0 0 0 .3 10c.3 0 .5 0 .8-.1" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const MicOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const EndCallIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L10.68 13.31z" />
    <line x1="2" y1="22" x2="22" y2="2" />
  </svg>
);

const HoldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const TransferIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="14" y1="10" x2="3" y2="21" />
  </svg>
);

const KeypadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="4" height="4" rx="1.5" />
    <rect x="10" y="4" width="4" height="4" rx="1.5" />
    <rect x="16" y="4" width="4" height="4" rx="1.5" />
    <rect x="4" y="10" width="4" height="4" rx="1.5" />
    <rect x="10" y="10" width="4" height="4" rx="1.5" />
    <rect x="16" y="10" width="4" height="4" rx="1.5" />
    <rect x="4" y="16" width="4" height="4" rx="1.5" />
    <rect x="10" y="16" width="4" height="4" rx="1.5" />
    <rect x="16" y="16" width="4" height="4" rx="1.5" />
  </svg>
);

function App() {
  const [config, setConfig] = useState({
    host: '192.168.0.167',
    port: '5066',
    user: '1012',
    password: '1234',
    displayName: 'User 1012',
  });

  const [dest, setDest] = useState('1003');
  const [isRegistered, setIsRegistered] = useState(false);
  const [status, setStatus] = useState('Disconnected');
  const [callStatus, setCallStatus] = useState('Idle');
  const [isIncoming, setIsIncoming] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isHeld, setIsHeld] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferTarget, setTransferTarget] = useState('');
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    sipService.setCallbacks({
      onRegistered: () => {
        setIsRegistered(true);
        setStatus('Registered');
      },
      onUnregistered: () => {
        setIsRegistered(false);
        setStatus('Disconnected');
      },
      onRegistrationFailed: (cause) => {
        setIsRegistered(false);
        setStatus(`Failed: ${cause}`);
      },
      onNewCall: (session) => {
        setCallStatus('Inbound Call...');
        setIsIncoming(true);
      },
      onCallEnded: () => {
        setCallStatus('Idle');
        setIsIncoming(false);
        setIsMuted(false);
        setIsHeld(false);
        setIsTransferring(false);
        setTransferTarget('');
        stopTimer();
      },
      onCallConfirmed: () => {
        setCallStatus('In Call');
        startTimer();
      },
      onCallFailed: (cause) => {
        setCallStatus(`Failed: ${cause}`);
        setIsIncoming(false);
        setIsMuted(false);
        setIsHeld(false);
        setIsTransferring(false);
        setTransferTarget('');
        stopTimer();
        setTimeout(() => setCallStatus('Idle'), 3000);
      },
      onRemoteStream: (stream) => {
        if (audioRef.current) {
          audioRef.current.srcObject = stream;
          audioRef.current.play().catch(e => console.error("Error playing audio", e));
        }
      }
    });

    return () => {
      sipService.stop();
      stopTimer();
    };
  }, []);

  const startTimer = () => {
    setDuration(0);
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRegister = () => {
    setStatus('Registering...');
    sipService.start(config);
  };

  const handleUnregister = () => {
    sipService.stop();
  };

  const handleCall = () => {
    if (!dest) return;
    setCallStatus('Calling...');
    sipService.makeCall(dest);
  };

  const handleHangup = () => {
    sipService.terminateCall();
    setCallStatus('Idle');
  };

  const handleAnswer = () => {
    sipService.answerCall();
    setCallStatus('In Call');
    setIsIncoming(false);
  };

  const handleHold = () => {
    sipService.holdCall();
  };

  const handleunhold = () => {
    sipService.unholdCall();
  };

  const handlemute = () => {
    sipService.muteCall();
    setIsMuted(true);
  };

  const handleunmute = () => {
    sipService.unmuteCall();
    setIsMuted(false);
  };

  const handleToggleHold = () => {
    if (isHeld) {
      sipService.unholdCall();
      setIsHeld(false);
    } else {
      sipService.holdCall();
      setIsHeld(true);
    }
  };

  const handleToggleTransfer = () => {
    setIsTransferring(prev => !prev);
    if (!isTransferring) setTransferTarget('');
  };

  const handleTransferConfirm = () => {
    if (!transferTarget) return;
    sipService.transferCall(transferTarget);
    setIsTransferring(false);
  };

  const handleCancelTransfer = () => {
    setIsTransferring(false);
    setTransferTarget('');
  };

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const addDigit = (digit) => {
    setDest(prev => prev + digit);
  };

  const keys = [
    { n: '1', l: '' }, { n: '2', l: 'ABC' }, { n: '3', l: 'DEF' },
    { n: '4', l: 'GHI' }, { n: '5', l: 'JKL' }, { n: '6', l: 'MNO' },
    { n: '7', l: 'PQRS' }, { n: '8', l: 'TUV' }, { n: '9', l: 'WXYZ' },
    { n: '*', l: '' }, { n: '0', l: '+' }, { n: '#', l: '' }
  ];

  return (
    <div className="app-container">
      {!isRegistered ? (
        <div className="registration-card animate-in">
          <div className="logo-container">
            <CloudIcon />
          </div>
          <h2>Register Account</h2>
          <p className="subtitle">Enter your SIP credentials to get started</p>

          <div className="input-group">
            <label>Server Host</label>
            <input name="host" value={config.host} onChange={handleChange} placeholder="e.g. 192.168.1.11" />
          </div>

          <div className="row">
            <div className="col">
              <div className="input-group">
                <label>Port</label>
                <input name="port" value={config.port} onChange={handleChange} placeholder="5066" />
              </div>
            </div>
            <div className="col">
              <div className="input-group">
                <label>Extension</label>
                <input name="user" value={config.user} onChange={handleChange} placeholder="1012" />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <input name="password" type="password" value={config.password} onChange={handleChange} placeholder="••••••••" />
          </div>

          <button className="btn btn-primary" onClick={handleRegister}>
            Register
          </button>

          <p style={{ marginTop: '20px', fontSize: '13px', color: status.includes('Failed') ? 'var(--danger)' : 'var(--text-muted)' }}>
            Status: {status}
          </p>
        </div>
      ) : (
        <div className="dashboard animate-in">
          <div className="side-panel">
            <div className="section-title">
              <span>Voice Dashboard</span>
              <span className="sign-out" style={{ fontSize: '12px', color: 'var(--danger)', cursor: 'pointer' }} onClick={handleUnregister}>LOGOUT</span>
            </div>

            <div className="active-calls-list">
              <div className="section-title" style={{ fontSize: '14px', opacity: 0.7 }}>Recent Activity</div>
              {callStatus !== 'Idle' ? (
                <div className="call-item">
                  <div className="item-avatar">{dest[0] || '?'}</div>
                  <div className="item-details">
                    <div className="item-name">{dest}</div>
                    <div className="item-status">{callStatus}</div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', background: 'var(--surface-alt)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No active calls at the moment
                </div>
              )}
            </div>

            {!isTransferring ? (
              <div className="dialer-section">
                <input
                  className="dial-display-input"
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  placeholder="0000"
                />

                <div className="keypad">
                  {keys.map(k => (
                    <button key={k.n} className="key" onClick={() => addDigit(k.n)}>
                      {k.n}
                      {k.l && <span className="key-sub">{k.l}</span>}
                    </button>
                  ))}
                </div>

                {callStatus === 'Idle' ? (
                  <button className="btn btn-call-large" onClick={handleCall}>
                    <PhoneIcon /> Start Call
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {isIncoming && (
                      <button className="btn btn-primary" style={{ background: 'var(--primary)' }} onClick={handleAnswer}>Answer</button>
                    )}
                    <button className="btn btn-primary" style={{ background: 'var(--danger)' }} onClick={handleHangup}>Hangup</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="transfer-panel animate-in">
                <div className="transfer-title">Transfer to</div>
                <div className="transfer-input-group">
                  <input
                    placeholder="Extension..."
                    value={transferTarget}
                    onChange={(e) => setTransferTarget(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="suggestions-list">
                  {[
                    { ext: '1012', name: 'Alice' },
                    { ext: '1013', name: 'Bob' },
                    { ext: '1014', name: 'Reception' }
                  ].map(item => (
                    <div
                      key={item.ext}
                      className={`suggestion-item ${transferTarget === item.ext ? 'selected' : ''}`}
                      onClick={() => setTransferTarget(item.ext)}
                    >
                      <div className="suggestion-avatar">{item.name[0]}</div>
                      <div className="suggestion-info">
                        <div className="suggestion-name">{item.name}</div>
                        <div className="suggestion-ext">{item.ext}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="action-buttons">
                  <button className="btn btn-cancel" onClick={handleCancelTransfer}>Cancel</button>
                  <button className="btn btn-transfer-confirm" onClick={handleTransferConfirm}>Transfer</button>
                </div>
              </div>
            )}
          </div>

          <div className="main-display">
            <div className={`status-badge ${isRegistered ? 'status-online' : 'status-offline'}`}>
              {status}
            </div>

            <div className="display-tabs">
              <div className="tab">Call Log</div>
              <div className="tab active">Active Session</div>
              <div className="tab">Keypad</div>
              <div className="tab">Contacts</div>
            </div>

            <div className="caller-info">
              {callStatus === 'Idle' ? (
                <>
                  <div className="caller-avatar-large">
                    <CloudIcon />
                  </div>
                  <div className="caller-name">System Ready</div>
                  <div className="caller-number">Initialize a conversation above</div>
                </>
              ) : (
                <>
                  <div className="caller-avatar-large">{dest[0] || '?'}</div>
                  <div className="caller-name">{isIncoming ? 'Incoming Invitation' : 'Outgoing Request'}</div>
                  <div className="caller-number">{dest}</div>
                  <div className="call-timer">{formatDuration(duration)}</div>
                </>
              )}
            </div>

            {callStatus !== 'Idle' && (
              <div className="call-controls animate-in">
                <button
                  className={`control-btn ${isMuted ? 'active' : ''}`}
                  onClick={isMuted ? handleunmute : handlemute}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <MicOffIcon /> : <MicIcon />}
                </button>
                <button
                  className={`control-btn ${isHeld ? 'active' : ''}`}
                  onClick={handleToggleHold}
                  title={isHeld ? "Unhold" : "Hold"}
                >
                  {isHeld ? <PlayIcon /> : <HoldIcon />}
                </button>
                <button
                  className={`control-btn ${isTransferring ? 'active transfer-mode' : ''}`}
                  onClick={handleToggleTransfer}
                  title="Transfer Call"
                >
                  <TransferIcon />
                </button>
                <button className="control-btn"><KeypadIcon /></button>
                <button className="control-btn end-call" onClick={handleHangup}><EndCallIcon /></button>
              </div>
            )}

            {isTransferring && (
              <div className="transfer-banner animate-in">
                Transferring to <b>{transferTarget || '...'}</b> — click Transfer to confirm
              </div>
            )}
          </div>
        </div>
      )}

      <audio ref={audioRef} autoPlay playsInline muted={false} style={{ width: 0, height: 0, visibility: 'hidden' }} />
    </div>
  );
}

export default App;
