import config from '../../config';
const B2 = require('backblaze-b2');
const RNFS = require('react-native-fs');
const crypto = require('crypto-js');
const sha1 = require('js-sha1');

const b2 = new B2({
  applicationKeyId: config.backblaze.applicationKeyId,
  applicationKey: config.backblaze.applicationKey,
});

const common_args = {
  axios: {
    headers: {'Transfer-Encoding': ''},
  },
};

export const getBucket = async bucketName => {
  try {
    await authorize();
    const resp = await b2.getBucket({bucketName});
    console.log(resp.data);
  } catch (err) {
    console.log('Error getting bucket:', err.message);
  }
};

export const getFileInfo = async fileId => {
  await authorize();

  const response = await b2
    .getFileInfo(fileId)
    .catch(err =>
      console.error('Backblaze - Getting file:', err.response.data.message),
    );
  console.log(Object.keys(response));
  console.log(response.data);
};

export const getFileLink = fileName => {
  return config.backblaze.publicUrl + fileName;
};

export const uploadToBackblaze = async filePath => {
  const fileExtension = getFileExtension(filePath);

  await authorize();

  const epochSeconds =
    parseInt(new Date().getTime() / 1000) * randomNumber(1, 100);

  const fileName = `_${epochSeconds}.${fileExtension}`;

  const file = await RNFS.readFile(filePath, 'base64').catch(err => {
    console.err('Backblaze - File reading:', err.message);
    throw err;
  });

  const fileBuffer = Buffer.from(file, 'base64');
  //const hash = crypto.SHA1(fileBuffer).toString(crypto.enc.Hex);
  const hash = sha1.hex(fileBuffer);

  const getUrl = await b2.getUploadUrl(config.backblaze.bucketId).catch(err => {
    console.error('Backblaze - Getting upload url:', err.response.data.message);
    throw err;
  });

  const uploadUrl = getUrl.data.uploadUrl;

  const authToken = getUrl.data.authorizationToken;

  const result = await b2
    .uploadFile({
      uploadUrl: uploadUrl,
      uploadAuthToken: authToken,
      fileName: fileName,
      mime: `image/${fileExtension}`,
      data: fileBuffer,
      hash: hash,
      ...common_args,
    })
    .catch(err => {
      console.error('Backblaze - Uploading file:', err.response.data.message);
      throw err;
    });

  console.log('Backblaze - Succesfuly uploaded file:', result.data.fileName);
  return {
    fileId: result.data.fileId,
    fileName: result.data.fileName,
  };
};

const authorize = async () => {
  await b2
    .authorize()
    .catch(err => console.error('Backblaze - Authorization:', err.message));
};
const getFileExtension = filename => {
  if (filename) {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  }
  return '';
};

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
