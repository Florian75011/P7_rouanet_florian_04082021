import axios from 'axios'

export async function uploadFile(method, url, file, body) {
  try {
    // Gestion de l'upload d'image en front
    const formData = new FormData()
    formData.append('image', file)
    formData.append('data', JSON.stringify(body))
    const options = { headers: {} }
    if (localStorage.getItem('accessToken')) {
      options.headers.authorization =
        'Bearer ' + localStorage.getItem('accessToken')
    }
    if (['post', 'put'].includes(method.toLowerCase())) {
      const response = await axios[method](
        'http://localhost:5000' + url,
        formData,
        options
      )
      const responseData = response.data
      responseData.status = response.status
      return responseData
    } else {
      throw new Error('Bad request method')
    }
  } catch (err) {
    throw err
  }
}
