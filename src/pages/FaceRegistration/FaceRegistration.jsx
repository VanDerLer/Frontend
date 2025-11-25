// src/pages/FaceRegistration/FaceRegistration.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { registerFace } from "../../service/faceService";
import "../../styles/FaceRegistration/FaceRegistration.css";

export default function FaceRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [step, setStep] = useState(1);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (step === 1) startCamera();
    else stopCamera();

    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function startCamera() {
    try {
      setErrorMsg("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current
          .play()
          .catch(() => {});
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Não foi possível acessar a câmera. Verifique as permissões do navegador."
      );
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  function handleCapture() {
    setErrorMsg("");
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    const width = video.videoWidth || 480;
    const height = video.videoHeight || 640;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);
    setStep(2);
  }

  function handleRetry() {
    setCapturedImage(null);
    setStep(1);
  }

  async function handleConfirm() {
    try {
      setLoading(true);
      setErrorMsg("");

      if (!capturedImage) {
        setErrorMsg("Nenhuma imagem capturada.");
        return;
      }

      // 🔐 chama Azure via back
      await registerFace(capturedImage);

      // marca que tem biometria cadastrada (pra BookCard)
      localStorage.setItem("vanderler_biometria", "true");

      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Não foi possível concluir o registro facial. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  const isStep1 = step === 1;
  const title = isStep1
    ? "Posicione-se no quadro"
    : "Confirme seu registro facial";
  const description = isStep1
    ? "Certifique-se de que seu rosto esteja totalmente visível e bem iluminado. Evite sombras ou obstruções."
    : "Revise a imagem capturada para garantir que está nítida e bem iluminada.";
  const stepText = isStep1 ? "1 de 2" : "2 de 2";

  return (
    <div className="face-page">
      <div className="face-card">
        <header className="face-header">
          <div className="face-header-texts">
            <h1 className="face-title">{title}</h1>
            <p className="face-subtitle">{description}</p>
          </div>

          <div className="face-logo-placeholder">
            <span className="face-logo-text">VanDerLer</span>
          </div>
        </header>

        <div className="face-progress">
          <div className="face-step-text">{stepText}</div>
          <div className="face-progress-bar">
            <div
              className={`face-progress-fill ${
                isStep1 ? "face-progress-fill-half" : "face-progress-fill-full"
              }`}
            />
          </div>
        </div>

        <div className="face-main">
          <div className="face-frame">
            {isStep1 ? (
              <video
                ref={videoRef}
                className="face-video"
                autoPlay
                playsInline
                muted
              />
            ) : (
              capturedImage && (
                <img
                  src={capturedImage}
                  alt="Pré-visualização da captura facial"
                  className="face-photo"
                />
              )
            )}
          </div>
        </div>

        {errorMsg && <p className="face-error">{errorMsg}</p>}

        <div className="face-actions">
          {isStep1 ? (
            <button
              type="button"
              className="face-btn face-btn-primary"
              onClick={handleCapture}
              disabled={!!errorMsg}
            >
              Capturar
            </button>
          ) : (
            <>
              <button
                type="button"
                className="face-btn face-btn-secondary"
                onClick={handleRetry}
                disabled={loading}
              >
                Refazer
              </button>
              <button
                type="button"
                className="face-btn face-btn-primary"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Confirmando..." : "Confirmar"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
