// loader
document.onreadystatechange = function () {
    if (document.readyState !== "complete") {
        document.querySelector("body").style.visibility = "hidden";
        document.querySelector("#loader").style.visibility = "visible";
    } else {
        document.querySelector("#loader").style.display = "none";
        document.querySelector("body").style.visibility = "visible";
    }
};
// checking firebase file from html
!firebaseConfig ? undefined : firebase.initializeApp(firebaseConfig);
// array to save tasks
let tasks;
// checking the local storage during page initialization
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'))
// array to save all created tasks
let taskItemElems = []; 
// we use this function when array tasks have changed
function updateLocal() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
// function works when you open app
(async function () {  
    if (localStorage.localId) {
        generateTasksPage();
        let tasks = await getTasksListFromDatabase(JSON.parse(localStorage.getItem('localId')));
        fillTasksList(tasks)
    } else { 
        const rootElement = document.getElementById('root');
        const authForm = initializeAuthForm();
        return rootElement.append(authForm);
    }
})();

function initializeAuthForm() {
    const form = createForm("auth");
    const inputLogin = createInput("login", "email", "Fill the e-mail please!");
    const inputPassword = createInput("password", "password", "Must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character");
    const title = createTitle("Welcome");
    const button = createButton("button", "submit", "Login");
    const errorValidationEmail = createLabel("errorValidEmail");
    const errorValidationPassword = createLabel("errorValidPassword");
    form.addEventListener('submit', submitFormHandler);
    inputPassword.addEventListener('input', () => {
        button.disabled = !validatePassword(inputPassword.value)
    });
    inputLogin.addEventListener("input", () => {
        button.disabled = !validateEmail(inputLogin.value)
    });
    form.append(title);
    form.append(inputLogin);
    form.append(errorValidationEmail);
    form.append(inputPassword);
    form.append(errorValidationPassword);
    form.append(button);
    return form;
}

function submitFormHandler(event) {
    event.preventDefault();
    const inputPassword = document.getElementById('password');
    const inputLogin = document.getElementById('login');
    const password = inputPassword.value;
    const email = inputLogin.value;
    authWithEmailAndPassword(email, password)
}

async function registrWithEmailAndPassword(email, password) {
    const errorValidationEmail = document.getElementById('errorValidEmail');
    try {
        const data = await firebase.auth().createUserWithEmailAndPassword(email, password);
        window.localStorage.setItem('localId', JSON.stringify(data.user.uid));
        window.localStorage.setItem('refreshToken', JSON.stringify(data.user.refreshToken));
        window.localStorage.setItem('idToken', JSON.stringify(data.user.Aa));
        generateTasksPage();
        alert('You have successfully registered')
    } catch (error) {
        if (error.code == 'auth/email-already-in-use') {
            return showError(errorValidationEmail, 'Email already in use')
        } else {
        return showError(errorValidationEmail, error.message)
        }
    }
}

async function authWithEmailAndPassword(email, password) {
    const errorValidationPassword = document.getElementById('errorValidPassword');
    try {
        const data = await firebase.auth().signInWithEmailAndPassword(email, password);
        window.localStorage.setItem('localId', JSON.stringify(data.user.uid));
        window.localStorage.setItem('refreshToken', JSON.stringify(data.user.refreshToken));
        window.localStorage.setItem('idToken', JSON.stringify(data.user.Aa));
        generateTasksPage();
        tasks = await getTasksListFromDatabase(data.user.uid);
        fillTasksList(tasks);
    } catch (error) {
        switch (error.code) {
            case 'auth/wrong-password':
                showError(errorValidationPassword, "You fill wrong password");
                break;
            case 'auth/user-not-found':
                showError(errorValidationPassword, "User not found");
                registrWithEmailAndPassword(email, password);
                break;
            default:
                showError(errorValidationPassword, error.message)
        }
    }
}

function showError(label, text) {
    label.innerHTML = text;
}

function validatePassword(value) {
    const inputPassword = document.getElementById('password');
    const errorValidationPassword = document.getElementById('errorValidPassword');
     //check empty password field 
    if (inputPassword.value === "") {
        return showError(errorValidationPassword, "**Fill the password please!");
    }
    //minimum password length validation  
    if (inputPassword.value.length < 8) {
        return showError(errorValidationPassword, "**Password length must be at least 8 characters");
    }
    //  8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character
    let decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (!inputPassword.value.match(decimal)) {
        return showError(errorValidationPassword, "**Fill the right password please!");
    } else {
        showError(errorValidationPassword, "");
        return value;
    }
}

function validateEmail(value) {
    const inputLogin = document.getElementById('login');
    const errorValidationEmail = document.getElementById('errorValidEmail');
    //check empty email field 
    if (inputLogin.value === "") {
        return showError(errorValidationEmail, "**Fill the e-mail please!");
    }
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!inputLogin.value.match(mailformat)) {
        return showError(errorValidationEmail, "**You have entered an invalid email address!");
    } else {
        showError(errorValidationEmail, "");
        return value;
    }
}

function createForm(name) {
    const form = document.createElement('form');
    form.id = name;
    return form;
}

function createInput(name, type, title) {
    if (!name || !type) return null;
    const input = document.createElement('input');
    input.type = type;
    input.id = name;
    input.name = name;
    input.title = title;
    return input;
}

function createTitle(text) {
    if (!text) return null;
    const title = document.createElement('h3');
    title.innerHTML = text;
    return title;
}

function createButton(name, type, text) {
    if (!name || !type || !text) return null;
    const button = document.createElement('button');
    button.innerHTML = text;
    button.type = type;
    button.id = name;
    button.name = name;
    button.disabled = true;
    return button;
}

function createLabel(name) {
    if (!name) return null;
    const errorValidation = document.createElement('label');
    errorValidation.style.color = "red";
    errorValidation.id = name;
    errorValidation.name = name;
    return errorValidation;
}

function createDiv(name) {
    const div = document.createElement('div');
    div.id = name;
    div.className = name;
    return div;
}
// ================================ tasks page

function generateTasksPage() {
    const rootElement = document.getElementById('root');
    rootElement.remove();
    const newRootElement = createDiv('root');
    const logOutBtn = createButton("logout", "submit", "Logout");
    logOutBtn.disabled = false;
    logOutBtn.addEventListener('click', logOut);
    const tasksList = initializeTasksForm();
    document.body.appendChild(newRootElement);
    newRootElement.append(logOutBtn);
    return newRootElement.append(tasksList);
}

function initializeTasksForm() {
    const container = createDiv("container");
    const title = createTitle("My Tasks List");
    const newTask = createDiv("newtask");
    const deskTaskInput = createInput("input", "text");
    const addTaskBtn = createButton("push", "submit", "Add");
    addTaskBtn.disabled = false;
    const tasks = createDiv("tasks");
    deskTaskInput.placeholder = "Task to be done..";
    container.append(title);
    container.append(newTask);
    newTask.append(deskTaskInput);
    newTask.append(addTaskBtn);
    container.append(tasks);
    addTaskBtn.addEventListener('click', submitTaskFromDatabase);
    return container;
}
// function to clear local storage and initialize auth form
function logOut() {
    const rootElement = document.getElementById('root');
    rootElement.remove();
    const newRootElement = createDiv('root');
    const authForm = initializeAuthForm();
    document.body.appendChild(newRootElement);
    localStorage.clear();
    return newRootElement.append(authForm);
}
// function constructor to create many tasks object
function Task(title) {
    this.userId = JSON.parse(window.localStorage.getItem('localId'));
    this.dateCreated = Date.now();
    this.dateUpdated = Date.now();
    this.title = title;
    this.status = false;
}

async function submitTaskFromDatabase() {
    const deskTaskInput = document.getElementById('input');
    if (deskTaskInput.value.length == 0) {
        alert("Please enter a task!");
    } else {
        try {
            await addTaskToDatabase(new Task(deskTaskInput.value));
            tasks = await getTasksListFromDatabase(JSON.parse(localStorage.getItem('localId')))
            fillTasksList(tasks);
            deskTaskInput.value = '';
        } catch (error) {
            console.error(error);
        }
    }
}

async function addTaskToDatabase(task) {
    try {
        return await firebase.database().ref('ToDo').push(task);
    } catch (error) {
        console.log(error.message)
    }
}

async function getTasksListFromDatabase(id) {
    try {
        return await firebase.database().ref('ToDo').get()
            .then(response => response.val())
            .then(response => {
                return response ? Object.keys(response).map(key => ({
                    ...response[key],
                    id: key
                })) : []
            })
            .then(response => {
                return response.filter(task => {
                    return task.userId == `${id}`;
                })     
            })
            .then(response => {
                return response.filter(task => {
                    return task.status !== 'archived';
                })
            })
            .then(response => {
                window.localStorage.setItem('tasks', JSON.stringify(response));
                return response;
            })
    } catch (error) {
        console.error(error);
    }
}

function createTaskTemplate(task, index) {
    return `
<div class="task ${task.status ? 'checked' : ''}"> 
<div id="taskname"> ${task.title} </div>
<div class="buttons"> 
<input onclick = completeTask(${index}) class="btn-complete" type="checkbox" ${task.status ? 'checked' : ''}>
<button onclick = deleteTask(${index}) class="btn-delete">Delete</button>
</div>
</div>
`;
}
// function to display array tasks on a page
function fillTasksList(tasks) {
    document.querySelector('#tasks').innerHTML = "";
    if (tasks.length > 0) {
        tasks.forEach((task, index) => {
            document.querySelector('#tasks').innerHTML += createTaskTemplate(task, index);
        })
        taskItemElems = document.querySelectorAll('.task') 
    }
}

async function completeTask(index) {
    tasks[index].status = !tasks[index].status;
    console.log(index)
    if (tasks[index].status === true) {
        await firebase.database().ref('ToDo').child(tasks[index].id).update({ dateUpdated: Date.now()})
        await firebase.database().ref('ToDo').child(tasks[index].id).update({ status: true })  
        taskItemElems[index].classList.add("checked");
    } else if (tasks[index].status === false) {
        await firebase.database().ref('ToDo').child(tasks[index].id).update({ dateUpdated: Date.now()})
        await firebase.database().ref('ToDo').child(tasks[index].id).update({ status: false })
        taskItemElems[index].classList.remove("checked");
    }
    updateLocal();
    fillTasksList(tasks);
}

async function deleteTask(index) {
    tasks[index].disabled = false;
    taskItemElems[index].classList.add("delition");
    await firebase.database().ref('ToDo').child(tasks[index].id).update({ status: 'archived' })
    await firebase.database().ref('ToDo').child(tasks[index].id).update({ dateUpdated: Date.now()})
    setTimeout(() => {
        tasks.splice(index, 1);
        updateLocal();
        fillTasksList(tasks);
    }, 500)
}