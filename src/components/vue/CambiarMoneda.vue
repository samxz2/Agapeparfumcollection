<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useMonedaStore } from '../../store/moneda';

const monedaStore = useMonedaStore();
const monedaActual = ref('usd');

const toggleMoneda = () => {
  monedaStore.toggleMoneda();
  monedaActual.value = monedaStore.getMonedaActual();
};

const actualizarMoneda = () => {
  monedaActual.value = monedaStore.getMonedaActual();
};

onMounted(() => {
  monedaActual.value = monedaStore.getMonedaActual();
  window.addEventListener('moneda-cambiada', actualizarMoneda);
});

onUnmounted(() => {
  window.removeEventListener('moneda-cambiada', actualizarMoneda);
});
</script>

<template>
  <button 
    @click="toggleMoneda"
    class="flex items-center gap-2 bg-surface border border-primary-dark/30 hover:border-primary rounded-full px-3 py-1.5 md:px-4 md:py-2 transition-all duration-300"
  >
    <span class="text-xs md:text-sm font-medium text-text">
      {{ monedaActual === 'usd' ? 'USD' : 'Bs' }}
    </span>
    <svg class="w-3 h-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>
</template>