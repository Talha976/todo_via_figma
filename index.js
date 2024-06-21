
function togglePasswordVisibility() {
    const show = document.getElementById('showPasswordBtn');
    const password = document.getElementById('password');

    if(password.type === 'password'){
        password.type = 'text';
        show.textContent = 'Hide';
    }
    else{
        password.type = 'password';
        show.textContent = 'Show'
    }

}

function submit(event){
    event.preventDefault();
    let email = document.getElementById('email').value; 
    let password = document.getElementById('password').value;     
   const hashedPassword = sha256(password);
   var formData = {
        'email' : email,
        'password': hashedPassword
   }

   localStorage.setItem('userForm',JSON.stringify(formData));
   window.location.href = 'todo.html';
   email = '';
   password = '';

}

document.getElementById('loginForm').addEventListener('submit', submit);