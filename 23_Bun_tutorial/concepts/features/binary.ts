function performBinaryDataOperations() {
  // 🧱 Create an ArrayBuffer of 8 bytes
  const arrayBuffer = new ArrayBuffer(8);
  console.log('🧱 ArrayBuffer:', arrayBuffer);

  // 📐 Create a DataView to manipulate binary data
  const dataView = new DataView(arrayBuffer);

  // ✏️ Set values in the buffer
  dataView.setUint8(0, 3);
  dataView.setInt16(1, 513);

  console.log('📌 Uint8 at position 0:', dataView.getUint8(0));
  console.log('📌 Int16 at position 1:', dataView.getInt16(1));

  // 🔢 Create a Uint8Array
  const uint8ArraySample = new Uint8Array([0, 1, 2, 3, 4]);
  console.log('🔢 Uint8Array:', uint8ArraySample);

  // 💬 Create a Node-style Buffer from a string
  const bufferFromString = Buffer.from('Hello Bun JS');
  console.log('💬 Buffer content:', bufferFromString.toString());

  // 🌐 Create a Blob with HTML content
  const htmlBlob = new Blob(['<html>Hello</html>'], { type: 'text/html' });
  console.log('🌐 Blob size:', htmlBlob.size);
  console.log('🌐 Blob type:', htmlBlob.type);

  // ✍️ Encode a string using TextEncoder
  const textEncoder = new TextEncoder();
  const encodedText = textEncoder.encode('Hello Bun!');
  console.log('✍️ Encoded value:', encodedText);

  // 📝 Decode the Uint8Array back to string
  const textDecoder = new TextDecoder();
  const decodedText = textDecoder.decode(encodedText);
  console.log('📝 Decoded value:', decodedText);
}

performBinaryDataOperations();
