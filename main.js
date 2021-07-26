const keepAlive = require('./server');
const Discord = require('discord.js');
const Client = new Discord.Client();
const fs = require('fs');
Client.keywords = JSON.parse(fs.readFileSync('./keywords.json', 'utf8'));
Client.legitChecks = JSON.parse(fs.readFileSync('./legitChecks.json', 'utf8'));

Client.prefix = "l!";

Client.once('ready', () => {

    console.log("X=======--------========X");
    console.log("");
    console.log("Bot działa w trybie online");
    console.log("");
    console.log("X=======--------========X");

});

Client.on('message', message => {

    if (message.author.bot) return;

    var thisGuild = Client.keywords.find(g => g.guildId == message.guild.id);

    var stillRepeat1 = true;

    for (const keyword of thisGuild.legitKeyword) {

        if (message.content.toLowerCase().endsWith(keyword) && stillRepeat1) {
            stillRepeat1 = false;
            var playerName = message.content.split(" ")[0].replace("<", "");

            var playerName1 = playerName.replace("@", "");

            var playerName2 = playerName1.replace(">", "");

            var playerName3 = playerName2.replace("!", "");

            var player = message.guild.members.cache.get(playerName3);
            if (typeof player !== 'undefined') {
                if (playerName3 != message.author.id) {

                    var legitCheck = Client.legitChecks.find(g => g.guildId == message.guild.id);

                    if (!legitCheck.legitChecks.find(a => a.senderId == message.author.id && a.playerName == playerName3)) {

                        message.channel.send(`Dziękujemy <@${message.author.id}> za informację! Aby sprawdzic aktualne potwierdzenia i skargi tego gracza wpisz **l!check [Nick Gracza]**`);

                        legitCheck.legitChecks.push({
                            "senderId": message.author.id,
                            "playerName": playerName3,
                            "type": "Legit"
                        });

                        Client.updateConfig();

                    } else {
                        message.channel.send("**Już raz oceniłeś tego użytkownika!**");
                    }

                } else {
                    message.channel.send("**Nie mozesz ocenić sam siebie!**");
                }
            } else {
                message.channel.send("**Przykro mi ale takiego gracza nie ma na serverze!**");
            }
        }

    }

    var stillRepeat = true;

    for (const keyword of thisGuild.noLegitKeyword) {

        if (message.content.toLowerCase().endsWith(keyword) && stillRepeat) {
            stillRepeat = false;
            var playerName = message.content.split(" ")[0].replace("<", "");

            var playerName1 = playerName.replace("@", "");

            var playerName2 = playerName1.replace(">", "");

            var playerName3 = playerName2.replace("!", "");

            var player = message.guild.members.cache.get(playerName3);
            if (typeof player !== 'undefined') {
                if (playerName3 != message.author.id) {

                    var legitCheck = Client.legitChecks.find(g => g.guildId == message.guild.id);

                    if (!legitCheck.legitChecks.find(a => a.senderId == message.author.id && a.playerName == playerName3)) {

                        message.channel.send(`Dziękujemy <@${message.author.id}> za informację! Aby sprawdzic aktualne potwierdzenia i skargi tego gracza wpisz **l!check [Nick Gracza]**`);

                        legitCheck.legitChecks.push({
                            "senderId": message.author.id,
                            "playerName": playerName3,
                            "type": "noLegit"
                        });

                        Client.updateConfig();

                    } else {
                        message.channel.send("**Już raz oceniłeś tego użytkownika!**");
                    }

                } else {
                    message.channel.send("**Nie mozesz ocenić sam siebie!**");
                }
            } else {
                message.channel.send("**Przykro mi ale takiego gracza nie ma na serverze!**");
            }
        }

    }

    if (message.content.startsWith(Client.prefix)) {
        if (message.content.toLowerCase().slice(Client.prefix.length).startsWith("check")) {
            const arg = message.content.split(/ +/)[1];
            if (typeof arg !== 'undefined' && arg != ""){
                var playerName = arg.replace("<", "");

                var playerName1 = playerName.replace("@", "");

                var playerName2 = playerName1.replace(">", "");

                var playerName3 = playerName2.replace("!", "");

                var player = message.guild.members.cache.get(playerName3);
                if (typeof player !== 'undefined') {

                    var legits = 0;
                    var noLegits = 0;

                    var legitCheck = Client.legitChecks.find(g => g.guildId == message.guild.id);

                    for (const legitC of legitCheck.legitChecks) {
                        
                        if (legitC.playerName == playerName3) {

                            if (legitC.type == "Legit") {
                                legits = legits + 1;
                            } else {
                                noLegits = noLegits + 1;
                            }

                        }

                    }

                    const embed = new Discord.MessageEmbed()
                        .setColor('#22ff00')
                        .setTitle(`Skargi i potwierdzenia gracza ${player.user.username}`)
                        .setDescription(`**Ilość skarg/zażaleń na tego gracza:** ${noLegits}\n**Ilość potwierdzeń tego gracza:** ${legits}`)
                        .setFooter("Dziekuję, że mogłem pomóc!")

                    message.channel.send(embed);

                } else {
                    message.channel.send("**Tego gracza nie ma na serverze!**");
                }
            }
        }
    }

});

Client.updateConfig = () => {

    try {
        var legitChecks = Client.legitChecks;
    } catch (error) {
        console.error(error);
    }

    fs.writeFileSync('./legitChecks.json', JSON.stringify(legitChecks));

}
keepAlive();

Client.login(process.env['TOKEN']);