<script setup>
import { ref } from 'vue';
import { AlertTriangle, X, Send } from 'lucide-vue-next';

const showModal = ref(false);
const problema = ref('');
const tipoProblema = ref('producto');
const email = ref('');
const enviando = ref(false);
const enviado = ref(false);

const tipos = [
  { value: 'producto', label: 'Problema con producto' },
  { value: 'web', label: 'Error en la web' },
  { value: 'otro', label: 'Otro' }
];

const abrirModal = () => {
  showModal.value = true;
  document.body.style.overflow = 'hidden';
};

const cerrarModal = () => {
  showModal.value = false;
  document.body.style.overflow = 'auto';
  problema.value = '';
  tipoProblema.value = 'producto';
  email.value = '';
  enviado.value = false;
};

const enviarReporte = async () => {
  if (!problema.value.trim()) {
    alert('Por favor describe el problema');
    return;
  }
  
  enviando.value = true;
  
  const mensaje = `*REPORTE DE PROBLEMA - AGAPE*\n\n` +
    `*Tipo:* ${tipos.find(t => t.value === tipoProblema.value)?.label}\n` +
    `*Email:* ${email.value || 'No proporcionado'}\n` +
    `*URL:* ${window.location.href}\n\n` +
    `*Descripción:*\n${problema.value}\n\n` +
    `*Fecha:* ${new Date().toLocaleString()}`;
  
  const url = `https://wa.me/584127050149?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
  
  enviando.value = false;
  enviado.value = true;
  
  setTimeout(() => {
    cerrarModal();
  }, 2000);
};
</script>

<template>
  <div>
    <!-- Botón flotante -->
    <button
      @click="abrirModal"
      class="fixed bottom-20 right-4 z-40 bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center gap-2 md:bottom-6 md:right-24"
      title="Reportar problema"
    >
      <AlertTriangle class="w-5 h-5" />
      <span class="hidden md:inline text-sm">Reportar</span>
    </button>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(0,0,0,0.8)" @click.self="cerrarModal">
      <div class="bg-surface rounded-2xl max-w-md w-full border border-primary-dark/30">
        <div class="flex items-center justify-between p-4 border-b border-primary-dark/30">
          <div class="flex items-center gap-2">
            <AlertTriangle class="w-5 h-5 text-yellow-500" />
            <h3 class="font-bold text-lg text-text">Reportar Problema</h3>
          </div>
          <button @click="cerrarModal" class="text-text-muted hover:text-text">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div v-if="!enviado" class="p-4 space-y-4">
          <div>
            <label class="block text-text-muted text-sm mb-1">Tipo de problema *</label>
            <select v-model="tipoProblema" class="w-full px-3 py-2 bg-background border border-primary-dark/30 rounded-lg text-text">
              <option v-for="t in tipos" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
          </div>

          <div>
            <label class="block text-text-muted text-sm mb-1">Tu email (opcional)</label>
            <input type="email" v-model="email" placeholder="correo@ejemplo.com" class="w-full px-3 py-2 bg-background border border-primary-dark/30 rounded-lg text-text" />
            <p class="text-text-muted text-xs mt-1">Para poder contactarte si necesitamos más información</p>
          </div>

          <div>
            <label class="block text-text-muted text-sm mb-1">Describe el problema *</label>
            <textarea v-model="problema" rows="4" placeholder="¿Qué está pasando? (producto defectuoso, error al pagar, página no carga...)" class="w-full px-3 py-2 bg-background border border-primary-dark/30 rounded-lg text-text resize-none"></textarea>
          </div>

          <div class="flex gap-3 pt-2">
            <button @click="cerrarModal" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition">
              Cancelar
            </button>
            <button @click="enviarReporte" :disabled="enviando" class="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2">
              <Send class="w-4 h-4" />
              {{ enviando ? 'Enviando...' : 'Enviar reporte' }}
            </button>
          </div>
        </div>

        <div v-else class="p-8 text-center">
          <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 class="text-xl font-semibold text-text mb-2">¡Reporte enviado!</h4>
          <p class="text-text-muted">Gracias por ayudarnos a mejorar. Te contactaremos pronto.</p>
        </div>
      </div>
    </div>
  </div>
</template>