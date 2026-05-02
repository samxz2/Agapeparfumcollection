import { reactive } from 'vue';

const cargarFavoritosGuardados = () => {
  if (typeof window !== 'undefined') {
    const guardado = localStorage.getItem('favoritos-agape');
    if (guardado) {
      try {
        return JSON.parse(guardado);
      } catch (e) {
        console.error('Error al cargar favoritos:', e);
        return [];
      }
    }
  }
  return [];
};

const guardarFavoritos = (items) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('favoritos-agape', JSON.stringify(items));
    // Disparar evento manual para actualizar otras pestañas
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'favoritos-agape',
      newValue: JSON.stringify(items)
    }));
  }
};

const state = reactive({
  items: cargarFavoritosGuardados()
});

export function useFavoritosStore() {
  const agregarFavorito = (producto) => {
    const existente = state.items.find(item => item.id === producto.id);
    
    if (!existente) {
      state.items.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        precioOferta: producto.precioOferta,
        enOferta: producto.enOferta,
        imagen: producto.imagen || '',
        categoria: producto.categoria,
        estadoEnvio: producto.estadoEnvio
      });
      guardarFavoritos(state.items);
    }
  };
  
  const eliminarFavorito = (productoId) => {
    state.items = state.items.filter(item => item.id !== productoId);
    guardarFavoritos(state.items);
  };
  
  const toggleFavorito = (producto) => {
    const existente = state.items.find(item => item.id === producto.id);
    if (existente) {
      eliminarFavorito(producto.id);
    } else {
      agregarFavorito(producto);
    }
  };
  
  const estaEnFavoritos = (productoId) => {
    return state.items.some(item => item.id === productoId);
  };
  
  const vaciarFavoritos = () => {
    state.items = [];
    guardarFavoritos(state.items);
  };
  
  return {
    items: state.items,
    agregarFavorito,
    eliminarFavorito,
    toggleFavorito,
    estaEnFavoritos,
    vaciarFavoritos,
    get totalFavoritos() {
      return state.items.length;
    }
  };
}