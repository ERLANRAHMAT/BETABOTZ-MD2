const axios = require('axios');
const FormData = require('form-data');
const { fromBuffer } = require('file-type');

/**
 * Upload image to api.betabotz.eu.org
 * Supported mimetype:
``
* - `image/jpeg`
* - `image/png`
* - `image/webp`
* - `video/mp4`
* - `video/avi`
* - `video/mkv`
* - `audio/mpeg`
* - `audio/wav`
* - `audio/ogg`
 * @param {Buffer} buffer
 *@param {apikey} register on api.betabotz.eu.org
 *@param lann replace it with your apikey 
 */
 
module.exports = async buffer => {
  const { ext, mime } = (await fromBuffer(buffer)) || {};
  const form = new FormData();
  form.append("file", buffer, { filename: `tmp.${ext}`, contentType: mime });
  form.append("apikey", lann);
  try {
    const { data } = await axios.post("https://api.betabotz.eu.org/api/tools/upload", form, {
      headers: form.getHeaders(),
    });   
    console.log(data);  
    return data.result;
  } catch (error) {
    throw error;
  }
};
