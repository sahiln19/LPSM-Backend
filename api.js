var expresss = require('express');
var bodyParser = require('body-parser');
var app = expresss();
var admin = require('./admin');
var courses = require('./courses');
var subjects = require('./subjects');
var batches = require('./batches');
var faculties = require('./faculties');
var lectures = require('./lectures');
var payout = require('./payout');
var app = expresss();
app.use(expresss.json());
app.use(expresss.urlencoded({extended: true}));

const ROUTE = '/Adminlogin';
const PORT = 5000;
const courseid = '/course/:id';
const course = '/course';
const subject = '/subject'; 
const subjectid = '/subject/:id';   
const batch = '/batch';
const batchid = '/batch/:id';
const faculty = '/faculty';
const facultyid = '/faculty/:id';
const lecture = '/lecture';
const lectureid = '/lecture/:id';
const payoutid = '/payout/:id';
const payouts = '/payout';
 
//define routes
//admin login route
app.post(ROUTE, (request, response) => admin.login(request, response));

//cources routes
app.post(course, (request, response) => courses.add(request, response));
app.get(course, (request, response) => courses.select(request, response));
//
app.put(courseid, (request, response) => courses.update(request, response));
app.delete(courseid, (request, response) => courses.deleteCourse(request, response));

//subjects routes
app.post(subject, (request, response) => subjects.add(request, response));
app.get(subject, (request, response) => subjects.select(request, response));
//
app.put(subjectid, (request, response) => subjects.update(request, response));
app.delete(subjectid, (request, response) => subjects.deleteSubject(request, response));

//batches routes
 app.post(batch, (request, response) => batches.add(request, response));
 app.get(batch, (request, response) => batches.select(request, response));
//
 app.put(batchid, (request, response) => batches.update(request, response));
app.delete(batchid, (request, response) => batches.deleteBatch(request, response));

//faculties routes
app.post(faculty, (request, response) => faculties.add(request, response));
app.get(faculty, (request, response) => faculties.select(request, response));
//
app.put(facultyid, (request, response) => faculties.update(request, response));
app.delete(facultyid, (request, response) => faculties.deleteFaculty(request, response));

//lectures routes
app.post(lecture, (request, response) => lectures.add(request, response));
app.get(lecture, (request, response) => lectures.select(request, response));
// 
app.put(lectureid, (request, response) => lectures.update(request, response));
app.delete(lectureid, (request, response) => lectures.deleteLecture(request, response));

//Payout routes
app.post(payouts, (request, response) => payout.add(request, response));
app.get(payouts, (request, response) => payout.select(request, response));
//
app.put(payoutid, (request, response) => payout.update(request, response));
app.delete(payoutid, (request, response) => payout.deletePayout(request, response));

app.listen(PORT)
console.log(`Server is ready  to connect`);