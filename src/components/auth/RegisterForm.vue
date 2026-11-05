<template>
  <div class="q-pa-md" style="max-width: 450px; width: 100%">
    <q-card class="q-pa-md shadow-2">
      <q-card-section class="text-center">
        <q-avatar size="60px" font-size="32px" color="primary" text-color="white" icon="person_add" />
        <div class="text-h6 q-mt-sm">Crear Cuenta</div>
        <div class="text-subtitle2 text-grey-7">Completa los datos para registrarte</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            filled
            v-model="firstName"
            label="Nombres *"
            hint="Ingresa tu nombre"
            lazy-rules
            :rules="[(val) => (val && val.trim().length > 0) || 'El nombre es obligatorio']"
          >
            <template #prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="lastName"
            label="Apellidos *"
            hint="Ingresa tus apellidos"
            lazy-rules
            :rules="[(val) => (val && val.trim().length > 0) || 'El apellido es obligatorio']"
          >
            <template #prepend>
              <q-icon name="badge" />
            </template>
          </q-input>

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
            hint="Mínimo 6 caracteres"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'La contraseña es obligatoria',
              (val) => (val && val.length >= 6) || 'La contraseña debe tener al menos 6 caracteres',
            ]"
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
              label="Registrarse"
              type="submit"
              color="primary"
              :loading="loading"
              icon-right="how_to_reg"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { signUp } from '@/services/api'

const emit = defineEmits(['registered', 'switch-to-login'])
const $q = useQuasar()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const isPwd = ref(true)
const loading = ref(false)

function isValidEmail(val) {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailPattern.test(val)
}

async function onSubmit() {
  loading.value = true
  try {
    const result = await signUp({
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      password: password.value,
    })

    if (result.success) {
      $q.notify({
        color: 'positive',
        textColor: 'white',
        icon: 'check_circle',
        position: 'top',
        message: '¡Registro exitoso! Ya puedes iniciar sesión.',
      })
      emit('registered', { email: email.value, password: password.value })
      onReset()
    } else {
      $q.notify({
        color: 'negative',
        textColor: 'white',
        icon: 'report_problem',
        position: 'top',
        message: result.message || 'Error al registrar el usuario',
      })
    }
  } catch (error) {
    console.error('Error durante registro:', error)
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'error',
      position: 'top',
      message: 'Ocurrió un error inesperado al registrarte',
    })
  } finally {
    loading.value = false
  }
}

function onReset() {
  firstName.value = ''
  lastName.value = ''
  email.value = ''
  password.value = ''
  isPwd.value = true
}
</script>
