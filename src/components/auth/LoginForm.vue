<template>
  <div class="q-pa-md" style="max-width: 450px; width: 100%">
    <!-- Si ya está autenticado, mostrar tarjeta con info del usuario -->
    <q-card v-if="currentUser" class="q-pa-md shadow-2 text-center">
      <q-card-section>
        <q-avatar size="70px" color="positive" text-color="white" icon="verified_user" />
        <div class="text-h6 q-mt-md">¡Sesión Activa!</div>
        <div class="text-subtitle1 text-weight-bold text-primary q-mt-xs">
          {{ currentUser.firstName }} {{ currentUser.lastName }}
        </div>
        <div class="text-caption text-grey-7">{{ currentUser.email }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-mt-sm">
        <div class="text-caption text-grey-6 q-mb-sm">Token JWT almacenado correctamente</div>
        <q-btn label="Cerrar Sesión" color="negative" outline icon="logout" @click="onLogout" />
      </q-card-section>
    </q-card>

    <!-- Formulario de Login si no está autenticado -->
    <q-card v-else class="q-pa-md shadow-2">
      <q-card-section class="text-center">
        <q-avatar size="60px" font-size="32px" color="primary" text-color="white" icon="lock" />
        <div class="text-h6 q-mt-sm">Iniciar Sesión</div>
        <div class="text-subtitle2 text-grey-7">Ingresa tus credenciales para acceder</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            filled
            type="email"
            v-model="email"
            label="Correo electrónico *"
            hint="ejemplo@correo.com"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'El correo es obligatorio',
              (val) => isValidEmail(val) || 'Ingresa un correo electrónico válido',
            ]"
          >
            <template #prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            filled
            :type="isPwd ? 'password' : 'text'"
            v-model="password"
            label="Contraseña *"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'La contraseña es obligatoria']"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
            <template #append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="row justify-between items-center q-mt-lg">
            <q-btn label="Limpiar" type="reset" color="grey-7" flat />
            <q-btn
              label="Iniciar Sesión"
              type="submit"
              color="primary"
              :loading="loading"
              icon-right="login"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { signIn } from '@/services/api'

const emit = defineEmits(['logged-in'])
const $q = useQuasar()

const email = ref('')
const password = ref('')
const isPwd = ref(true)
const loading = ref(false)
const currentUser = ref(null)

onMounted(() => {
  const savedUser = localStorage.getItem('user_info')
  if (savedUser) {
    try {
      currentUser.value = JSON.parse(savedUser)
    } catch (err) {
      console.warn('Error al recuperar usuario guardado:', err)
      localStorage.removeItem('user_info')
    }
  }
})

function isValidEmail(val) {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailPattern.test(val)
}

async function onSubmit() {
  loading.value = true
  try {
    const result = await signIn({
      email: email.value.trim(),
      password: password.value,
    })

    if (result.success) {
      currentUser.value = result.data
      $q.notify({
        color: 'positive',
        textColor: 'white',
        icon: 'check_circle',
        position: 'top',
        message: `¡Bienvenido(a), ${result.data.firstName} ${result.data.lastName}!`,
      })
      emit('logged-in', result.data)
      onReset()
    } else {
      $q.notify({
        color: 'negative',
        textColor: 'white',
        icon: 'report_problem',
        position: 'top',
        message: result.message || 'Error al iniciar sesión',
      })
    }
  } catch (error) {
    console.error('Error durante inicio de sesión:', error)
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'error',
      position: 'top',
      message: 'Ocurrió un error inesperado al intentar iniciar sesión',
    })
  } finally {
    loading.value = false
  }
}

function onReset() {
  email.value = ''
  password.value = ''
  isPwd.value = true
}

function onLogout() {
  localStorage.removeItem('user_token')
  localStorage.removeItem('user_info')
  currentUser.value = null
  $q.notify({
    color: 'info',
    textColor: 'white',
    icon: 'logout',
    position: 'top',
    message: 'Has cerrado sesión exitosamente',
  })
}
</script>
