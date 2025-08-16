const chatUsecase = require("../../infrastructure/usecase/chat/chatUsecase");

async function chatHandler(req, res) {
  const { message, conversationHistory } = req.body;

  try {
    const reply = await chatUsecase(message, conversationHistory);

    res.status(200).json({
      success: true,
      message: reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Handler] Lỗi chatHandler:", error);
    res.status(500).json({
      success: false,
      error: "Đã có lỗi xảy ra khi xử lý yêu cầu",
      details: error.message,
    });
  }
}

async function healthHandler(req, res) {
  try {
    res.status(200).json({
      success: true,
      message: "Server is running!",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Health check failed" });
  }
}

module.exports = {
  chatHandler,
  healthHandler,
};
