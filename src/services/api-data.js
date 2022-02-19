import axios from 'axios'
import { DATA } from '@/router/paths-api'

const initAxios = () => {
  const jwt = localStorage.getItem('Authorization')
  axios.defaults.headers.common['Authorization'] = jwt
  return axios
}

export async function getLang() {
  try {
    const { data } = await initAxios().get(DATA.LANG)
    return data
  } catch (e) {
    return null
  }
}

export async function getOptions() {
  try {
    const { data } = await initAxios().get(DATA.SETTINGS.OPTIONS)
    return data
  } catch (e) {
    return null
  }
}

export async function getCurrency() {
  try {
    const { data } = await initAxios().get(DATA.SETTINGS.CURRENCY)
    return data
  } catch (e) {
    return null
  }
}
