<script setup>
import { ref, computed } from 'vue';
import { useCarritoStore } from '../../store/carrito';
import { useMonedaStore } from '../../store/moneda';
import { ShoppingBag, Plus, Minus, Trash2, X, MessageCircle } from 'lucide-vue-next';

const carritoStore = useCarritoStore();
const monedaStore = useMonedaStore();
const isOpen = ref(false);

const totalItems = computed(() => carritoStore.totalItems);
const totalPrecio = computed(() => carritoStore.totalPrecio); // Siempre en USD
const itemsEnCarrito = computed(() => carritoStore.itemsEnCarrito);

const { eliminarProducto, actualizarCantidad, vaciarCarrito } = carritoStore;

// Formatear precio según moneda actual
const formatearPrecio = (precioUSD) => {
  return monedaStore.getPrecioFormateado(precioUSD);
};

const generarMensajeWhatsApp = () => {
  const monedaActual = monedaStore.getMonedaActual();
  const simbolo = monedaActual === 'usd' ? '$' : 'Bs';
  
  let mensaje = "*AGAPE PARFUM - NUEVO PEDIDO*\n";
  mensaje += "\n";
  mensaje += "*PRODUCTOS:*\n";
  
  itemsEnCarrito.value.forEach(item => {
    const precioMostrado = monedaStore.getPrecioFormateado(item.precio);
    mensaje += `• ${item.nombre} x${item.cantidad} - ${precioMostrado}\n`;
  });
  
  const totalMostrado = monedaStore.getPrecioFormateado(totalPrecio.value);
  mensaje += `\n*TOTAL: ${totalMostrado}*`;
  mensaje += "\n\n*DATOS DE ENVÍO:*";
  mensaje += "\nNombre: ";
  mensaje += "\nTeléfono: ";
  mensaje += "\nDirección: ";
  mensaje += "\nCiudad: ";
  
  const url = `https://wa.me/584127050149?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
};

const toggleCarrito = () => {
  isOpen.value = !isOpen.value;
};

const cerrarCarrito = () => {
  isOpen.value = false;
};

const getImagenUrl = (item) => {
  if (item.imagen && item.imagen !== '') {
    return item.imagen;
  }
  return null;
};
</script>

<template>
  <div>
    <button 
      @click="toggleCarrito"
      class="relative bg-primary-dark p-3 rounded-full hover:bg-primary transition-all shadow-lg"
    >
      <ShoppingBag class="w-5 h-5 text-white" />
      <span v-if="totalItems > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {{ totalItems }}
      </span>
    </button>
    
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="cerrarCarrito">
      <div class="absolute inset-0 bg-black/80" @click="cerrarCarrito"></div>
      
      <div class="relative bg-surface rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-primary-dark/30">
        <div class="flex items-center justify-between p-4 border-b border-primary-dark/30">
          <h3 class="font-bold text-lg text-text">Mi Carrito</h3>
          <button @click="cerrarCarrito" class="text-text-muted hover:text-primary">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="max-h-96 overflow-y-auto p-4">
          <div v-if="itemsEnCarrito.length === 0" class="text-center text-text-muted py-12">
            <ShoppingBag class="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Tu carrito está vacío</p>
          </div>
          
          <div v-for="item in itemsEnCarrito" :key="item.id" class="flex gap-3 mb-4 p-3 bg-background rounded-xl">
            <div class="w-16 h-16 bg-surface rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              <img 
                v-if="getImagenUrl(item)"
                :src="item.imagen" 
                :alt="item.nombre"
                class="w-full h-full object-cover"
                @error="e => { e.target.style.display = 'none' }"
              />
              <ShoppingBag v-else class="w-6 h-6 text-primary" />
            </div>
            
            <div class="flex-1">
              <div class="font-semibold text-text">{{ item.nombre }}</div>
              <div class="text-sm text-text-muted">{{ formatearPrecio(item.precio) }}</div>
              <div class="flex items-center gap-2 mt-2">
                <button 
                  @click="actualizarCantidad(item.id, item.cantidad - 1)"
                  class="w-6 h-6 bg-primary-dark rounded-full hover:bg-primary text-white flex items-center justify-center"
                >
                  <Minus class="w-3 h-3" />
                </button>
                <span class="text-sm text-text">{{ item.cantidad }}</span>
                <button 
                  @click="actualizarCantidad(item.id, item.cantidad + 1)"
                  class="w-6 h-6 bg-primary-dark rounded-full hover:bg-primary text-white flex items-center justify-center"
                >
                  <Plus class="w-3 h-3" />
                </button>
                <button 
                  @click="eliminarProducto(item.id)"
                  class="text-red-500 text-xs ml-auto flex items-center gap-1"
                >
                  <Trash2 class="w-3 h-3" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="itemsEnCarrito.length > 0" class="p-4 border-t border-primary-dark/30 bg-background">
          <div class="flex justify-between mb-3">
            <span class="font-semibold text-text">Total:</span>
            <span class="font-bold text-xl text-primary">{{ formatearPrecio(totalPrecio) }}</span>
          </div>
          <button 
            @click="generarMensajeWhatsApp"
            class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle class="w-5 h-5" /> Comprar por WhatsApp
          </button>
          <button 
            @click="vaciarCarrito"
            class="w-full mt-2 text-text-muted hover:text-red-500 text-sm py-2 transition-all"
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  </div>
</template>