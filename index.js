require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");


const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("mobileShopDb");
        const phonesCollection = db.collection("phones-collection");
        const flashSellCollection = db.collection("flashSellProducts")

        // products api
        app.get('/products', async (req, res) => {
            const result = await phonesCollection.find().toArray();
            res.send(result)
        })

        app.get('/products/:id', async (req, res) => {
            const paramId = req.params;
            const query = { _id: new ObjectId(paramId) }
            const result = await phonesCollection.findOne(query)
            res.send(result)
        })

        // flashsale api

        app.get('/products/flashsale/all', async (req, res) => {
            const result = await flashSellCollection.find().toArray()
            res.send(result)
        })


        app.get('/products/flashsale/all/:id', async (req, res) => {
            const paramId = req.params;
            console.log(paramId, 'single flashsale')
            const query = { _id: new ObjectId(paramId.id) }
            const result = await flashSellCollection.findOne(query)
            res.send(result)
        })

        app.get('/products/brands', async (req, res)=>{
            const result  = await phonesCollection.find("brand").toArray()
            res.send(result)
        })


        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } finally {
    }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
    const serverStatus = {
        message: "Server is running smoothly for Your Mobile shop",
        timestamp: new Date(),
    };
    res.json(serverStatus);
});