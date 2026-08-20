import axios from 'axios';
import FormData from 'form-data';
import * as fileType from 'file-type';

const fromBuffer = fileType.fromBuffer || fileType.fileTypeFromBuffer;

export default async (buffer, tmp = false) => {
  const validBuffer = Buffer.from(buffer);
  
  const { ext = 'bin', mime = 'application/octet-stream' } = (await fromBuffer(validBuffer)) || {};
  
  const form = new FormData();
  form.append("file", validBuffer, { 
    filename: `tmp.${ext}`, 
    contentType: mime,
    knownLength: validBuffer.length 
  });
  
  form.append("apikey", global.lann); 
  form.append("tmp", String(tmp)); 

  try {
    const { data } = await axios.post("https://api.betabotz.eu.org/api/tools/upload", form, {
      headers: form.getHeaders(),
    });   
    return data.result;
  } catch (e) {
    console.error(e);
    throw e;
  }
};