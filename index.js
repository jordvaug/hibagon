/**
 * A Bot for Slack!
 */
var dotenv = require('dotenv');
dotenv.load();
/**
 * Define a function for initiating a conversation on installation
 * With custom integrations, we don't have a way to find out who installed us, so we can't message them :(
 */

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('I am a bot that has just joined your team');
                convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}




/**
 * Configure the persistence options
 */

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
    };
}


/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
    //Treat this as a custom integration
    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
    //Treat this as an app
    var app = require('./lib/apps');
    var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}

/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});


/**
 * Core bot logic goes here!
 */
// BEGIN EDITING HERE!

controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!")
});

controller.hears(['hello', 'hi', 'hey'], ['direct_message','direct_mention','mention'], function (bot, message) {
    bot.reply(message, 'Hello! how can I help you? You can ask me questions about VetEx (examples)');
});

controller.hears('about', ['direct_message','direct_mention','mention'], function (bot, message) {
    bot.reply(message, 'Did you want to know more about VetEx? Here is our about section on the website \n' +
        'https://www.vetexpeditions.com/about/');
});

controller.hears(['commands','list','all'], ['direct_message','direct_mention','mention'], function (bot, message) {
    bot.reply(message, 'Here is a list of my current commands: hey, about, waiver, schedule, signup ...');
});

controller.hears(['DD214', 'waiver'], ['direct_message','direct_mention','mention'], function (bot, message) {
    bot.reply(message, 'Are you looking for the DD214s? They are all located here:\n https://www.dropbox.com/sh/rp1er0wx7lo76et/AADM34Uwc3xIu2GX87dqBpgNa?dl=0' +
             '/n if that isn\'t what you\'re looking for try typing "list" to see a list of my commands.');
});

controller.hears(['schedule','events'], ['direct_message','direct_mention','mention'], function (bot, message) {
    bot.reply(message, 'If you are looking for our upcoming events? if that isn\'t what you\'re looking for try typing "list" to see a list of my commands.'+
              '\n https://calendar.google.com/calendar/r?mode=day&date=20181027T225653&pli=1&t=AKUaPmbZO78vO72PZyKurl6bAZWqAOghQnhRlZQSKpHaxtykBUGl8oTISXrMlkZ0XhTZRc8cbQfaTsJ05ffG19n9l3MhI_KBrQ%3D%3D');
});

controller.hears(['signup','sign up', 'reporting'], ['direct_message','direct_mention','mention'], function (bot, message) {
    bot.reply(message, 'Are you looking for the leaders sign up and reporting form? If not try typing "list". \n'+
              'https://docs.google.com/spreadsheets/d/1CQXf0raXZ9d8H4a5Z8ZG3oAzEqt32UDBlpYh5lHKP8A/edit?ts=5c0352e0#gid=0');
});




/**
 * AN example of what could be:
 * Any un-handled direct mention gets a reaction and a pat response!
 */
controller.on('direct_message,mention,direct_mention', function (bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function (err) {
        if (err) {
            console.log(err)
        }
        bot.reply(message, 'I heard you loud and clear boss.');
    });
});


