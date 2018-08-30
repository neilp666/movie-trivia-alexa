const Alexa = require('alexa-sdk');

var movieData = [
    {
        "title": "jurassic park",
        "country": "USA",
        "year": "1995",
        "cast": [
                "Sam Neill",
                "Laura Dern",
                "Jeff Goldblum"
            ]
    },
    {
        "title": "the dark knight",
        "country": "USA",
        "year": "2008",
        "cast": [
                "Christian Bale",
                "Heath Ledger",
                "Aaron Eckhart"
            ]
    },
    {
       "title": "transformers",
       "country": "USA",
       "year": "2007",
       "cast": [
                "Shia LeBeouf",
                "Megan Fox",
                "Josh Duhamel"
           ]
    }
];

exports.handler = function (event, context, callback) {
  var alexa = Alexa.handler(event, context);

  // dynamoDB

  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

  "LaunchRequest": function() {
    var userName = this.attributes['userName'];
    if (!userName) {
      this.emit('LaunchIntent');
    } else {
      this.emit('TestIntent');
    }
  },

  "LaunchIntent": function() {
    this.emit(':ask', 'Hi, Welcome to Movie Trivia! The skill that quizzes you on certain movie information. To get started please tell us your first name');
  },

 'GetNameIntent': function() {
      this.attributes['userName'] = this.event.request.intent.slots.FirstName.value;

      var firstName =  this.attributes['userName'];

      if (firstName) {
          this.emit(':ask', `Ok ${firstName}! Tell me what movie you would want to be quizzed on. Say either ${movieData[0].title} or ${movieData[1].title} or ${movieData[2].title}`);
      } else {
          this.emit(':ask', `Sorry, I didn\'t get your name!`, `Tell me your name by saying: My name is, and then your name.`);
      }
  },

  'CaptureMovieTitle': function() {
    var movieTitle = this.event.request.intent.slots.MovieTitle.value;
    var userName = this.attributes['userName'];

    if (movieTitle) {
      this.attributes['movieName'] = movieTitle;
      this.emit(':ask', `Ok ${userName}! You selected ${movieTitle} as the movie, that's great! Here's your first question. What year did ${movieTitle} come out `);
    } else {
      this.emit(':ask', `Sorry, I didn\'t recognize that movie`, `Say either Dark Knight at jurassic Park`);
    }
  },

  'MovieAnswer': function() {
        var movieYear = this.event.request.intent.slots.MovieYear.value;
        this.attributes['year'] = movieYear;

         for (var i=0; i < movieData.length; i++) {
             if ((this.attributes['movieName'] == movieData[i].title) && (movieYear == movieData[i].year)) {
                 this.emit(':tell',  `Yes, looks like ${movieYear} is correct.`);
             }
         }
    },

    'TestIntent': function() {
      this.emit(':ask', 'Welcome back ${this.attributes['userName']}! You can ask me for another movie questions , but first tell me know name.');
    }
};
