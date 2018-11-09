/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');


const synonyms = {
    lifestyle: ['family', 'kids', 'kids and family', 'kidspot'],
    crime: ['true crime'],
    news: ['news'],
    sport: ['sports'],
    entertainment: [],
    business: [],
    health: [],
    digest: []
}

function getTopicKey(topicName) {
    let topicKey;
    if (synonyms[topicName]) {
        return topicName;
    }
    Object.keys(synonyms).forEach(key => {
        if (synonyms[key].includes(topicName)) {
            topicKey = key;
        }
    });
    return topicKey;
}

function getAd() {
    const ads = [
        '<sub alias="ANZ">ANZ</sub> Bank',
        '<sub alias="HSBC">HSBC</sub> Bank',
        'Mount Franklin',
        'Cadbury Cream Eggs',
        'Domino\'s Pizza'
    ];
    const index = Math.floor(Math.random() * (ads.length - 1));
    return ads[index];
}

const audios = {
    digest: {
        url: 'https://s3-ap-southeast-2.amazonaws.com/angry-news/output.mp3',
        name: 'Daily Digest'
    },
    business: {
        name: 'Mentor Next Door',
        url: 'https://media.whooshkaa.com/podcasts/2857/episodes/614189-mentor-next-door-episode-5-mobile-technology-in-the-modern-business-1.mp3?id=182562" length="13409236'
    },
    health: {
        name: 'balls Deep',
        url: 'https://media.whooshkaa.com/podcasts/3462/episodes/cefb7a-balls-deep-fitzy-full.mp3?id=256825'
    },
    sport: {
        'name': 'Official Supercoach Podcast',
        url: 'https://media.whooshkaa.com/podcasts/1036/episodes/3d4e67-supercoach-podcast-teams-round-25.mp3?id=268605'
    },
    entertainment: {
        name: "Sydney Confidential",
        url:
            "https://media.whooshkaa.com/podcasts/1054/episodes/c9d612-jmo-episode-14-anne-marie-v1.mp3?id=260907"
    },
    lifestyle: {
        name: "The Juggling Act",
        url: "https://media.whooshkaa.com/podcasts/1466/episodes/0dd854-the-juggling-act-071118-v2.mp3?id=300546"
    },
    crime: {
        name: "My Father The Murderer",
        url:
            "https://media.whooshkaa.com/podcasts/4276/episodes/0ce0e9-mftm-e04-final.mp3?id=297216"
    },
    news: {
        name: "From the Newsroom",
        url:
            "https://media.whooshkaa.com/podcasts/3924/episodes/d78a81-morning-podcast-081118-podcast.mp3?id=300775&amp;sponsor=e7e060a0f6ed71494ce273d40081efc55fdb0aee7acd01b2fbed8999994e82c7"
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome to Daily Voice, please choose a topic!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Select a topic', speechText)
            .getResponse();
    },
};

const TopicIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'TopicIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let speakOutput = '';

        const topicSlot = handlerInput.requestEnvelope.request.intent.slots.topic;
        let topic;
        if (topicSlot && topicSlot.value) {
            topic = topicSlot.value.toLowerCase();
        }

        const topicKey = getTopicKey(topic);
        const audio = audios[topicKey];

        sessionAttributes.topic = topicKey;
        sessionAttributes.audio = audio;

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        if (audio) {
            const ad = getAd();
            const speechText = `Playing ${audio.name} from ${topic}. Brought to you by ${ad}.`;

            return handlerInput.responseBuilder
                .speak(speechText)
                .addAudioPlayerPlayDirective("REPLACE_ALL", audio.url, topic, 0)
                .getResponse();
        }
        else {

            speakOutput = 'I\'m sorry, I couldn\'t find the topic';

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can select a topic to start playing!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Select a topic', speechText)
            .getResponse();
    },
};

const PlayIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'PlayIntent';
    },
    handle(handlerInput) {

        return handlerInput.responseBuilder
            .speak('Playing audio')
            .addAudioPlayerPlayDirective(
                'REPLACE_ALL',
                'https://s3-ap-southeast-2.amazonaws.com/angry-news/audio/tt.mp3',
                'fucking',
                0)
            .getResponse();
    }
};

const StopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .addAudioPlayerStopDirective()
            .withSimpleCard('Bye bye', speechText)
            .getResponse();
    },
};

const CancelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent';

    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .addAudioPlayerStopDirective()
            .withSimpleCard('Bye bye', speechText)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, I can\'t understand the command. Please say again.')
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        TopicIntentHandler,
        PlayIntentHandler,
        HelpIntentHandler,
        CancelIntentHandler,
        StopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
