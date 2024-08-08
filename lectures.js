var connection = require('./connection')
var commoncode = require('./commoncode')

let add = (request, response) => {
    let requiredFields = ['teacher_id', 'subject_id','batch_id','duration','amount','lecture_date','payout_id']
    let missingFields = commoncode.getMissingFields(request.body, requiredFields);
    if (missingFields.length > 0) {
        response.json({
            error: 'yes',
            success: 'no',
            message: `Missing fields: ${missingFields.join(', ')}`
        });
        return;
    }
    let { teacher_id, subject_id,batch_id, time,duration,amount,lecture_date,payout_id } = request.body;
    teacher_id = connection.DB.escape(teacher_id);
    subject_id = connection.DB.escape(subject_id);
    batch_id = connection.DB.escape(batch_id);
    duration = connection.DB.escape(duration);
    amount = connection.DB.escape(amount);
    lecture_date = connection.DB.escape(lecture_date);
    payout_id = connection.DB.escape(payout_id);
    let query = `INSERT INTO lectures (teacher_id, subject_id,batch_id,duration,amount,lecture_date,payout_id) VALUES (${teacher_id}, ${subject_id},${batch_id},${duration},${amount},${lecture_date},${payout_id})`;
    connection.DB.query(query, (err,result) => {
        if (err) {
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
    })
}
let select = (request,response) => {
    let query = `SELECT * FROM lectures`;
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
                lectures: result
            });
        }
    })
}
let update = (request,response) => {
   let {id} = request.params;
   let {teacher_id, subject_id,batch_id,duration,amount,lecture_date,payout_id} = request.body;
   let requiredFields = ['teacher_id', 'subject_id','batch_id','duration','amount','lecture_date','payout_id']
   let missingFields = commoncode.getMissingFields(request.body, requiredFields);
   if(missingFields.length > 0){
       response.json({
           error: 'yes',
           success: 'no',
           message: `Missing fields: ${missingFields.join(', ')}`
       });
       return;
   }
    teacher_id = connection.DB.escape(teacher_id);
    subject_id = connection.DB.escape(subject_id);
    batch_id = connection.DB.escape(batch_id);
    duration = connection.DB.escape(duration);
    amount = connection.DB.escape(amount);
    lecture_date = connection.DB.escape(lecture_date);
    payout_id = connection.DB.escape(payout_id);
    let query = `UPDATE lectures SET teacher_id = ${teacher_id}, subject_id = ${subject_id},batch_id = ${batch_id},duration = ${duration},amount = ${amount},lecture_date = ${lecture_date},payout_id = ${payout_id} WHERE id = ${id}`;
   connection.DB.query(query, (err,result) => {
    if(err){
        response.json({
            error: 'yes',
            success: 'no',
            message: 'Something went wrong, please try again'
        });
        console.error(err);
    }
    else{
        response.json({
            error: 'no',
            success: 'yes',
            message: 'Lecture updated successfully'
        });
    }
})
}
let deleteLecture = (request,response) => {
    let {id} = request.params;
    let query = `DELETE FROM lectures WHERE id = ${id}`;
    connection.DB.query(query, (err,result) => {
        if(err){
            response.json({
                error: 'yes',
                success: 'no',
                message: 'Something went wrong, please try again'
            });
            console.error(err);
        }
        else  {
            if (result.affectedRows === 0) {
                response.json({
                    error: 'yes',
                    success:'no',
                    message:'Lecture not found'
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

module.exports.add = add
module.exports.select = select
module.exports.update = update
module.exports.deleteLecture = deleteLecture