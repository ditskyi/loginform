const doc = document;
  const elem = doc.getElementById('root');

  const form = doc.createElement('form');
  form.className = "form";
  form.id = "genform";
  form.action = "";
  form.method = "post";
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
  inputP.autocomplete = "current-password";
  inputM.after(inputP);

  const btn = doc.createElement('button');
  btn.className = "btn";
  btn.innerHTML = "Login";
  btn.type = "submit";
  btn.id = "btn";
  btn.disabled = false;
  inputP.after(btn);

  const message = doc.createElement('label');
  message.className = "message";
  message.style.color = "red";
  btn.before(message); 

form.addEventListener("submit", verifyPassword);
form.addEventListener("click", onClick);

function verifyPassword(event) {  
    //check empty password field 
    event.preventDefault(); 
    if (inputP.value == "") {  
       message.innerHTML = "**Fill the password please!";
       inputP.style.boxShadow = "0 0 2px 1px red";
       return false;  
    } 
     
   //minimum password length validation  
    if(inputP.value.length < 8) {
       message.innerHTML = "**Password length must be at least 8 characters"; 
       inputP.style.boxShadow = "0 0 2px 1px red";
       return false;  
    }  
    
    // 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character
    let decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (!inputP.value.match(decimal)) {
        message.innerHTML = "**Fill the right password please!";
        inputP.style.boxShadow = "0 0 2px 1px red";
        return false;
     }
    //  else {
    //     inputP.style.boxShadow = "0 0 2px 1px green";
    // }
    //maximum length of password validation  
    if(inputP.value.length > 15) {  
        message.innerHTML = "**Password length must not exceed 15 characters";  
        inputP.style.boxShadow = "0 0 2px 1px red";
       return false;  
    } else {  
        inputP.style.boxShadow = "0 0 2px 1px green";
        // alert("Password is correct");  
    } 
  }

  function onClick () {
    message.innerHTML = "";
      return inputP.style.boxShadow = "0 0 1px 1px blue";
  }



  