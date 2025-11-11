import React, { useEffect, useRef, useState } from 'react';

export default function CameraPreview({ active }) {
  const videoRef = useRef(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let stream;
    async function start() {
      try {
        if (!active) return;
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e) {
        setErr('Não foi possível acessar a câmera (permita no navegador).');
      }
    }
    start();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [active]);

  return (
    <div style={{border:'1px solid #2a2540', borderRadius:12, padding:8, background:'#141021'}}>
      <div style={{fontSize:12, opacity:.75, marginBottom:6}}>Prévia da câmera (somente visual, não é a imagem do FaceID)</div>
      <video ref={videoRef} style={{width:'100%', borderRadius:8}} playsInline muted />
      {err && <div style={{marginTop:6, fontSize:12, color:'#ffb4b4'}}>{err}</div>}
    </div>
  );
}