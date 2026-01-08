function logMetaAndEnvironment() {
  // 🌐 Log module metadata
  console.log('🌐 Module URL:', import.meta.url);
  console.log('🌐 Is main module:', import.meta.main);

  // 📝 Log environment variables
  console.log('📝 NODE_ENV via process.env:', process.env.NODE_ENV);
  console.log('📝 NODE_ENV via Bun.env:', Bun.env.NODE_ENV);
}

logMetaAndEnvironment();
