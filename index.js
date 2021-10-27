const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const port = 5000;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("hello");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ezfbm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(uri);

async function run() {
  try {
    await client.connect();
    //event database
    const database = client.db("volunteer_database");
    const volunteer_events = database.collection("events");
    //volunteer database
    const volunteerCollection = database.collection("volunteers");
    //GET API

    app.get("/events", async (req, res) => {
      const cursor = volunteer_events.find({});
      const events = await cursor.toArray();
      res.send(events);
    });

    //POST API
    app.post("/events", async (req, res) => {
      const newEvent = req.body;
      console.log("new event", req.body);
      const result = await volunteer_events.insertOne(newEvent);
      res.json(result);
    });
    //POST VOLUNTEER DETAILS
    app.post("/volunteer", async (req, res) => {
      const volunteer = req.body;
      const result = await volunteerCollection.insertOne(volunteer);
      console.log("hitting the voluntter details", volunteer);
      res.json(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`listening to port : ${port}`);
});

// username : fahim12
// pass : cO2q1JY4MRSnhWmQ
