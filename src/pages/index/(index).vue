<template>
  <q-page class="q-pa-md flex flex-center">
    <div class="column items-center full-width" style="max-width: 500px">
      <!-- Navegación y componentes previos de la clase -->
      <div class="row justify-center q-mb-md q-gutter-sm">
        <q-btn color="secondary" outline to="/second" label="Ir a Segunda Página" no-caps />
      </div>

      <TestComponent />

      <!-- Tarjeta principal con Pestañas para Iniciar Sesión y Registrarse -->
      <q-card class="full-width q-mt-md shadow-3" style="border-radius: 12px">
        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="register" icon="person_add" label="Registrarse (SignUp)" />
          <q-tab name="login" icon="login" label="Iniciar Sesión (Login)" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated>
          <!-- Panel de Registro (Tarea Principal) -->
          <q-tab-panel name="register" class="flex flex-center">
            <RegisterForm @registered="handleRegistrationSuccess" />
          </q-tab-panel>

          <!-- Panel de Inicio de Sesión (Opcional) -->
          <q-tab-panel name="login" class="flex flex-center">
            <LoginForm />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import TestComponent from '../test.vue'
import LoginForm from '../../components/auth/LoginForm.vue'
import RegisterForm from '../../components/auth/RegisterForm.vue'

// Pestaña inicial seleccionada: registro (para enfocar la tarea principal)
const activeTab = ref('register')

function handleRegistrationSuccess() {
  // Al registrarse exitosamente, cambiar a la pestaña de login
  activeTab.value = 'login'
}
</script>
