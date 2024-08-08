var connection = require('./connection')
var commoncode = require('./commoncode')

let add = (request, response) => {
    let requiredFields = ['name', 'mobile','photo','email', 'gender', 'qualification', 'experience'];
    let missingFields = commoncode.getMissingFields(request.body, requiredFields);
    if (missingFields.length > 0) {
        response.json({
            error: 'yes',
            success: 'no',
            message: `Missing fields: ${missingFields.join(', ')}`
        });
        return;
    }
    let { name, mobile,photo,email,gender, qualification,experience} = request.body;
    name = connection.DB.escape(name);
    mobile = connection.DB.escape(mobile);
    photo = connection.DB.escape(photo);
    email = connection.DB.escape(email)
    gender = connection.DB.escape(gender);
    qualification = connection.DB.escape(qualification);
    experience = connection.DB.escape(experience);

    let query = `INSERT INTO faculties (name, mobile,photo,email,gender,qualification,experience) VALUES (${name}, ${mobile},${photo},${email},${gender},${qualification},${experience})`;
    connection.DB.query(query, (err, result) => {
    if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            response.json({
                error: 'yes',
                success: 'no',
                message: 'Faculty already exists'
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
            message: 'Faculty added successfully'
        });
    }
})
}
let select = (request, response) => {
    let query = `SELECT * FROM faculties`;
    connection.DB.query(query, (err, result) => {
        if (err) {
            response.json({
                error: 'no',
                success: 'no',
                message: 'Something went wrong, please try again'
            });
            console.error(err);
        } else {
            response.json({            
                faculties: result
            });
        }
    });
}
let update = (request, response) => {
    let {id} = request.params;
    let {name, mobile,photo,email,gender, qualification,experience} = request.body;
    let requiredFields = ['name', 'mobile','photo','email','gender', 'qualification', 'experience'];
    let missingFields = commoncode.getMissingFields(request.body, requiredFields);
    if (missingFields.length > 0) {
        response.json({
            error: 'yes',
            success: 'no',
            message: `Missing fields: ${missingFields.join(', ')}`
        });
        return;
    }
    name = connection.DB.escape(name);
    mobile = connection.DB.escape(mobile);
    photo = connection.DB.escape(photo);
    email = connection.DB.escape(email);
    gender = connection.DB.escape(gender);
    qualification = connection.DB.escape(qualification);
    experience = connection.DB.escape(experience);

    let query = `UPDATE faculties SET name = ${name}, mobile = ${mobile},photo = ${photo}, email = ${email}, gender = ${gender}, qualification = ${qualification}, experience = ${experience} WHERE id = ${id}`;
    connection.DB.query(query, (err, result) =>{
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
let deleteFaculty = (request, response) => {
    let { id } = request.params;
    let query = `DELETE FROM faculties WHERE id = ${id}`;
    connection.DB.query(query, (err, result) => {
        if (err) {
            response.json({
                error: 'yes',
                success: 'no',
                message: 'Something went wrong, please try again'
            });
            console.error(err);
        } else  {
            if (result.affectedRows === 0) {
                response.json({
                    error: 'yes',
                    success:'no',
                    message:'Faculty not found'
                });
            } else {
                response.json({
                    error: 'no',
                    success: 'yes',
                    message: 'Successfully deleted Data'
                });
            }
        }
    })
}


module.exports.add = add;
module.exports.select = select;
module.exports.update = update;
module.exports.deleteFaculty = deleteFaculty;