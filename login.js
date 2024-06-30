document.getElementById('login_form').addEventListener('submit',function login (e){
    e.preventDefault();

    const user = document.getElementById('user').value
    const password = document.getElementById('password').value

    if (user === 'manuel' && password === '123'){
        window.location.href = 'app.html'
    }else{
        alert('Usuario o contraseña incorrectos')
    }


} )