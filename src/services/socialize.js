import axios from 'axios'

export const getRedirectUrl = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.VUE_APP_API_URL}/api/auth/redirect`
    )
    return data
  } catch (e) {
    return null
  }
}
