<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useCarritoStore } from '../../store/carrito';
import { useFavoritosStore } from '../../store/favoritos';
import { useMonedaStore } from '../../store/moneda';
import ProductoModal from './ProductoModal.vue';
import { ShoppingCart, Package, Heart } from 'lucide-vue-next';

const props = defineProps({
  producto: Object
});

const carritoStore = useCarritoStore();
const favoritosStore = useFavoritosStore();
const monedaStore = useMonedaStore();

const modalAbierto = ref(false);
const mostrarNotificacion = ref(false);
const productoAgregado = ref('');
const imagenError = ref(false);
const esFavorito = ref(false);
const precioFormateado = ref('');
const precioOfertaFormateado = ref('');
const oldPrecioFormateado = ref('');

const estadoConfig = {
  disponible: { texto: "Disponible", color: "text-green-500", bg: "bg-green-500/10", sePuedeComprar: true },
  transito: { texto: "En camino", color: "text-yellow-500", bg: "bg-yellow-500/10", sePuedeComprar: false },
  proximamente: { texto: "Próximamente", color: "text-blue-500", bg: "bg-blue-500/10", sePuedeComprar: false }
};

const estado = estadoConfig[props.producto.estadoEnvio] || estadoConfig.disponible;

const actualizarPrecios = () => {
  precioFormateado.value = monedaStore.getPrecioFormateado(props.producto.precio);
  if (props.producto.precioOferta) {
    precioOfertaFormateado.value = monedaStore.getPrecioFormateado(props.producto.precioOferta);
  }
  if (props.producto.oldPrice) {
    oldPrecioFormateado.value = monedaStore.getPrecioFormateado(props.producto.oldPrice);
  }
};

const agregarAlCarrito = () => {
  if (!estado.sePuedeComprar) {
    alert(`❌ ${estado.texto}. No disponible para comprar.`);
    return;
  }
  
  carritoStore.agregarProducto(props.producto, 1);
  productoAgregado.value = props.producto.nombre;
  mostrarNotificacion.value = true;
};

const toggleFavorito = () => {
  favoritosStore.toggleFavorito(props.producto);
  esFavorito.value = favoritosStore.estaEnFavoritos(props.producto.id);
};

const abrirModal = () => {
  modalAbierto.value = true;
};

const cerrarModal = () => {
  modalAbierto.value = false;
};

const cerrarNotificacion = () => {
  mostrarNotificacion.value = false;
};

const handleImageError = () => {
  imagenError.value = true;
};

const actualizarMoneda = () => {
  actualizarPrecios();
};

onMounted(() => {
  esFavorito.value = favoritosStore.estaEnFavoritos(props.producto.id);
  actualizarPrecios();
  window.addEventListener('moneda-cambiada', actualizarMoneda);
});

onUnmounted(() => {
  window.removeEventListener('moneda-cambiada', actualizarMoneda);
});
</script>

<template>
  <div 
    @click="abrirModal"
    class="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-primary-dark/30 hover:border-primary relative"
  >
    <div v-if="producto.enOferta && producto.estadoEnvio === 'disponible'" class="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
      OFERTA
    </div>
    
    <div :class="[estado.bg, 'absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-bold']">
      <span :class="estado.color">{{ estado.texto }}</span>
    </div>
    
    <button 
      @click.stop="toggleFavorito"
      class="absolute bottom-2 right-2 z-10 bg-black/50 rounded-full p-2 hover:scale-110 transition-all"
    >
      <Heart 
        class="w-5 h-5" 
        :class="esFavorito ? 'fill-red-500 text-red-500' : 'text-white'"
      />
    </button>
    
    <div class="h-64 bg-gradient-to-br from-surface to-background flex items-center justify-center relative overflow-hidden">
      <img 
        v-if="props.producto.imagen && props.producto.imagen !== '' && !imagenError"
        :src="props.producto.imagen" 
        :alt="props.producto.nombre"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <div v-else class="text-center">
        <Package class="w-20 h-20 opacity-50 group-hover:scale-110 transition-transform duration-300 text-primary mx-auto mb-2" />
        <p class="text-text-muted text-sm">{{ props.producto.nombre }}</p>
      </div>
    </div>
    
    <div class="p-5">
      <h3 class="font-bold text-xl mb-2 text-text group-hover:text-primary transition-colors">
        {{ producto.nombre }}
      </h3>
      <p class="text-text-muted text-sm mb-3 line-clamp-2">
        {{ producto.descripcion }}
      </p>
      
      <div class="mb-2">
        <div v-if="producto.enOferta && producto.estadoEnvio === 'disponible'" class="flex items-center gap-2">
          <span class="text-text-muted line-through text-sm">{{ oldPrecioFormateado || precioFormateado }}</span>
          <span class="text-2xl font-bold text-red-500">{{ precioOfertaFormateado }}</span>
        </div>
        <div v-else class="text-2xl font-bold text-primary">{{ precioFormateado }}</div>
      </div>
      
      <button 
        @click.stop="agregarAlCarrito"
        :disabled="!estado.sePuedeComprar"
        class="w-full bg-primary-dark hover:bg-primary text-white px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <ShoppingCart class="w-4 h-4" /> 
        {{ estado.sePuedeComprar ? 'Agregar' : estado.texto }}
      </button>
    </div>
  </div>
  
  <ProductoModal 
    :producto="producto" 
    :abierto="modalAbierto" 
    @cerrar="cerrarModal"
  />
</template>