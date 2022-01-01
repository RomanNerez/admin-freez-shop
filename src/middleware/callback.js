import axios from 'axios'

export default async (to, from, next) => {
  try {
    const { data } = await axios.post(
      `${process.env.VUE_APP_API_URL}/api/auth${to.fullPath}`
    )
    localStorage.setItem('Authorization', `Bearer ${data.access_token}`)
    next({ name: 'Home' })
  } catch (e) {
    next({ name: 'Login' })
  }
}
