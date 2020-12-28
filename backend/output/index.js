"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const path = require("path");
const serviceAccount = require('./service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '../../frontend/build')));
app.use(express.json());
const users = db.collection('users');
const removeId = ({ name, email, photo, interests, classes, clubs }) => {
    return {
        name: name,
        email: email,
        photo: photo,
        interests: interests,
        classes: classes,
        clubs: clubs,
    };
};
// Create new user
app.post('/addUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    admin
        .auth()
        .verifyIdToken(req.headers.idtoken)
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.body;
        const newDoc = users.doc(user.id);
        newDoc.set(removeId(user));
        res.send(newDoc.id);
    }))
        .catch(() => {
        console.log('Authentication Error');
    });
}));
// Get user info
app.get('/getUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    users.doc(id).get()
        .then(doc => {
        const user = doc.data();
        user.id = doc.id;
        res.send(user);
    })
        .catch((err) => res.send(null));
}));
// Update a user
// app.post('/updateUser', async (req, res) => {
//     const updatedUser: User = req.body;
//     await users.doc(updatedUser.id).update(removeId(updatedUser));
//     res.send(updatedUser.id);
// });
const filterUsers = (list) => {
    const idLinks = {};
    list.map(user => {
        if (!(user.id in idLinks)) {
            idLinks[user.id] = user;
        }
        ;
    });
    console.log(idLinks);
    return Object.values(idLinks);
};
// Get recommended users
app.post('/getCommon', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currUser = req.body;
    const allDocs = yield users.orderBy('name', 'asc').get();
    const allUsers = [];
    for (const doc of allDocs.docs) {
        let thisUser = doc.data();
        thisUser.id = doc.id;
        allUsers.push(thisUser);
    }
    ;
    const commonInterests = allUsers.filter(user => user.interests.some(interest => currUser.interests.includes(interest)));
    const commonClasses = allUsers.filter(user => user.classes.some(currClass => currUser.classes.includes(currClass)));
    const commonClubs = allUsers.filter(user => user.clubs.some(club => currUser.clubs.includes(club)));
    const joint = [...commonInterests, ...commonClasses, ...commonClubs].filter(user => user.id !== currUser.id);
    res.send(filterUsers(joint));
}));
// Delete a user
// app.delete('/deleteUser', async (req, res) => {
//     const id: string = req.query.id as string;
//     await users.doc(id).delete();
//     res.send('Successfully deleted user');
// });
app.get('*', (_, response) => response.sendFile(path.join(__dirname, '../../frontend/build/index.html')));
// app.listen(8080, function() {
//     console.log("Server started");
// });
app.listen(process.env.PORT || 8080, () => console.log('Backend started'));
