const extractor = require('../utils/tortugawtfembed')
const util = require('util')

extractor('https://tortuga.wtf/embed/117')
    .then((files) => console.log(util.inspect(files, false, null, true)))// eslint-disable-line
    .catch(console.error)