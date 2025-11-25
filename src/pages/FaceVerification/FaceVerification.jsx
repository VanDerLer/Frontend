import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { verifyFace } from "../../service/faceService";
import "../../styles/FaceRegistration/FaceRegistration.css";

export default function FaceVerification() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const targetPath = location.state?.from || `/books/${id}`;

  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }

  async function handleConfirm() {
    try {
      setLoading(true);
      setErrorMsg("");

      if (!capturedImage) {
        setErrorMsg("Nenhuma imagem capturada.");
        return;
      }

      const match = await verifyFace(capturedImage);

      if (match) {
        navigate(targetPath, { replace: true });
      } else {
        setErrorMsg(
          "Não conseguimos confirmar que é você. Tente novamente em um ambiente mais iluminado."
        );
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Erro ao verificar sua identidade. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    navigate("/");
  }

  return (
    <div className="face-page">
      <div className="face-card">
        <header className="face-header">
          <div className="face-header-texts">
            <h1 className="face-title">Confirme sua identidade</h1>
            <p className="face-subtitle">
              Antes de abrir este livro, posicione seu rosto novamente para
              confirmar que é você.
            </p>
          </div>

          <div className="face-logo-placeholder">
            <span className="face-logo-text">VanDerLer</span>
          </div>
        </header>

        <div className="face-progress">
          <div className="face-step-text">Verificação de segurança</div>
          <div className="face-progress-bar">
            <div className="face-progress-fill face-progress-fill-full" />
          </div>
        </div>

        <div className="face-main">
          <div className="face-frame">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Pré-visualização da verificação"
                className="face-photo"
              />
            ) : (
              <video
                ref={videoRef}
                className="face-video"
                autoPlay
                playsInline
                muted
              />
            )}
          </div>
        </div>

        {errorMsg && <p className="face-error">{errorMsg}</p>}

        <div className="face-actions">
          <button
            type="button"
            className="face-btn face-btn-secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </button>

          {!capturedImage ? (
            <button
              type="button"
              className="face-btn face-btn-primary"
              onClick={handleCapture}
              disabled={!!errorMsg}
            >
              Capturar
            </button>
          ) : (
            <button
              type="button"
              className="face-btn face-btn-primary"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Verificando..." : "Confirmar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
