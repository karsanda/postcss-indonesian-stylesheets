const properties = {
  'color': 'warna'
}

module.exports = Object.keys(properties).map(key => ({ en: key, id: properties[key] }))
