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
  let query = `SELECT * FROM subjects`;
  connection.DB.query(query, (err, result) => {  
    if(err != null){
        response.json("[{'error':'error occured'}")
    }
    else{
        response.json(result);
    } 
});
}

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


module.exports.add = add
module.exports.select = select
module.exports.update = update
module.exports.deleteSubject = deleteSubject