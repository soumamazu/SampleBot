var restify = require('restify');
var builder = require('botbuilder');
var message = require('botbuilder/lib/Message')

// handlers
var sayHello = function (sess){
    var msg = new message.Message()
                         .setText(sess,"Hello =^_^= , I am XiaoBai,"
                                  + " an professional *travel guide*,"
                                  +  " what can I help you?")
    sess.send(msg)
}

var sayDefault = function(sess){
    var msg = new message.Message()
                         .setText(sess, "Please **turn** on GPS. Let me show you around ^o^.")
    sess.send(msg)
}

var sayThanks= function(sess){
    var msg = new message.Message()
                         .setText(sess, "^_^, You are so welcome, it's my pleasure.")
    sess.send(msg)
}

var answerImgQuery = function(sess){
    var msg = new message.Message()
                         .setText(sess, "It says: \"正大光明\", by English"
                                 + " which means: \"Fair and square.\" ")
    sess.send(msg)
}

var overview = function(sess){
    var msg = new message.Message()
                         .setText(sess,"Wow, Cool the Forbidden City.")
                         .addAttachment({
                             contentType : 'image/jpeg',
                             contentUrl : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Forbidden_City_Beijing_Shenwumen_Gate.JPG/1024px-Forbidden_City_Beijing_Shenwumen_Gate.JPG'
                         })
                         .addAttachment({
                            actions:[
                                { title : 'Introduction'},
                                { title : 'History', url : 'https://en.wikipedia.org/wiki/Forbidden_City#History'},
                                { title : 'Photos', url: 'https://www.flickr.com/groups/forbiddencity/pool/'}

                             ]
                         })
    sess.send(msg)
}

var cultureAnswer = function(key, sess){
    var msg = new message.Message()
                         .setText(sess, "**The Last Emperor**")
                         .addAttachment({
                            contentType : 'image/jpeg',
                            contentUrl : 'http://www.gstatic.com/tv/thumb/movieposters/7559/p7559_p_v8_aa.jpg'
                         })
                        .addAttachment({
                            actions: [
                                {title : "see introduction", url : "https://en.wikipedia.org/wiki/Forbidden_City"},
                                {title : "next movie", url:"#"}
                            ]
                        })
    sess.send(msg)
}

var briefIntro = function(sess){
    var msg = new message.Message()
                         .setText(sess,"The  **Forbidden City** was the Chinese imperial"
                                 + "  palace from the Ming dynasty to the end of the Qing"
                                 + "  dynasty—the years 1420 to 1912. It is located in"
                                 + "  the centre of Beijing, China, and now houses the"
                                 + "  **Palace Museum**. It served as the home of emperors"
                                 + "  and their households as well as the ceremonial"
                                 + "  and political centre of Chinese government for"
                                 + "  almost 500 years.")
                         .addAttachment({
                             contentType : 'image/jpeg',
                             contentUrl : 'http://www.discoverbeijingtours.com/uploads/120921/120921/1-1209211K334K9.jpg'
                         })
    sess.send(msg)
                         
}

var quesAnswer = function (key,sess){
    var msg = new message.Message()
    if (key == "rooms"){
        msg.setText(sess, "It has *8,707* rooms. By the last count, including"
                    + " big and small palaces, halls, towers, pavilions,"
                    + " belvederes, there are 8,707 rooms. The 9,999 rooms"
                    + "  and a half is just a myth."
                    )
    }
    else if(key == "emperors"){
        msg.setText(sess,"13, **Qing emperors** succeeded each other from father to son"
                    + " until the *Tongzhi* emperor (r. 1861–1874), the *eleventh*"
                    + "  Qing ruler, died childess in 1874. The *last two emperors*"
                    + "  were chosen by Empress Dowager *Cixi* from other branches"
                    + " of the imperial clan."
                    )
    }
    sess.send(msg)
}

var figureAnswer = function(name,sess){
    var msg = new message.Message()
                         .setText(sess,"Empress Dowager Cixi")
                         .addAttachment({
                             contentType : 'image/png',
                             contentUrl : 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/SC-GR-257.jpg/255px-SC-GR-257.jpg'
                         })
                         .addAttachment({
                            actions:[
                                { title : 'Introduction', url: 'https://en.wikipedia.org/wiki/Empress_Dowager_Cixi'},
                                { title : 'history', url : 'https://en.wikipedia.org/wiki/Empress_Dowager_Cixi#history'},
                                { title : 'See Wikipedida', url : 'https://en.wikipedia.org/wiki/Empress_Dowager_Cixi'}

                             ]
                         })
    sess.send(msg)
}

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: 'samplenodejsbot', appSecret: 'f2a901a548c1436eb9428627fbf11965' });

bot.configure({
    goodbyeMessage: "Goodbye..."
})


// demo control logic
bot.add('/', function(sess){
    text = sess.message.text
    console.log(sess.message)
    if (/^(hi|hello)/i.test(text)){
        sayHello(sess);
    }
    else if(/forbidden city/i.test(text) && /in/i.test(text)){
        overview(sess)
    }
    else if(/introduction/i.test(text)){
        briefIntro(sess)
    }
    else if (/rooms/i.test(text)){
        quesAnswer('rooms',sess)
    }
    else if(/emperors/i.test(text)){
        quesAnswer('emperors',sess)
    }
    else if(/cixi/i.test(text)){
        figureAnswer('cixi',sess)
    }
    else if(/movie/i.test(text))
    {
        cultureAnswer('movie',sess)
    }
    else if(/poem/i.test(text)){
        cultureAnswer('poem',sess)
    }
    else if(/thank/i.test(text)){
        sayThanks(sess)
    }
    else if(sess.message.attachments.length > 0){
        answerImgQuery(sess);
    }
    else{
        sayDefault(sess)
    }
});

// Setup Restify Server
var server = restify.createServer();
server.get('.*', restify.serveStatic({
  directory: __dirname,
  default : 'index.html'
}));

server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 9000, function () {
    console.log('%s listening to %s', server.name, server.url); 
});