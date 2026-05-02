<script setup>
import { ref, watch, onMounted } from 'vue';

const terminoBusqueda = ref('');
const resultados = ref([]);
const todosLosPerfumes = ref([]);

// Cargar los perfumes desde el archivo
onMounted(async () => {
  try {
    const module = await import('../../data/perfumes.js');
    todosLosPerfumes.value = module.perfumes;
    resultados.value = todosLosPerfumes.value;
  } catch (error) {
    console.error('Error cargando perfumes:', error);
  }
});

// Función de búsqueda
const realizarBusqueda = () => {
  const termino = terminoBusqueda.value.toLowerCase().trim();
  
  if (!termino) {
    resultados.value = todosLosPerfumes.value;
  } else {
    resultados.value = todosLosPerfumes.value.filter(perfume => 
      perfume.nombre.toLowerCase().includes(termino) ||
      perfume.descripcion.toLowerCase().includes(termino) ||
      perfume.categoria.toLowerCase().includes(termino) ||
      perfume.notas.some(nota => nota.toLowerCase().includes(termino))
    );
  }
  
  // Emitir evento para que la página actualice los resultados
  const event = new CustomEvent('resultados-busqueda', {
    detail: { resultados: resultados.value, termino: terminoBusqueda.value }
  });
  window.dispatchEvent(event);
};

// Buscar en tiempo real
watch(terminoBusqueda, () => {
  realizarBusqueda();
});

const limpiarBusqueda = () => {
  terminoBusqueda.value = '';
  realizarBusqueda();
};
</script>

<template>
  <div class="relative max-w-md mx-auto">
    <div class="relative">
      <input 
        type="text"
        v-model="terminoBusqueda"
        placeholder="🔍 Buscar perfumes por nombre, descripción o notas..."
        class="w-full px-4 py-3 bg-surface border border-primary-dark/30 rounded-full text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
      />
      <button 
        v-if="terminoBusqueda"
        @click="limpiarBusqueda"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary"
      >
        ✕
      </button>
    </div>
    
    <!-- Contador de resultados -->
    <div v-if="terminoBusqueda" class="text-center mt-2 text-sm text-text-muted">
      {{ resultados.length }} resultado(s) encontrado(s)
    </div>
  </div>
</template>
onMounted(async () => {
  try {
    const module = await import('../../data/perfumes.js');
    todosLosPerfumes.value = module.perfumes;
    resultados.value = todosLosPerfumes.value;
  } catch (error) {
    console.error('Error cargando perfumes:', error);
  }
  
  // 👇 NUEVO: Escuchar evento de limpieza externa
  window.addEventListener('limpiar-buscador', () => {
    terminoBusqueda.value = '';
    realizarBusqueda();
  });
});