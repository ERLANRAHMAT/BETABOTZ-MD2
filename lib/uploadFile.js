import fetch from 'node-fetch';
import axios from 'axios'
import FormData from 'form-data';
import { fileTypeFromBuffer as fromBuffer } from 'file-type';

/**
 * Upload file to https://catbox.moe
 * @returns {string|null|(string|null)[]}
 */
 const catbox = async (buffer) => {
  const { ext } = await fromBuffer(buffer) || {};
    if (!ext) throw new Error('File type not recognized');
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', buffer, `file.${ext}`);
    const response = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: {
        ...form.getHeaders(),
        'Content-Length': form.getLengthSync()
      }
    });
    return response.data;
};

/**
 * Upload epheremal file to file.io
 * `Expired in 1 day`
 * `100MB Max Filesize`
 * @param {Buffer} buffer File Buffer
 */
const fileIO = async (buffer) => {
  const { ext } = await fromBuffer(buffer) || {};
  const form = new FormData();
  form.append('file', buffer, `tmp.${ext}`);
  const res = await fetch('https://file.io/?expires=1d', { // 1 Day Expiry Date
    method: 'POST',
    body: form
  });
  const json = await res.json();
  if (!json.success) throw json;
  return json.link;
};


/**
 * Upload file to api.betabotz.eu.org
 * @returns {string|null|(string|null)[]}
 */
const api = async (buffer) => {
  const validBuffer = Buffer.from(buffer); 
  
  const { ext = "bin", mime = "application/octet-stream" } = (await fromBuffer(validBuffer)) || {};
  const form = new FormData();
  
  form.append("file", validBuffer, { 
    filename: `tmp.${ext}`, 
    contentType: mime,
    knownLength: validBuffer.length 
  });

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
  for (const upload of [api, catbox]) {
    try {
      return await upload(inp);
    } catch (e) {
      err = e;
    }
  }
  if (err) throw err;
};
