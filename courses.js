var connection = require('./connection');
var commoncode  = require('./commoncode');


let add = (request, response) => {
    let requiredFields = ['title', 'fees', 'duration', 'description'];
    let missingFields = commoncode.getMissingFields(request.body, requiredFields);
    
    if(missingFields.length > 0){
        response.json({
            error: 'no',
            success: 'no',
            message: `Missing fields: ${missingFields.join(', ')}`
        });
        return;
    } else {
        let { title, fees, duration, description } = request.body;
        let query = `INSERT INTO courses (title, fees, duration, description) VALUES (?, ?, ?, ?)`;
        let values = [title, fees, duration, description];
        
        connection.DB.query(query, values, (err, result) => {
            if(err != null){
                if(err.code == 'ER_DUP_ENTRY'){
                    response.json("[{'error' : 'yes', 'success' : 'no', 'message' : 'Course already exists'}]");
                } else {
                    response.json("[{'error' : 'no', 'success' : 'no', 'message' : 'Something went wrong, please try again'}]");
                    console.log(err);
                }
            } else {
                response.json("[{'error' : 'no', 'success' : 'yes', 'message' : 'Course added successfully'}]");
            }
        });
    }
};

let select = (request, response) => {
    let query = `SELECT * FROM courses`;
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
    let { id } = request.params;
    let { title, fees, duration, description } = request.body;
    let requiredFields = ['title', 'fees', 'duration', 'description'];
    let missingFields = commoncode.getMissingFields(request.body, requiredFields);
    if(missingFields.length > 0){
        response.json({
            error: 'yes',
            success: 'no',
            message: `Missing fields: ${missingFields.join(', ')}`
        });
        return;
    }

    let query = `UPDATE courses SET title = ?, fees = ?, duration = ?, description = ? WHERE id = ?`;
    let values = [title, fees, duration, description, id];

    console.log("Executing query:", query);
    console.log("With values:", values);

    connection.DB.query(query, values, (err, result) => {
        if (err) {
            console.log("Database error:", err);
            response.json({
                error: 'yes',
                success: 'no',
                message: 'Error occurred while updating'
            });
        } else {
            if (result.affectedRows === 0) {
                response.json({
                    error: 'no',
                    success: 'no',
                    message: 'Course not found'
                });
            } else {
                response.json({
                    error: 'no',
                    success: 'yes',
                    message: 'Successfully updated data'
                });
            }
        }
    });
};


let deleteCourse = (request, response) => {
    let { id } = request.params;
    id = connection.DB.escape(id);

    let query = `DELETE FROM courses WHERE id = ${id}`;
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
                    message: 'Course not found'
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

let getcourse = (request, response) => {
    let { id } = request.params;
    id = connection.DB.escape(id);

    let query = `SELECT * FROM courses WHERE id = ${id}`;
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
                    message: 'Course not found'
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
module.exports.deleteCourse = deleteCourse;
module.exports.getcourse = getcourse;
