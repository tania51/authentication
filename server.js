const express = require('express');
const mysql = require('mysql');
const cors = require('cors')


const app = express();
app.use(cors());
app.use(express.json())

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'authentication'
// })
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    waitForConnection: true,
    connectionLimit: 10,
    queueLimit: 0
})

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO login (`fullName`, `userName`, `password`) VALUES (?)";
    const values = [
        req.body.fullName,
        req.body.userName,
        req.body.password,
    ]
    db.query(sql, [values], (err, data) => {
        if(err) {
            return res.json("Error");
        }
        return res.json(data)
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE userName = ? AND password = ?";
    db.query(sql, [req.body.userName, req.body.password], (err, data) => {
        if(err) {
            return res.json("Error");
        }
        if(data.length > 0) {
            return res.json("Success")
        }
        else {
            return res.json('Failed')
        }
    })
})



app.listen(8000, () => {
    console.log('authentication backed working perfectly');
})