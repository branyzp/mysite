let programming_languages = [
	'JavaScript',
	'Python',
	'HTML',
	'CSS',
	'C',
	'SQL',
	'Java',
];

let animals = ['Cow', 'Dog', 'Cat', 'Chicken', 'GameStop Ape'];

let cars = ['Lambo', 'Ferrari', 'Tesla', 'Jaguar', 'Rivian'];

const category = document.getElementById('category');
const categoryChosen = category.value;

//Tutorial starts
const wordE1 = document.getElementById('word');
const wrongLettersE1 = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');

const figureParts = document.querySelectorAll('.figure-part');

const words = categoryChosen;

alert(words);

let selectedWord = words[Math.floor(Math.random() * words.length)];

alert(selectedWord);
