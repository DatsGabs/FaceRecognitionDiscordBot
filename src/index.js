const Discord = require('discord.js')
const client = new Discord.Client()
require('dotenv').config()

const actions = require('./commons/discord')
actions(client)
