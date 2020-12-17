import * as express from 'express';
import * as admin from 'firebase-admin';

const serviceAccount = require('./service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(express.json());

const users = db.collection('users');


type User = {
    id: string,
    name: string,
    email: string,
    photo: string,
    interests: string[],
    classes: string[],
    clubs: string[],
};

const removeId = ({name, email, photo, interests, classes, clubs}: User) => {
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
app.post('/addUser', (req, res) => {
    const user: User = req.body;
    const newDoc = users.doc(user.id);
    newDoc.set(removeId(user));
    res.send(newDoc.id);
});

// Get user info
app.get('/getUser', async (req, res) => {
    const id: string = req.query.id as string;
    users.doc(id).get()
        .then(doc => {
            const user: User = doc.data() as User;
            user.id = doc.id;
            res.send(user);
        })
        .catch((err) => res.send(null));
});

// Update a user
app.post('/updateUser', async (req, res) => {
    const updatedUser: User = req.body;
    await users.doc(updatedUser.id).update(removeId(updatedUser));
    res.send(updatedUser.id);
});

// Get recommended users
app.post('/getCommon', async (req, res) => {
    const currUser: User = req.body;
    const allDocs = await users.orderBy('name', 'asc').get();
    const allUsers: User[] = [];
    for (const doc of allDocs.docs) {
        let thisUser: User = doc.data() as User;
        thisUser.id = doc.id;
        allUsers.push(thisUser);
    };
    const commonInterests: User[] = allUsers.filter(user => user.interests.some(interest => currUser.interests.includes(interest)));
    const commonClasses: User[] = allUsers.filter(user => user.classes.some(currClass => currUser.classes.includes(currClass)));
    const commonClubs: User[] = allUsers.filter(user => user.clubs.some(club => currUser.clubs.includes(club)));
    res.send([...commonInterests, ...commonClasses, ...commonClubs].filter(user => user.id !== currUser.id));
});

// Delete a user
app.delete('/deleteUser', async (req, res) => {
    const id: string = req.query.id as string;
    await users.doc(id).delete();
    res.send('Successfully deleted user');
});



app.listen(8080, function() {
    console.log("Server started");
});