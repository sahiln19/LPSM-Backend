var connection  = require('./connection');
const add = (request, response) => {   
    const  {start_date , end_date }  = request.body;
    const query = `
        WITH LectureDetails AS (
            SELECT
                b.batch_name,
                s.title AS subject_title,
                l.lecture_date,
                l.duration,
                l.amount
            FROM
                lectures l
                JOIN batches b ON l.batch_id = b.id
                JOIN subjects s ON l.subject_id = s.id
            WHERE
                l.lecture_date BETWEEN ? AND ?
        ),
        BatchWiseDetails AS (
            SELECT
                batch_name,
                subject_title,
                COUNT(lecture_date) AS total_lectures,
                SUM(amount) AS total_amount
            FROM
                LectureDetails
            GROUP BY
                batch_name, subject_title
        )
        SELECT
            LectureDetails.batch_name,
            LectureDetails.subject_title,
            LectureDetails.lecture_date,
            LectureDetails.duration,
            LectureDetails.amount,
            BatchWiseDetails.total_lectures,
            BatchWiseDetails.total_amount
        FROM
            LectureDetails
            JOIN BatchWiseDetails
            ON LectureDetails.batch_name = BatchWiseDetails.batch_name
            AND LectureDetails.subject_title = BatchWiseDetails.subject_title
        ORDER BY
            LectureDetails.batch_name, LectureDetails.lecture_date;
    `;

    connection.query(query, [start_date, end_date], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json(results);
        }
    });
}
    

module.exports.add = add