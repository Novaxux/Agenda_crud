
// cargarElementos al cargar página
window.onload = () => agenda.cargarClientes()

// funcion para agregar elementos a la agenda

class contacto {
    constructor (name,phone, image){
        this.nombre = name;
        this.telefono = phone;
        this.url_foto = image;
    }
    
}
class Agenda {
    constructor(){
        this.baseApi = 'http://localhost/Agenda_repaso/cliente.php';
        // el id del usuario
        this.userId = JSON.parse(localStorage.getItem('authUser')).id;
        // parametros a buscar
        this.params = null;
        this.list = [];


    }
    //   hacemos fetch a la api
    async fetchData(fullUrl) {
     
    fetch(fullUrl)
    .then(response => response.json()) // Convertir respuesta a JSON.
      
    .then(data => {
        console.log('Full response:', data); // Log the full response for debugging

        if (data.status === 'success') {
          if (data.message){
            console.log(data.message);
            alert(data.message); // Show success 
            this.cargarClientes()

          }
           else if(data.data){
            console.log('lista actualizada')
              this.list = data.data
              this.cargarElementos()


            }
        } else {
          if (data.message){

            console.error(data.message);
            alert(data.message); // Show error message
          }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing your request.'); // Show general error message
    });

    
    }
   
    async agregarContacto(name, phone, image){
        // la data del cliente a agrgar
        const clientData = new contacto (name,phone,image) 
        this.params = new URLSearchParams({
            ...clientData,
            idUsuario: this.userId
        });
        console.log(clientData)
        
        const url = `${this.baseApi}?accion=agregarCliente&${this.params.toString()}`;
        await this.fetchData(url); // Wait for the fetch to complete
        await this.cargarClientes(); // Reload the client list
    }

    buscar(){
        let patron = document.getElementById('patronContent').value.toLowerCase()
        let patronType = document.getElementById('patronType').value
        console.log(patron)
        
        // patron a buscar
        this.cargarElementos(patron,patronType)
        
       
    }
    cerrarSesion(){
    const confClose = document.getElementById('confClose')
    const confCloseTrue = document.getElementById('confCloseTrue')
    const confCloseFalse = document.getElementById('confCloseFalse')
    

    confClose.showModal()
        confCloseTrue.onclick = () => {
            localStorage.removeItem('authUser');
            window.location.href= 'index.html';
            confClose.close()
        }
        confCloseFalse.onclick = () => {
            confClose.close()
        }
   
    }
    async cargarClientes(){
      this.params = new URLSearchParams({
          idUsuario: this.userId
      });
      const url = `${this.baseApi}?accion=obtenerClientes&${this.params.toString()}`;

        await this.fetchData(url)
    }

    cargarElementos (patron,patronType) {
        
        const contenedor = document.getElementById('agenda')
        contenedor.innerHTML = ''
        let encontrada

     
        console.log(this.list)
        this.list.forEach((element,index)  => {

            switch (patronType){
                case 'name':
                    let nombre = this.list[index].nombre.toLowerCase()
                    encontrada = nombre.includes(patron)
                break

                case 'image':
                    let url_foto = this.list[index].url_foto.toLowerCase()
                    encontrada = url_foto.includes(patron)
                break

                case 'phone':
                    let telefono = this.list[index].telefono.toLowerCase()
                    encontrada = telefono.includes(patron)
                break
            
            }
            if(!patron || encontrada){
                
                const elemento = ` <article class='formulario container'>
                <div class='container-header'>
                <h1>${element.nombre}</h1>
                <img class='fotografia' src="${element.url_foto}" alt="fotografia">
                </div>
                <div>
                <p><b>Teléfono</b><br>${element.telefono}</p>
                </div>
                <div>
                <button onclick=agenda.Editar(${index})>Editar</button>
                <button onclick=agenda.Borrar(${index})>Borrar</button>
                </div>
                </article>
                `
                contenedor.innerHTML+=elemento
            }
            // contador++
        }
    )
    }
  
    Borrar(element) {
    const confBorrar = document.getElementById('confBorrar')
    const confBorrarTrue = document.getElementById('confBorrarTrue')
    const confBorrarFalse = document.getElementById('confBorrarFalse')
    const idCliente = this.list[element].id
    

    confBorrar.showModal()
        confBorrarTrue.onclick = async() => {
            this.params = new URLSearchParams({
                idCliente: idCliente
            });
            const url = `${this.baseApi}?accion=eliminarCliente&${this.params.toString()}`;
            console.log(url)
            await this.fetchData(url)
            this.cargarClientes()
            confBorrar.close()
        }
        confBorrarFalse.onclick = () => {
            confBorrar.close()
        }
    }
   
   
   Editar(element) {
        const idCliente = this.list[element].id

       const confEditar = document.getElementById('confEditar')
       const confEditarTrue = document.getElementById('confEditarTrue')
       const confEditarFalse = document.getElementById('confEditarFalse')
    //    valor del elemento al editar
        document.getElementById('ename').value = this.list[element].nombre
        document.getElementById('eimage').value = this.list[element].url_foto
        document.getElementById('ephone').value = this.list[element].telefono

    //    Abrir el modal
       confEditar.showModal()

    //    guardar datos
       confEditarTrue.onclick = async() => {
        const data = []
        data.nombre = document.getElementById('ename').value
        data.url_foto = document.getElementById('eimage').value
        data.telefono = document.getElementById('ephone').value
        console.log(data)
        
        this.params = new URLSearchParams({
            ...data,
            id : idCliente
        });

        const url = `${this.baseApi}?accion=editarCliente&${this.params.toString()}`;
  
          await this.fetchData(url)
        
        confEditar.close()
    }
       confEditarFalse.onclick = () => {
           confEditar.close()

        }
    }
}
const agenda = new Agenda()

document.getElementById('agregarForm').addEventListener('submit', function agregar(e){
    e.preventDefault()
    const name = document.getElementById('name').value
    document.getElementById('name').value= ''
    const phone = document.getElementById('phone').value
    document.getElementById('phone').value= ''
    const image = document.getElementById('image').value
    document.getElementById('image').value= ''
    
    agenda.agregarContacto(name,phone,image)
   
})

document.getElementById('patronContent').addEventListener('keyup',function(){
    agenda.buscar()
})

document.getElementById('closeSesion').onclick = () => {
    agenda.cerrarSesion()
}