import React, { useState } from 'react';
import { api } from '../api';
import {
  startRegistration,
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable,
} from '@simplewebauthn/browser';
import WebcamBox from '../components/WebcamBox';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [stage, setStage] = useState('user'); // 'user' -> 'face' -> 'done'
  const [showCam, setShowCam] = useState(false);
  const [options, setOptions] = useState(null);
  const [busy, setBusy] = useState(false);

  async function createUser(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setStatus('Criando usuário...');
    try {
      await api.post('/webauthn/register/finish', { username: 'noop', attestationOrAssertionResponse: {} }).catch(()=>{}); // evita hot-reload antigos travarem CORS (safe no-op)
      await api.post('/auth/register', { username, password });
      setStatus('Usuário criado. Agora registre sua face.');
      setStage('face');
    } catch (err) {
      setStatus(err?.response?.data?.error || 'Falha ao criar usuário.');
    } finally {
      setBusy(false);
    }
  }

  async function prepareFaceOptions() {
    if (busy) return;
    setBusy(true);
    setStatus('Preparando registro facial...');

    if (!browserSupportsWebAuthn()) {
      setStatus('Navegador sem WebAuthn');
      setBusy(false);
      return;
    }
    const hasPlatform = await platformAuthenticatorIsAvailable();
    if (!hasPlatform) {
      setStatus('Sem autenticador de plataforma (Windows Hello/Face)');
      setBusy(false);
      return;
    }

    try {
      const { data } = await api.post('/webauthn/register/options', { username });
      const pk = { ...data.publicKey };

      // IMPORTANTE: não converter base64url -> ArrayBuffer; a lib faz isso.
      pk.timeout = 120000;

      setOptions(pk);
      setShowCam(true);
      setStatus('Pronto. Clique em "Confirmar Face" para registrar.');
    } catch (err) {
      console.error(err);
      setStatus('Falha ao preparar registro facial.');
    } finally {
      setBusy(false);
    }
  }

  async function confirmFace() {
    if (busy || !options) return;
    setBusy(true);
    setStatus('Aguardando confirmação facial do sistema...');
    try {
      const att = await startRegistration(options);
      const payload = { credentialId: att.id, publicKeyCose: att.id }; // demo simplificada

      await api.post('/webauthn/register/finish', {
        username,
        attestationOrAssertionResponse: payload,
      });

      setStatus('Cadastro concluído! Senha + Face registrados.');
      setStage('done');
    } catch (err) {
      console.error(err);
      setStatus('Falha ao registrar face. Tente novamente.');
    } finally {
      setTimeout(() => setShowCam(false), 1200); // dá tempo do vídeo encerrar sem AbortError
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h2>Cadastro obrigatório: Senha + Face</h2>

      {stage === 'user' && (
        <form onSubmit={createUser}>
          <label>Usuário</label>
          <input className="input" value={username} onChange={e => setUsername(e.target.value)} required />
          <div style={{ height: 10 }} />
          <label>Senha</label>
          <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} required />
          <div style={{ height: 12 }} />
          <button className="btn" type="submit" disabled={!username || !password || busy}>Criar conta</button>
        </form>
      )}

      {stage === 'face' && (
        <div>
          <p>Passo 2: registre sua face para concluir o cadastro.</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button className="btn" onClick={prepareFaceOptions} disabled={busy}>Preparar</button>
            <button className="btn" onClick={confirmFace} disabled={busy || !options}>Confirmar Face</button>
          </div>
          <WebcamBox active={showCam} />
        </div>
      )}

      {stage === 'done' && <p>Concluído! Agora você pode fazer login (senha + face).</p>}

      <div style={{ height: 10 }} />
      <div className="mono">{status}</div>
    </div>
  );
}