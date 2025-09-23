let inventario = {...productos}; // del inventario.js

const localData = JSON.parse(localStorage.getItem('inventario')) || {};
for (let key in localData) {
  if (!inventario[key]) inventario[key] = localData[key];
}

function calcularDias(producto) {
  const cantidad = producto.cantidad_disponible ?? producto.peso_disponible ?? 0;
  const uso = producto.uso_diario_cantidad ?? producto.uso_diario_peso ?? 1;
  return Math.floor(cantidad / uso);
}

let filtro = '';
function renderizar() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  const productosArray = Object.entries(inventario)
    .filter(([_, info]) => !filtro || info.categoria === filtro)
    .sort(([_, a], [__, b]) => calcularDias(a) - calcularDias(b));

  for (let [nombre, info] of productosArray) {
    const dias = calcularDias(info);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${nombre}</h3>
      <span class="dias">${dias}</span>
      <div class="uso-diario">Uso diario: ${info.uso_diario_cantidad ?? info.uso_diario_peso ?? 0}</div>
      <button onclick="actualizarProducto('${nombre}')">Actualizar</button>
    `;
    grid.appendChild(card);
  }
}

function filtrarCategoria(cat) {
  filtro = cat;
  renderizar();
}

function actualizarProducto(nombre) {
  const prod = inventario[nombre];
  let valor = prompt(`Nueva cantidad/peso de "${nombre}"`, prod.cantidad_disponible ?? prod.peso_disponible ?? 0);
  valor = parseFloat(valor);
  if (!isNaN(valor)) {
    if (prod.cantidad_disponible !== null) prod.cantidad_disponible = valor;
    else prod.peso_disponible = valor;
    prod.fecha_actualizacion = new Date().toISOString();
    localStorage.setItem('inventario', JSON.stringify(inventario));
    renderizar();
  }
}

function agregarProducto() {
  const nombre = prompt('Nombre del producto:');
  if (!nombre) return;
  const categoria = prompt('Categoría: Congelado, Refrigerado, Elaborado, Seco');
  inventario[nombre] = {
    cantidad_caja: 0,
    peso_caja: 0,
    cantidad_disponible: 0,
    peso_disponible: 0,
    uso_diario_cantidad: 0,
    uso_diario_peso: 0,
    fecha_actualizacion: new Date().toISOString(),
    categoria: categoria || 'Seco'
  };
  localStorage.setItem('inventario', JSON.stringify(inventario));
  renderizar();
}

function descargarJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inventario, null, 2));
  const a = document.createElement('a');
  a.href = dataStr;
  a.download = "inventario_actualizado.json";
  a.click();
}

renderizar();
