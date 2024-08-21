var connection = require('./connection');   
const commoncode = require('./commoncode'); // if commoncode.js is in the same directory as admin.js


let login = (request, response) => {
    let requiredFields = ['email', 'password'];
    let missingFields = commoncode.getMissingFields(request.body, requiredFields);

    if (missingFields.length > 0) {
        // Respond with missing fields
        response.json({
            error: 'yes',
            success: 'no',
            message: `Missing fields: ${missingFields.join(', ')}`
        });
        return;
    }

    let { email, password } = request.body;
    let query = `SELECT id FROM adminlogin WHERE email = ? AND password = ?`;
    
    // Use parameterized queries to prevent SQL injection
    connection.DB.query(query, [email, password], (err, result) => {
        if (err) {
            // Handle database error
            response.status(500).json({
                error: 'yes',
                success: 'no',
                message: 'Error occurred while processing your request'
            });
            return;
        }

        if (result.length === 0) {
            // Invalid email or password
            response.json({
                error: 'yes',
                success: 'no',
                message: 'Invalid email or password'
            });
        } else {
            // Successful login
            response.json({
                error: 'no',
                success: 'yes',
                message: 'Login successfully'
            });
        }
    });
}

   
module.exports.login = login;