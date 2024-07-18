<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "agenda_base";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    $response = array(
        'status' => 'error',
        'message' => 'Error de conexión: ' . $conn->connect_error
    );
    echo json_encode($response);
    exit;
}

// Obtener los datos del método GET
$usuario = $_GET['usuario'];
$contrasena = $_GET['contrasena'];

// Preparar la consulta SQL
$sql = "SELECT * FROM usuarios WHERE usuario = '$usuario' AND contrasena = '$contrasena'";

// Ejecutar la consulta
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // El usuario y contraseña son correctos
    $row = $result->fetch_assoc();
    $response = array(
        'status' => 'ok',
        'message' => 'Inicio de sesión exitoso',
        'data' => $row
    );
} else {
    // El usuario o contraseña son incorrectos
    $response = array(
        'status' => 'error',
        'message' => 'Usuario o contraseña incorrectos'
    );
}

// Devolver la respuesta en formato JSON
echo json_encode($response);

// Cerrar la conexión
$conn->close();
?>