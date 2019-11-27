
const makeResponse = require('../utils/makeResponse')

const extractors = {
    'stormTv': require('./stormTVExtractor')
}

module.exports = async (parmas) => {
    if(!parmas)
        return makeResponse({ message: 'No extractor parmas'}, 404)

    const { type } = parmas
    const extractor = extractors[type]

    if(!extractor)
        return makeResponse({ message: 'No extractor found'}, 404)

    return await extractor(parmas)
}