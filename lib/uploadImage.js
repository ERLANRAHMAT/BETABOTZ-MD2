import axios from 'axios';
import FormData from 'form-data';
import pkg from 'file-type';
const { fromBuffer } = pkg;

export default async (buffer, tmp = false) => {
  const { ext = 'bin', mime = 'application/octet-stream' } = (await fromBuffer(buffer)) || {};
  
  const form = new FormData();
  form.append("file", buffer, { filename: `tmp.${ext}`, contentType: mime });
  form.append("apikey", global.lann); 
  form.append("tmp", String(tmp)); 

  try {
    const { data } = await axios.post("https://api.betabotz.eu.org/api/tools/upload", form, {
      headers: form.getHeaders(),
    });   
    return data.result;
  } catch (e) {
    console.log(e);
    throw e;
  }
};