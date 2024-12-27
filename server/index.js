import { Server } from "socket.io";
import "dotenv/config";
import express from "express";
import cors from "cors";

// Port server
const port = process.env.PORT || 3001;

// Inisialisasi aplikasi Express
const app = express();

// Middleware CORS
app.use(
  cors({
    origin: "*", // Mengizinkan semua origin
  })
);

// Endpoint HTTP dasar
app.get("/", (req, res) => {
  res.send("Welcome to server!");
});

// Menjalankan server HTTP
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Konfigurasi Socket.IO dengan CORS
const io = new Server(server, {
  cors: {
    origin: "*", // Mengizinkan semua origin untuk WebSocket
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.emit("socket id", socket.id);

  // Berikan data semua rooms ke klien
  socket.on("get rooms", () => {
    socket.emit("rooms data", "hallo");
  });

  socket.on("create room", (data) => {
    // Menerima data dan melakukan destructuring
    console.log(data)
    const { userData, roomCode } = data;
    const { namePlayer, img } = userData;
    if (!namePlayer || !img) {
      socket.emit("error", "Invalid room data");
      return;
    }
    if (!rooms[roomCode]) {
      (rooms[roomCode] = {
        host: socket.id,
        player: [{ id: socket.id, namePlayer: namePlayer, img: img }],
        turn: "",
        maxPlayer: "",
        time: "",
        hint: "",
        word: [],
        chat: [],
      }),
        socket.join(roomCode);
      socket.emit("create room", roomCode);
      console.log(`Room created: ${roomCode}`);
    } else {
      socket.emit("error", "Room already exists");
    }
  });

  socket.on("setting room", (data) => {
    console.log(data);
    const { roomData, roomCode } = data;
    const { maxPlayer, time, hint } = roomData;

    // Validasi data
    if (!maxPlayer || !time || !hint) {
      socket.emit("error", "Invalid room data");
      return;
    }
    console.log(rooms[roomCode]);
    // Periksa apakah ruangan ada
    if (rooms[roomCode]) {
      // Pastikan hanya memperbarui data yang diinginkan
      rooms[roomCode].maxPlayer = maxPlayer;
      rooms[roomCode].time = time;
      rooms[roomCode].hint = hint;

      console.log(
        `Room ${roomCode} updated: maxPlayer=${maxPlayer}, time=${time}, hint=${hint}`
      );
      socket.emit("setting room", roomCode);
    } else {
      // Jika ruangan tidak ada, kirim pesan error
      socket.emit("error", "Room does not exist");
    }
  });

  // Bergabung dengan ruang tertentu
  socket.on("join room", (data) => {
    const { userData, roomCode } = data;
    const { namePlayer, img } = userData;

    if (rooms[roomCode]) {
      // Cek apakah ruang belum penuh
      if (rooms[roomCode].player.length < rooms[roomCode].maxPlayer) {
        // Tambahkan pemain baru ke array player
        rooms[roomCode].player.push({
          id: socket.id,
          namePlayer: namePlayer,
          img: img,
        });

        // Masukkan socket ke ruang (Socket.IO)
        socket.join(roomCode);
        socket.emit("join room", roomCode);
        console.log(`${socket.id} joined room ${roomCode}`);
      } else {
        socket.emit("error", "Room is full");
      }
    } else {
      socket.emit("error", "Room does not exist");
    }
  });

  socket.on("get DataUser", (roomCode) => {
    if (rooms[roomCode]) {
      // Periksa apakah pengguna adalah salah satu pemain
      const isPlayer = rooms[roomCode].player.some(
        (player) => player.id === socket.id
      );

      if (isPlayer) {
        const data = rooms[roomCode];

        // Masukkan socket ke ruang (Socket.IO) jika belum bergabung
        socket.join(roomCode);

        // Kirim data ke semua klien di ruang tersebut
        socket.emit("get DataUser", data);
      } else {
        socket.emit("error", "You are not a player in this room");
      }
    } else {
      socket.emit("error", "Room does not exist");
    }
  });

  socket.on("leave room", (roomCode) => {
    if (rooms[roomCode]) {
      // Cek apakah yang keluar adalah host
      if (rooms[roomCode].host === socket.id) {
        // Jika host keluar, hapus seluruh ruang dan keluarkan semua pemain
        console.log(`${socket.id} (Host) left room ${roomCode}`);

        // Hapus ruang dari objek
        delete rooms[roomCode];

        // Kirim pemberitahuan bahwa ruang telah dihapus
        io.to(roomCode).emit(
          "room deleted",
          "The room has been deleted because the host left."
        );

        // Keluarkan semua pengguna dari ruang
        // Mengeluarkan semua client dari room
        io.in(roomCode)
          .fetchSockets()
          .then((sockets) => {
            sockets.forEach((socket) => {
              socket.leave(roomCode); // Keluarkan setiap socket dari room
            });
          })
          .catch((error) => {
            console.error("Error fetching sockets:", error);
          });
      } else {
        // Jika pemain biasa keluar, cari pemain berdasarkan socket.id dan hapus dari daftar player
        const playerIndex = rooms[roomCode].player.findIndex(
          (player) => player.id === socket.id
        );

        if (playerIndex !== -1) {
          // Jika pemain ditemukan, hapus pemain dari array
          rooms[roomCode].player.splice(playerIndex, 1); // Menghapus 1 pemain pada indeks playerIndex
          console.log(`${socket.id} (Player) left room ${roomCode}`);

          // Emit pesan kepada pemain yang keluar
          socket.emit("left room", `You left room, room code: ${roomCode}`);
          io.to(roomCode).emit("get UserData", rooms[roomCode]);
        } else {
          console.log(
            `Player with socket ID ${socket.id} not found in room ${roomCode}`
          );
        }
      }
    } else {
      socket.emit("error", "Room does not exist");
    }
  });

  socket.on("kick player", (roomCode, playerId) => {
    // Pastikan ruang ada
    if (rooms[roomCode]) {
      // Cek apakah yang meminta untuk kick adalah host
      if (rooms[roomCode].host === socket.id) {
        // Cek apakah playerId ada di dalam daftar pemain
        const playerIndex = rooms[roomCode].player.findIndex(
          (player) => player.id === playerId
        );

        if (playerIndex !== -1) {
          // Hapus pemain dari daftar pemain
          rooms[roomCode].player.splice(playerIndex, 1);

          // Keluar dari room
          io.sockets.sockets.get(playerId).leave(roomCode);

          // Beri tahu pemain bahwa mereka dikeluarkan
          io.to(playerId).emit("kicked", "You have been kicked from the room.");
          io.to(roomCode).emit("get UserData", rooms[roomCode]);

          console.log(
            `Player ${playerId} has been kicked from room ${roomCode}.`
          );
        } else {
          // Jika pemain tidak ditemukan dalam daftar
          socket.emit("error", "Player not found in the room.");
        }
      } else {
        socket.emit(
          "error",
          "You are not the host. Only the host can kick players."
        );
      }
    } else {
      socket.emit("error", "Room does not exist.");
    }
  });

  socket.on("word", (roomCode, msg) => {
    // Memeriksa apakah room dengan roomCode ada
    if (rooms[roomCode]) {
      const turn = rooms[roomCode].turn; // Mendapatkan giliran pemain
      if (rooms[roomCode].player[turn].id === socket.id) {
        rooms[roomCode].word[0] = { id: socket.id, msg: msg };
        console.log(`${socket.id} sent word: ${msg}`);
      } else {
        // Jika pemain bukan yang sedang turn, kirimkan error atau abaikan
        socket.emit("error", "It's not your turn.");
      }
    } else {
      // Jika room tidak ada, kirimkan error
      socket.emit("error", "Room does not exist.");
    }
  });

  socket.on("message", (roomCode, msg) => {
    // Memeriksa apakah room dengan roomCode ada
    if (rooms[roomCode]) {
      // Menambah objek chat ke array chat di dalam room tersebut
      rooms[roomCode].chat.push({ id: socket.id, msg: msg });
      console.log(`Message from ${socket.id}: ${msg}`);

      io.to(roomCode).emit("get UserData", rooms[roomCode]);
      // Cek apakah pesan chat yang dikirim sama dengan word yang disimpan
      const currentWord = rooms[roomCode].word.find(
        (wordEntry) => wordEntry.id !== socket.id
      );
      if (currentWord && currentWord.msg === msg) {
        // Jika pesan chat sama dengan word yang dikirim oleh pemain dengan turn
        console.log("Correct word! Awarding points.");
        // Logika untuk memberi poin kepada pemain (belum implementasi)
      }
    } else {
      // Jika room tidak ada, kirimkan error
      socket.emit("error", "Room does not exist.");
    }
  });

  const disconnectTimers = {};

  socket.on("disconnect", () => {
    // console.log(`User disconnected: ${socket.id}`);

    for (const roomCode in rooms) {
      if (rooms[roomCode].host === socket.id) {
        // Host disconnect
        io.to(roomCode).emit(
          "host disconnected",
          "The host has disconnected. Waiting for reconnect..."
        );

        // Set timeout untuk menghapus room setelah 30 detik
        disconnectTimers[socket.id] = setTimeout(() => {
          io.to(roomCode).emit(
            "room deleted",
            "The room has been deleted because the host did not reconnect."
          );

          // Jika host keluar, keluarkan semua pemain dari room
          // Mengeluarkan semua client dari room
          io.in(roomCode)
            .fetchSockets()
            .then((sockets) => {
              sockets.forEach((socket) => {
                socket.leave(roomCode); // Keluarkan setiap socket dari room
              });
            })
            .catch((error) => {
              console.error("Error fetching sockets:", error);
            });

          // Hapus room
          delete rooms[roomCode];
          console.log(`Room deleted: ${roomCode}`);
        }, 30000); // Timeout 30 detik
      } else {
        // Bukan host disconnect
        io.to(roomCode).emit(
          "player disconnected",
          `Player ${socket.id} has disconnected. Waiting for reconnect...`
        );

        // Set timeout untuk menghapus player dari room
        disconnectTimers[socket.id] = setTimeout(() => {
          const playerIndex = rooms[roomCode].player.findIndex(
            (player) => player.id === socket.id
          );

          if (playerIndex !== -1) {
            rooms[roomCode].player.splice(playerIndex, 1);

            io.to(roomCode).emit("get UserData", rooms[roomCode]);
            console.log(`Player removed from room ${roomCode}: ${socket.id}`);
          }

          // Jika tidak ada pemain yang tersisa, hapus room
          if (rooms[roomCode].player.length === 0) {
            delete rooms[roomCode];
            console.log(`Room deleted: ${roomCode}`);
          }
        }, 30000); // Timeout 30 detik
      }
    }
  });

  socket.on("reconnect", ({ roomCode, playerId }) => {
    console.log(
      `Player ${playerId} attempting to reconnect to room ${roomCode}`
    );

    if (rooms[roomCode]) {
      const room = rooms[roomCode];
      const player = room.player.find((p) => p.playerid === playerId);

      if (player) {
        // Batalkan timeout jika pemain reconnect
        if (disconnectTimers[player.id]) {
          clearTimeout(disconnectTimers[player.id]);
          delete disconnectTimers[player.id];
        }

        const oldSocket = io.sockets.sockets.get(player.id);
        if (oldSocket) {
          oldSocket.leave(roomCode);
          console.log(
            `Old socket ID ${player.id} removed from room ${roomCode}`
          );
        }
        // Perbarui socket ID pemain
        player.id = socket.id;

        // Masukkan pemain kembali ke room
        socket.join(roomCode);

        console.log(`Player ${playerId} reconnected to room ${roomCode}`);
        io.to(roomCode).emit("room update", room.player);
      } else {
        socket.emit("error", "Player not found in room");
      }
    } else {
      socket.emit("error", "Room does not exist");
    }
  });
});
