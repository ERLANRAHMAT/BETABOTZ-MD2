import fetch from "node-fetch";
import axios from "axios";
import FormData from "form-data";
import pkg from "file-type";
const { fromBuffer } = pkg; 

/**
 * Upload file to api.betabotz.eu.org
 * @returns {string|null}
 */
const api = async (buffer) => {
  const { ext = "bin", mime = "application/octet-stream" } =
    (await fromBuffer(buffer)) || {};
  const form = new FormData();
  form.append("file", buffer, { filename: `tmp.${ext}`, contentType: mime });

  // [FIX] Perbaikan cara memasukkan apikey ke FormData
  form.append("apikey", global.lann);

  try {
    const { data } = await axios.post(
      "https://api.betabotz.eu.org/api/tools/upload",
      form,
      {
        headers: form.getHeaders(),
      },
    );
    
    // Pastikan mengembalikan string result dari respons API
    if (data && data.result) {
      return data.result;
    }
    throw new Error(data?.message || "Gagal mendapatkan URL dari respons Betabotz");
    
  } catch (e) {
    console.log("Upload Error (Betabotz):", e?.message || e);
    throw e;
  }
};

export default async function (inp) {
  if (!Buffer.isBuffer(inp)) {
    throw new Error("Input yang dikirim ke uploader bukan berupa Buffer!");
  }
  
  // Karena hanya pakai Betabotz, langsung eksekusi fungsinya
  return await api(inp);
}