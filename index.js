const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware start
app.use(cors());
app.use(express.json());
// middleware end

// mongodb start


const uri = "mongodb+srv://shahadathossentamim:mOdeiyOq1aeNzGd6@cluster0.edf8g9k.mongodb.net/?retryWrites=true&w=majority";

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

    // collection db
    const doctorCollection = client.db("doctorportal").collection("doctordetails");
    const appoinmentCollection = client.db("doctorportal").collection("appoinment");

//doctor details api
app.get('/doctors',async(req,res)=>{
const result = await doctorCollection.find().toArray();
res.send(result);
})
//
//appoinment data get 
app.get('/appointment',async(req,res)=>{
 const email = req.query.email;  
   const query = { email: email };
  const result = await appoinmentCollection.find(query).toArray();
  res.send(result);
})

//Spacific A Data Read with {id} Start
app.get('/doctors/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    // DB Data r bitorar Jasob Data gula lagb ta options a patai dibo.....
    const options = {
      // Include only the `title` and `imdb` fields in the returned document
      projection: { price: 1, title: 1, appoinment_id: 1,name:1, category:1 },
    };
    const result = await doctorCollection.findOne(query,options);
    res.send(result);
}) 
//Spacific Data Read with {id} End 

//
//booking Start
app.post('/appoinment',async(req,res)=>{
 const appoinment =req.body;
 console.log(appoinment)
   const result = await appoinmentCollection.insertOne(appoinment);
   res.send(result)
});
//booking End
//

//appoinment booking api
app.patch('/appoinment/:id',async(req,res)=>{
  const id =req.params.id;
  const filter = {_id: new ObjectId(id)};
  const updatedAppoinment = req.body;
  // console.log(updatedBooking)
  const updateDoc = {
    $set: {
      status:updatedAppoinment.status
    },
  };
  const result = await appoinmentCollection.updateOne(filter,updateDoc)
  res.send(result);
})
//

    //delete User cart Items Api 
    app.delete('/appointment/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await appoinmentCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongodb end


app.get('/',(req,res)=>{
 res.send('bangladesh')
});




app.listen(port,()=>{
    console.log(`Ami kisu pari na ${port}`)
})
