var connection = require('./connection')
var commoncode = require('./commoncode');
const { request } = require('express');

let add= (request, response) => {
    let requiredFields = ['course_id', 'title', 'rate'];
    let missingFields = commoncode.getMissingFields(request.body, requiredFields);
    
    if (missingFields.length > 0) {
        response.json({
            error: 'no',
            success: 'no',
            message: `Missing fields: ${missingFields.join(', ')}`
        });
        return;
    } else {
       let { course_id, title, rate } = request.body;
        let query = `INSERT INTO subjects (course_id, title, rate) VALUES ('${course_id}', '${title}', '${rate}')`;
        connection.DB.query(query, (err, result) => {
            if(err != null){
                if(err.code == 'ER_DUP_ENTRY'){
                    response.json("[{'error' : 'yes', 'success' : 'no', 'message' : 'Subject  already exists'}]");
                }
                else{
                response.json("[{'error' : 'no', 'success' : 'no', 'message' : 'Something went wrong, please try again'}]");
                console.log(err)
            }
            }
            else{
                response.json("[{'error' : 'no', 'success' : 'yes', 'message' : 'Subject added successfully'}]");
            }
        });
       
    }
};

let select = (request, response) => {
    let query = `
        SELECT s.id, s.course_id, s.title, s.rate, c.title AS course_title
        FROM subjects s
        JOIN courses c ON s.course_id = c.id
    `;
    
    connection.DB.query(query, (err, result) => {  
        if (err) {
            response.json({
                error: 'error occurred',
                message: 'Error occurred while fetching subjects'
            });
        } else {
            response.json({
                subjects: result // Update key to match the frontend expectations
            });
        }
    });
};

let update = (request, response) => {
    let {id} = request.params;
    let {title, rate} = request.body;
    let requiredFields = ['title', 'rate'];
    let missingFields = commoncode.getMissingFields(request.body, requiredFields);
    if(missingFields.length > 0){
        response.json({
            error : 'no',
            success :'no',
            message : `Missing fields: ${missingFields.join(', ')}`
        });
        return;
    }
    
    // Sanitize inputs to prevent SQL injection
    title = connection.DB.escape(title);
    rate = connection.DB.escape(rate);
    id = connection.DB.escape(id);
    
    let query = `UPDATE subjects SET title = ${title}, rate = ${rate} WHERE id = ${id}`;
    connection.DB.query(query, (err,result) => {
        if(err){
            response.json({
                error: 'no',
                success: 'no',
                message: 'Error occurred while updating'
            });
        }
        else{
            if (result.affectedRows === 0) {
                response.json({
                    error: 'no',
                    success: 'no',
                    message: 'Subject not found'
                });
            } else {
                response.json({
                    error: 'no',
                    success: 'yes',
                    message: 'Successfully updated data'
                });
            }
        }
    })
}  

let deleteSubject = (request, response) => {
    let { id } = request.params;
    let query = `DELETE FROM subjects WHERE id = ${id}`;
    connection.DB.query(query, (err, result) => {
        if (err) {
            response.json({
                error: 'no',
                success: 'no',
                message: 'Error occurred while deleting'
            });
        } else {
            if (result.affectedRows === 0) {
                response.json({
                    error: 'no',
                    success: 'no',
                    message: 'Subject not found'
                });
            } else {
                response.json({
                    error: 'no',
                    success: 'yes',
                    message: 'Successfully deleted data'
                });
            }
        }
    });
}
let getsubject = (request, response) => {
    let { id } = request.params;
    id = connection.DB.escape(id);
    let query = `SELECT * FROM subjects WHERE id = ${id}`;
    connection.DB.query(query, (err, result) => {
        if (err) {
            response.json({
                error: 'no',
                success: 'no',
                message: 'Error occurred while fetching data'
            });
        } else {
            if (result.length === 0) {
                response.json({
                    error: 'no',
                    success: 'no',
                    message: 'Subject not found'
                });
            } else {
                response.json(result[0]);
            }
        }
    });
}

module.exports.add = add
module.exports.select = select
module.exports.update = update
module.exports.deleteSubject = deleteSubject
module.exports.getsubject = getsubject