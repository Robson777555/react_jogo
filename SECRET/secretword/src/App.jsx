import './App.css';
import { useState, useEffect, useCallback } from 'react';

import { wordsList } from "./data/words";

import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

// Defina a variável stages
const stages = [
  { name: "start" },
  { name: "game" },
  { name: "end" }
];

const guessesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name); 
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    console.log(category);

    const word = words[category][Math.floor(Math.random() * words[category].length)];

    console.log(word);

    return { word, category };
  },[words]);

  const startGame = useCallback(() => {
    
    clearLettersStates()
    
    const { word, category } = pickWordAndCategory();

    let wordLetters = word.split("").map((l) => l.toLowerCase());

    console.log(word, category);
    console.log(wordLetters);

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);
    
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
   const normalizedLetter = letter.toLowerCase()

   if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
    return 
   }

   if(letters.includes(normalizedLetter)){
    setGuessedLetters((actualGuessedLetters)=>[
      ...actualGuessedLetters,
      normalizedLetter
    ])

   }else{
    setWrongLetters((actualWrongLetters)=>[
      ...actualWrongLetters,
      normalizedLetter
    ])

    setGuesses((actualGuesses)=> actualGuesses - 1)
   }

  };

  const clearLettersStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

 useEffect(() => {
  if(guesses <= 0){

    clearLettersStates()

    setGameStage(stages[2].name)
  }

 }, [guesses])

 useEffect(() => {

  const uniqueLetters = [...new Set(letters)]

  if(guessedLetters.length === uniqueLetters.length){
    setScore((actualScore) => actualScore += 100)

    startGame()


  }

  

 }, [guessedLetters, letters, startGame])

  const retry = () => {
    
    setScore(0)
    setGuesses(guessesQty)


    setGameStage(stages[0].name);
  };

  useEffect(() => {
    console.log(`gameStage: ${gameStage}`);
  }, [gameStage]);

  return (
    <div className='App'>
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
