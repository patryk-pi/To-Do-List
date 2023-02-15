const $clock = document.getElementById('clock');
const $btn = document.querySelector('.btn');
const $nameInput = document.getElementById('task-name');
const $descInput = document.getElementById('task-description')
const $dateInput = document.getElementById('task-date');
const $taskForm = document.getElementById('task-form');
const $plannedTasks = document.getElementById('planned-tasks')


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
        this.status = true;
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
    }

    addNewTask() {


        const taskName = $nameInput.value;
        const taskDesc = $descInput.value;
        const taskDate = $dateInput.value;

        if (!taskName || !taskDesc || !taskDate) {
            alert('Uzupełnij wszystkie pola!')
        }
        const newTask = new Task(taskName, taskDesc, taskDate);

        localStorage.setItem(newTask.name, JSON.stringify(newTask));
        this.tasks.push(newTask);
        console.log(newTask);
        this.updatePlannedTasksList();
    }

    updatePlannedTasksList() {
        $plannedTasks.innerHTML = '';

        this.tasks.forEach(task => {
            const {name, description: desc, date} = task
            const html = `<div class="card mt-5">

                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">${desc} </p>
                </div>
              
                <div class="card-footer d-flex justify-content-around align-items-center">
                    <button type="button" class="btn btn-success">✅ Wykonano!</button>
                    <small class="text-muted">Zaplanowana data wykonania: ${date}</small>
                    <button type="button" class="btn btn-danger">🚮 Usuń</button>
                </div>
            </div>`;

            $plannedTasks.insertAdjacentHTML('beforeend', html);
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

}

const app = new App;

