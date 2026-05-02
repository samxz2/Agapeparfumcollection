<script setup>
import { watch } from 'vue';
import { CheckCircle, X } from 'lucide-vue-next';

const props = defineProps({
  mensaje: String,
  visible: Boolean,
  productoNombre: String
});

const emit = defineEmits(['cerrar']);

const cerrar = () => {
  emit('cerrar');
};

// Auto cerrar después de 3 segundos
watch(() => props.visible, (nuevoValor) => {
  if (nuevoValor) {
    setTimeout(() => {
      cerrar();
    }, 3000);
  }
});
</script>

<template>
  <div 
    v-if="visible"
    class="fixed top-20 right-4 z-[100] animate-slide-in"
  >
    <div class="bg-green-500 rounded-xl shadow-2xl p-4 max-w-sm w-full border border-white/20">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <CheckCircle class="w-6 h-6 text-white" />
        </div>
        
        <div class="flex-1">
          <h4 class="font-bold text-white">¡Producto Agregado!</h4>
          <p class="text-white/90 text-sm mt-1">
            {{ productoNombre }} se agregó al carrito correctamente.
          </p>
        </div>
        
        <button @click="cerrar" class="text-white/70 hover:text-white">
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
</style>