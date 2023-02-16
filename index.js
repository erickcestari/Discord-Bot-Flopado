
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js')

//dotenv
const dotenv = require('dotenv')
dotenv.config()
const {TOKEN, CLIENT_ID, GUILD_ID} = process.env

//importação dos comandos
const fs = require("node:fs")
const path = require("node:path")
const commandsPath = path.join(__dirname,"commands")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

for(const file of commandFiles){
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)
	if("data" in command && "execute" in command){
		client.commands.set(command.data.name, command)
	} else{
		console.log(`Esse comando em ${filePath} está com "data" ou "execute ausentes"`)
	}
}

//Login do bot
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`)
});

client.login(TOKEN)

//listener de interações com o bot
client.on(Events.InteractionCreate, async interaction =>{
	if(!interaction.isChatInputCommand()) return
	console.log(interaction)
	const command = interaction.client.commands.get(interaction.commandName)
	if(!command){
		console.error("Commando não encontrado")
		return
	}
	try{
		await command.execute(interaction)
	}
	catch(error){
		console.error(error)
		await interaction.reply("Houve um erro ao executar esse comando!")
	}
})
