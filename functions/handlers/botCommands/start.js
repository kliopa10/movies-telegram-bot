const Extra = require('telegraf/extra')

module.exports = (bot, providers) => {
    bot.command(['start', 'help'], async ({ i18n, reply, mixpanel, message: { text } }) => {
        if(text.endsWith('start')) {
            mixpanel.track('register', { bot: BOT_TYPE })
            mixpanel.people.set({ $created: new Date().toISOString() })
        }
    
        await reply(
            i18n.t(
                'start',
                {
                    sample: providers[0],
                    providers: providers.map((it) => ` - ${it}`).join('\n')
                }
            ),
            Extra.HTML()
        )
    })
}