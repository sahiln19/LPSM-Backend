var connection = require('./connection')
// teachers.js
const cloudinary = require('cloudinary').v2;
var commoncode = require('./commoncode')

const add = async (request, response) => {
    let requiredFields = ['name', 'mobile', 'email', 'gender', 'qualification', 'experience'];
    let missingFields = commoncode.getMissingFields(request.body, requiredFields);
    if (missingFields.length > 0) {
        response.json({
            error: 'yes',
            success: 'no',
            message: `Missing fields: ${missingFields.join(', ')}`
        });
        return;
    }

    let { name, mobile, email, gender, qualification, experience } = request.body;

    // Check if the file is uploaded
    if (!request.file) {
        response.json({
            error: 'yes',
            success: 'no',
            message: 'Photo is required'
        });
        return;
    }

    // Upload photo to Cloudinary
    try {
        const result = await cloudinary.uploader.upload(request.file.path, {
            folder: 'teachers',
            use_filename: true,
            unique_filename: false,
        });

        // Get the URL of the uploaded image
        const photoUrl = result.secure_url;

        // Save the teacher data along with the Cloudinary URL
        const query = `INSERT INTO teachers (name, mobile, photo, email, gender, qualification, experience) VALUES (
            ${connection.DB.escape(name)},
            ${connection.DB.escape(mobile)},
            ${connection.DB.escape(photoUrl)},
            ${connection.DB.escape(email)},
            ${connection.DB.escape(gender)},
            ${connection.DB.escape(qualification)},
            ${connection.DB.escape(experience)}
        )`;

        connection.DB.query(query, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    response.json({
                        error: 'yes',
                        success: 'no',
                        message: 'Teacher already exists'
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
                    message: 'Teacher added successfully'
                });
            }
        });

    } catch (uploadError) {
        response.json({
            error: 'yes',
            success: 'no',
            message: 'Failed to upload photo to Cloudinary'
        });
        console.error(uploadError);
    }
}

let select = (request, response) => {
    let query = `SELECT * FROM teachers`;
    connection.DB.query(query, (err, result) => {
        if (err) {
            response.json({
                error: 'no',
                success: 'no',
                message: 'Something went wrong, please try again'
            });
            console.error(err);
        } else {
            console.log(result); // Add this line to inspect the data
            response.json({            
                teachers: result
            });
        }
    });
}

const update = async (request, response) => {
    // Log the request body to see what's being received
    console.log('Request Body:', request.body);
    console.log('Uploaded File:', request.file);

    let { id } = request.params;
    let { name, mobile, email, gender, qualification, experience } = request.body;

    let requiredFields = ['name', 'mobile', 'email', 'gender', 'qualification', 'experience'];
    let missingFields = requiredFields.filter(field => !request.body[field]);

    if (missingFields.length > 0) {
        response.json({
            error: 'yes',
            success: 'no',
            message: `Missing fields: ${missingFields.join(', ')}`
        });
        return;
    }

    id = connection.DB.escape(id);
    name = connection.DB.escape(name);
    mobile = connection.DB.escape(mobile);
    email = connection.DB.escape(email);
    gender = connection.DB.escape(gender);
    qualification = connection.DB.escape(qualification);
    experience = connection.DB.escape(experience);

    let photoQuery = "";
    if (request.file && request.file.path) {
        try {
            // Upload the file to Cloudinary
            const result = await cloudinary.uploader.upload(request.file.path, {
                folder: 'teachers',
                use_filename: true,
                unique_filename: false,
            });

            const photoUrl = connection.DB.escape(result.secure_url);
            photoQuery = `, photo = ${photoUrl}`;
        } catch (uploadError) {
            response.json({
                error: 'yes',
                success: 'no',
                message: 'Failed to upload photo to Cloudinary'
            });
            console.error(uploadError);
            return;
        }
    }

    let query = `UPDATE teachers SET name = ${name}, mobile = ${mobile}, email = ${email}, gender = ${gender}, qualification = ${qualification}, experience = ${experience} ${photoQuery} WHERE id = ${id}`;

    connection.DB.query(query, (err, result) => {
        if (err) {
            response.json({
                error: 'yes',
                success: 'no',
                message: 'Error occurred while updating',
                details: err
            });
        } else {
            if (result.affectedRows === 0) {
                response.json({
                    error: 'yes',
                    success: 'no',
                    message: 'Teacher not found'
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

let deleteTeacher = (request, response) => {
    let { id } = request.params;
    let query = `DELETE FROM teachers WHERE id = ${id}`;
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
const getteacher = (request, response) => {
    let { id } = request.params;
    let query = `SELECT * FROM teachers WHERE id = ${id}`;
    connection.DB.query(query, (err, result) => {
        if (err) {
            response.json({ error: 'Error fetching teacher details' });
        } else {
            response.json(result[0]); // Ensure ke pehla element return kare chhe jo result array hoi
        }
    });
}


module.exports.add = add;
module.exports.select = select;
module.exports.update = update;
module.exports.deleteTeacher = deleteTeacher;
module.exports.getteacher = getteacher;