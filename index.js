const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { ObjectId } = require('mongodb');
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://kiddoWarehouse:${process.env.DB_PASS}@cluster0.ywstc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        client.connect();
        const servicesCollection = client.db("kiddoWarehouse").collection('services');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service)
        })


        app.post('/services', async (req, res) => {
            const newService = req.body;
            const result = await servicesCollection.insertOne(newService);
            res.send(result);
        })

        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    name: updatedUser.name,
                    price: updatedUser.price,
                    quantity: updatedUser.quantity,
                    img: updatedUser.img,
                    description: updatedUser.description
                }
            };
            const result = await servicesCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            console.log(updatedUser);
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    quantity: updatedUser.quantity
                }
            };
            const result = await servicesCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})