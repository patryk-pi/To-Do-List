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
    plannedTasks = [];
    doneTasks = [];
    $btnsDone = document.querySelectorAll('.btn-done');

    constructor() {
        $taskForm.addEventListener('submit', e => {
            e.preventDefault();
            this.addNewTask();
        });
        this.setDateInput();
        this.renderTasks();
        this.plannedTasks = [...JSON.parse(localStorage.getItem("tasks")).filter(task => task.active === true)];
        this.doneTasks = [...JSON.parse(localStorage.getItem("tasks")).filter(task => task.active === false)];
        console.log(this.plannedTasks)
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

        this.plannedTasks.push(newTask);
        console.log(newTask);
        this.saveTaskToLocalStorage(newTask)
        this.updatePlannedTasksList();

        $nameInput.value = $descInput.value = '';
        this.setDateInput();

    }

    updatePlannedTasksList() {
        $plannedTasks.innerHTML = '';

        this.plannedTasks.filter(task => task.active === true).forEach((task, index) => {
            this.updateTaskList(task, index);

        });

        $btnsDone = document.querySelectorAll('.btn-done');
    }

    updateDoneTasksList() {
        $doneTasks.innerHTML = '';

        this.doneTasks.filter(task => task.active === false).forEach((task, index) => {
            this.updateTaskList(task, index);

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
            this.plannedTasks.push(task);
        })

        this.renderDoneTasks(this.plannedTasks);
        this.renderPlannedTasks(allTasks);
        this.markTaskAsDone()

    }

    renderPlannedTasks(array) {
        array.filter(task => {
            return task.active === true;
        }).forEach((task, i) => {
                this.updateTaskList(task, i);
                this.plannedTasks.push(task, i);
            }
        );
    }

    renderDoneTasks(array) {
        array.filter(task => {
            return task.active !== true;
        }).forEach((task, i) => {
                this.updateTaskList(task, i);
                this.plannedTasks.push(task, i);
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
  <button type="button" class="btn btn-success ${active === true ? 'btn-done' : 'btn-primary'}">Left</button>
  <button type="button" class="btn btn-outline-warning">Middle</button>
  <button type="button" class="btn btn-outline-danger">Right</button>
</div>
                    
                </div>
            </div>`;

        active === true ? $plannedTasks.insertAdjacentHTML('beforeend', html) : $doneTasks.insertAdjacentHTML('beforeend', html);
        $btnsDone = document.querySelectorAll('.btn-done');

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
                console.log(dataId)
                this.moveTask(this.plannedTasks[dataId])
                this.doneTasks.push(this.plannedTasks[dataId]);
                this.plannedTasks.splice(dataId, 1)
                this.updateDoneTasksList();
                this.updatePlannedTasksList();
                localStorage.setItem('tasks', JSON.stringify(this.plannedTasks));

            });
        });




    }

}

const app = new App;



