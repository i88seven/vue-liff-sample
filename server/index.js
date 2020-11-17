const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const cors = require('cors');
const app = express();
const port = 3000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to LIFF Todo App API!');
});

app.post('/api/tasks', (req, res) => {
  const { title, description, status, deadline, userId } = req.body;
  const tasks = db.get(`tasks.${userId}`).value();
  const latestId = db.get(`id.${userId}`).value();
  let newTask = {};
  console.log(tasks);
  if (tasks) {
    newTask = {
      id: latestId + 1,
      title,
      description,
      status,
      deadline,
    };
    db.get(`task.${userId}`).push(newTask).write();
    db.set(`id.${userId}`, latestId + 1).write();
  } else {
    newTask = {
      id: 1,
      title,
      description,
      status,
      deadline,
    };
    db.set(`tasks.${userId}`, [newTask]).write();
    db.set(`id.${userId}`, newTask.id).write();
  }
  res.send(newTask);
});

app.get('/api/tasks/:userId', (req, res) => {
  const userId = req.params.userId;
  const tasks = db.get(`tasks.${userId}`).value() || [];
  res.send({
    tasks: tasks,
  });
})

app.put('/api/tasks', (req, res) => {
  const { id, title, description, status, deadline, userId } = req.body;
  db.get(`tasks.${userId}`)
    .find({ id: id })
    .assign({
      title,
      description,
      status,
      deadline,
    })
    .write();
  res.send('update task success');
})

app.listen(port, () => console.log(`LIFF Todo Api API listening at http://localhost:${port}`));