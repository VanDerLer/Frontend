export function toArrayBuffer(v) {
  if (!v) return v;
  if (v instanceof ArrayBuffer) return v;
  if (ArrayBuffer.isView(v)) return v.buffer;
  if (typeof v === 'string') {
    const pad = '='.repeat((4 - (v.length % 4)) % 4);
    const b64 = (v + pad).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(b64);
    const arr = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr.buffer;
  }
  return v;
}