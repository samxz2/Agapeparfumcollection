<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useCarritoStore } from '../../store/carrito';
import { useMonedaStore } from '../../store/moneda';
import Notificacion from './Notificacion.vue';
import { 
  ShoppingCart, 
  X, 
  Package, 
  Flame,
  Bitcoin,
  CreditCard,
  Smartphone,
  Building2,
  Globe
} from 'lucide-vue-next';

const props = defineProps({
  producto: Object,
  abierto: Boolean
});

const emit = defineEmits(['cerrar']);
const carritoStore = useCarritoStore();
const monedaStore = useMonedaStore();

const mostrarNotificacion = ref(false);
const productoAgregado = ref('');
const imagenError = ref(false);

// Precios formateados según moneda actual
const precioFormateado = ref('');
const precioOfertaFormateado = ref('');
const oldPrecioFormateado = ref('');

const estadoConfig = {
  disponible: { texto: "Disponible", color: "text-green-500", bg: "bg-green-500/10", icono: "✓", sePuedeComprar: true },
  transito: { texto: "En camino", color: "text-yellow-500", bg: "bg-yellow-500/10", icono: "🚚", sePuedeComprar: false },
  proximamente: { texto: "Próximamente", color: "text-blue-500", bg: "bg-blue-500/10", icono: "⏳", sePuedeComprar: false }
};

const estado = estadoConfig[props.producto.estadoEnvio] || estadoConfig.disponible;

const metodosPago = [
  { nombre: "USDT", icono: Bitcoin, descripcion: "" },
  { nombre: "ZELLE", icono: CreditCard, descripcion: "" },
  { nombre: "ZINLI", icono: Smartphone, descripcion: "" },
  { nombre: "BINANCE", icono: Bitcoin, descripcion: "" },
  { nombre: "PAGO MOVIL", icono: Building2, descripcion: "" },
  { nombre: "PAYPAL", icono: Globe, descripcion: "" }
];

const actualizarPrecios = () => {
  precioFormateado.value = monedaStore.getPrecioFormateado(props.producto.precio);
  if (props.producto.precioOferta) {
    precioOfertaFormateado.value = monedaStore.getPrecioFormateado(props.producto.precioOferta);
  }
  if (props.producto.oldPrice) {
    oldPrecioFormateado.value = monedaStore.getPrecioFormateado(props.producto.oldPrice);
  }
};

const cerrarModal = () => {
  emit('cerrar');
};

const agregarAlCarrito = () => {
  if (!estado.sePuedeComprar) {
    alert(`❌ ${estado.texto}. No disponible para comprar.`);
    return;
  }
  
  carritoStore.agregarProducto(props.producto, 1);
  productoAgregado.value = props.producto.nombre;
  mostrarNotificacion.value = true;
  
  setTimeout(() => {
    cerrarModal();
  }, 500);
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
  actualizarPrecios();
  window.addEventListener('moneda-cambiada', actualizarMoneda);
});

onUnmounted(() => {
  window.removeEventListener('moneda-cambiada', actualizarMoneda);
});
</script>

<template>
  <Notificacion 
    :visible="mostrarNotificacion" 
    :producto-nombre="productoAgregado"
    @cerrar="cerrarNotificacion"
  />
  
  <div v-if="abierto" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="cerrarModal">
    <div class="absolute inset-0 bg-black/80" @click="cerrarModal"></div>
    
    <div class="relative bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-primary-dark/30">
      <button 
        @click="cerrarModal"
        class="absolute top-4 right-4 text-text hover:text-primary z-10 bg-black/50 rounded-full p-1"
      >
        <X class="w-5 h-5" />
      </button>
      
      <div class="p-6">
        <div class="flex items-center gap-3 mb-4 flex-wrap">
          <div v-if="producto.enOferta && producto.estadoEnvio === 'disponible'" class="inline-flex items-center gap-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            <Flame class="w-3 h-3" /> OFERTA
          </div>
          
          <div :class="[estado.bg, 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold']">
            <span :class="estado.color">{{ estado.icono }} {{ estado.texto }}</span>
          </div>
        </div>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gradient-to-br from-surface to-background rounded-xl h-80 flex items-center justify-center relative overflow-hidden">
            <img 
              v-if="producto.imagen && producto.imagen !== '' && !imagenError"
              :src="producto.imagen" 
              :alt="producto.nombre"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div v-else class="text-center">
              <Package class="w-24 h-24 text-primary opacity-50 mx-auto mb-2" />
              <p class="text-text-muted text-sm">{{ producto.nombre }}</p>
            </div>
          </div>
          
          <div>
            <h2 class="text-2xl font-bold text-primary mb-2">{{ producto.nombre }}</h2>
            <p class="text-text-muted mb-4 whitespace-pre-line">{{ producto.descripcion }}</p>
            
            <div v-if="producto.incluye" class="mb-6">
              <div class="text-sm font-semibold text-primary mb-2">Incluye:</div>
              <ul class="list-disc list-inside text-text-muted text-sm">
                <li v-for="item in producto.incluye" :key="item">{{ item }}</li>
              </ul>
            </div>
            
            <div class="mb-4">
              <div v-if="producto.enOferta && producto.estadoEnvio === 'disponible'" class="flex items-center gap-3">
                <span class="text-text-muted line-through text-xl">{{ oldPrecioFormateado || precioFormateado }}</span>
                <span class="text-3xl font-bold text-red-500">{{ precioOfertaFormateado }}</span>
              </div>
              <div v-else class="text-3xl font-bold text-primary">{{ precioFormateado }}</div>
            </div>
            
            <button 
              @click="agregarAlCarrito"
              :disabled="!estado.sePuedeComprar"
              class="w-full bg-primary-dark hover:bg-primary text-white py-3 rounded-full transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart class="w-5 h-5" /> {{ estado.sePuedeComprar ? 'Agregar al Carrito' : estado.texto }}
            </button>
          </div>
        </div>
        
        <div class="mt-8 pt-6 border-t border-primary-dark/30">
          <h3 class="text-lg font-semibold text-primary mb-4">Métodos de Pago</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div v-for="metodo in metodosPago" :key="metodo.nombre" class="bg-surface p-3 rounded-xl text-center hover:bg-primary/10 transition">
              <component :is="metodo.icono" class="w-6 h-6 mx-auto mb-1 text-primary" />
              <div class="text-sm font-semibold text-text">{{ metodo.nombre }}</div>
              <div class="text-xs text-text-muted">{{ metodo.descripcion }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>