
import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer as fromBuffer } from 'file-type';

/**
 * Upload file to https://pomf.lain.la
 * @returns {string|null|(string|null)[]}
 */
const pomf = async (buffer: Buffer) => {
  const { ext = 'bin', mime = 'application/octet-stream' } = (await fromBuffer(buffer)) || {};
  const form = new FormData();
  form.append('files[]', buffer, { filename: `tmp.${ext}`, contentType: mime });

  try {
    const { data } = await axios.post('https://pomf.lain.la/upload.php', form, {
      headers: form.getHeaders(),
    });
    return data.files[0].url;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

/**
 * Upload file to api.betabotz.eu.org
 * @returns {string|null|(string|null)[]}
 */
const api = async (buffer: Buffer) => {
  const { ext = 'bin', mime = 'application/octet-stream' } = (await fromBuffer(buffer)) || {};
  const form = new FormData();
  form.append('file', buffer, { filename: `tmp.${ext}`, contentType: mime });
  form.append('apikey', String((global as any).lann ?? ''));

  try {
    const { data } = await axios.post(
      'https://api.betabotz.eu.org/api/tools/upload',
      form,
      {
        headers: form.getHeaders(),
      },
    );
    return data.result;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export default async function (inp: Buffer) {
  if (!inp || inp.length === 0) throw new Error('Buffer kosong');
  let err: unknown = false;
  for (const upload of [api, pomf]) {
    try {
      return await upload(inp);
    } catch (e) {
      err = e;
    }
  }
  if (err) throw err;
}
