import { api } from "./api";

// só pra garantir o split do dataURL
function extractBase64(dataUrl) {
  if (!dataUrl) return "";
  const parts = dataUrl.split(",");
  return parts.length === 2 ? parts[1] : dataUrl;
}

export async function registerFace(imageDataUrl) {
  const imageBase64 = extractBase64(imageDataUrl);

  console.log("[faceService] registerFace() chamado");
  console.log("[faceService] imageDataUrl começa com:", imageDataUrl?.slice(0, 30));
  console.log("[faceService] imageBase64 length:", imageBase64?.length);

  try {
    const resp = await api.post("/face/register", { imageBase64 });

    console.log("[faceService] registerFace() resposta OK:", resp.status, resp.data);
    return resp.data;
  } catch (err) {
    console.error("[faceService] ERRO em /face/register:");
    if (err.response) {
      console.error("  status:", err.response.status);
      console.error("  headers:", err.response.headers);
      console.error("  data:", err.response.data);
    } else {
      console.error("  err.message:", err.message);
    }
    throw err;
  }
}

export async function verifyFace(imageDataUrl) {
  const imageBase64 = extractBase64(imageDataUrl);

  console.log("[faceService] verifyFace() chamado");
  console.log("[faceService] imageBase64 length:", imageBase64?.length);

  try {
    const resp = await api.post("/face/verify", { imageBase64 });

    console.log("[faceService] verifyFace() resposta:", resp.status, resp.data);

    return resp.data?.match;
  } catch (err) {
    console.error("[faceService] ERRO em /face/verify:");
    if (err.response) {
      console.error("  status:", err.response.status);
      console.error("  headers:", err.response.headers);
      console.error("  data:", err.response.data);
    } else {
      console.error("  err.message:", err.message);
    }
    throw err;
  }
}
