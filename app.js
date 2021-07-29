const doc = document;
  const elem = doc.getElementById('root');

  const form = doc.createElement('form');
  form.className = "form";
  form.id = "genform";
  elem.append(form);

  const span = doc.createElement('span');
  span.className = "span";
  span.innerHTML = "Welcome";
  form.prepend(span);
  
  const inputM = doc.createElement('input');
  inputM.className = "emailId";
  inputM.type = "text";
  inputM.placeholder = "Email";
  inputM.title = "Fill the Email please!";
  span.after(inputM);
  
  const inputP = doc.createElement('input');
  inputP.className = "pas";
  inputP.type = "password";
  inputP.placeholder = "Password";
  inputP.title = "Must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
  inputP.value = "";
  inputM.after(inputP);

  const btn = doc.createElement('button');
  btn.className = "btn";
  btn.innerHTML = "Login";
  btn.type = "submit";
  btn.id = "btn";
  btn.disabled = false;
  inputP.after(btn);

  const message = doc.createElement('span');
  message.className = "message";
  message.style.color = "red";
  btn.before(message); 

form.addEventListener("submit", verifyPassword);

function verifyPassword(event) {  
    //check empty password field 
    event.preventDefault(); 
    if (inputP.value == "") {  
       message.innerHTML = "**Fill the password please!"; 
       return false;  
    }  
     
   //minimum password length validation  
    if(inputP.value.length < 8) {
       message.innerHTML = "**Password length must be at least 8 characters"; 
       return false;  
    }  
    
    // 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character
    let decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (!inputP.value.match(decimal)) {
        message.innerHTML = "**Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character";
        return false;
    }
    //maximum length of password validation  
    if(inputP.value.length > 15) {  
        message.innerHTML = "**Password length must not exceed 15 characters";  
       return false;  
    } else {  
       alert("Password is correct");  
    } 

  }