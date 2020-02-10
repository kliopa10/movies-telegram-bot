const superagent = require('superagent')
const makeResponse = require('../utils/makeResponse')

module.exports = (patterns) => async (params) => {
    const { url } = params

    const siteRes = await superagent
        .get(url)
        .timeout(5000)

    for(let pattern of patterns) {
        let expression
        let transform = (m) => m[m.length - 1]  

        if(typeof config === 'string') {
            expression = pattern
        } else {
            expression = pattern.expression
            transform = pattern.transform
        }

        const matches = siteRes.text.match(expression)

        if(matches == null || matches.length < 1)
            continue    

        return makeResponse(null, 302, {
            Location: transform(matches)
        })
    }
    
    throw Error('Video can`t be extracted', params)
}