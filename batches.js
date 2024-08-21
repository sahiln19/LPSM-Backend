var connection = require('./connection');
var commoncode = require('./commoncode');

let add = (request, response) => {
    let requiredFields = ['batch_name', 'course_id', 'start_date', 'end_date', 'class_time'];
    let missingFields = commoncode.getMissingFields(request.body, requiredFields);

    if (missingFields.length > 0) {
        response.json({
            error: 'yes',
            success: 'no',
            message: `Missing fields: ${missingFields.join(', ')}`
        });
        return;
    }

    let { batch_name, course_id, start_date, end_date, class_time } = request.body;

    // Use parameterized query to avoid SQL injection
    let query = `INSERT INTO batches (batch_name, course_id, start_date, end_date, class_time) VALUES (?, ?, ?, ?, ?)`;
    let values = [batch_name, course_id, start_date, end_date, class_time];

    connection.DB.query(query, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                response.json({
                    error: 'yes',
                    success: 'no',
                    message: 'Batch already exists'
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
                message: 'Batch added successfully'
            });
        }
    });
};

let select = (request, response) => {
    let query = `
        SELECT b.id,b.batch_name, b.course_id, b.start_date, b.end_date, b.class_time, c.title AS course_title
       FROM batches b
       JOIN courses c ON b.course_id = c.id
 
    `;
    
    connection.DB.query(query, (err, result) => {
        if (err) {
            response.json({
                error: 'yes',
                message: 'Error occurred'
            });
        } else {
            response.json({
                batches: result // Update key to match the frontend expectations
            });
        }
    });
};

let update = (request, response) => {
    let { id } = request.params;
    let { batch_name, start_date, end_date, class_time } = request.body;
    
    console.log("Received data:", {batch_name, start_date, end_date, class_time }); // Log received data
  
    // Sanitize inputs
    start_date = connection.DB.escape(start_date);
    end_date = connection.DB.escape(end_date);
    class_time = connection.DB.escape(class_time);
    
    let query = `UPDATE batches SET batch_name = ${batch_name}, start_date = ${start_date}, end_date = ${end_date}, class_time = ${class_time} WHERE id = ${id}`;
    
    connection.DB.query(query, (err, result) => {
      if (err) {
        response.json({
          error: 'yes',
          success: 'no',
          message: 'Something went wrong, please try again'
        });
        console.error(err);
      } else {
        response.json({
          error: 'no',
          success: 'yes',
          message: 'Batch updated successfully'
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
let getbatch = (request, response) => {
    let { id } = request.params;
    let query = `SELECT * FROM batches WHERE id = ${id}`;
    connection.DB.query(query, (err, result) => {
        if (err) {
            response.json({
                error: 'yes',
                message: 'Error occurred'
            });
        } else {
            if (result.length === 0) {
                response.json({
                    error: 'yes',
                    message: 'Batch not found'
                });
            } else {
                response.json(result[0]);
            }
        }
    });
}
module.exports.add = add;
module.exports.select = select;
module.exports.update = update;
module.exports.deleteBatch = deleteBatch;
module.exports.getbatch = getbatch;