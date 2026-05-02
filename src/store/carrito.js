import { reactive } from 'vue';

// Cargar carrito guardado en localStorage
const cargarCarritoGuardado = () => {
  if (typeof window !== 'undefined') {
    const guardado = localStorage.getItem('carrito-agape');
    if (guardado) {
      try {
        return JSON.parse(guardado);
      } catch (e) {
        console.error('Error al cargar carrito:', e);
        return [];
      }
    }
  }
  return [];
};

// Guardar carrito en localStorage
const guardarCarrito = (items) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('carrito-agape', JSON.stringify(items));
  }
};

const state = reactive({
  items: cargarCarritoGuardado()
});

export function useCarritoStore() {
  const agregarProducto = (producto, cantidad = 1) => {
    const existente = state.items.find(item => item.id === producto.id);
    
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      state.items.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,  // SIEMPRE en USD
        cantidad: cantidad,
        imagen: producto.imagen || ''
      });
    }
    
    guardarCarrito(state.items);
  };
  
  const eliminarProducto = (productoId) => {
    state.items = state.items.filter(item => item.id !== productoId);
    guardarCarrito(state.items);
  };
  
  const actualizarCantidad = (productoId, cantidad) => {
    const producto = state.items.find(item => item.id === productoId);
    if (producto) {
      producto.cantidad = cantidad;
      if (producto.cantidad <= 0) {
        eliminarProducto(productoId);
      } else {
        guardarCarrito(state.items);
      }
    }
  };
  
  const vaciarCarrito = () => {
    state.items = [];
    guardarCarrito(state.items);
  };
  
  return {
    items: state.items,
    agregarProducto,
    eliminarProducto,
    actualizarCantidad,
    vaciarCarrito,
    get totalItems() {
      return state.items.reduce((total, item) => total + item.cantidad, 0);
    },
    get totalPrecio() {
      return state.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    },
    get itemsEnCarrito() {
      return state.items;
    }
  };
}