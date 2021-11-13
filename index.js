const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())

//mongo server link
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ffrq.mongodb.net/myFirstDatabase?
retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//run funtion
async function run() {
    try {

        //database
        await client.connect();
        const database = client.db("foodMaster");
        const usersCollection = database.collection("hero");
        const ordersCollection = database.collection("orders");
        const adminsCollection = database.collection("admin");
        const reviewCollection = database.collection("review");

        // server all user product
        app.get('/homepageProduct', async(req, res) => {
            const curser = usersCollection.find({}).limit(6)
            const users = await curser.toArray()
            res.send(users)
        })


        app.get('/exploreProduct', async(req, res) => {
            const curser = usersCollection.find({})
            const users = await curser.toArray()
            res.send(users)
        })

        // server specific user product
        app.get('/showusers/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await usersCollection.findOne(query)
            res.json(result)
        })

        // server product add
        app.post('/addProduct', async(req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser)
            res.json(result)
        })

        // home service button
        app.post('/buynow', async(req, res) => {
            const buy = req.body;
            const result = await ordersCollection.insertOne(buy)
            res.json(result)
        })

        // home service button user product show
        app.get('/myOrders', async(req, res) => {
            const curser = ordersCollection.find({})
            const users = await curser.toArray()
            res.send(users)
        })
        
        // home service button user product delete
        app.delete('/myOrders/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result =  await ordersCollection.deleteOne(query)
            res.send(result)
        })

        app.delete('/exploreProduct/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result =  await usersCollection.deleteOne(query)
            res.send(result)
        })

        // status update
        app.put("/updateStatus/:id", (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body.status;
            const filter = { _id: ObjectId(id) };
            ordersCollection
                .updateOne(filter, {
                $set: { status: updatedStatus },
                })
                .then((result) => {
                res.send(result);
                });
        });


        app.get('/review', async(req, res) => {
            const curser = reviewCollection.find({})
            const users = await curser.toArray()
            res.send(users)
        })


        app.post("/addReview", async (req, res) => {
            const result = await reviewCollection.insertOne(req.body);
            res.send(result);
        });


        app.post("/addUserInfo", async (req, res) => {
            console.log("req.body");
            const result = await adminsCollection.insertOne(req.body);
            res.send(result);
            console.log(result);
        });

        app.put("/makeAdmin", async (req, res) => {
            const filter = { email: req.body.email };
            const result = await adminsCollection.find(filter).toArray();



            if (result) {
              const documents = await adminsCollection.updateOne(filter, {
                $set: { role: "admin" },
              });
            //   console.log(documents);
            }
            else {
              const role = "admin";
              const result3 = await adminsCollection.insertOne(req.body.email, {
                role: role,
                $set: {email: result3}
              });
            }
        
            // console.log(result);
        });

          app.get("/makeAdmin/:email", async (req, res) => {
            const result = await adminsCollection
              .find({ email: req.params.email })
              .toArray();
            console.log(result);
            res.send(result);
          });
        
        
        } finally {
        // await client.close();
        }
    }

    // run function call
run().catch(console.dir);

// default 
app.get('/', (req, res) => {
    res.send('Travel Tour Agency');
})

//port
app.listen(port, () => {
    console.log('agency server running', port)
})