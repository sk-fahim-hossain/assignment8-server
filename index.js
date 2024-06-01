const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.if4agm4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("shavy-academy").collection("user-collection");
    const classCollection = client.db("shavy-academy").collection("class-collection");
    const selectedClassCollection = client.db("shavy-academy").collection("selected-class-collection");
    const paidClassCollection = client.db("shavy-academy").collection("paid-class-collection");
    const paymentHistoryCollection = client.db("shavy-academy").collection("payment-history-collection");
   


    




    // users related api
    app.get('/users',  async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get('/users/:email',  async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === 'admin';
      }
      res.send(user);
    })
    // check user admin or not
    app.get('/users/admin/:email',  async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === 'admin';
      }
      res.send({ admin });
    })


    // creating a user
    app.post('/users', async (req, res) => {
      const user = req.body;

     
      // insert email if user doesnt exists: 
      // you can do this many ways (1. email unique, 2. upsert 3. simple checking)
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'user already exists', insertedId: null })
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.patch('/users',  async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      
      const filter = { email: user.email};
        const updatedDoc = {
          $set: {
            role: user.role
          }
        }
     
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })

    app.delete('/users/:id',  async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

    // class related apis

    app.post('/classes', async (req, res) => {
      const newClass = req.body;
      const result = await classCollection.insertOne(newClass);
      res.send(result);
    });
    app.get('/classes', async (req, res) => {
      const filter = {}
      const result = await classCollection.find(filter).toArray();
      res.send(result);
    });
  
    app.get('/classes/:email', async (req, res) => {
      const email = req.params.email;
      const filter = {instructorEmail:email}
      const result = await classCollection.find(filter).toArray();
      res.send(result);
    });
    app.patch('/classes', async (req, res) => {
      const newStatus = req.body;
      console.log(newStatus)
      const filter = { _id: new ObjectId(newStatus.id) }
      const updatedDoc = {
        $set: {
          status: newStatus.updatedStatus,
        }
      }
      const result = await classCollection.updateOne(filter, updatedDoc)
      res.send(result);
    });





//select classes Api
app.post('/selected-classes', async (req, res) => {
  const selectedClass = req.body;
  const result = await selectedClassCollection.insertOne(selectedClass);
  res.send(result);
})

app.get('/selected-classes/:email', async (req, res) => {
  const userEmail = req.params.email;
  console.log(userEmail)
  const query = {email: userEmail}

  const result = await selectedClassCollection.find(query).toArray();
  res.send(result);
})
app.patch('/selected-classes/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const updatedDoc = {
    $set: {
      paidStatus: "paid"
    }
  }

  const result = await selectedClassCollection.updateOne(filter,updatedDoc);
  res.send(result);
})
app.delete('/selected-classes/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await selectedClassCollection.deleteOne(query);
  res.send(result);
})

// 



   
    
    

      
    
    await client.db("shavy-academy").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Shavvy Academy is sitting')
})

app.listen(port, () => {
  console.log(`Shavvy Academy server is sitting on port ${port}`);
})

