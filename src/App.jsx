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

const BlindIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const WarmIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 1l4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="M7 23l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
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
  const [sessions, setSessions] = useState({}); // { sessionId: { status, duration, ... } }
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferTarget, setTransferTarget] = useState('');

  const audioRef = useRef(null);
  const timersRef = useRef({}); // { sessionId: intervalId }

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
        const id = session.id;
        const number = session.remote_identity.uri.user;
        setSessions(prev => {
          const newSessions = {
            ...prev,
            [id]: {
              id,
              session,
              status: 'Ringing...',
              isIncoming: true,
              isAnswered: false,
              number,
              duration: 0,
              isMuted: false,
              isHeld: false,
              stream: null
            }
          };

          setActiveSessionId(prevId => {
            if (!prevId) return id;
            return prevId;
          });

          return newSessions;
        });
      },
      onCallConfirmed: (session) => {
        const id = session.id;
        setSessions(prev => {
          if (!prev[id]) return prev;
          return {
            ...prev,
            [id]: { ...prev[id], status: 'In Call', isAnswered: true }
          };
        });
        startTimer(id);
      },
      onCallEnded: (session) => {
        const id = session.id;
        stopTimer(id);
        setSessions(prev => {
          const newSessions = { ...prev };
          delete newSessions[id];

          setActiveSessionId(prevId => {
            if (prevId !== id) return prevId;
            const remainingIds = Object.keys(newSessions);
            return remainingIds.length > 0 ? remainingIds[0] : null;
          });

          return newSessions;
        });
      },
      onCallFailed: (session, cause) => {
        const id = session.id;
        stopTimer(id);
        setSessions(prev => {
          if (!prev[id]) return prev;
          return {
            ...prev,
            [id]: { ...prev[id], status: `Failed: ${cause}` }
          };
        });
        setTimeout(() => {
          setSessions(prev => {
            const newSessions = { ...prev };
            if (newSessions[id] && newSessions[id].status.includes('Failed')) {
              delete newSessions[id];
            }
            return newSessions;
          });
          setActiveSessionId(prev => {
            if (prev !== id) return prev;
            // Access state inside functional update for accuracy if needed, 
            // but sessions are already deleted or will be deleted.
            return null; // For failed calls, staying at null is fine unless we want to find another
          });
        }, 3000);
      },
      onRemoteStream: (session, stream) => {
        const id = session.id;
        setSessions(prev => {
          if (!prev[id]) return prev;
          const updatedSession = { ...prev[id], stream: stream };

          setActiveSessionId(prevId => {
            if (prevId === id && audioRef.current) {
              audioRef.current.srcObject = stream;
              audioRef.current.play().catch(e => console.error("Error playing audio", e));
            }
            return prevId;
          });

          return { ...prev, [id]: updatedSession };
        });
      }
    });

    return () => {
      sipService.stop();
      Object.keys(timersRef.current).forEach(id => clearInterval(timersRef.current[id]));
    };
  }, []);

  useEffect(() => {
    if (activeSessionId && sessions[activeSessionId] && sessions[activeSessionId].stream) {
      if (audioRef.current) {
        audioRef.current.srcObject = sessions[activeSessionId].stream;
        audioRef.current.play().catch(e => console.error("Error playing audio", e));
      }
    }
  }, [activeSessionId, sessions]);

  const startTimer = (id) => {
    if (timersRef.current[id]) clearInterval(timersRef.current[id]);
    timersRef.current[id] = setInterval(() => {
      setSessions(prev => {
        if (!prev[id]) return prev;
        return {
          ...prev,
          [id]: { ...prev[id], duration: prev[id].duration + 1 }
        };
      });
    }, 1000);
  };

  const stopTimer = (id) => {
    if (timersRef.current[id]) {
      clearInterval(timersRef.current[id]);
      delete timersRef.current[id];
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
    const session = sipService.makeCall(dest);
    const id = session.id;
    setSessions(prev => ({
      ...prev,
      [id]: {
        id,
        session,
        status: 'Calling...',
        isIncoming: false,
        isAnswered: false,
        number: dest,
        duration: 0,
        isMuted: false,
        isHeld: false,
        stream: null
      }
    }));
    setActiveSessionId(id);
    setDest('');
  };

  const handleHangup = (id) => {
    const sessionData = sessions[id || activeSessionId];
    if (sessionData) {
      sipService.terminateCall(sessionData.session);
    }
  };

  const handleAnswer = (id) => {
    const sessionData = sessions[id || activeSessionId];
    if (sessionData) {
      sipService.answerCall(sessionData.session);
    }
  };

  const handleDecline = (id) => {
    const sessionData = sessions[id || activeSessionId];
    if (sessionData) {
      sipService.terminateCall(sessionData.session);
    }
  };

  const handleToggleHold = (id) => {
    const sid = id || activeSessionId;
    const sessionData = sessions[sid];
    if (sessionData) {
      if (sessionData.isHeld) {
        sipService.unholdCall(sessionData.session);
        setSessions(prev => ({ ...prev, [sid]: { ...prev[sid], isHeld: false } }));
      } else {
        sipService.holdCall(sessionData.session);
        setSessions(prev => ({ ...prev, [sid]: { ...prev[sid], isHeld: true } }));
      }
    }
  };

  const handleToggleMute = (id) => {
    const sid = id || activeSessionId;
    const sessionData = sessions[sid];
    if (sessionData) {
      if (sessionData.isMuted) {
        sipService.unmuteCall(sessionData.session);
        setSessions(prev => ({ ...prev, [sid]: { ...prev[sid], isMuted: false } }));
      } else {
        sipService.muteCall(sessionData.session);
        setSessions(prev => ({ ...prev, [sid]: { ...prev[sid], isMuted: true } }));
      }
    }
  };

  const handleToggleTransfer = () => {
    setIsTransferring(prev => !prev);
    if (!isTransferring) setTransferTarget('');
  };

  const handleTransferConfirm = () => {
    if (!transferTarget) return;
    const sessionData = sessions[activeSessionId];
    if (sessionData) {
      sipService.transferCall(sessionData.session, transferTarget);
    }
    setIsTransferring(false);
  };

  const handleAttendTransfer = () => {
    // Requires exactly two sessions
    const sessionIds = Object.keys(sessions);
    if (sessionIds.length === 2) {
      const active = sessions[activeSessionId];
      const otherId = sessionIds.find(id => id !== activeSessionId);
      const other = sessions[otherId];
      sipService.attendedTransfer(other.session, active.session);
    }
  }

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

  const activeSession = sessions[activeSessionId];
  const sessionCount = Object.keys(sessions).length;
  const otherSessionId = Object.keys(sessions).find(id => id !== activeSessionId);

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
              {sessionCount > 0 ? (
                Object.values(sessions).map(s => (
                  <div
                    key={s.id}
                    className={`call-item ${s.id === activeSessionId ? 'active' : ''}`}
                    onClick={() => setActiveSessionId(s.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="item-avatar">{s.number?.charAt(0) || '?'}</div>
                    <div className="item-details">
                      <div className="item-name">{s.number}</div>
                      <div className="item-status">
                        <span className={`status-dot ${s.isAnswered ? 'in-call' : (s.isIncoming ? 'ringing' : '')}`}></span>
                        {s.status} {s.isHeld ? '(Held)' : ''}
                      </div>
                    </div>
                  </div>
                ))
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

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    className="btn btn-call-large"
                    onClick={handleCall}
                    disabled={sessionCount >= 2}
                  >
                    <PhoneIcon /> {sessionCount > 0 ? 'Add Call' : 'Start Call'}
                  </button>
                </div>
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

                <div className="action-buttons">
                  <button className="btn btn-cancel" onClick={handleCancelTransfer}>Cancel</button>
                  <div className="transfer-options-container" style={{ flex: 2 }}>
                    <div className="transfer-option-card" onClick={handleTransferConfirm}>
                      <div className="option-icon blind"><BlindIcon /></div>
                      <div className="option-text">
                        <div className="option-label">Blind Transfer</div>
                        <div className="option-desc">Immediate, one-way</div>
                      </div>
                    </div>
                    <div className="transfer-option-card warm" onClick={() => {
                      handleToggleHold();
                      setDest(transferTarget);
                      setIsTransferring(false);
                    }}>
                      <div className="option-icon warm"><WarmIcon /></div>
                      <div className="option-text">
                        <div className="option-label">Warm Transfer</div>
                        <div className="option-desc">Consult first</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="main-display">
            <div className={`status-badge ${!activeSession ? (isRegistered ? 'status-online' : 'status-offline') : (activeSession.isAnswered ? 'status-online' : 'badge-ringing')}`}>
              {!activeSession ? status : (activeSession.isAnswered ? 'In Call' : 'Ringing')}
            </div>

            <div className="display-tabs">
              <div className="tab">Call Log</div>
              <div className="tab active">Active Session</div>
              <div className="tab">Keypad</div>
              <div className="tab">Contacts</div>
            </div>

            <div className="caller-info">
              {!activeSession ? (
                <>
                  <div className="caller-avatar-large">
                    <CloudIcon />
                  </div>
                  <div className="caller-name">System Ready</div>
                  <div className="caller-number">Initialize a conversation above</div>
                  <a
                    href="https://www.linkedin.com/in/sai-vishwanath-katkam-9b7507234"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="developer-tag"
                    style={{
                      fontSize: '15px',
                      opacity: 0.8,
                      marginTop: '16px',
                      color: 'var(--secondary)',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'inline-block',
                      transition: 'all 0.2s'
                    }}
                  >
                    --developed by vishwanath
                  </a>
                </>
              ) : (
                <>
                  <div className="caller-avatar-large">{activeSession.number?.charAt(0) || '?'}</div>
                  <div className="caller-name">
                    {activeSession.isAnswered ? 'In call' : (activeSession.isIncoming ? 'Incoming call' : 'Calling...')}
                  </div>
                  <div className="caller-number">{activeSession.number}</div>
                  {activeSession.isAnswered && <div className="call-timer">{formatDuration(activeSession.duration)}</div>}
                </>
              )}
            </div>

            {activeSession && (
              <div className="call-controls animate-in">
                {activeSession.isAnswered ? (
                  <>
                    <button
                      className={`control-btn ${activeSession.isMuted ? 'active' : ''}`}
                      onClick={() => handleToggleMute()}
                      title={activeSession.isMuted ? "Unmute" : "Mute"}
                    >
                      {activeSession.isMuted ? <MicOffIcon /> : <MicIcon />}
                    </button>
                    <button
                      className={`control-btn ${activeSession.isHeld ? 'active' : ''}`}
                      onClick={() => handleToggleHold()}
                      title={activeSession.isHeld ? "Unhold" : "Hold"}
                    >
                      {activeSession.isHeld ? <PlayIcon /> : <HoldIcon />}
                    </button>
                    <button
                      className={`control-btn ${isTransferring ? 'active transfer-mode' : ''}`}
                      onClick={handleToggleTransfer}
                      title="Transfer Call"
                    >
                      <BlindIcon />
                    </button>

                    {sessionCount === 2 && (
                      <button
                        className="control-btn attend-transfer"
                        onClick={handleAttendTransfer}
                        title="Complete Warm Transfer"
                        style={{ background: 'var(--primary)', color: 'white' }}
                      >
                        <WarmIcon />
                      </button>
                    )}

                    <button className="control-btn"><KeypadIcon /></button>
                    <button className="btn btn-hangup-full" onClick={() => handleHangup()} style={{ width: '100%', padding: '16px' }}>
                      <EndCallIcon /> Hangup
                    </button>
                  </>
                ) : (
                  <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '400px' }}>
                    {activeSession.isIncoming ? (
                      <>
                        <button className="btn btn-answer" onClick={() => handleAnswer()}>
                          <PhoneIcon /> Answer
                        </button>
                        <button className="btn btn-decline" onClick={() => handleDecline()}>
                          <EndCallIcon /> Decline
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-decline" style={{ width: '100%' }} onClick={() => handleHangup()}>
                        <EndCallIcon /> Cancel Call
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {isTransferring && (
              <div className="transfer-banner animate-in">
                Transferring <b>{activeSession?.number}</b> to <b>{transferTarget || '...'}</b>
              </div>
            )}

            {sessionCount === 2 && !isTransferring && (
              <div className="transfer-banner animate-in" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                Two calls active. Click the blue transfer icon to connect them.
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
