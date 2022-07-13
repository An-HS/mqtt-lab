const express = require("express");
const http = require("http");
var cors = require("cors");
var mqtt = require("mqtt");
const { CLIENT_RENEG_LIMIT } = require("tls");
const app = express();

var serverPort = 8282;

var server = http.createServer(app);

//set the template engine ejs

app.use(cors());

//middlewares
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.type("text/plain");
  res.status(200).send("YOLO");
});

server.listen(serverPort, () => {
  console.log("ssh websocket server started");
});


/*
mqtt init
*/ 

// mqtt 的基本設定
//var client = mqtt.connect("mqtt://localhost:1883");
var client = mqtt.connect("mqtt://localhost:1883", {
  username: "an",
  password: "1111",
});

// 建立 mqtt 連線並 subscribe topic "test"
client.on("connect", function () {
  console.log("MQTT CONNECTION START");
  client.subscribe("monosparta/chat");
});

/*// 設定接收訊息的函數, { qos: 0 }
client.on("message", function (topic, message) {
  console.log(message.toString())
});*/


const io = require("socket.io")(server);

io.on("connection", function (socket) {
  //console.log("user connect")
  socket.on("disconnect", function () {
    
  });
  socket.on("chat", function (msg) {
    // 從 client 收到訊息時，使用 topic "test" 傳送訊息到 mqtt broker
    //console.log(msg);
    client.publish("monosparta/chat", JSON.stringify(msg));
  });
  /*try {
    //以 test 發送訊息給監聽的 client 
    socket.emit(topic, JSON.parse(msg));
  } catch {
    socket.emit("data", "Node not found.");
  }*/
  client.on("message", function (topic, message) {
    socket.emit("chat", JSON.parse(message));
    //console.log(message.toString());
  });
});




