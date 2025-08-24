// src/usecases/googleAuthUsecase.js

const userRepository = require("../../repository/userRepository");

class GoogleAuthUsecase {
   const { SignJWT } = await import("jose");
  constructor(repository) {
    this.repository = repository;
  }

  async handleGoogleLogin(
    code,
    client_id,
    client_secret,
    redirect_uri,
    jwtSecret
  ) {
    // jose yêu cầu secret dạng Uint8Array
    const secretKey = new TextEncoder().encode(jwtSecret);
    
    // Lấy token từ Google
    const tokenData = await this.repository.exchangeCodeForToken(
      code,
      client_id,
      client_secret,
      redirect_uri
    );

    // Verify id_token từ Google
    const userInfo = await this.repository.verifyIdToken(tokenData.id_token);

    // Kiểm tra user trong DB
    let userFromDB = await userRepository.findByUsernameOrEmail(userInfo.email);
    if (!userFromDB) {
      userFromDB = await userRepository.create({
        email: userInfo.email,
        name: userInfo.name,
        avatar: userInfo.picture,
        status: 1,
        role: "user",
      });
    }

    // Tạo token của app bằng jose
    const appToken = await new SignJWT({
      userId: userFromDB.user_id,
      email: userInfo.email,
      name: userInfo.name,
      phone: userFromDB.phone,
      role: userFromDB.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secretKey);


    return { token: appToken, user: userInfo };
  }
}

module.exports = GoogleAuthUsecase;
