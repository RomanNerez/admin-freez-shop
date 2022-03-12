import axios from 'axios'
import { DATA } from '@/router/paths-api'
import { DataApi } from '@/exceptions/DataApi'

const initAxios = () => {
  const jwt = localStorage.getItem('Authorization')
  axios.defaults.headers.common['Authorization'] = jwt
  return axios
}

const errorBuild = (error) => {
  return new DataApi({
    error: true,
    message: error.message,
  })
}

export async function getLang() {
  try {
    const { data } = await initAxios().get(DATA.LANG)
    return data
  } catch (e) {
    return errorBuild(e)
  }
}

export async function getOptions() {
  try {
    const { data } = await initAxios().get(DATA.SETTINGS.OPTIONS)
    return data
  } catch (e) {
    // if (e.response.status === 401) {
    //   const { data } = await initAxios().post(
    //     `${process.env.VUE_APP_API_URL}/api/auth/refresh`
    //   )
    //   console.log(data)
    // }
    return errorBuild(e)
  }
}

export async function getCurrency() {
  try {
    const { data } = await initAxios().get(DATA.SETTINGS.CURRENCY)
    return data
  } catch (e) {
    return errorBuild(e)
  }
}

export async function createCurrency(dataCurreny) {
  try {
    const { data } = await initAxios().post(DATA.SETTINGS.CURRENCY_CREATE, {
      data: dataCurreny,
    })

    return data
  } catch (e) {
    return errorBuild(e)
  }
}

export async function editCurrency(dataCurreny) {
  try {
    const { data } = await initAxios().post(DATA.SETTINGS.CURRENCY_EDIT, {
      data: dataCurreny,
    })

    return data
  } catch (e) {
    return errorBuild(e)
  }
}

export async function updateCurrency(dataCurreny) {
  try {
    const { data } = await initAxios().post(DATA.SETTINGS.CURRENCY_UPDATE, {
      data: dataCurreny,
    })

    return data
  } catch (e) {
    return errorBuild(e)
  }
}

export async function deleteCurrency(id) {
  try {
    await initAxios().post(DATA.SETTINGS.CURRENCY_DELETE, {
      id,
    })
  } catch (e) {
    return errorBuild(e)
  }
}
