import { reactive } from 'vue';

// Cargar estadísticas guardadas
const cargarEstadisticas = () => {
  if (typeof window !== 'undefined') {
    const guardado = localStorage.getItem('analytics-agape');
    if (guardado) {
      try {
        return JSON.parse(guardado);
      } catch (e) {
        console.error('Error al cargar analytics:', e);
      }
    }
  }
  

  return { 
    compras: {}
  };
};

const guardarEstadisticas = (stats) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('analytics-agape', JSON.stringify(stats));
  }
};

const state = reactive(cargarEstadisticas());

export function useAnalyticsStore() {
  const registrarCompra = (productoId, cantidad = 1) => {
    if (!state.compras[productoId]) {
      state.compras[productoId] = 0;
    }
    state.compras[productoId] += cantidad;
    guardarEstadisticas(state);
  };
  
  const getBestSellers = (productos, limite = 8) => {
    const conVentas = productos.map(producto => ({
      ...producto,
      ventas: state.compras[producto.id] || 0
    }));
    
    conVentas.sort((a, b) => b.ventas - a.ventas);
    
    // Si no hay ventas, devuelve array vacío
    const conVentasReales = conVentas.filter(p => p.ventas > 0);
    
    return conVentasReales.slice(0, limite);
  };
  
  const getTotalVentas = () => {
    return Object.values(state.compras).reduce((total, cant) => total + cant, 0);
  };
  
  return {
    compras: state.compras,
    registrarCompra,
    getBestSellers,
    getTotalVentas
  };
}