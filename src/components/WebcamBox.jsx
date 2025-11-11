import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';

export default function WebcamBox({ active }) {
  const [enabled, setEnabled] = useState(false);

  // Mantém o componente montado; só liga/desliga visualmente
  useEffect(() => {
    const t = setTimeout(() => setEnabled(active), 80); // pequeno debounce evita AbortError
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div style={{ border: '1px solid #2a2540', borderRadius: 12, padding: 8, background: '#141021' }}>
      <div style={{ fontSize: 12, opacity: .75, marginBottom: 6 }}>
        Prévia da câmera (apenas visual; o FaceID do sistema não expõe imagem)
      </div>
      <div style={{ position: 'relative' }}>
        <Webcam
          audio={false}
          mirrored
          style={{ width: '100%', borderRadius: 8, opacity: enabled ? 1 : .15, transition: 'opacity .2s' }}
          videoConstraints={{ facingMode: 'user' }}
          forceScreenshotSourceSize
        />
        {!enabled && (
          <div
            style={{
              position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
              background: 'rgba(0,0,0,.35)', borderRadius: 8, fontSize: 12
            }}
          >
            câmera pausada
          </div>
        )}
      </div>
    </div>
  );
}