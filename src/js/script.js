const $clock = document.getElementById('clock');
const $btn = document.querySelector('.btn');
const $nameInput = document.getElementById('task-name');
const $descInput = document.getElementById('task-description')
const $dateInput = document.getElementById('task-date');
const $taskForm = document.getElementById('task-form');
const $nameInputEdit = document.getElementById('task-name-edit');
const $descInputEdit = document.getElementById('task-description-edit')
const $dateInputEdit = document.getElementById('task-date-edit');
const $taskFormEdit = document.querySelector('.edit-section');
const $overlay = document.querySelector('.overlay');
const $plannedTasks = document.getElementById('planned-tasks');
const $doneTasks = document.getElementById('done-tasks');


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

    constructor() {
        $taskForm.addEventListener('submit', e => {
            e.preventDefault();
            this.addNewTask();
        });
        this.setDateInput();
        this.renderTasks();
        this.plannedTasks = [...JSON.parse(localStorage.getItem("tasks")).filter(task => task.active === true)];
        this.doneTasks = [...JSON.parse(localStorage.getItem("tasks")).filter(task => task.active === false)];
        console.log(this.plannedTasks);
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
            this.updateTaskHtml(task, index);

        });
        this.addDoneButtonListeners();
        this.addDeleteButtonListener();
        this.addReturnButtonListener();
        this.addEditButtonListener();
    }

    updateDoneTasksList() {
        $doneTasks.innerHTML = '';

        this.doneTasks.filter(task => task.active === false).forEach((task, index) => {
            this.updateTaskHtml(task, index);
        });

    }

    addDoneButtonListeners() {
        const doneButtons = document.querySelectorAll('.btn-done');

        doneButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                this.markTaskAsDone(e);
            })
        })
    }

    addDeleteButtonListener() {
        const deleteButtons = document.querySelectorAll('.btn-delete');

        deleteButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                this.deleteTask(e)
            })
        });
    }

    addReturnButtonListener() {
        const returnButtons = document.querySelectorAll('.btn-return');

        returnButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                this.markTaskAsUndone(e);
            })
        })
    }

    addEditButtonListener() {
        const editButtons = document.querySelectorAll('.btn-edit');

        editButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                this.editTask(e);
            })
        })
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

        this.renderDoneTasks(allTasks);
        this.renderPlannedTasks(allTasks);
        this.addDoneButtonListeners();
        this.addDeleteButtonListener();
        this.addReturnButtonListener();
        this.addEditButtonListener();

    }

    renderPlannedTasks(array) {
        array.filter(task => {
            return task.active === true;
        }).forEach((task, i) => {
                this.updateTaskHtml(task, i);
            }
        );
    }

    renderDoneTasks(array) {
        array.filter(task => {
            return task.active !== true;
        }).forEach((task, i) => {
                this.updateTaskHtml(task, i);
            }
        );
    }

    updateTaskHtml(task, index) {
        const {name, description: desc, date, active} = task
        const html = active === true ? `<div class="card mt-5">
       

                <div class="card-body" data-id="${index}">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">${desc} </p>
                </div>
              
                <div class="card-footer d-flex justify-content-around align-items-center">
                    
                    <small class="text-muted">Zaplanowana data wykonania: ${date}</small>
                    <div class="btn-group" role="group" >
  <button type="button" class="btn btn-success btn-done">Wykonano</button>
  <button type="button" class="btn btn-outline-warning btn-edit">Edytuj</button>
  <button type="button" class="btn btn-outline-danger btn-delete">Usuń</button>
</div>  </div>
            </div>` : `<div class="card mt-5">

                <div class="card-body" data-id="${index}">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">${desc} </p>
                </div>
              
                <div class="card-footer d-flex justify-content-around align-items-center">
                    
                    <small class="text-muted">Wykonano: ${date}</small>
                    <div class="btn-group" role="group" >
  <button type="button" class="btn btn-outline-success btn-return">Przywróc do zaplanowanych</button>
  <button type="button" class="btn btn-outline-danger btn-delete">Usuń</button>
</div>`


        ;

        active === true ? $plannedTasks.insertAdjacentHTML('beforeend', html) : $doneTasks.insertAdjacentHTML('beforeend', html);


    }


    moveTask(task) {
        task.active === true ? task.active = false : task.active = true;
    }

    markTaskAsDone(event) {
        event.preventDefault();

        const dataId = +event.target.parentElement.parentElement.previousElementSibling.getAttribute('data-id')
        this.moveTask(this.plannedTasks[dataId])
        this.doneTasks.push(this.plannedTasks[dataId]);
        this.plannedTasks.splice(dataId, 1)
        this.updateTasksList();
    }

    markTaskAsUndone(event) {

        event.preventDefault();
        const dataId = +event.target.parentElement.parentElement.previousElementSibling.getAttribute('data-id');
        this.moveTask(this.doneTasks[dataId])
        this.plannedTasks.push(this.doneTasks[dataId]);
        this.doneTasks.splice(dataId, 1)
        this.updateTasksList();
    }

    deleteTask(event) {
        event.preventDefault();
        const dataId = +event.target.parentElement.parentElement.previousElementSibling.getAttribute('data-id');
        const targetArray = String(event.target.parentElement.parentElement.parentElement.parentElement.id);
        if (targetArray === 'planned-tasks') {
            this.plannedTasks.splice(dataId, 1);
            this.updateTasksList();
        } else {
            this.doneTasks.splice(dataId, 1);
            this.updateTasksList();
        }
    }

    editTask(event) {
        const dataId = +event.target.parentElement.parentElement.previousElementSibling.getAttribute('data-id');
        $taskFormEdit.classList.remove('hidden');
        $overlay.classList.remove('hidden');
        $nameInputEdit.value = this.plannedTasks[dataId].name
        $descInputEdit.value = this.plannedTasks[dataId].description
        $dateInputEdit.value = this.plannedTasks[dataId].date;
        this.plannedTasks.splice(dataId, 1);

        document.getElementById('btn-edit-task').addEventListener('click', e => {
            e.preventDefault();

            this.plannedTasks.splice(dataId, 1);
            const newTask = new Task(taskName, taskDesc, taskDate);

            let dataFormLocalStorage = [];
            if (localStorage.getItem('tasks') !== null) {
                dataFormLocalStorage = JSON.parse(localStorage.getItem("tasks"));
            }

            this.plannedTasks.splice(dataId, 0, newTask);
            console.log(newTask);
            this.saveTaskToLocalStorage(newTask)
            this.updatePlannedTasksList();

            $nameInput.value = $descInput.value = '';
            this.setDateInput();

            $taskFormEdit.classList.add('hidden');
            $overlay.classList.add('hidden');
        })

    }

    updateTasksList() {
        this.updateDoneTasksList();
        this.updatePlannedTasksList();
        const allTasks = [...this.plannedTasks, ...this.doneTasks]
        localStorage.setItem('tasks', JSON.stringify(allTasks));
    }


}

const app = new App;



