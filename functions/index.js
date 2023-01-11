const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
 exports.helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
 });

exports.isLoggedIn = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Not logged in");
});

exports.postcomments = functions.https.onRequest((request, response) => {

    const currentTime = admin.firestore.Timestamp.now();
    request.body.timestamp = currentTime;

    admin.firestore().collection('comments').add(request.body).then(()=>{
       response.send("Saved in the database");
    });
});

exports.getcomments = functions.https.onRequest((request, response) =>
{
// 1. Connect to our Firestore database
    let myData = []
    admin.firestore().collection('comments').orderBy('timestamp').get().then((snapshot) => {
        if (snapshot.empty) {
            console.log('No matching documents.');
            response.send('No data in database');
            return;
        }
        snapshot.forEach(doc => {
            myData.push(doc.data());
        });
// 2. Send data back to client
        response.send(myData);
    })
});


