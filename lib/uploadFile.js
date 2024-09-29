const fetch = require('node-fetch');
const axios = require('axios')
const FormData = require('form-data');
const { fromBuffer } = require('file-type');

/**
 * Upload file to https://pomf.lain.la
 * @returns {string|null|(string|null)[]}
 */
 
const pomf = async (buffer) => {
const { ext, mime } = (await fromBuffer(buffer)) || {};
  const form = new FormData();
  form.append("files[]", buffer, { filename: `tmp.${ext}`, contentType: mime });
  try {
    const { data } = await axios.post("https://pomf.lain.la/upload.php", form, {
      headers: form.getHeaders(),
    });   
    console.log(data);  
    return data.files[0].url
  } catch (error) {
    throw error;
  }
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
const api = async (buffer) => {
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
}

module.exports = async function (inp) {
  let err = false;
  for (const upload of [api, pomf, fileIO]) {
    try {
      return await upload(inp);
    } catch (e) {
      err = e;
    }
  }
  if (err) throw err;
};
