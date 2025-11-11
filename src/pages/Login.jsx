import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../api';
import {
  startAuthentication,
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable,
} from '@simplewebauthn/browser';
import WebcamBox from '../components/WebcamBox';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [stage, setStage] = useState('password'); // 'password' -> 'face'
  const [showCam, setShowCam] = useState(false);
  const [options, setOptions] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function stepPassword(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setStatus('Validando senha...');
    try {
      const r = await api.post('/auth/login', { username, password });
      if (r?.data?.status !== 'password_ok') throw new Error('Prosseguir para face');
      setStage('face');
      setStatus('Senha ok. Agora confirme com a face.');
    } catch (err) {
      if (err?.response?.status === 401) setStatus('Usuário ou senha inválidos.');
      else if (err?.response?.status === 428) setStatus('Passkey não registrada. Conclua o registro facial.');
      else setStatus('Falha ao entrar com senha.');
    } finally {
      setBusy(false);
    }
  }

  async function prepareFace() {
    if (busy) return;
    setBusy(true);
    setStatus('Preparando autenticação facial...');
    if (!browserSupportsWebAuthn()) {
      setStatus('Navegador sem WebAuthn');
      setBusy(false);
      return;
    }
    const hasPlatform = await platformAuthenticatorIsAvailable();
    if (!hasPlatform) {
      setStatus('Sem autenticador de plataforma');
      setBusy(false);
      return;
    }

    try {
      const { data } = await api.post('/webauthn/auth/options', { username });
      const pk = { ...data.publicKey };

      // IMPORTANTE: não converter base64url -> ArrayBuffer; a lib faz isso.
      pk.timeout = 120000;

      setOptions(pk);
      setShowCam(true);
      setStatus('Pronto. Clique em "Confirmar Face" para entrar.');
    } catch (err) {
      console.error(err);
      setStatus('Falha ao preparar autenticação facial.');
    } finally {
      setBusy(false);
    }
  }

  async function confirmFace() {
    if (busy || !options) return;
    setBusy(true);
    setStatus('Aguardando confirmação facial do sistema...');
    try {
      const assertion = await startAuthentication(options);
      const resp = await api.post('/webauthn/auth/finish', {
        username,
        attestationOrAssertionResponse: { credentialId: assertion.id },
      });
      setToken(resp.data.token); // token só após face
      setStatus('Ok! Redirecionando...');
      navigate('/books');
    } catch (err) {
      console.error(err);
      setStatus('Falha na autenticação facial.');
    } finally {
      setTimeout(() => setShowCam(false), 1200);
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h2>Entrar (Senha + Face obrigatórios)</h2>

      {stage === 'password' ? (
        <form onSubmit={stepPassword}>
          <label>Usuário</label>
          <input className="input" value={username} onChange={e => setUsername(e.target.value)} required />
          <div style={{ height: 10 }} />
          <label>Senha</label>
          <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} required />
          <div style={{ height: 12 }} />
          <button className="btn" type="submit" disabled={!username || !password || busy}>Continuar</button>
        </form>
      ) : (
        <div>
          <p>Usuário <b>{username}</b> validado por senha.</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button className="btn" onClick={prepareFace} disabled={busy}>Preparar</button>
            <button className="btn" onClick={confirmFace} disabled={busy || !options}>Confirmar Face</button>
          </div>
          <WebcamBox active={showCam} />
        </div>
      )}

      <div style={{ height: 10 }} />
      <div className="mono">{status}</div>
    </div>
  );
}