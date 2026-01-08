async function performPasswordHashingOperations() {
  const plainTextPassword = '123456';

  // Generate a default password hash
  const defaultPasswordHash = await Bun.password.hash(plainTextPassword);
  console.log('🔐 Default hash:', defaultPasswordHash);

  // Verify the password against the hash
  const isPasswordValid = await Bun.password.verify(plainTextPassword, defaultPasswordHash);
  console.log('✅ Password match:', isPasswordValid);

  // Generate an Argon2id password hash
  const argon2IdPasswordHash = await Bun.password.hash(plainTextPassword, {
    algorithm: 'argon2id',
    memoryCost: 4,
    timeCost: 3,
  });
  console.log('🧪 Argon2id hash:', argon2IdPasswordHash);

  // Verify Argon2id hash
  const isArgon2IdPasswordValid = await Bun.password.verify(
    plainTextPassword,
    argon2IdPasswordHash
  );
  console.log('✅ Argon2id password match:', isArgon2IdPasswordValid);

  const bcryptPasswordHash = await Bun.password.hash(plainTextPassword, {
    algorithm: 'bcrypt',
    cost: 10,
  });

  console.log('🧱 Bcrypt hash:', bcryptPasswordHash);

  // Verify bcrypt hash
  const isBcryptPasswordValid = await Bun.password.verify(plainTextPassword, bcryptPasswordHash);
  console.log('✅ Bcrypt password match:', isBcryptPasswordValid);
}

performPasswordHashingOperations();
