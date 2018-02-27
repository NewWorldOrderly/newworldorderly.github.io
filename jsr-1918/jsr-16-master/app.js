
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBmAURwVYa_zVsEeBEO5VmJEYrZU2YjlSg",
  authDomain: "jsr-1918.firebaseapp.com",
  databaseURL: "https://jsr-1918.firebaseio.com",
  projectId: "jsr-1918",
  storageBucket: "jsr-1918.appspot.com",
  messagingSenderId: "422545887833"
};
firebase.initializeApp(config);

$(document).ready(function() {
  var database = firebase.database();


  // CREATE

  $('#message-form').submit(function(event) {
    // by default a form submit reloads the DOM which will subsequently reload all our JS
    // to avoid this we preventDefault()
    event.preventDefault();

    // grab user message input
    var message = $('#message').val();

    // clear message input (for UX purposes)
    $('#message').val('');

    // create a section for messages data in your db
    var messagesReference = database.ref('messages');

    // use the set method to save data to the messages
    messagesReference.push({
      message: message,
      votes: 0
    });


  });

  getFanMessages();

  // READ
  function getFanMessages() {
    // retrieve messages data when .on() initially executes
    // and when its data updates
    database.ref('messages').on('value', function (results) {
      var $messageBoard = $('.message-board')
      var messages = []

      var allMessages = results.val();

      // iterate through results coming from database call; messages
      for (var msg in allMessages) {
        // get method is supposed to represent HTTP GET method
        var message = allMessages[msg].message;
        var votes = allMessages[msg].votes;
        console.log('votes from for in', votes);
        // create message element
        var $messageListElement = $('<li></li>')


        // add message to li
        $messageListElement.html(message);

      // push element to array of messages
        messages.push($messageListElement)

        // remove lis to avoid dupes
        $messageBoard.empty()
      }

      for (var i in messages) {
        $messageBoard.append(messages[i]);
      }
    })
  }

});

