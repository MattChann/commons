import * as express from 'express';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as path from 'path';

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
app.post('/addUser', async (req, res) => {
    admin
        .auth()
        .verifyIdToken(req.headers.idtoken as string)
        .then(async () => {
            const user: User = req.body;
            const newDoc = users.doc(user.id);
            newDoc.set(removeId(user));
            res.send(newDoc.id);
        })
        .catch(() => {
            console.log('Authentication Error')
        });
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
// app.post('/updateUser', async (req, res) => {
//     const updatedUser: User = req.body;
//     await users.doc(updatedUser.id).update(removeId(updatedUser));
//     res.send(updatedUser.id);
// });

const filterUsers = (list: User[]): User[] => {
    const idLinks: Record<string, User> = {};
    list.map(user => {
        if (!(user.id in idLinks)) {
            idLinks[user.id] = user;
        };
    });
    console.log(idLinks);
    return Object.values(idLinks);
};

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
    const joint = [...commonInterests, ...commonClasses, ...commonClubs].filter(user => user.id !== currUser.id);
    res.send(filterUsers(joint));
});

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