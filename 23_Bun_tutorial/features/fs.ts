import type { BunFile } from 'bun';

async function performFileSystemOperations(): Promise<void> {
  // 📦 Create a BunFile reference for the input file
  const inputFile: BunFile = Bun.file('./read.txt');

  console.log('📦 File Size:', inputFile.size, 'bytes');
  console.log('📄 File Type:', inputFile.type);

  // 📝 Read the entire file content as text
  const fileTextContent: string = await inputFile.text();
  console.log('📝 File Content:\n', fileTextContent);

  // 🧠 Alternative ways to read file data in binary formats
  const fileArrayBuffer: ArrayBuffer = await inputFile.arrayBuffer();
  const fileByteArray: Uint8Array = await inputFile.bytes();

  console.log('🧠 ArrayBuffer Data:', fileArrayBuffer);
  console.log('🔢 Byte Array Data:', fileByteArray);

  // ✅ Write the content to a new file
  await Bun.write('./write.txt', fileTextContent);
  console.log('✅ File copied and created successfully');

  // ❓ Check if the new file exists
  const isFileExists = await Bun.file('./write.txt').exists();
  console.log('Is file exists ❓', isFileExists);

  // 🗑️ Delete the new file
  await Bun.file('./write.txt').delete();
  console.log('🗑️ File deleted successfully');
}

performFileSystemOperations();
