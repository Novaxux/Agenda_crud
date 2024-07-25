document.getElementById('login_form').addEventListener('submit',function login (e){
    e.preventDefault();

    const username = document.getElementById('user').value
    const password = document.getElementById('password').value

            // Llamar a la API de inicio de sesión
            fetch('http://localhost/Agenda_repaso/login.php?usuario=' + encodeURIComponent(username) + '&contrasena=' + encodeURIComponent(password))
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.status === 'ok') {
         
                    //alert('Inicio de sesión exitoso');
                    // Redirigir a una página protegida o realizar alguna acción adicional
                    // Almacena los datos del usuario en el Almacenamiento Web
                    delete data.data.contrasena
                    localStorage.setItem('authUser', JSON.stringify(data.data));
                    // Redirige al usuario a la página de inicio
                    window.location.href = 'app.html';
                } else {
                    // Inicio de sesión fallido
                    alert(data.message);
                }
            })
            .catch(error => {
                alert('Error al llamar a la API de inicio de sesión');
                console.error('Error:', error);
            });

} )