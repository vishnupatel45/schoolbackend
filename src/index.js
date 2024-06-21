const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


require('dotenv').config();
const password = process.env.MY_SECRET_PASSWORD;
// const connectionstring = `mongodb+srv://Vishnu45:${password}@cluster0.xeshaz2.mongodb.net/`;
const connectionstring = 'mongodb://localhost:27017';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get('/Home-alert', async (req, res) => {
    try {
        const client = await MongoClient.connect(connectionstring);
        const database = client.db('schoolApp');
        const document = await database.collection('homeAlert').find({}).toArray();
        res.send(document);
    } catch (error) {
        console.error('Error fetching home alerts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/Events', async (req, res) => {
    try {
        const client = await MongoClient.connect(connectionstring);
        const database = client.db('schoolApp');
        const documents = await database.collection('events').find({}).toArray();
        res.send(documents);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/Assignnment/:class/:section', async (req, res) => {
    const assignment = {
        Class: parseInt(req.params.class),
        Section: req.params.section,
    };
    try {
        const client = await MongoClient.connect(connectionstring);
        const database = client.db('schoolApp');
        const document = await database.collection('assignnment').find(assignment).toArray();
        res.send(document);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/teacher-profile', async (req, res) => {
    try {
        const client = await MongoClient.connect(connectionstring);
        const database = client.db('schoolApp');
        const document = await database.collection('teacherprofile').find({}).toArray();
        res.send(document);
    } catch (error) {
        console.error('Error fetching teacher profiles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/studentprofile/:class/:section/:RollNumber', async (req, res) => {
    const profile = {
        Class: parseInt(req.params.class),
        Section: req.params.section,
        RollNumber: parseInt(req.params.RollNumber)
    };
    try {
        const client = await MongoClient.connect(connectionstring);
        const database = client.db('schoolApp');
        const document = await database.collection('studentProfile').find(profile).toArray();
        res.send(document);
    } catch (error) {
        console.error('Error fetching student profiles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/studentMarks/:class/:section/:RollNumber', async (req, res) => {
    const marks = {
        class: parseInt(req.params.class),
        section: req.params.section,
        RollNumber: parseInt(req.params.RollNumber)
    };
    try {
        const client = await MongoClient.connect(connectionstring);
        const database = client.db('schoolApp');
        const document = await database.collection('Marks').find(marks).toArray();
        res.send(document);
    } catch (error) {
        console.error('Error fetching student marks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/Homework/:class/:section', async (req, res) => {
    try {
        const client = await MongoClient.connect(connectionstring);
        const database = client.db('schoolApp');
        const documents = await database.collection('Homework').find({ class: parseInt(req.params.class), section: req.params.section }).toArray();
        res.send(documents);
    } catch (error) {
        console.error('Error fetching homework:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/achivement/:class/:section/:RollNumber', async (req, res) => {
    const achivement = {
        class: parseInt(req.params.class),
        section: req.params.section,
        RollNumber: parseInt(req.params.RollNumber)
    };
    try {
        const client = await MongoClient.connect(connectionstring);
        const database = client.db('schoolApp');
        const document = await database.collection('achivement').find(achivement).toArray();
        res.send(document);
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/GetAttendance/:class/:section/:RollNumber', async (req, res) => {
    const attendance = {
        class: parseInt(req.params.class),
        Section: req.params.section,
        RollNumber: parseInt(req.params.RollNumber)
    };
    try {
        const client = await MongoClient.connect(connectionstring);
        const database = client.db('schoolApp');
        const document = await database.collection('attendance').find(attendance).toArray();
        res.send(document);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/GetGalleryImages', async (req, res) => {
    try {
        const client = await MongoClient.connect(connectionstring);
        const database = client.db('schoolApp');
        const documents = await database.collection('gallery').find({}).toArray();
        
        // Modify image paths to include the uploads directory
        const imagePaths = documents.map(doc => `/uploads/${doc.gallery}`);
        
        res.send(imagePaths);
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




app.post('/Add-homewrok', async (req, res) => {
    const HomeWork = {
        class: parseInt(req.body.Class),
        section: req.body.Section,
        Subject: req.body.Subject,
        topic: req.body.homeWork
    };
    try {
        const client = await MongoClient.connect(connectionstring);
        const database = client.db('schoolApp');
        await database.collection('Homework').insertOne(HomeWork);
        res.send('Homework is updated');
    } catch (error) {
        console.error('Error adding homework:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/Add-Achivements', async (req, res) => {
    const achivement = {
        class: parseInt(req.body.Class),
        section: req.body.Section,
        RollNumber: parseInt(req.body.RollNumber),
        title: req.body.Title,
        text: req.body.Text
    };
    try {
        const client = await MongoClient.connect(connectionstring);
        const database = client.db('schoolApp');
        await database.collection('achivement').insertOne(achivement);
        res.send('Achievement is updated');
    } catch (error) {
        console.error('Error adding achievement:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/Add-Events', async (req, res) => {
    const Events = {
        Title: req.body.EventTitle,
        Text: req.body.EventText,
        EventDate: req.body.EventDate
    };
    try {
        const client = await MongoClient.connect(connectionstring);
        const database = client.db('schoolApp');
        const existingEvent = await database.collection('events').findOne({ Title: req.body.EventTitle });
        if (existingEvent) {
            console.log('Event already exists');
            res.send('Event already exists');
        } else {
            await database.collection('events').insertOne(Events);
            res.send('Event is updated to db');
        }
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/Addto-Gallery', upload.single('galleryImage'), async (req, res) => {
    try {
        const galleryImage = req.file.filename; // Extract filename from the uploaded file
        const client = await MongoClient.connect(connectionstring);
        const database = client.db('schoolApp');
        await database.collection('gallery').insertOne({ gallery: galleryImage }); // Insert filename into the gallery field
        res.send('Photo is added to Gallery section');
    } catch (error) {
        console.error('Error adding photo to gallery:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/Addteacher-profile', async (req, res) => {
    const teacher = {
        techName: req.body.techName,
        techSubject: req.body.techSubject,
        techExperience: req.body.techExperience,
        techIntro: req.body.techIntro
    };
    try {
        const client = await MongoClient.connect(connectionstring);
        const database = client.db('schoolApp');
        const existingTeacher = await database.collection('teacherprofile').findOne({ techName: req.body.techName });
        if (existingTeacher) {
            console.log('Teacher already exists');
            res.send('Teacher already exists');
        } else {
            await database.collection('teacherprofile').insertOne(teacher);
            res.send('Teacher profile is updated');
        }
    } catch (error) {
        console.error('Error adding teacher profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(7000, () => {
    console.log('Server is started on http://127.0.0.1:7000');
});
