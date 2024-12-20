import { createServer } from "http";
import { Server } from "socket.io";

const requestHandler = (req, res) => {
  res.writeHead(200);
  res.end("Server is running");
};

const httpsServer = createServer(requestHandler);

const io = new Server(httpsServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["https://localhost:5500"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("message", (data) => {
    console.log(data);
    io.emit("message", `${socket.id.substring(0, 5)}: ${data}`);
  });

  const intervalId = setInterval(() => {
    console.log("send message");
    socket.emit("message", `Server: ${new Date().toISOString()}`);
  }, 1000);

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
    clearInterval(intervalId); // 清除定时器
  });
});

httpsServer.listen(3500, () => {
  console.log("listening on port 3500");
});
