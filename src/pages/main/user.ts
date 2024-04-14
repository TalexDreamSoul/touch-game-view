const baseUrl = 'https://gameends.tagzxia.com:9981'

export function getUserInfo(user: string) {
  return new Promise((resolve, reject) => {
    fetch(`${baseUrl}/info/${user}`, {
    })
      .then(res => res.json())
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function updateUserInfo(user: string, key: string, value: any) {
  return new Promise((resolve, reject) => {
    fetch(`${baseUrl}/info/update/${user}/${key}/${value}`, {})
      .then(res => res.json())
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
