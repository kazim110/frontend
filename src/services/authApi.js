import http from './http'

function normalizeAuthResponse(data, fallbackMessage) {
  return {
    user: data.user,
    token: data.token,
    message: data.message || fallbackMessage,
    redirectUrl: data.redirect_url,
  }
}

export function getErrorMessage(error) {
  const errors = error.response?.data?.errors

  if (errors) {
    return Object.values(errors).flat().join(' ')
  }

  return error.response?.data?.message || 'Something went wrong. Please try again.'
}

export async function registerUser(form) {
  await http.get('/sanctum/csrf-cookie')
  const { data } = await http.post('/api/register', form)
  return normalizeAuthResponse(data, 'Account created successfully.')
}

export async function loginUser(form) {
  await http.get('/sanctum/csrf-cookie')
  const { data } = await http.post('/api/login', form)
  return normalizeAuthResponse(data, 'Signed in successfully.')
}

export function logoutUser() {
  return http.post('/api/logout')
}
