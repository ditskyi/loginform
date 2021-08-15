  (function () {
    const rootElement = document.getElementById('root');
    const authForm = initializeAuthForm();
    
    return rootElement.append(authForm);
  })();
  
  function initializeAuthForm () {
    const form = createForm ("auth");
    const inputLogin = createInput ("login", "email", "Fill the e-mail please!");
    const inputPassword = createInput ("password", "password", "Must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character");
    const title = createTitle ("Welcome");
    const button = createButton ("button", "submit", "Login");
    const errorValidationEmail = createLabel ("errorValidEmail");
    const errorValidationPassword = createLabel ("errorValidPassword");

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
  
    function submitFormHandler (event) {
        event.preventDefault(); 
        const inputPassword = document.getElementById('password');
        const inputLogin = document.getElementById('login');
        const password = inputPassword.value;
        const email = inputLogin.value;
        authWithEmailAndPassword(email, password)
       

    }
// Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyB2Ksu_mphl7GoWF9zCwGVkSaVCrTTknCk",
        authDomain: "login-form-app-18c1e.firebaseapp.com",
        databaseURL: "https://login-form-app-18c1e-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "login-form-app-18c1e",
        storageBucket: "login-form-app-18c1e.appspot.com",
        messagingSenderId: "828076952376",
        appId: "1:828076952376:web:6ee1d47435b3c15fdc8fcd"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);

    async function registrWithEmailAndPassword (email, password) {
        try {
            const data = await firebase.auth().createUserWithEmailAndPassword(email, password);
            // вызов функции onSuccessAuth
            console.log(data.user.uid)
            alert('Вы успешно зарегистрировались')
        } catch (error) {
            if (error.code == 'auth/email-already-in-use') {
                return alert('Данный email уже используется')
            }
            return console.log(error.message)
            
        }

//         const apiKey = "AIzaSyB2Ksu_mphl7GoWF9zCwGVkSaVCrTTknCk"
//  return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
//      method: 'POST',
//      body: JSON.stringify({
//          email, password,
//          returnSecureToken: true 
//      }),
//       headers: {
//           'Content-Type': 'application/json'
//       }
//  })
//  .then(response => response.json())
//  .then(response => console.log(response.idToken, response.email))  
    }

    async function authWithEmailAndPassword (email, password) {

        try {
            const data = await firebase.auth().signInWithEmailAndPassword(email, password);
            // вызов функции onSuccessAuth
            console.log(data.user.uid)
        } catch (error) {
            switch (error.code) {
                case 'auth/wrong-password':
                    alert('Вы ввели не корретный пароль')
                    break;
                case 'auth/user-not-found' :
                    alert('Такой пользователь не найден')
                    registrWithEmailAndPassword(email, password);
                    break;
                default:
                    alert(error.message)
            }
          
        }

//         const apiKey = "AIzaSyB2Ksu_mphl7GoWF9zCwGVkSaVCrTTknCk"
//  return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
//      method: 'POST',
//      body: JSON.stringify({
//          email, password,
//          returnSecureToken: true 
//      }),
//       headers: {
//           'Content-Type': 'application/json'
//       }
//  })
//  .then(response => {
//      if (response.ok) {
//         response.json().then(data => console.log('Ваш токен', data.idToken, 'Ваша почта', data.email))
//      }
//      return console.log(returnEmailAndPassword())
    //  response.json().then(error => {
    //     const e = new Error('Пожалуйста зарегистрируйтесь')
    //     e.data = error
    //     throw e 
    //  })  
    // })
//  .then(registrWithEmailAndPassword)  
    }

    // функция onSuccessAuth 
    // готовит новый UI(список to do)
    // замена в div root текущего UI на новый 
    // сохранить в локал сторедж основной токен и токен рефреша
    //объект тодо
    const todoObject = {
        id: 'string id',
        created: 'date created',
        updated: 'date updated',
        userId: 'author id',
        title: 'string title',
        text: 'string text',
        status: 'status id'
    };

    const statuses = {
        id: 'string id',
        title: 'string title', // new, completed
    };
    // создаю две таблицы в файрбез
    // делаю запрос на фб для получения тудушек
    // отрисовка тудушек
    // создать форму для создания и редактирования тудушек и удаление
    // сделать лоадинг при запросах на сервер


  // написать function валидацию форм

  function validatePassword (value) {  

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

  // накидывать на баттон событие по запросу на сервер


  function createForm (name) {
    const form = document.createElement('form');
    form.id = name;
    return form;
  }
  
  function createInput (name, type, title) {
    if (!name || !type) return null;
    const input = document.createElement('input');
    input.type = type;
    input.id = name;
    input.name = name;
    input.title = title;
    return input;
  }
  
  function createTitle (text) {
    if (!text) return null;
    const title = document.createElement('h3');
    title.innerHTML = text;
    return title;
  }
  
  function createButton (name, type, text) {
    if (!name || !type || !text) return null;
    const button = document.createElement('button');
    button.innerHTML = text;
    button.type = type;
    button.id = name;
    button.name = name;
    button.disabled = true;
    return button;
  }

  function createLabel (name) {
    if (!name) return null;
    const errorValidation = document.createElement('label');
    errorValidation.style.color = "red";
    errorValidation.id = name;
    errorValidation.name = name;
   return errorValidation;
  }

  document.onreadystatechange = function() {
    if (document.readyState !== "complete") {
        document.querySelector("body").style.visibility = "hidden";
        document.querySelector("#loader").style.visibility = "visible";
    } else {
        document.querySelector("#loader").style.display = "none";
        document.querySelector("body").style.visibility = "visible";
    }
};
  