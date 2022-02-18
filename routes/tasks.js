var express = require('express');
var router = express.Router();
const pool = require('../database');

/*
    BASE URL /tasks
    GET / - Get all tasks
    POST / - create a new task
    GET /:id - get task by id
    PUT /:id - update a task by id
    DELETE /:id - deleta a task by id
*/
router.get('/', async (req, res, next) => {
    await pool.promise()
        .query('SELECT * FROM tasks')
        .then(([rows, fields]) => {
            res.json({
                tasks: {
                    data: rows
                }
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                tasks: {
                    error: 'Error getting tasks'
                }
            })
        })
});

/* GET a form for posting a new task  */
router.get('/new',
  (req, res, next) => {
    let  data = {
        message: 'Post a new task',
        layout:  'layout.njk',
        title: 'Post a new task'
    }
    res.render('tasksform.njk', data);
});

/* POST a new task */
router.post('/',
  async (req, res, next) => {
    const sql = 'INSERT INTO tasks (task) VALUES (?)';
    const result = await pool.promise()
    .query(sql, [req.body.task])
    .catch(err => {
        console.log(err);
        res.status(500).json({
            tasks: {
                error: "Cannot retrieve tasks"
            }
        });
    });
    res.redirect('/tasks');
});

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;

    if (isNaN(req.params.id)) {
        res.status(400).json({
            task : {
                error: 'Bad request'
            }
        })
    } else {
        await pool.promise()
        .query('SELECT * FROM tasks WHERE id = ' + id)
        .then(([rows, fields]) => {
            res.json({
                tasks: {
                    data: rows
                }
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                tasks: {
                    error: 'Error getting tasks'
                }
            })
        })
    }
});

module.exports = router;
