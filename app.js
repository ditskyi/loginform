(async function () {
    
    initializeFirebase();

    if (localStorage.localId) { // если есть id юзера то при обновлении страницы отрисовуется туду лист и подгружаются таски

        onSuccessAuth();
        let tasks = await getToDoListFromDatabase(JSON.parse(localStorage.getItem('localId')));
        console.log(tasks);
        fillHtmlList(tasks)

    } else { // если локал сторедж пуст стан отрисовка логинки

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

    //создать с помощью append форму в правильном порядке 
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
// initialize firebase
function initializeFirebase() {

    const firebaseConfig = {
        apiKey: "AIzaSyB2Ksu_mphl7GoWF9zCwGVkSaVCrTTknCk",
        authDomain: "login-form-app-18c1e.firebaseapp.com",
        databaseURL: "https://login-form-app-18c1e-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "login-form-app-18c1e",
        storageBucket: "login-form-app-18c1e.appspot.com",
        messagingSenderId: "828076952376",
        appId: "1:828076952376:web:6ee1d47435b3c15fdc8fcd",

    };
    return firebase.initializeApp(firebaseConfig);
}

async function registrWithEmailAndPassword(email, password) {
    try {
        const data = await firebase.auth().createUserWithEmailAndPassword(email, password);
        window.localStorage.setItem('localId', JSON.stringify(data.user.uid));
        window.localStorage.setItem('refreshToken', JSON.stringify(data.user.refreshToken));
        window.localStorage.setItem('idToken', JSON.stringify(data.user.Aa));
        // вызов функции onSuccessAuth
        onSuccessAuth();
        alert('Вы успешно зарегистрировались')
    } catch (error) {
        if (error.code == 'auth/email-already-in-use') {
            return alert('Данный email уже используется')
        }
        return console.log(error.message)

    }

}

async function authWithEmailAndPassword(email, password) {

    try {
        const data = await firebase.auth().signInWithEmailAndPassword(email, password);

        window.localStorage.setItem('localId', JSON.stringify(data.user.uid));
        window.localStorage.setItem('refreshToken', JSON.stringify(data.user.refreshToken));
        window.localStorage.setItem('idToken', JSON.stringify(data.user.Aa));
        onSuccessAuth();
        alert('Вы успешно залогинились')
        tasks = await getToDoListFromDatabase(data.user.uid);
        console.log('--gettasks--', tasks);
        fillHtmlList(tasks);

    } catch (error) {
        switch (error.code) {
            case 'auth/wrong-password':
                alert('Вы ввели не корретный пароль')
                break;
            case 'auth/user-not-found':
                alert('Такой пользователь не найден')
                registrWithEmailAndPassword(email, password);
                break;
            default:
                alert(error.message)
        }

    }

}

function validatePassword(value) {

    //check empty password field 
    const inputPassword = document.getElementById('password');
    const errorValidationPassword = document.getElementById('errorValidPassword');

    if (inputPassword.value === "") {
        errorValidationPassword.innerHTML = "**Fill the password please!";
        return false;
    }

    //minimum password length validation  
    if (inputPassword.value.length < 8) {
        errorValidationPassword.innerHTML = "**Password length must be at least 8 characters";
        return false;
    }

    //  8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character
    let decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (!inputPassword.value.match(decimal)) {
        errorValidationPassword.innerHTML = "**Fill the right password please!";
        return false;
    } else {
        errorValidationPassword.innerHTML = "";
        return value;
    }
}
function validateEmail(value) {

    const inputLogin = document.getElementById('login');
    const errorValidationEmail = document.getElementById('errorValidEmail');
    //check empty email field 
    if (inputLogin.value === "") {
        errorValidationEmail.innerHTML = "**Fill the e-mail please!";
        return false;
    }
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!inputLogin.value.match(mailformat)) {
        errorValidationEmail.innerHTML = "**You have entered an invalid email address!";
        return false;
    } else {
        errorValidationEmail.innerHTML = "";
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

document.onreadystatechange = function () {
    if (document.readyState !== "complete") {
        document.querySelector("body").style.visibility = "hidden";
        document.querySelector("#loader").style.visibility = "visible";
    } else {
        document.querySelector("#loader").style.display = "none";
        document.querySelector("body").style.visibility = "visible";
    }
};
/////////////////////// to do list
// замена в div root текущего UI на новый 
function onSuccessAuth() {
    const rootElement = document.getElementById('root');
    rootElement.remove();
    const newRootElement = createDiv('root');
    const logOutBtn = createButton("logout", "submit", "Logout");
    logOutBtn.disabled = false;
    logOutBtn.addEventListener('click', logOut);
    const todoList = initializeTodoList();
    document.body.appendChild(newRootElement);
    newRootElement.append(logOutBtn);
    return newRootElement.append(todoList);

}

function initializeTodoList() {
    const container = createDiv("container");
    const title = createTitle("My ToDo List");
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

    addTaskBtn.addEventListener('click', submitTask);

    return container;

}
// функция которая затирает все данные из локал сторедж и отрисовует страницу авторизации
function logOut() {
    const rootElement = document.getElementById('root');
    rootElement.remove();
    const newRootElement = createDiv('root');
    const authForm = initializeAuthForm();
    document.body.appendChild(newRootElement);
    localStorage.clear();
    return newRootElement.append(authForm);
}

let tasks;
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'))
// при инициализации страницы если нет таскс в localStorage то тогда массив будет пустым, если есть то мы записываем в таскс эти значения 

let todoItemElems = []; // массив в котором хранятся все созданные тудушки

// функция конструктор которая создает много однотипным объектов таск
function Task(title) {
    this.userId = JSON.parse(window.localStorage.getItem('localId'));
    this.dateCreated = Date.now();
    this.dateUpdated = Date.now();
    this.title = title;
    this.status = false; // false - новая тудушка 
}

// асинхронная функция сначала записывается туду в коллекцию в датабейз, если удачно, тогда мы пушим эту тудушку в массив таскс
async function submitTask() {
    const deskTaskInput = document.getElementById('input');
    if (deskTaskInput.value.length == 0) {
        alert("Please enter a task");

    } else {
        try {
            await addToDoInDatabase(new Task(deskTaskInput.value));
            tasks = await getToDoListFromDatabase(JSON.parse(localStorage.getItem('localId'))) // записываем массив тудушек из database с id каждой туду в том числе новой туду
            console.log('--tasks--', tasks)
            fillHtmlList(); // рисуем массив таскс на странице
            deskTaskInput.value = '';

        } catch (error) {
            console.error(error);
        }
    }
}

// функция добавления тудушки в датабейс, она принимает таску которую мы создали
async function addToDoInDatabase(task) {
    try {
        return await firebase.database().ref('ToDo').push(task) // создаем коллекцию ToDо где будут хранится все туду всех пользователей

    } catch (error) {
        console.log(error.message)

    }
}

async function getToDoListFromDatabase(id) {
    try {
        // можно попробовать воспользоваться методом сортировки из библиотеки firebase 
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
                })     // фильтр по id автора
            })

            // здесь нужно сделать фильтр по статусу и вывести все тудушки не имеющие статут архив
            .then(response => {
                return response.filter(task => {
                    return task.status !== 'archived';
                })
            })
            .then(response => {
                console.log(response)
                window.localStorage.setItem('tasks', JSON.stringify(response));
                return response;
            })
    } catch (error) {
        console.error(error)
    }
}

// функция отображения таски на странице
// если такс статус есть то добавляем класс чекед, иначе ничего
function createTemplate(task, index) {
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
// функция которая показывает таски на странице
function fillHtmlList() {
    document.querySelector('#tasks').innerHTML = ""; // зачищаем див с тасками
    // если в массиве таскс что-то есть то мы пробегаем по массиву с помощью forEach , так как это массив итерации будут повторятся, += говорит что мы
    // добавляем к следующей итерации функцию createTemplate, которая принимает task - наш таск с массива таскс и index таски 
    if (tasks.length > 0) {
        filterTask();
        tasks.forEach((task, index) => {
            document.querySelector('#tasks').innerHTML += createTemplate(task, index);
        })
        todoItemElems = document.querySelectorAll('.task') // в массив записываем новую тудушку
    }
}

fillHtmlList(); // вызываем при инициализации страницы для того что б пробигать по таскам и отображать на странице все такси из массива

// функция для записи массива тасков в localStorage, эта функция вызывается когда массив таскс был обновлен/изменен 
function updateLocal() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

async function completeTask(index) {
    tasks[index].status = !tasks[index].status; // пробегаемся по массиву такс и находим по индексу ту таску на которой нажали чекбокс и изменем в ней
    // статус на комплитед
    if (tasks[index].status === true) {
        await firebase.database().ref('ToDo').child(tasks[index].id).update({ dateUpdated: Date.now()})
        await firebase.database().ref('ToDo').child(tasks[index].id).update({ status: true })
        
        todoItemElems[index].classList.add("checked");
    } else if (tasks[index].status === false) {
        await firebase.database().ref('ToDo').child(tasks[index].id).update({ dateUpdated: Date.now()})
        await firebase.database().ref('ToDo').child(tasks[index].id).update({ status: false })
        
        todoItemElems[index].classList.remove("checked");
    }
    updateLocal(); // обновить данные в локал сторедж
    fillHtmlList(); // в связи с тем что мы изменили таску нужно показать это изменение на странице
}

async function deleteTask(index) {
    tasks[index].disabled = false;
    todoItemElems[index].classList.add("delition");
    await firebase.database().ref('ToDo').child(tasks[index].id).update({ status: 'archived' })
    await firebase.database().ref('ToDo').child(tasks[index].id).update({ dateUpdated: Date.now()})
    setTimeout(() => {
        tasks.splice(index, 1); // удаляем таску из массива таскс
        updateLocal();
        fillHtmlList();
    }, 500)

}
// функция которая отражает на странице сначала которые не выполненые а потом те которые выполнены
function filterTask() {
    const activeTasks = tasks.length && tasks.filter(item => item.status === false);
    const completedTasks = tasks.length && tasks.filter(item => item.status === true);
    tasks = [...activeTasks, ...completedTasks];
}
