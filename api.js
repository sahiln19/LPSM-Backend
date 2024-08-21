var express = require('express');
var bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
var path = require('path');
var mysql = require('mysql2');
var cors = require('cors');
var app = express();
var admin = require('./admin');
var courses = require('./courses');
var subjects = require('./subjects');
var batches = require('./batches');
var teachers = require('./teachers');
var lectures = require('./lectures');
var payout = require('./payout');
const multer = require('multer');
var app = express();
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const ROUTE = '/Adminlogin';
const PORT = 5000;
const courseid = '/course/:id';
const course = '/course';
const subject = '/subject'; 
const subjectid = '/subject/:id';   
const batch = '/batch';
const batchid = '/batch/:id';
const teacher = '/teacher';
const teacherid = '/teacher/:id';
const lecture = '/lecture';
const payouts = '/payout';
const reports = '/report';

app.get('images/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'images', filename);
    res.sendFile(filepath);
});


// Configure multer storage
cloudinary.config({
    cloud_name: 'dymj26viu',
    api_key: '331185753794371',
    api_secret: 'MT4eMEs_d2qsD8KEYxogqh14Cms',
  });
  
  // Configure multer to use Cloudinary storage
  const storages = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'teachers', // Optional: Specify a folder in Cloudinary
      allowed_formats: ['jpg', 'png', 'jpeg','png','webp','bmp'], // Specify allowed image formats
    },
  });
  
  const uploads = multer({ storage: storage });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = "images/";
        cb(null, path);
        console.log('Destination:', file);
    },
    filename: function (req, file, cb) {
        let uniqueFileName = file.fieldname + "-" + Date.now() + path.extname(file.originalname).toLowerCase();
        cb(null, uniqueFileName);
        console.log('Filename:', uniqueFileName);
    },
});

// Set up multer with limits and file filter
const maxSize = 1 * 1024 * 1024; // 1 MB
var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
        var filetypes = /jpeg|jpg|png|webp|bmp/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
    },
});

//define routes
//admin login route
app.post(ROUTE, (request, response) => admin.login(request, response));

//cources routes
app.post(course, (request, response) => courses.add(request, response));
app.get(course, (request, response) => courses.select(request, response));
//
app.put(courseid, (request, response) => courses.update(request, response));
app.get(courseid, (request, response) => courses.getcourse(request, response));
app.delete(courseid, (request, response) => courses.deleteCourse(request, response));

//subjects routes
app.post(subject, (request, response) => subjects.add(request, response));
app.get(subject, (request, response) => subjects.select(request, response));
//
app.put(subjectid, (request, response) => subjects.update(request, response));
app.get(subjectid, (request, response) => subjects.getsubject(request, response));
app.delete(subjectid, (request, response) => subjects.deleteSubject(request, response));

//batches routes
 app.post(batch, (request, response) => batches.add(request, response));
 app.get(batch, (request, response) => batches.select(request, response));
//
 app.put(batchid, (request, response) => batches.update(request, response));
 app.get(batchid, (request,response) => batches.getbatch(request,response))
app.delete(batchid, (request, response) => batches.deleteBatch(request, response));

//faculties routes
app.post(teacher, upload.single("photo"), (request, response) => teachers.add(request, response));
app.get(teacher, (request, response) => teachers.select(request, response));
//
app.put(teacherid,upload.single('photo'), (request, response) => teachers.update(request, response));
app.get(teacherid, (request, response) => teachers.getteacher(request, response));
// app.post(teacher, upload.single('photo'), (request, response) => teachers.add(request, response));
app.delete(teacherid, (request, response) => teachers.deleteTeacher(request, response));

//lectures routes
app.post(lecture, (request, response) => lectures.add(request, response));
app.get(lecture, (request, response) => lectures.select(request, response));


//Payout routes
app.post(payouts, (request, response) => payout.add(request, response));
app.get(payouts, (request, response) => payout.select(request, response));
//
//report routes
app.post(reports, (request, response) => reports.add(request, response));

app.listen(PORT)
console.log(`Server is ready  to connect`);