/*INICIO DEL PROGRAMA */

let productosArray = [] // Defino un arreglo para almacenar productos

// Obtengo productos almacenados en localStorage al cargar la página *no olvidar
cargarProductosDesdeLocalStorage()

let nombresDuplicados = new Set() // Defino un conjunto para llevar un seguimiento de los nombres duplicados

let miformulario = document.getElementById("formulario") // Obtengo una referencia al elemento HTML <form> con el ID "formulario"
miformulario.addEventListener("submit", agregarProductosSistema) // Agrego un evento "submit" al formulario para llamar a la función "validarFormulario" cuando se envíe

let miformularioBorrado = document.getElementById("formularioBorrado") // Obtengo una referencia al elemento HTML <form> con el ID "formulario"
miformularioBorrado.addEventListener("submit", borrarFormulario) // Agrego un evento "submit" al formulario para llamar a la función "validarFormulario" cuando se envíe

const listaProductos = document.getElementById("listaProductos") // Cambia "listaBorraProductos" a "listaProductos"
const mensajeAlerta = document.getElementById("mensaje-alerta")

// FUNCION PARA CARGAR PRODUCTOS DESDE LOCALSTORAGE
function cargarProductosDesdeLocalStorage() {
    console.log("Función cargar Productos Desde LocalStorage llamada!")//hago un console.log a cada funcion para ver si estan funcionando correctamente.
    const productosLocalStorage = localStorage.getItem("productosArray")
    if (productosLocalStorage) {
        productosArray = JSON.parse(productosLocalStorage)
    }
}

// FUNCION PARA GUARDAR PRODUCTOS EN LOCALSTORAGE
function guardarProductosEnLocalStorage() {
    console.log("Función guardar Productos En Local Storage llamada!")
    localStorage.setItem("productosArray", JSON.stringify(productosArray))
}

// FUNCION MENSAJE DE ALERTA EN TIEMPO
function mostrarMensaje(mensaje) {
    console.log("Función mostrar error llamada!")
    mensajeAlerta.textContent = mensaje
    setTimeout(function () {
        mensajeAlerta.textContent = "" // Borra el contenido del mensaje
    }, 4000)
}

// FUNCION AGREGAR PRODUCTOS
function agregarProductosSistema(variable) {//le puse nombre variable a la variable a futuro le colocare un nombre relacionado 
    console.log("Función agregar Productos Sistema llamada!")
    variable.preventDefault()
    let formulario = variable.target

    let nombre = formulario.querySelector("#producto").value.trim().toUpperCase() // Trim para eliminar espacios en blanco, lo deje en blanco para ocuparlo mas adelante
    let descripcion = formulario.querySelector("#descripcion-producto").value
    let precio = parseFloat(formulario.querySelector("#precio").value)
    let precioRebajado = parseFloat(formulario.querySelector("#precio-rebajado").value)
    let cantidad = parseInt(formulario.querySelector("#cantidad").value)
    let categoria = formulario.querySelector("#categoria").value.toUpperCase()

    // Verifica si el campo de categoría no está vacío
    if (categoria.trim() === "") {
        const mensajeError = "Error: El campo de categoría no puede estar vacío"
        mostrarMensaje(mensajeError)
        console.log("Error: El campo de categoría no puede estar vacío")
        return // Detiene la función si la categoría está vacía
    }

    if (!isNaN(cantidad) && cantidad >= 1) {
        const productoExistente = productosArray.find(function (producto) {
            return producto.nombre === nombre
        })

        if (productoExistente) {
            if (precioRebajado >= precio) {
                const mensajeError = `Error: El precio rebajado debe ser inferior al precio normal`
                mostrarMensaje(mensajeError)
                console.log("Error: El precio rebajado debe ser inferior al precio normal")
            } else {
                // Si el producto ya existe, actualiza el precio y la cantidad
                productoExistente.precio = precio
                productoExistente.precioRebajado = precioRebajado
                productoExistente.descripcion = descripcion
                productoExistente.cantidad += cantidad
                productoExistente.categoria = categoria
                const mensaje = `Se actualizó la cantidad de "${cantidad}" del producto "${nombre}" en el sistema!`
                mostrarMensaje(mensaje)
                console.log(`Se actualizó el precio y la cantidad del producto "${nombre}" en el sistema!`)
            }
        } else {
            if (precioRebajado >= precio) {
                const mensajeError = `Error: El precio rebajado debe ser inferior al precio normal!`
                mostrarMensaje(mensajeError)
            } else {
                // Si el producto no existe, se agrega y se registra la fecha y hora actual
                const agregarDatosArray = { nombre: nombre, descripcion: descripcion, precio: precio, precioRebajado: precioRebajado, cantidad: cantidad, categoria: categoria, fecha: new Date() }
                productosArray.push(agregarDatosArray)
                nombresDuplicados.add(nombre)
                // Aquí se muestra cuando se agrega el producto y el mensaje de alerta
                const mensaje = `Producto "${nombre}" agregado al sistema!`
                mostrarMensaje(mensaje)
                console.log(`Producto "${nombre}" agregado al sistema!`)
            }
        }

        guardarProductosEnLocalStorage() // Guardar productos en localStorage
        mostrarProductos() // Llama a mostrarProducto para actualizar la información
        mostrarProductosGaleria() // Llama a mostrarProductosGalería para actualizar la galería
    } else {
        const mensajeError = `Producto no agregado al sistema!`
        mostrarMensaje(mensajeError)
        console.log("Producto no agregado al sistema!")
    }
}

// FUNCION BORRAR PRODUCTOS
function borrarFormulario(variable) {
    console.log("Función borrar Formulario llamada!")
    variable.preventDefault()
    let formulario = variable.target
    let nombre = formulario.querySelector("#productoB").value.toUpperCase()
    let cantidad = parseInt(formulario.querySelector("#cantidadB").value)

    if (!isNaN(cantidad) && cantidad >= 1) {
        const index = productosArray.findIndex(function (producto) {
            return producto.nombre === nombre
        })

        if (index !== -1) {
            if (cantidad >= productosArray[index].cantidad) {
                productosArray.splice(index, 1)
                nombresDuplicados.delete(nombre) // Elimina el nombre duplicado del *conjunto
                const mensaje = `Producto "${nombre}" eliminado completamente del sistema.`
                // aquí se agrega el mensaje de alerta cuando se borra un producto
                mostrarMensaje(mensaje)
                console.log(`Producto "${nombre}" eliminado completamente del sistema.`)
            } else {
                productosArray[index].cantidad -= cantidad
                console.log(`Cantidad ${cantidad} del producto "${nombre}" eliminada del sistema.`)
                // aquí se agrega el mensaje de alerta cuando se borra un producto
                const mensaje = `Cantidad ${cantidad} del producto "${nombre}" eliminada del sistema.`
                mostrarMensaje(mensaje)
            }

            guardarProductosEnLocalStorage() // Guardar productos en localStorage
            mostrarProductos() // llama a mostrarProductos para actualizar
            mostrarProductosGaleria() // Llama a mostrarProductosGaleria para actualizar la galería
        } else {
            // aquí se agrega el mensaje de alerta cuando se borra un producto
            const mensajeError = `Producto no encontrado en el sistema.`
            mostrarMensaje(mensajeError)
            console.log("Producto no encontrado en el sistema.")
        }
    } else {
        console.log("Cantidad inválida.")
    }
}

// FUNCION PARA MOSTRAR PRODUCTOS
function mostrarProductos() {
    console.log("Función mostrar Productos llamada!")
    const listaProductos = document.getElementById("listaProductos")
    listaProductos.innerHTML = ''

    if (productosArray.length > 0) {
        for (let i = 0; i < productosArray.length; i++) {
            const producto = productosArray[i]
            const fila = document.createElement("tr")
            const numCelda = document.createElement("td")
            numCelda.textContent = i + 1
            const nombreCelda = document.createElement("td")
            nombreCelda.textContent = producto.nombre
            const precioCelda = document.createElement("td")
            precioCelda.textContent = `$${producto.precio.toFixed(0)}` // cambio el interior de fixed para mostrar los decimales
            const precioRebajadoCelda = document.createElement("td")
            precioRebajadoCelda.textContent = `$${producto.precioRebajado.toFixed(0)}` // cambio el interior de fixed para mostrar los decimales
            const cantidadCelda = document.createElement("td")
            cantidadCelda.textContent = producto.cantidad
            const categoriaCelda = document.createElement("td")
            categoriaCelda.textContent = producto.categoria

            fila.appendChild(numCelda)
            fila.appendChild(nombreCelda)
            fila.appendChild(precioCelda)
            fila.appendChild(precioRebajadoCelda)
            fila.appendChild(cantidadCelda)
            fila.appendChild(categoriaCelda)

            listaProductos.appendChild(fila)
        }
    } else {
        console.log("No hay productos en el sistema.")
    }
}

// FUNCION PARA MOSTRAR PRODUCTOS GALERIA
function mostrarProductosGaleria() {
    // me avisa si la función se ejecuta correctamente y me imprime en consola
    console.log("Función mostrar Productos Galeria llamada!")

    const galeria = document.getElementById("galeria")
    galeria.innerHTML = '' // Borra el contenido actual del contenedor

    // Ordena los productos por fecha (de menor a mayor)
    productosArray.sort((a, b) => a.fecha - b.fecha)

    productosArray.forEach((producto) => {
        if (producto.cantidad > 0) {
            // Crea una card para el producto
            const card = document.createElement("div")
            card.classList.add("card")
            card.style.width = "18rem"

            // Crea el contenido de la card
            const cardBody = document.createElement("div")
            cardBody.classList.add("card-body")

            const cardTitle = document.createElement("h5")
            cardTitle.classList.add("card-title")
            cardTitle.textContent = producto.nombre // Nombre del producto

            const cardCategorias = document.createElement("p")
            cardCategorias.classList.add("card-Categorias")
            cardCategorias.textContent = `Categorias: ${producto.categoria}`

            const cardPrecio = document.createElement("p")
            cardPrecio.classList.add("card-precio")
            cardPrecio.textContent = `$${producto.precio}`

            const cardPreciorebajado = document.createElement("p")
            cardPreciorebajado.classList.add("card-precioRebajado")
            cardPreciorebajado.textContent = `$${producto.precioRebajado}`

            /* const cardTextCantidad = document.createElement("p")//la ocupare mas adelante
            cardTextCantidad.classList.add("card-cantidad")
            cardTextCantidad.textContent = `Cantidad: ${producto.cantidad}` */

            const cardDescripcion = document.createElement("p")
            cardDescripcion.classList.add("card-descripcion")
            cardDescripcion.textContent = `Detalles: ${producto.descripcion}`

            // Agrega un botón
            const boton = document.createElement("a")
            boton.href = "#" // Agrega la URL a la que debe dirigir el botón, la ocupare mas adelante
            boton.classList.add("btn", "btn-primary")
            boton.textContent = "Añadir al carrito(no disponible)" // Texto del botón

            // Agrega los elementos a la card
            cardBody.appendChild(cardTitle)
            cardBody.appendChild(cardPrecio)
            cardBody.appendChild(cardPreciorebajado)
            cardBody.appendChild(cardCategorias)
            /* cardBody.appendChild(cardTextCantidad) */
            cardBody.appendChild(cardDescripcion)
            cardBody.appendChild(boton)
            card.appendChild(cardBody)

            // Agrega la card a la galería
            galeria.appendChild(card)
        }
    })
}

/* FIN DEL PROGRAMA  */