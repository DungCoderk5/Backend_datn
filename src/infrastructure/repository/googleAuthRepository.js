// src/repositories/googleAuthRepository.js

class GoogleAuthRepository {
  async exchangeCodeForToken(code, client_id, client_secret, redirect_uri) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: "authorization_code",
      }),
    });
    console.log({
      code,
      client_id,
      client_secret,
      redirect_uri,
    });
    const data = await res.json(); // Đọc body 1 lần duy nhất

    if (!res.ok) {
      console.error("Google token error:", data);
      throw new Error("Lấy token từ Google thất bại");
    }

    return data;
  }

  async verifyIdToken(id_token) {
    const res = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`
    );
    if (!res.ok) throw new Error("Xác thực ID token thất bại");
    return res.json();
  }
}

module.exports = GoogleAuthRepository;
