var connection = require('./connection');
var commoncode = require('./commoncode');

let add = (request, response) => {
    let requiredFields = ['course_id', 'start_date', 'end_date', 'class_time'];
    let missingFields = commoncode.getMissingFields(request.body, requiredFields);
    
    if (missingFields.length > 0) {
        response.json({
            error: 'yes',
            success: 'no',
            message: `Missing fields: ${missingFields.join(', ')}`
        });
        return;
    }
    
    let { course_id, start_date, end_date, class_time } = request.body;
    
    // // Escape values to prevent SQL injection
    course_id = connection.DB.escape(course_id);
    start_date = connection.DB.escape(start_date);
    end_date = connection.DB.escape(end_date);
    class_time = connection.DB.escape(class_time);
    
    let query = `INSERT INTO batches (course_id, start_date, end_date, class_time) VALUES (${course_id}, ${start_date}, ${end_date}, ${class_time})`;
    
    connection.DB.query(query, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                response.json({
                    error: 'yes',
                    success: 'no',
                    message: 'Subject already exists'
                });
            } else {
                response.json({
                    error: 'yes',
                    success: 'no',
                    message: 'Something went wrong, please try again'
                });
                console.error(err);
            }
        } else {
            response.json({
                error: 'no',
                success: 'yes',
                message: 'Subject added successfully'
            });
        }
    });
};

let select = (request, response) => {
    let query = `SELECT * FROM batches`;
    
    connection.DB.query(query, (err, result) => {
        if (err) {
            response.json({
                error: 'yes',
                message: 'Error occurred'
            });
        } else {
            response.json(result);
        }
    }  );
}
let update = (request, response) => {   
    let {id} = request.params;
    let {start_date, end_date, class_time} = request.body;
    let requiredFields = ['start_date', 'end_date', 'class_time'];
    let missingFields = commoncode.getMissingFields(request.body, requiredFields);
    if(missingFields.length > 0){
        response.json({
            error : 'yes',
            success :'no',
            message : `Missing fields: ${missingFields.join(', ')}`
        });
        return;
    }
    
    // Sanitize inputs to prevent SQL injection
    
    start_date = connection.DB.escape(start_date);
    end_date = connection.DB.escape(end_date);
    class_time = connection.DB.escape(class_time);
    
    let query = `UPDATE batches SET start_date = ${start_date}, end_date = ${end_date}, class_time = ${class_time} WHERE id = ${id}`;
    
    connection.DB.query(query, (err, result) => {
        if(err){
            response.json({
                error : 'yes',
                success :'no',
                message : 'Something went wrong, please try again'
            });
            console.error(err);
        } else {
            response.json({
                error : 'no',
                success :'yes',
                message : 'Batch updated successfully'
            });
        }
    });
}
let deleteBatch = (request, response) => {
    let { id } = request.params;
    let query = `DELETE FROM batches WHERE id = ${id}`;
    connection.DB.query(query, (err, result) => {
        if (err) {
            response.json({
                error: 'yes',
                success: 'no',
                message: 'Error occurred while deleting'
            });
            console.error(err);
        } else {
            if (result.affectedRows === 0) {
                response.json({
                    error: 'yes',
                    success:'no',
                    message:'Batches not found'
                });
            } else {
                response.json({
                    error: 'no',
                    success: 'yes',
                    message: 'Successfully deleted Data'
                });
            }
        }
    });
}

module.exports.add = add;
module.exports.select = select;
module.exports.update = update;
module.exports.deleteBatch = deleteBatch;