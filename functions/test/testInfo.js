const providers = require('../providers')
const util = require('util')

const provider = 'nekomori'
const id = '150'

console.log(decodeURIComponent(id))

providers.getInfo(provider, id)
    .then((details) => console.log(util.inspect(details, false, null, true)))// eslint-disable-line