//require APIs
const discord = require('discord.js');
const fs = require("fs");

//declare variables
var text, list;

//FUNCTIONS
function updateJSONs(){
    text = JSON.parse(fs.readFileSync("./text.json").toString('utf8'));
    list = JSON.parse(fs.readFileSync("./list.json").toString('utf8'));
}

function pickRandom(l = []) {
    return l[Math.floor(Math.random() * l.length)];
}

//JSON files
//config is constant and doesnt change during execution
const config = require('./config.json');//require config with token
//get varaible JSONs
updateJSONs();

//create bot client
const client = new discord.Client({
	intents : [
	discord.GatewayIntentBits.Guilds,
	discord.GatewayIntentBits.GuildMessages,
	discord.GatewayIntentBits.MessageContent,
	discord.GatewayIntentBits.DirectMessages
	],
	
});

//when ready
client.once('ready', ()=>{
    //log the logged username
    console.log('Logged as: '+client.user.username);
    //list all logged servers
    console.log('Logged into servers: ')
    client.guilds.cache.forEach((e) => {
        console.log(e.name)
    });
    //say hi on start
    client.channels.cache.filter(c => list.introchans.includes(c.name)).forEach((tc => {//for each channel on the intro channels list
        tc.send(pickRandom(text.intro));//pick random welcome phrase
    }));

});

//on message
client.on('messageCreate', (m)=>{
	//console.log(m.mentions.members.has(client.user.id));
    if(m.mentions.users.has(client.user.id)){//check if it is with bot
        let cstr = m.content.slice(m.content.indexOf(' ')).trim().toLowerCase();//get command string

        let csarg = cstr.split(' ');//get command arguments

        //command interpretation
        switch (csarg[0]){
            case 'filosofa'://fala filosofia manerona
            case 'filosofia':
                m.channel.send(pickRandom(text.sabedoria));
                break;

            case 'visita'://manda foto da visita

                if(m.mentions.users.size !== 2 || csarg.length > 4){
                    m.channel.send(pickRandom(text.synerror));
                    break;
                }

                let tu = m.mentions.users.find(u => u.id !== client.user.id);

                //let msg = pickRandom(list.msgs);
				let msg = list.msgs[1];
                tu.send({
                    content: msg.text.replace('<username>', tu.username),
                    files:[
                        {
                            attachment:msg.path
                        }
                    ]
                });
                break;

            default://n entendi
                m.channel.send(pickRandom(text.cmderror));
                break;
        }
    }
});

//log bot on
client.login(config.token);