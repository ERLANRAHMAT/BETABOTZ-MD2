import fetch from "node-fetch";
import axios from "axios";
import FormData from "form-data";
import * as fileType from 'file-type';

const fromBuffer = fileType.fromBuffer || fileType.fileTypeFromBuffer;

/**
 * Upload file to https://pomf.lain.la
 * @returns {string|null|(string|null)[]}
 */
const pomf = async (buffer) => {
  const { ext = "bin", mime = "application/octet-stream" } =
    (await fromBuffer(buffer)) || {};
  const form = new FormData();
  form.append("files[]", buffer, { filename: `tmp.${ext}`, contentType: mime });

  try {
    const { data } = await axios.post("https://pomf.lain.la/upload.php", form, {
      headers: form.getHeaders(),
    });
    return data.files[0].url;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

/**
 * Upload file to api.betabotz.eu.org
 * @returns {string|null|(string|null)[]}
 */
const api = async (buffer) => {
  const { ext = "bin", mime = "application/octet-stream" } =
    (await fromBuffer(buffer)) || {};
  const form = new FormData();
  form.append("file", buffer, { filename: `tmp.${ext}`, contentType: mime });

  form.append("apikey", global.lann);

  try {
    const { data } = await axios.post(
      "https://api.betabotz.eu.org/api/tools/upload",
      form,
      {
        headers: form.getHeaders(),
      },
    );
    return data.result;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default async function (inp) {
  let err = false;
  for (const upload of [api, pomf]) {
    try {
      return await upload(inp);
    } catch (e) {
      err = e;
    }
  }
  if (err) throw err;
}