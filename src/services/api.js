const API_BASE_URL = 'http://localhost:5166/api'

/**
 * Registra un nuevo usuario en el sistema llamando a POST /api/User/signup
 * @param {Object} userData - { firstName, lastName, email, password }
 */
export async function signUp(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/User/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      }),
    })

    if (response.status === 201 || response.status === 200) {
      return { success: true }
    }

    if (response.status === 400) {
      return { success: false, message: 'El correo ya está registrado o los datos no son válidos.' }
    }

    return { success: false, message: `Error del servidor (${response.status})` }
  } catch (error) {
    console.error('Error al realizar signUp:', error)
    return {
      success: false,
      message: 'No se pudo conectar con el servidor backend. Asegúrate de que la API esté encendida.',
    }
  }
}

/**
 * Inicia sesión llamando a POST /api/User/signin
 * @param {Object} credentials - { email, password }
 */
export async function signIn(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/User/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      // Guardar sesión en localStorage para persistencia opcional
      if (data.jwt) {
        localStorage.setItem('user_token', data.jwt)
        localStorage.setItem('user_info', JSON.stringify(data))
      }
      return { success: true, data }
    }

    if (response.status === 401) {
      return { success: false, message: 'Correo o contraseña incorrectos.' }
    }

    return { success: false, message: `Error al iniciar sesión (${response.status})` }
  } catch (error) {
    console.error('Error al realizar signIn:', error)
    return {
      success: false,
      message: 'No se pudo conectar con el servidor backend. Asegúrate de que la API esté encendida.',
    }
  }
}
