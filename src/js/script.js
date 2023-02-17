const $clock = document.getElementById('clock');
const $btn = document.querySelector('.btn');
const $nameInput = document.getElementById('task-name');
const $descInput = document.getElementById('task-description')
const $dateInput = document.getElementById('task-date');
const $taskForm = document.getElementById('task-form');
const $plannedTasks = document.getElementById('planned-tasks');
const $doneTasks = document.getElementById('done-tasks')
let $btnsDone = document.querySelectorAll('.btn-done');


/*
// CLOCK
const updateDate = () => {
    const interval = setInterval(() => {
        currentTime();
    }, 1000)
}

const currentTime =() => {
    $clock.innerHTML ='';
    const date = (new Date());
    const html = `<p class="lead">${new Date().toLocaleDateString()}</p>
                    <p class="lead">${new Date().toLocaleTimeString()}</p>`
    $clock.insertAdjacentHTML('beforeend', html);
}

updateDate();
currentTime();*/


class Task {

    constructor(name, description, date) {
        this.name = name;
        this.description = description;
        this.date = date;
        this.active = true;
    }
}

class App {
    tasks = [];

    constructor() {
        $taskForm.addEventListener('submit', e => {
            e.preventDefault();
            this.addNewTask();
        });
        this.setDateInput();
        this.renderTasks();
        this.tasks = [...JSON.parse(localStorage.getItem("tasks"))];
        console.log(this.tasks)
    }

    addNewTask() {

        const taskName = $nameInput.value;
        const taskDesc = $descInput.value;
        const taskDate = $dateInput.value;

        if (!taskName || !taskDesc || !taskDate) {
            alert('Uzupełnij wszystkie pola!');
            return;
        }
        const newTask = new Task(taskName, taskDesc, taskDate);

        let dataFormLocalStorage = [];
        if (localStorage.getItem('tasks') !== null) {
            dataFormLocalStorage = JSON.parse(localStorage.getItem("tasks"));
        }

        this.tasks.push(newTask);
        console.log(newTask);
        this.saveTaskToLocalStorage(newTask)
        this.updatePlannedTasksList();

        $nameInput.value = $descInput.value = '';
        this.setDateInput();

    }

    updatePlannedTasksList() {
        $plannedTasks.innerHTML = '';

        this.tasks.forEach(task => {
          this.updateTaskList(task);
          console.log(task)
            console.log(this.tasks)
        });
    }

    // DATES

    padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    formatDate(date = new Date()) {
        return [
            date.getFullYear(),
            this.padTo2Digits(date.getMonth() + 1),
            this.padTo2Digits(date.getDate()),
        ].join('-');
    }

    setDateInput() {
        $dateInput.value = this.formatDate();
    }

    // LOCAL STORAGE

    saveTaskToLocalStorage(task) {
        let dataFromLocalStorage = [];
        if (localStorage.getItem('tasks') !== null) {
            dataFromLocalStorage = JSON.parse(localStorage.getItem('tasks'));
            dataFromLocalStorage.push(task);
            localStorage.setItem('tasks', JSON.stringify(dataFromLocalStorage))
        } else {
            dataFromLocalStorage.push(task);
            localStorage.setItem('tasks', JSON.stringify(dataFromLocalStorage))
        }
    }

    renderTasks() {
        const allTasks = JSON.parse(localStorage.getItem("tasks"));

        allTasks.forEach(task => {
            this.tasks.push(task);
        })

        this.renderDoneTasks(this.tasks);
        this.renderPlannedTasks(allTasks);
        this.markTaskAsDone()

    }

    renderPlannedTasks(array) {
        array.filter(task=> {
            return task.active === true;
        }).forEach((task, i) => {
                this.updateTaskList(task, i);
                this.tasks.push(task, i);
            }
        );
    }

    renderDoneTasks(array) {
        array.filter(task=> {
            return task.active !== true;
        }).forEach((task, i) => {
                this.updateTaskList(task, i);
                this.tasks.push(task, i);
            }
        );
    }

    updateTaskList(task, index) {
        const {name, description: desc, date, active} = task
        const html = `<div class="card mt-5">

                <div class="card-body" data-id="${index}">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">${desc} </p>
                </div>
              
                <div class="card-footer d-flex justify-content-around align-items-center">
                    
                    <small class="text-muted">Zaplanowana data wykonania: ${date}</small>
                    <div class="btn-group" role="group" aria-label="Basic example">
  <button type="button" class="btn btn-success btn-done">Left</button>
  <button type="button" class="btn btn-outline-warning">Middle</button>
  <button type="button" class="btn btn-outline-danger">Right</button>
</div>
                    
                </div>
            </div>`;

        active === true ? $plannedTasks.insertAdjacentHTML('beforeend', html) : $doneTasks.insertAdjacentHTML('beforeend', html)

    }


    moveTask(task) {
       task.active === true ? task.active = false : task.active = true;
    }

    markTaskAsDone() {

        $btnsDone = document.querySelectorAll('.btn-done');

        $btnsDone.forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                const dataId = +e.target.parentElement.parentElement.previousElementSibling.getAttribute('data-id')
                const parent = e.target.parentElement.parentElement.previousElementSibling.parentElement;


                this.moveTask(this.tasks[dataId]);
                console.log(this.tasks[dataId])
                this.tasks.push(this.tasks[dataId])
                this.updateTaskList(this.tasks[dataId], [dataId]);
                localStorage.clear();

                this.tasks.forEach( task => {
                    this.saveTaskToLocalStorage(task)
                })
                parent.remove();
                console.log(this.tasks)

            });
        })
    }
}

const app = new App;



