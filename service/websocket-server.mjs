import { WebSocketServer } from "ws";
// 简单的 Token 验证函数（此处仅做示例，请根据实际场景改进）
function verifyToken(token) {
  // 假设 'valid-token' 是有效 token，仅供示例
  return token === "701194b4-03d8-482e-b399-8e5fa51c98b8";
}
// 创建 WebSocket 服务器，监听端口 5000
const serverOptions = { port: 5000 };
const wss = new WebSocketServer(serverOptions);
wss.on("connection", (ws, request) => {
  console.log("客户端尝试连接");
  // 解析 URL 参数
  const requestUrl = new URL(
    request.url || "",
    `http://${request.headers.host}`,
  );
  const token = requestUrl.searchParams.get("token");
  // 验证 token
  // if (!verifyToken(token)) {
  //   ws.send("Token 错误");
  //   ws.close();
  //   return;
  // }
  console.log("客户端已连接");
  // 当从客户端接收到消息时
  ws.on("message", (message) => {
    const receivedMessage = message.toString();
    console.log("收到消息：", receivedMessage);
    // 简单回复客户端消息
    ws.send(
      JSON.stringify({
        header: {
          type: JSON.parse(receivedMessage).header.type,
          version: "1.0",
          timestamp: Date.now(),
        },
        body: JSON.parse(receivedMessage).body,
      }),
    );
  });
  // 当连接关闭
  ws.on("close", () => {
    console.log("客户端已断开连接");
  });
  // 向客户端发送一条消息
  ws.send(
    JSON.stringify({
      type: "image",
      url: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
    }),
  );
});
console.log("WebSocket 服务器已启动，监听端口 5000");
