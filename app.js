const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./util/database");

//Model
const User = require("./models/User");
const Message = require("./models/Message");
const Group = require("./models/Group");
const GroupUser = require("./models/GroupUser");

// Route
const userRoutes = require("./routes/UserRoutes");
const messageRoutes = require("./routes/MesaageRoutes");
const groupRoutes = require("./routes/GroupRoutes");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://192.168.0.108:5500",
  },
});

// app.use(cors());
app.use(
  cors({
    origin: "http://192.168.0.108:5500",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, //for cookies should not block
  })
);

app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(userRoutes);
app.use(messageRoutes);
app.use(groupRoutes);

User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

User.belongsToMany(Group, { through: GroupUser });
Group.belongsToMany(User, { through: GroupUser });

// {force:true}
sequelize
  .sync()
  .then((result) => {
    server.listen(3000);
    // app.listen(process.env.PORT || 3000);
  })
  .catch((e) => console.log(e));

io.on("connection", (socket) => {
  socket.on("send-chat-message", (message, username) => {
    //when client emit it send response
    console.log("msg ", message);
    const a = socket.broadcast.emit("chat-message", {
      message: message,
      username: username,
    }); //send all client except current client
    console.log(a);
  });
});
