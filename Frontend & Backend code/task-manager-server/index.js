const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "https://task-manager-client-nine-phi.vercel.app",
      "http://localhost:5173",
    ],
  })
);
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const userCollection = client.db("taskDB").collection("users");
    const taskCollection = client.db("taskDB").collection("tasks");
 
    app.post("/jwt", async (req, res) => {
      const email = req.body;
      const token = jwt.sign(email, process.env.DB_SECRET_TOKEN, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    const verifyToken = async (req, res, next) => {
      const authorization = await req.headers.authorization;
      if (!authorization) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = authorization.split(" ")[1];
      console.log(token);
      if (token) {
        jwt.verify(token, process.env.DB_SECRET_TOKEN, (err, decoded) => {
          if (err) {
            return res.status(401).send({ message: "unauthorized access" });
          }
          req.decoded = decoded;
          next();
        });
      }
    };

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user?.email };
      const isExistEmail = await userCollection.findOne(query);
      if (isExistEmail) {
        return res.send({
          message: "email is already exist",
          insertedId: null,
        });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get("/tasks", verifyToken, async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/tasks", verifyToken, async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
    });

    app.post("/tasks", verifyToken, async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });

    app.delete("/task/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/task/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(query);
      res.send(result);
    });

    app.patch("/task/:id", verifyToken, async (req, res) => {
      const task = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          title: task?.title,
          assignTo: task?.assignTo,
          status: task?.status,
          start_date: task?.start_date,
          end_date: task?.end_date,
        },
      };
      const result = await taskCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.patch("/task-update/:id", verifyToken, async (req, res) => {
      const statusData = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const find = await taskCollection.findOne(query);
      if (find.status === statusData.status) {
        return res.send({
          message: "The status is already same",
        });
      }
      const updatedDoc = {
        $set: {
          title: find.title,
          assignTo: find.assignTo,
          status: statusData?.status || find.status,
          start_date: find.start_date,
          end_date: find.end_date,
        },
      };
      const result = await taskCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.patch("/task-status/:id", verifyToken, async (req, res) => {
      const statusData = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const find = await taskCollection.findOne(query);
      if (find.status === statusData.status) {
        return res.send({
          message: "The status is already same",
        });
      }
      const updatedDoc = {
        $set: {
          // title: find.title,
          // assignTo: find.assignTo,
          status: statusData?.updateStatus || find.status,
          // start_date: find.start_date,
          // end_date: find.end_date,
        },
      };
      // console.log(statusData, id, query, find, updatedDoc);
      const result = await taskCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.patch("/task-back-status/:id", verifyToken, async (req, res) => {
      const statusData = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const find = await taskCollection.findOne(query);
      if (find.status === statusData.status) {
        return res.send({
          message: "The status is already same",
        });
      }
      const updatedDoc = {
        $set: {
          // title: find.title,
          // assignTo: find.assignTo,
          status: statusData?.updateBackStatus || find.status,
          // start_date: find.start_date,
          // end_date: find.end_date,
        },
      };
      // console.log(statusData, id, query, find, updatedDoc);
      const result = await taskCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.get("/task-stats", verifyToken, async (req, res) => {
      const statusCount = await taskCollection
        .aggregate([
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ])
        .toArray();
      res.send(statusCount);
    });

    app.get("/task-search-filter", verifyToken, async (req, res) => {
      try {
        const { title, status, email } = req.query;
        const query = {};

        if (title) {
          query.title = { $regex: title, $options: "i" }; // Case-insensitive title search
        }

        if (status) {
          query.status = status; // Filter by task (corrected here)
        }
        if (email) {
          query.userEmail = email; // Filter by user email
        }

        // Fetch unique tasks for the dropdown filter
        const taskInfo = await taskCollection
          .find({}, { projection: { status: 1 } })
          .toArray();

        // Filter events based on query
        const result = await taskCollection.find(query).toArray();
        const tasks = [...new Set(taskInfo.map((task) => task.status))];
        res.send({ result, tasks });
        console.log(result);
      } catch (error) {
        console.error(error.name, error.message);
        res
          .status(500)
          .send({ message: "An error occurred while fetching the gallery." });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`running`);
});

app.listen(port, (req, res) => {
  console.log(`on port: ${port}`);
});
