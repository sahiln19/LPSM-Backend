var connection = require('./connection');   
const commoncode = require('./commoncode'); // if commoncode.js is in the same directory as admin.js


let login = (request, response) => {
   let requiredFields = ['email', 'password'];
    let missingFields = commoncode.getMissingFields(request.body, requiredFields);
    if(missingFields.length > 0){
        response.json({
            error : 'no',
            success :'no',
            message : `Missing fields: ${missingFields.join(', ')}`
        });
        return;
    }
    else {
        let {email, password} = request.body
        let query = `SELECT id FROM adminlogin WHERE email = '${email}' AND password = '${password}'`;
        connection.DB.query(query, (err, result) => {
            if(err != null){
                response.json('Error occured');
            }
            else{
                if(result.length == 0){
                    response.json("[{'error' : 'no', 'success' : 'no', 'message' : 'Invalid email or password'}]");
                }
                else{
                    response.json("[{'error' : 'no', 'success' : 'yes', 'message' : 'Login Successfully'}]");
                }
            }
        })
    }
    }
    
   
module.exports.login = login;