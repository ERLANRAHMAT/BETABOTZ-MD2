
import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer as fromBuffer } from 'file-type';

const api = async (buffer, tmp: boolean | string = false, originalName = 'file') => {
  if (!buffer || buffer.length === 0) throw new Error('Buffer kosong');

  const { ext = 'bin', mime = 'application/octet-stream' } =
    (await fromBuffer(buffer)) || {};

  const form = new FormData();
  form.append('file', buffer, {
    filename: `${originalName}.${ext}`,
    contentType: mime,
  });
  form.append('apikey', global.lann);
  form.append('tmp', String(tmp === true || tmp === 'true' || tmp === '1'));

  try {
    const { data } = await axios.post('https://api.betabotz.eu.org/api/tools/upload', form, {
      headers: form.getHeaders(),
    });

    if (!data || !data.result) throw new Error('Upload gagal');
    return data.result;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export default async (buffer, flag: boolean | string = false) => {
  if (!buffer || buffer.length === 0) throw new Error('Buffer kosong');

  return api(buffer, flag, 'file');
};
