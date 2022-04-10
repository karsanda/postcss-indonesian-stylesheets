const values = {
  'red': 'merah'
}

module.exports = Object.keys(values).map(key => ({ en: key, id: values[key] }))
