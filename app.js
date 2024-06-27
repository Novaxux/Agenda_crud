
// cargarElementos al cargar página
window.onload = () => agenda.cargarElementos()
// funcion para agregar elementos a la agenda

class contacto {
    constructor (name,phone, image){
        this.name = name;
        this.phone = phone;
        this.image = image;
    }
    
}
class Agenda {
    constructor(){
        this.lista = JSON.parse(localStorage.getItem('lista')) || [];
    }
    guardarDatos() {
        localStorage.setItem('lista', JSON.stringify(this.lista));
      }
    agregarContacto(name, phone, image){
        this.lista.push(new contacto (name,phone,image)) 
        this.guardarDatos()
        this.cargarElementos()
    }

    buscar(){
        let patron = document.getElementById('patronContent').value.toLowerCase()
        let patronType = document.getElementById('patronType').value
        console.log(patron)
        
        // patron a buscar
        this.cargarElementos(patron,patronType)
        
       
    }

    cargarElementos (patron,patronType) {
        const contenedor = document.getElementById('agenda')
        contenedor.innerHTML = ''

        let contador = 0
        let name
        let image
        let phone
        let encontrada

        this.lista.forEach(element  => {

            switch (patronType){
                case 'name':
                name = this.lista[contador].name.toLowerCase()
                encontrada = name.includes(patron)
                break

                case 'image':
                    image = this.lista[contador].image.toLowerCase()
                    encontrada = image.includes(patron)
                break

                case 'phone':
                    phone = this.lista[contador].phone.toLowerCase()
                    encontrada = phone.includes(patron)
                break
            
            }
            if(!patron || encontrada){
                
                const elemento = ` <article class='formulario container'>
                <div class='container-header'>
                <h1>${element.name}</h1>
                <img class='fotografia' src="${element.image}" alt="fotografia">
                </div>
                <div>
                <p><b>Teléfono</b><br>${element.phone}</p>
                </div>
                <div>
                <button onclick=agenda.Editar(${contador})>Editar</button>
                <button onclick=agenda.Borrar(${contador})>Borrar</button>
                </div>
                </article>
                `
                contenedor.innerHTML+=elemento
            }
            contador++
        }
    )
}

Borrar(element) {
    const confBorrar = document.getElementById('confBorrar')
    const confBorrarTrue = document.getElementById('confBorrarTrue')
    const confBorrarFalse = document.getElementById('confBorrarFalse')
    confBorrar.showModal()
        confBorrarTrue.onclick = () => {
            this.lista.splice(element,1)
            this.guardarDatos()
            this.cargarElementos()
            confBorrar.close()

        }
        confBorrarFalse.onclick = () => {
            confBorrar.close()
        }
   }
   
   
   Editar(element) {
       const confEditar = document.getElementById('confEditar')
       const confEditarTrue = document.getElementById('confEditarTrue')
       const confEditarFalse = document.getElementById('confEditarFalse')
    //    valor del elemento al editar
        document.getElementById('ename').value = this.lista[element].name
        document.getElementById('eimage').value = this.lista[element].image
        document.getElementById('ephone').value = this.lista[element].phone

    //    Abrir el modal
       confEditar.showModal()

    //    guardar datos
       confEditarTrue.onclick = () => {

        this.lista[element].name = document.getElementById('ename').value
        this.lista[element].image = document.getElementById('eimage').value
        this.lista[element].phone = document.getElementById('ephone').value
        
           this.guardarDatos()
           this.cargarElementos()
        
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
