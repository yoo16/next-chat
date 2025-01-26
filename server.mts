import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();


app.prepare().then(() => {
    const httpServer = createServer(handle);
    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`)

        socket.on("join-room", (data) => {
            socket.join(data.room);
            console.log(`User ${data.username} join room ${data.room}`);
            socket.to(data.room).emit("user_joined",
                `${data.username} join room`
            )
        })

        socket.on("message", (data) => {
            console.log(data);
            console.log(`sender: ${data.sender} in room ${data.room}: ${data.message}`)
            socket.to(data.room).emit("message", data)
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`)
        })
    })

    httpServer.listen(port, () => {
        console.log(`Server runnging: http://${hostname}:${port}`)
    })
})
