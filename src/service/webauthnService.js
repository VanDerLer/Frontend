// src/service/webauthnService.js
import { api } from "./api";

/**
 * Converte base64url (sem padding) para Uint8Array
 */
function base64UrlToUint8Array(base64UrlString) {
  const padding = "=".repeat((4 - (base64UrlString.length % 4)) % 4);
  const base64 = base64UrlString.replace(/-/g, "+").replace(/_/g, "/") + padding;
  const raw = window.atob(base64);
  const outputArray = new Uint8Array(raw.length);

  for (let i = 0; i < raw.length; i++) {
    outputArray[i] = raw.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Converte ArrayBuffer para base64url
 */
function arrayBufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = window.btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

/**
 * Fluxo de REGISTRO biométrico (WebAuthn)
 */
export async function registrarBiometria() {
  if (!("credentials" in navigator)) {
    throw new Error(
      "Este navegador não suporta WebAuthn (navigator.credentials)."
    );
  }

  const optionsResp = await api.get("/webauthn/register/options");
  const options = optionsResp.data;

  const publicKey = {
    ...options,
    challenge: base64UrlToUint8Array(options.challenge),
    user: {
      ...options.user,
      id: base64UrlToUint8Array(options.user.id),
    },
    pubKeyCredParams: options.pubKeyCredParams,
  };

  if (Array.isArray(options.excludeCredentials)) {
    publicKey.excludeCredentials = options.excludeCredentials.map((cred) => ({
      type: cred.type,
      id: base64UrlToUint8Array(cred.id),
    }));
  }

  const credential = await navigator.credentials.create({ publicKey });

  if (!credential) {
    throw new Error("Credencial WebAuthn não foi criada.");
  }

  const attestationResponse = credential.response;

  const credentialData = {
    id: credential.id,
    type: credential.type,
    rawId: arrayBufferToBase64Url(credential.rawId),
    response: {
      clientDataJSON: arrayBufferToBase64Url(attestationResponse.clientDataJSON),
      attestationObject: arrayBufferToBase64Url(
        attestationResponse.attestationObject
      ),
    },
  };

  await api.post("/webauthn/register/finish", credentialData);
}

/**
 * Fluxo de AUTENTICAÇÃO biométrica (WebAuthn)
 */
export async function autenticarBiometria() {
  if (!("credentials" in navigator)) {
    throw new Error(
      "Este navegador não suporta WebAuthn (navigator.credentials)."
    );
  }

  // 1) pega opções de autenticação no back
  const optionsResp = await api.get("/webauthn/authenticate/options");
  const options = optionsResp.data;

  const publicKey = {
    ...options,
    challenge: base64UrlToUint8Array(options.challenge),
  };

  if (Array.isArray(options.allowCredentials)) {
    publicKey.allowCredentials = options.allowCredentials.map((cred) => ({
      ...cred,
      id: base64UrlToUint8Array(cred.id),
    }));
  }

  // 2) chama navigator.credentials.get
  const assertion = await navigator.credentials.get({ publicKey });

  if (!assertion) {
    throw new Error("Falha na autenticação WebAuthn.");
  }

  const authResp = assertion.response;

  const credentialData = {
    id: assertion.id,
    type: assertion.type,
    rawId: arrayBufferToBase64Url(assertion.rawId),
    response: {
      clientDataJSON: arrayBufferToBase64Url(authResp.clientDataJSON),
      authenticatorData: arrayBufferToBase64Url(authResp.authenticatorData),
      signature: arrayBufferToBase64Url(authResp.signature),
      userHandle: authResp.userHandle
        ? arrayBufferToBase64Url(authResp.userHandle)
        : null,
    },
  };

  // 3) manda pro back validar / registrar o uso
  await api.post("/webauthn/authenticate/finish", credentialData);
}
