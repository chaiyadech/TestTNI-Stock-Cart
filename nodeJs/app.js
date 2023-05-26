const express = require('express');
const app = express();
const cors = require('cors');

const corsOptions = {
    origin: ["http://172.20.10.5:8080"],
    optionsSuccessStatus: 200,
  };
app.use(cors());

app.use(express.json())
app.use(require("./rountes/rountes"));

app.listen(3000,(()=>{
    console.log("Server Is Running");
}))