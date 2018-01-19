/*

Create a page where every time the user hits the "Roll Dice" button, the screen randomly updates the two dice. 
Use the html and css code included in the starter code folder to get started.

Follow the steps below to write your code.
    * generate a random number between 1 - 6 and store to a variable, random1
    * generate a random number between 1 - 6 and store to a variable, random2
    * combine 'dice-' and random1 to form the random class for the first die, firstDie
    * combine 'dice-' and random2 to form the random class for the second die, secondDie
    * get the first die by ID and update the class to firstDie (hint: document.getElementById)
    * get the first die by ID and update the class to secondDie (hint:document.getElementById)

Check to see if the "Roll the Dice" button has been clicked; if it has, run the diceRoll function 
(hint: document.getElementById)

*/

document.getElementById('roll-dice').onclick = function diceRoll() {
	var random1 = Math.floor(Math.random() * 6) + 1,
		random2 = Math.floor(Math.random() * 6) + 1,
		firstDie = 'dice-' + random1,
		secondDie = 'dice-' + random2;

	document.getElementById('first-die').className = "dice " + firstDie;
	document.getElementById('second-die').className = "dice " + secondDie;
}