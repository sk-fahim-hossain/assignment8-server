const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



const PORT = 5000;

//middlewares
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.if4agm4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});



async function run() {

    try {
        await client.connect();

        const todoCollection = client.db("taskDb").collection("todos");

        // Routes
        app.get('/', async (req, res) => {
            res.send('hello fahim')
        });
        app.get('/tasks', async (req, res) => {
            let query = {};
            if (req.query.priority) {
                query.priority = req.query.priority
            }
            const cursor = todoCollection.find(query)
            const tasks = await cursor.toArray();
            try {
                res.json(tasks);
            } catch (err) {
                console.error('Error fetching todos:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        

        

       
    }
    finally { }
}

run().catch(console.dir);








// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});