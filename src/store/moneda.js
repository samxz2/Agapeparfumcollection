import { reactive } from 'vue';

export const TASA_BCV = 630.00;  

const cargarMonedaGuardada = () => {
  if (typeof window !== 'undefined') {
    const guardado = localStorage.getItem('moneda-agape');
    if (guardado === 'usd' || guardado === 'bs') {
      return guardado;
    }
  }
  return 'usd';
};

const state = reactive({
  monedaActual: cargarMonedaGuardada()
});

const guardarMoneda = (moneda) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('moneda-agape', moneda);
  }
};

export function useMonedaStore() {
  const toggleMoneda = () => {
    state.monedaActual = state.monedaActual === 'usd' ? 'bs' : 'usd';
    guardarMoneda(state.monedaActual);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('moneda-cambiada', { detail: { moneda: state.monedaActual } }));
    }
  };
  
  const getMonedaActual = () => state.monedaActual;
  
  const getPrecioFormateado = (precioUSD) => {
    if (!precioUSD && precioUSD !== 0) return state.monedaActual === 'usd' ? '$0' : 'Bs 0';
    if (state.monedaActual === 'usd') {
      return `$${formatearNumeroVE(precioUSD)}`;
    } else {
      const precioBs = precioUSD * TASA_BCV;
      return `Bs ${formatearNumeroVE(precioBs)}`;
    }
  };
  
  return {
    monedaActual: state.monedaActual,
    toggleMoneda,
    getMonedaActual,
    getPrecioFormateado
  };
}

// Función auxiliar de formateo
function formatearNumeroVE(numero) {
  if (isNaN(numero)) return '0';
  const redondeado = Math.round(numero * 100) / 100;
  const [entero, decimal] = redondeado.toString().split('.');
  const enteroFormateado = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (decimal) {
    return `${enteroFormateado},${decimal}`;
  }
  return enteroFormateado;
}