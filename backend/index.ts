import * as express from 'express';
import * as admin from 'firebase-admin';

const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(express.json());





app.listen(8080, function() {
    console.log("Server started");
});