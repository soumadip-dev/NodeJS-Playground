const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');
const { Transform } = require('stream');

// Custom transform stream for encryption
class EncryptStream extends Transform {
  constructor(secretKey, initVector) {
    super();
    this.secretKey = secretKey;
    this.initVector = initVector;
  }

  _transform(chunk, encoding, callback) {
    try {
      const cipher = crypto.createCipheriv('aes-256-ocb', this.secretKey, this.initVector, {
        authTagLength: 16,
      });

      const encryptedChunk = Buffer.concat([cipher.update(chunk), cipher.final()]);

      this.push(encryptedChunk);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

// Generate encryption key and IV
const encryptionKey = crypto.randomBytes(32);
const initializationVector = crypto.randomBytes(12);

// Create streams
const readableStream = fs.createReadStream('input.txt');
const gzipStream = zlib.createGzip();
const encryptionStream = new EncryptStream(encryptionKey, initializationVector);
const writableStream = fs.createWriteStream('output.txt.gz.enc');

// Pipeline: read → compress → encrypt → write
readableStream.pipe(gzipStream).pipe(encryptionStream).pipe(writableStream);

console.log('Streaming started: reading ➡️ compressing ➡️ encrypting ➡️ writing');
