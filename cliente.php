<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

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

// Funciones para el control de clientes
function agregarCliente($nombre, $telefono, $urlFoto, $idUsuario) {
    global $conn;
    $sql = "INSERT INTO clientes (nombre, telefono, url_foto, id_usuario) VALUES ('$nombre', '$telefono', '$urlFoto', $idUsuario)";
    
    if ($conn->query($sql) === TRUE) {
        return array('status' => 'success', 'message' => 'Cliente agregado exitosamente');
    } else {
        return array('status' => 'error', 'message' => 'Error al agregar el cliente: ' . $conn->error);
    }
}

// funcion para cargar los clientes
function obtenerClientes($id_usuario) {
    global $conn;
    $sql = "SELECT * FROM clientes WHERE id_usuario = $id_usuario";
    $result = $conn->query($sql);
    
    $clientes = array();
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $clientes[] = $row;
        }
            return array('status' => 'success', 'data' => $clientes);
        }else {
            return array('status' => 'error', 'message' => 'No se encontraron clientes');
        }
    
    
}   

function eliminarCliente($idCliente) {
    global $conn;
    $sql = "DELETE FROM clientes WHERE id = $idCliente";
    
    if ($conn->query($sql) === TRUE) {
        return array('status' => 'success', 'message' => 'Cliente borrado exitosamente');
    } else {
        return array('status' => 'error', 'message' => 'Error al borrar el cliente: ' . $conn->error);
    }
}

$accion = isset($_GET['accion']) ? $_GET['accion'] : '';

switch ($accion) {
    case 'agregarCliente':
        $nombre = $_GET['nombre'];
        $telefono = $_GET['telefono'];
        $urlFoto = $_GET['url_foto'];
        $idUsuario = $_GET['idUsuario'];
        
        $response = agregarCliente($nombre, $telefono, $urlFoto, $idUsuario);
        echo json_encode($response);
        break;
   case 'obtenerClientes':
        $id_usuario = $_GET['idUsuario'];
        $clientes = obtenerClientes($id_usuario);
        echo json_encode($clientes);
        break;
    
    case 'eliminarCliente':
        $idCliente = $_GET['idCliente'];
        
        if (eliminarCliente($idCliente)) {
            echo "Cliente eliminado exitosamente";
        } else {
            echo "Error al eliminar el cliente";
        }
        break;

    default:
        echo json_encode(array('status' => 'error', 'message' => 'Acción no válida'));
}

$conn->close();
?>
