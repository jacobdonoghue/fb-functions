const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
app.use(cors({ origin: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

var serviceAccount = require("./permissions.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-api-9a206..firebaseio.com",
});
const db = admin.firestore();
c
app.get("/hello-world", (req, res) => {
    console.log('hello world sent');
    return res.status(200).send("Hello World!");
});

// getLessons
app.get("/api/lessons", (req, res) => {
    
    let lessonsRef = db.collection('lessons');
    lessonsRef.where('instructor_email', '==', req.body.email)
        .get()
        .then((response) => {
            const lessons = [];
            response.forEach((res) => {
                const lesson = res.data();
                lesson.id = res.id;
                lessons.push(lesson);
            });
            return res.status(200).send({lessons: lessons});
        })
        .catch((error) => {
            return res.status(500).send({error});
        })
});

app.post("/api/create", (req, res) => {
            // console.log('res:', res);
            let body = req.body;
            /*let id = req.body.id;
            let item = req.body.item;*/
            console.log('test', body);
            db.collection("items").doc("/" + body.id + "/").create({ item: body.item })
            .then((result) => {
                return res.status(200).send();
            }).catch((error) => {
                return res.status(500).send({error})
            });
            // return res.status(200).send(body);
});

exports.app = functions.https.onRequest(app);


/* app.post('/api/create', {
    "test": "success"
}); */