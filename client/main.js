const API_HOST = ''; // Set host
const LIFF_ID = ''; // Set liff id
const statusJA = {
  backlog: '未着手',
  doing: '実行中',
  done: '完了',
  archive: '非表示',
};

Vue.component('todo', {
  props: { appName: String },
  data: function () {
    return {
      tasks: [],
      title: '',
      description: '',
      status: '',
      deadline: '',
      userId: '',
    };
  },
  template: `
  <div>
    <h3>{{appName}}</h3>
    <p>{{userId}}</p>
    <table>
      <tr>
        <th>タスクID</th>
        <th>タイトル</th>
        <th>詳細</th>
        <th>状態</th>
        <th>期限</th>
      </tr>
      <tr v-for="(task, index) in tasks" v-bind:key="index" v-show="task.status !== 'archive'">
        <td>{{task.id}}</td>
        <td>{{task.title}}</td>
        <td>{{task.description}}</td>
        <td>{{task.status | convertStatusJA}}</td>
        <td>{{task.deadline}}</td>
        <button @click="changeStatus(task.id, getNextStatus(task.status))">{{ getButtonText(task.status) }}</button>
      </tr>
    </table>
    <hr/>
    タイトル:<input type="text" v-model="title" @keydown.enter="addTask"><br>
    詳細:<input type="text" v-model="description" @keydown.enter="addTask"><br>
    期限:<input type="date" v-model="deadline" @keydown.enter="addTask"><br>
    <button @click="addTask">新規タスク作成</button>
  </div>
  `,
  created: function () {
    liff.init({ liffId: LIFF_ID }).then(() => {
      liff.getProfile().then((profile) => {
        this.userId = profile.userId;
        self.getTasks();
      });
    });
  },
  methods: {
    getTasks() {
      fetch(`${API_HOST}/api/tasks/${this.userId}`, { method: 'GET' })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        this.tasks = jsonResponse.tasks;
      });
    },
    addTask(event) {
      if (event.keycode !== 13 && event.type !== 'click') return;
      if (!this.title) {
        alert('Please input task title');
        return;
      }
      const newTask = { title: this.title, description: this.description, status: 'backlog', deadline: this.deadline, userId: this.userId }
      fetch(`${API_HOST}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        this.tasks.push(jsonResponse);
        this.resetInput();
      });
    },
    resetInput() {
      this.title = '';
      this.description = '';
      this.deadline = '';
    },
    changeStatus(id, status) {
      task = this.tasks.find((task) => task.id === id);
      task.status = status;
      task.userId = this.userId;
      fetch(`${API_HOST}/api/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })
    },
    getButtonText(status) {
      switch (status) {
        case 'backlog':
          return '着手する';
        case 'doing':
          return '完了！';
        case 'done':
          return '非表示にする';
        default:
          return '';
      }
    },
    getNextStatus(status) {
      switch (status) {
        case 'backlog':
          return 'doing';
        case 'doing':
          return 'done';
        case 'done':
          return 'archive';
        default:
          return '';
      }
    },
  },
  filters: {
    convertStatusJA(status) {
      if (status in statusJA) {
        return statusJA[status];
      }
      return status;
    },
  },
});
new Vue({ el: '#app' });