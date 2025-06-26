// src/usecases/googleAuthUsecase.js
const jwt = require("jsonwebtoken");
const userRepository = require("../../repository/userRepository");

class GoogleAuthUsecase {
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
    const tokenData = await this.repository.exchangeCodeForToken(
      code,
      client_id,
      client_secret,
      redirect_uri
    );
    const userInfo = await this.repository.verifyIdToken(tokenData.id_token);
    let userFromDB = await userRepository.findByUsernameOrEmail(userInfo.email);
    if (!userFromDB) {
    userFromDB = await userRepository.create({
        email: userInfo.email,
        name: userInfo.name,
        avatar: userInfo.picture,
        status: true,
        role: "user",
      });
    }
    const appToken = jwt.sign(
      {
        userId: userFromDB.user_id,
        email: userInfo.email,
        name: userInfo.name,
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return { token: appToken, user: userInfo };
  }
}

module.exports = GoogleAuthUsecase;
