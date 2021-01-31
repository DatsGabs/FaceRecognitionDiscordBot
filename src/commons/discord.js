const detection = require('./detection')
const { MessageAttachment } = require('discord.js')

module.exports = function (client) {
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
  })

  let active = true

  client.on('message', (message) => {
    if (message.author.bot) return

    if (message.content === '!switch') {
      active = !active
    }
    if (active) {
      if (message.attachments.size > 0) {
        message.attachments.forEach(async ({ url }) => {
          const result = await detection(url)
          const attachment = await new MessageAttachment(result)
          await message.channel.send(`${message.author},`, attachment)
          message.delete()
        })
      }
    }
  })

  client.login(process.env.token)
}
