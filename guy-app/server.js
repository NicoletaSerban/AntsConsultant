const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8900
require('dotenv').config()

//Declared DB variables

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'coduri-caen'

MongoClient.connect(dbConnectionStr)
    .then (client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

    //Middleware
app.set('view engine', 'ejs') //ejs e viewport for use ejs
app.use(express.static('public')) //public folder servit clientului
app.use(express.urlencoded({ extended: true })) // nu stiu
app.use(express.json()) // permite express sa parse json

//CRUD

//allow to acces our DB
app.get('/',(request,respone)=>{
    let contents = db.collection('sun').find().toArray()
    .then(data =>{
        //grab jus the name to show in our list

        let nameList = data.map(item => item.codCaen)
        console.log(nameList)
        respone.render('index.ejs', {info: nameList})
    })
    .catch(error => console.log(error))
})

// to add items
app.post('/api',(request,response)=>{
    console.log('Post Heard')
    db.collection('sun').insertOne(
        request.body
    )
    .then(result => {
        response.redirect('/')
    })
})

//update an existed item
app.put('/updateEntry',(request, response)=>{
   // console.log(request.body)

//iterate to see if body is emppty or not
Object.keys(request.body).forEach( key => {
    if (request.body[key] == null || request.body[key] == undefined  || request.body[key] == ""){
        delete request.body[key]
    }
})

  //find the item and update it
db.collection('sun').findOneAndUpdate(
    { name: request.body.name},
    {
        $set: request.body
    }
) .then(result =>{
    response.json('succes')
})
.catch(error=> console.error(error))
})

//delete item

app.delete('/deleteEntry', (request,response)=>{
   db.collection('sun').deleteOne(
        {name: request.body.name}
    )
    .then(result => {
        console.log('Entry Deleted')
        response.json('Entry Deleted')
    })
    .catch(error => console.error(error))
})

 app.listen(PORT || process.env.PORT, ()=>{
        console.log(`Server running on port ${PORT}`);
    })