var connection = require('./connection')
var commoncode = require('./commoncode')

let add = (request, response) => {
    // Define required fields
    let requiredFields = ['teacher_id', 'subject_id', 'batch_id', 'duration_start', 'duration_end', 'amount', 'lecture_date', 'payout_id'];
    
    // Check for missing fields
    let missingFields = commoncode.getMissingFields(request.body, requiredFields);
    if (missingFields.length > 0) {
        response.json({
            error: 'yes',
            success: 'no',
            message: `Missing fields: ${missingFields.join(', ')}`
        });
        return;
    }

    // Extract values from request body
    let { teacher_id, subject_id, batch_id, duration_start, duration_end, amount, lecture_date, payout_id } = request.body;

    // Escape values to prevent SQL injection
    teacher_id = connection.DB.escape(teacher_id);
    subject_id = connection.DB.escape(subject_id);
    batch_id = connection.DB.escape(batch_id);
    duration_start = connection.DB.escape(duration_start);
    duration_end = connection.DB.escape(duration_end);
    amount = connection.DB.escape(amount);
    lecture_date = connection.DB.escape(lecture_date);
    payout_id = connection.DB.escape(payout_id);

    // SQL query to insert data into the table
    let query = `
        INSERT INTO lectures (
            teacher_id, 
            subject_id, 
            batch_id, 
            duration_start, 
            duration_end, 
            amount, 
            lecture_date, 
            payout_id
        ) 
        VALUES (
            ${teacher_id}, 
            ${subject_id}, 
            ${batch_id}, 
            ${duration_start}, 
            ${duration_end}, 
            ${amount}, 
            ${lecture_date}, 
            ${payout_id}
        )
    `;

    // Execute the query
    connection.DB.query(query, (err, result) => {
        if (err) {
            // Handle errors
            if (err.code === 'ER_DUP_ENTRY') {
                response.json({
                    error: 'yes',
                    success: 'no',
                    message: 'Lecture already exists'
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
                message: 'Lecture added successfully'
            });
        }
    });
}


let select = (request, response) => {
    let query = `
        SELECT 
            l.id, 
            l.teacher_id, 
            l.subject_id, 
            l.batch_id, 
            l.duration_start,   /* Updated field */
            l.duration_end,     /* Updated field */
            l.amount, 
            l.lecture_date, 
            l.payout_id, 
            t.name AS teacher_name, 
            s.title AS subject_title, 
            b.batch_name AS batch_name, 
            p.remarks AS payout_remarks
        FROM lectures l
        JOIN teachers t ON l.teacher_id = t.id
        JOIN subjects s ON l.subject_id = s.id
        JOIN batches b ON l.batch_id = b.id
        JOIN payouts p ON l.payout_id = p.id
    `;

    connection.DB.query(query, (err, result) => {
        if (err) {
            console.error('Database Query Error:', err);
            response.json({
                error: 'yes',
                message: 'Error occurred while fetching lectures'
            });
        } else {
            response.json({
                lectures: result
            });
        }
    });
}








module.exports.add = add
module.exports.select = select
