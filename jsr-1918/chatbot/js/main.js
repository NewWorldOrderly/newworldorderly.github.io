// add an event listener to the form to submit Dave's message
$("#chatForm").submit(function(event){
   event.preventDefault();
   var newMessage = $('#chatInput').val();
  
  $('#bryan').append('Me: ' + newMessage + '<br />');
  $('#chatInput').val('');
  
  hal9000(newMessage);
   //alert(newMessage);
});
// create a function for HAL to respond to Dave's messages with variable logic based upon
// Dave's inputs

function hal9000(newMessage) {
  
  var classmates = ['Derek', 'Elaine', 'Joe W', 'Liana', 'Rebecca', 'Richard', 'Sonyl', 'Bailey', 'Bryan A', 'Carolyn', 'Christie', 'Courtney', 'David', 'Ellen', ' Emily', 'Joe M', 'Kenneth', 'Mark', 'Morris', 'Zach'];
   
  if(newMessage == 'Hi') {
    $('#hal').append('HAL 9000: Hello, Bryan. <br />');
  } else {
    $('#hal').append('HAL 9000: I do not understand. <br />');
  }         
}

// create a function for HAL to open the chat with "Good morning, Dave"
function goodmorning(newMessage) {
  $('#hal').append('HAL 9000: Good Morning, Dave. <br />');       
}
// invoke the opening message
goodmorning();