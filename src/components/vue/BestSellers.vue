<script setup>
import { ref, onMounted } from 'vue';
import { useAnalyticsStore } from '../../store/analytics';
import { perfumes } from '../../data/perfumes.js';
import ProductoCard from './ProductoCard.vue';

const analyticsStore = useAnalyticsStore();
const bestSellers = ref([]);

onMounted(() => {
  // Obtener los 8 productos más comprados
  bestSellers.value = analyticsStore.getBestSellers(perfumes, 8);
});
</script>

<template>
  <section class="container mx-auto px-4 py-16">
    <div class="text-center mb-12">
      <div class="flex justify-center mb-4">
        <svg class="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="" />
        </svg>
      </div>
      <h2 class="text-3xl md:text-4xl font-bold text-primary mb-4">Más Vendidos</h2>
      <p class="text-text-muted max-w-2xl mx-auto">
        Los perfumes favoritos de nuestra comunidad. ¡Los más elegidos por nuestros clientes!
      </p>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductoCard 
        v-for="producto in bestSellers" 
        :key="producto.id"
        :producto="producto"
        client:load
      />
    </div>
    
    <div v-if="bestSellers.length === 0" class="text-center text-text-muted py-12">
      <p>Aún no hay suficientes ventas registradas.</p>
      <p class="text-sm mt-2">¡Sé el primero en comprar!</p>
    </div>
  </section>
</template>