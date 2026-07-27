import fetch from 'node-fetch';
import axios from 'axios';
import FormData from 'form-data';
import pkg from 'file-type';
const { fromBuffer } = pkg;

const pomf = async (buffer) => {
  const { ext = 'bin', mime = 'application/octet-stream' } = (await fromBuffer(buffer)) || {};
  const form = new FormData();
  form.append("files[]", buffer, { filename: `tmp.${ext}`, contentType: mime });
  
  try {
    const { data } = await axios.post("https://pomf.lain.la/upload.php", form, {
      headers: form.getHeaders(),
    });   
    return data.files[0].url;
  } catch (error) {
    throw error;
  }
};

const fileIO = async (buffer) => {
  const { ext = 'bin' } = (await fromBuffer(buffer)) || {};
  const form = new FormData();
  form.append('file', buffer, `tmp.${ext}`);
  
  const res = await fetch('https://file.io/?expires=1d', { 
    method: 'POST',
    body: form
  });
  
  const json = await res.json();
  if (!json.success) throw json;
  return json.link;
};

const api = async (buffer) => {
  const { ext = 'bin', mime = 'application/octet-stream' } = (await fromBuffer(buffer)) || {};
  const form = new FormData();
  form.append("file", buffer, { filename: `tmp.${ext}`, contentType: mime });
  
  form.append("apikey", global.lann); 
  
  try {
    const { data } = await axios.post("https://api.betabotz.eu.org/api/tools/upload", form, {
      headers: form.getHeaders(),
    });   
    return data.result;
  } catch (error) {
    throw error;
  }
}

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
};