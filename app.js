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
        .then (token => {
            
        })

        // if (validatePassword(inputPassword.value) && validateEmail(inputLogin.value)) {

        //     const guest = {
        //         email: inputLogin.value.trim(),
        //         password: inputPassword.value.trim(),
        //         date: new Date().toJSON()
        //     }
            
        //     button.disabled = true;
        //     // Async request to server to save guest
        //     console.log("Guest", guest)

        //     inputLogin.value = "";
        //     inputPassword.value = "";
        //     button.disabled = false;


    // }

    }

    function authWithEmailAndPassword (email, password) {
        const apiKey = "AIzaSyB2Ksu_mphl7GoWF9zCwGVkSaVCrTTknCk"
 return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
     method: 'POST',
     body: JSON.stringify({
         email, password,
         returnSecureToken: true 
     }),
      headers: {
          'Content-Type': 'application/json'
      }
 })
 .then(response => response.json())
 .then(data => data.idToken)  
    }

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


  