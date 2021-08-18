const serverUrl = 'http://localhost:5000'

// Fonction mère pour réutiliser les fonctions en commun de nos fetch
async function fetchBase(method, routeUrl, body = null) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  const token = localStorage.getItem('accessToken')
  if (token) {
    headers.append('Authorization', 'Bearer ' + token)
  }
  const options = { method, headers }
  if (body) options.body = JSON.stringify(body) // ajoute le body lorsque celui-ci existe
  return new Promise((resolve, reject) => {
    fetch(serverUrl + routeUrl, options)
      .then(async (response) => {
        const result = await response.json()
        result.status = response.status
        return result
      })
      .then((result) => resolve(result))
      .catch((error) => reject(error))
  })
}

// Fonctions facilitant l'appel
export async function fetchGet(routeUrl) {
  return await fetchBase('GET', routeUrl)
}

export async function fetchPost(routeUrl, body) {
  return await fetchBase('POST', routeUrl, body)
}

export async function fetchPut(routeUrl, body) {
  return await fetchBase('PUT', routeUrl, body)
}

export async function fetchDelete(routeUrl) {
  return await fetchBase('DELETE', routeUrl)
}

// Envoyer token
