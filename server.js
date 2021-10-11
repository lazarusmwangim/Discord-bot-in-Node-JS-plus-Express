require('dotenv').config(); //initialize dotenv
const Discord = require('discord.js'); //import discord.js

//const client = new Discord.Client(); //create new client
const fetch = require("node-fetch");
const { Client, Intents } = require('discord.js');

const client = new Client({ 
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,"GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS"] 
});

/*const intents = new Intents([
    Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
    "GUILD_MEMBERS", // lets you request guild members (i.e. fixes the issue)
]);
const client = new Client({ ws: { intents } });*/


const express = require("express");
var bodyParser = require('body-parser');

const app = express();
const path = require("path");


let HTTP_PORT = process.env.PORT || 8080;
let Guilds;



function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// setup a 'route' to listen on the default url path (http://localhost)


/*client.once("ready", async (data) => {
    console.log("Ready!");
    console.log(`Logged in as ${client.user.tag}!`);
    const Guilds = client.guilds.cache.map((guild) => guild);
    console.log(Guilds[0]);
    await Guilds[0].members.fetch().then(console.log).catch(console.error);
});*/


client.on('ready',async () => {
	console.log(`Logged in as ${client.user.tag}`+` and serving ${client.guilds.cache.size} servers!`);
	
	Guilds = client.guilds.cache.map(guild => {
		let obj = {};
		obj['id'] = guild.id;
		obj['name'] = guild.name;
		return obj;
	});
	console.log(Guilds);
	app.get("/", function(req,res){
		//res.json(Guilds);
		res.sendFile(path.join(__dirname, "views/home.html"));
	});
	
	app.get("/l", function(req,res){
		res.json(Guilds);
	});
	
	app.post("/sendmessage",async function(req,res){
		//console.log(req.body);
		let mesg=req.body.message;
		let servr=req.body.server;
		const Guildss = client.guilds.cache.get(servr);
		await Guildss.members.fetch().then(members => {
			members.forEach(member =>{
				if (member.user.bot===false){
					member.send(mesg).catch(e => console.error(`Couldn't DM member ${member.user.tag}`));
				}
				
			});
		}).catch(console.error);
		var responses1={
			msg:"success",
			toD:"Wrong password!"};
		res.json(responses1);
		
	});
	
	app.use((req, res) => {
		//res.status(404).send("Page Not Found");
		res.sendFile(path.join(__dirname, "views/error.html"));
	});
	
});

client.on('messageCreate', async msg => {
	
	if(msg.mentions.has('896773767550861413')) {
		msg.author.send('Hello.');
	}
	/*else{
		//msg.content === 'ping'
		//msg.reply('Pong!');
		//let x=msg.mentions.members.first();
	}*/
});


/*client.on('messageCreate',async msg => {
	msg.guild.members.cache.forEach(member => { // Looping through each member of the guild.
    // Trying to send a message to the member.
    // This method might fail because of the member's privacy settings, so we're using .catch
		
		console.log('Member '+member.id);
		console.log('client '+client.user.id);
		console.log('Hello '+member.user.bot);
		
		//let s1=client.guilds.cache.Guild[0];
		//console.log(s1);
		
		if (member.user.bot===false){
			member.send("Hello, this is my message!").catch(e => console.error(`Couldn't DM member ${member.user.tag}`));
		}
	});
});*/

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
//console.log(Guilds);



app.listen(HTTP_PORT, onHttpStart);