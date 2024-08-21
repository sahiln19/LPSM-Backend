var connection = require('./connection')
var commoncode = require('./commoncode')

let add = (request,response) =>{
 let requiredFields = ['teacher_id', 'order_date', 'remarks', 'start_date', 'end_date'];
 let missingFields = commoncode.getMissingFields(request.body, requiredFields);
 if(missingFields.length > 0){
     response.json({
         error: 'yes',
         success: 'no',
         message: `Missing fields: ${missingFields.join(', ')}`
     });
     return;
 }
 let {teacher_id, order_date, remarks, start_date, end_date} = request.body;
    teacher_id = connection.DB.escape(teacher_id);
    order_date = connection.DB.escape(order_date);
    remarks = connection.DB.escape(remarks);
    start_date = connection.DB.escape(start_date);
    end_date = connection.DB.escape(end_date);
    let query = `INSERT INTO payouts (teacher_id, order_date, remarks, start_date, end_date) VALUES (${teacher_id}, ${order_date}, ${remarks}, ${start_date}, ${end_date})`;
    connection.DB.query(query, (err,result) => {
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
    let query = `
        SELECT p.id, p.teacher_id, p.order_date, p.remarks, p.start_date, p.end_date, t.name AS teacher_name
        FROM payouts p
        JOIN teachers t ON p.teacher_id = t.id
    `;
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
                payout: result
            });
        }
    });
};




module.exports.add = add
module.exports.select = select
