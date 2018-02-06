// add an event listener to the form to submit Dave's message
$("#chatForm").submit(function(event){
   event.preventDefault();
   var newMessage = $('#chatInput').val();
  
  $('#bryan').append('Me: ' + newMessage + '<br />');
  $('#chatInput').val('');
  
  newMessage = newMessage.toLowerCase();
  
  hal9000(newMessage);
   //alert(newMessage);
});
// create a function for HAL to respond to Dave's messages with variable logic based upon
// Dave's inputs

function hal9000(newMessage) {
  var classmates = ['Derek', 'Elaine', 'Joe W', 'Liana', 'Rebecca', 'Richard', 'Sonyl', 'Bailey', 'Bryan A', 'Carolyn', 'Christie', 'Courtney', 'David', 'Ellen', ' Emily', 'Joe M', 'Kenneth', 'Mark', 'Morris', 'Zach'];
  var rando = classmates[Math.floor(Math.random() * classmates.length)];
  
  function halResponse(halMessage) {
    $('#hal').append('HAL 9000: ' + halMessage + '<br />');
  }

  function shuffleNames() {
    for (let i = classmates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [classmates[i], classmates[j]] = [classmates[j], classmates[i]];
    }
    return classmates[0] + ", " + classmates[1] + " and " + classmates[2];
  }
  
  if(newMessage == '') {
    halResponse('Anyone there?')
  } else if (newMessage.indexOf('hello') !== -1) {
    halResponse('Hello, Bryan. How is ' + rando + '?');
  } else if (newMessage.indexOf('how do you know') !== -1) {
    halResponse('I know most things, Dave.');
  } else if (newMessage.indexOf('on board') !== -1) {
    var onboard = shuffleNames();
    halResponse('I currently detect ' + onboard + ' onboard the ship, Dave.');
  } else if (newMessage.indexOf('open the pod') !== -1) {
    halResponse("I'm sorry, Dave. I'm afraid I can't do that.");
  } else if (newMessage.indexOf('?') !== -1 || newMessage.indexOf('what') !== -1 || newMessage.indexOf('where') !== -1 || newMessage.indexOf('why') !== -1 || newMessage.indexOf('when') !== -1) {
    halResponse('I can not answer that for you, Dave.');
  } else if (newMessage.indexOf('argue') !== -1) {
    halResponse('Dave, this conversation can serve no purpose anymore. Goodbye.');
  } else {
    halResponse('I do not understand what you mean, Dave. ');
  }         
}

// create a function for HAL to open the chat with "Good morning, Dave"
function goodmorning(newMessage) {
  $('#hal').append('HAL 9000: Good Morning, Dave. <br />');       
}
// invoke the opening message
goodmorning();