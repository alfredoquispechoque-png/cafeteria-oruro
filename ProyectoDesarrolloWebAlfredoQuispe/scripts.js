// ==============================
// MANEJO DEL CARRITO DE COMPRAS
// ==============================

// Cargar carrito desde localStorage o iniciar vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Guardar el carrito
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Actualizar la vista del carrito
function actualizarCarrito() {
  const contenedor = document.getElementById("carrito-contenido");
  const totalElement = document.getElementById("carrito-total");

  if (!contenedor || !totalElement) return;

  contenedor.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>🛒 Tu carrito está vacío.</p>";
    totalElement.textContent = "Total: Bs 0";
    return;
  }

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const productoHTML = `
      <div class="carrito-item">
        <span>${item.nombre}</span>
        <span>Cant: ${item.cantidad}</span>
        <span>Bs ${item.precio}</span>
        <span>Subtotal: Bs ${subtotal}</span>
        <button class="btn-quitar" data-index="${index}">❌</button>
      </div>
    `;
    contenedor.innerHTML += productoHTML;
  });

  totalElement.textContent = `Total: Bs ${total}`;
}

// Agregar productos al carrito
function agregarAlCarrito(nombre, precio) {
  const existente = carrito.find(item => item.nombre === nombre);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  guardarCarrito();
  actualizarCarrito();
}

// Quitar productos del carrito
function quitarDelCarrito(index) {
  carrito[index].cantidad--;

  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }

  guardarCarrito();
  actualizarCarrito();
}

// ==============================
// EVENTOS
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  actualizarCarrito();

  // Escucha clics en los botones "Añadir al carrito"
  const botones = document.querySelectorAll(".btn-agregar");
  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      // Encuentra la tarjeta completa del producto
      const productoCard = boton.closest(".producto-card");

      // Extrae los datos del frente
      const nombre = productoCard.querySelector(".card-front h3").textContent.trim();
      const precioTexto = productoCard.querySelector(".card-front .precio").textContent.trim();

      // Convierte el precio a número
      const precio = parseFloat(precioTexto.replace("Bs", "").trim());

      agregarAlCarrito(nombre, precio);
    });
  });

  // Escucha clics en los botones "❌" del carrito
  const contenedor = document.getElementById("carrito-contenido");
  contenedor.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-quitar")) {
      const index = e.target.dataset.index;
      quitarDelCarrito(index);
    }
  });
});
