var genders = ["male", "female"];
var names = ["Doctor Gonzo","Doonesbury","Periwinkle","Chipper","Elmer","Dolce","Babushka","Grover","Taxi","Rosebud","Ouija","Bossman","Truffles","Six Toes","Sadie","Seuss","Van Gogh","Bunk","Heidi"];
var dogs = [];

// add a click handler for the #selectDog button
document.getElementById("formSubmit").addEventListener("click", function adoptHandler(e) {
  // let's add our code here to handle adopting a dog
  // don't forget to stop the form from reloading the page
  e.preventDefault();
  var sel = document.getElementById("formSubmit"),
  		dog = sel.options[sel.selectedIndex].text;
  adoptDog(dog);
});

// add a click handler for the #addmore button
document.getElementById("addmore").onclick = function(){
	document.getElementById("addmore").classList.add("hidden");
  document.getElementById("done").classList.add("hidden");
  document.getElementById("selectDog").classList.remove("hidden");
};

function adoptDog(dog) {
  // show the 'addmore' and 'done' and console.log a message that talks about the dog.
  // add the dog message to the array
  dogs.push(dog);
  document.getElementById("selectDog").classList.add("hidden");
  document.getElementById("addmore").classList.remove("hidden");
  document.getElementById("done").classList.remove("hidden");
  console.log('You are interested in adding a ' + dog + ' to your pack!');
}

// add a click handler for the #done button
document.getElementById("done").addEventListener("click", function finishHandler(gender,names,dogs) {
  // let's console log all our dogs

  for (i = 0; i < dogs.length; i++) {
  	var gender = genders[Math.floor(Math.random() * genders.length)],
  			name = names[Math.floor(Math.random() * names.length)];
	  console.log('You added a ' + gender + ' ' + dog + ' named ' + name + ' to your pack!');
	}
  
});
