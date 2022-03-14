const { response } = require('express');
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
    const flash = req.session.flash;
    const flashcolor = req.session.flashcolor;
    console.log(flash);
    req.session.flash = null;
    req.session.flashcolor = null;
    await pool.promise()
        .query('SELECT * FROM tasks')
        .then(([rows, fields]) => {
            res.render('tasks.njk', {
                flash: flash,
                flashcolor: flashcolor,
                tasks: rows,
                title:  'Tasks',
                layout: 'layout.njk'
            })
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

/* POST a new task */
router.post('/', async (req, res, next) => {
    const sql = 'INSERT INTO tasks (task,taskInfo) VALUES (?,?)'; 
    const task = req.body.task;
    const taskInfo = req.body.taskInfo
    if (task.length < 3) {
        res.status(400).json({
            tasks: {
                error: "Invalid task"
            }
        });
    } else if (taskInfo.length < 3) {
        res.status(400).json({
            tasks: {
                error: "Invalid task"
            }
        });
    }
    await pool.promise()
    .query(sql, [task, taskInfo])
    .then((response) => {
        if (response[0].affectedRows==1) {
            req.session.flash = 'Task: [' + task + "] successfully posted";
            req.session.flashcolor = 'success';
        res.redirect('/tasks');
        } else {
            res.status(400).json({
                tasks: {
                    error: "Invalid task"
                }
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            tasks: {
                error: "Cannot retrieve tasks"
            }
        });
    });
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
        .query('SELECT * FROM tasks WHERE id = ?', [id])
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

router.get('/:id/delete', async (req, res, next) => {
    const id = req.params.id;
    await pool.promise()
        .query('DELETE from tasks WHERE id = ?', [id])
        .then((response) => {
            if (response[0].affectedRows==1) {
            req.session.flash = 'Task deleted';
            req.session.flashcolor = 'success';
            res.redirect('/tasks');
            } else {
            req.session.flash = 'Task not found';
            req.session.flashcolor = 'danger';
            res.status(400).redirect('/tasks');
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                tasks: {
                    error: 'Error getting tasks'
                }
            })
        })
})
router.post('/:id/complete', async (req, res, next) => {
    const id = req.params.id;
    await pool.promise()
        .query('update tasks SET completed = !completed, updated_at=now() WHERE id = ?', [id])
        .then(() => {
            res.redirect('/tasks');
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                tasks: {
                    error: 'Error getting tasks'
                }
            })
        })


})

router.post('/:id/update', async (req, res, next) => {
    const id = req.params.id
    const state = req.body.completed;
    await pool.promise()
        .query('update tasks SET completed = ?, updated_at=now() where id = ?', [state, id])
        .then((response) => {
            res.json({
                task: {
                    data: response
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


})



module.exports = router;
