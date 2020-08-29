const DataLifeProvider = require('./DataLifeProvider')
const urlencode = require('urlencode')
const superagent = require('superagent')
const $ = require('cheerio')

class AnigatoProvider extends DataLifeProvider {
    constructor() {
        super('anigato', {
            scope: '.sres-wrap',
            selectors: {
                id: {
                    transform: ($el) => urlencode($el.attr('href'))
                },
                name: '.sres-wrap h2',
                image: {
                    selector: '.sres-img img',
                    transform: ($el) => this._absoluteUrl($el.attr('src'))
                }
            },
            detailsScope: '#dle-content',
            detailsSelectors: {
                title: '.short-top-left h1',
                image: {
                    selector: '.mimg img',
                    transform: ($el) => this._absoluteUrl($el.attr('src'))
                },
                files: {
                    selector: '#kodik-player iframe',
                    transform: async ($el) => {
                        const iframeSrc = $el.attr('src')
                        const res = await superagent
                            .get(iframeSrc.startsWith('//') ? 'https:' + iframeSrc : iframeSrc)
                            .timeout(this.config.timeout)

                        const $iframe = $(res.text)
                        const $seasons = $iframe.find('.series-options')
                            .children()
                            .toArray()

                        const getOptionUrls = (el) => ([{
                            url: $(el).attr('value').split('?')[0],
                            extractor: { type: 'anigit' }
                        }])

                        if ($seasons.length == 0) {
                            return [{
                                id: 0,
                                urls: [{
                                    url: iframeSrc,
                                    extractor: { type: 'anigit' }
                                }]
                            }]
                        } else if ($seasons.length == 1) {
                            const $season = $($seasons[0])
                            return $season.find('option')
                                .toArray()
                                .map((el, id) => ({
                                    id,
                                    name: $(el).text(),
                                    urls: getOptionUrls(el)
                                }))
                        } else {
                            return $seasons
                                .map((el, season) => {
                                    return $(el)
                                        .find('option')
                                        .toArray()
                                        .map((el) => ({
                                            name: $(el).text(),
                                            path: `Season ${season + 1}`,
                                            urls: getOptionUrls(el)
                                        }))
                                })
                                .reduce((acc, items) => acc.concat(items), [])
                                .map((items, id) => ({ id, ...items }))
                        }
                    }
                }
            }
        })
    }
}

module.exports = AnigatoProvider