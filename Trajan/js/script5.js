
'use strict';

(function () {

    const capitalize = foo => {
        return foo && foo.charAt(0).toUpperCase() + foo.substr(1);
    };

    const verboseNumber = number => {
        switch (Number(number)) {
            case 1:
                return 'one';
            case 2:
                return 'two';
            case 3:
                return 'three';
            case 4:
                return 'four';
            case 5:
                return 'five';
            case 6:
                return 'six';
            case 7:
                return 'seven';
            case 8:
                return 'eight';
            case 9:
                return 'nine';
            case 10:
                return 'ten';
        }
        return number;
    };
    const plural = (singular, plural, number) => {
        return Number(number) === 1 ? singular : plural;
    };

    const pickOne = (texts, maybeNotThatOne) => {
        if (texts.length === 1) {
            return texts[0];
        }
        const randomIndex = Math.floor(Math.random() * texts.length);
        if (maybeNotThatOne && maybeNotThatOne === randomIndex) {
            return texts[randomIndex === 0 ? 1 : randomIndex - 1];
        }
        return texts[randomIndex];
    };

    class Hangman {
        constructor() {
        }

        init(word) {
            this.state = 'open';
            this.word = word;
            this.lettersStillToFind = this.word.letters().split('').reduce((agg, letter) => {
                if (agg.indexOf(letter) === -1) {
                    agg.push(letter);
                }
                return agg;
            }, []);
            this.suggestedLetters = [];
            this.suggestions = 0;
            this.lastSuggestionWorked = undefined;
            this.lastSuggestion = undefined;
            this.streak = [];
            this.fails = 0;
            this.maxFails = 10;
            this.fullGame = 0;
        }

        wordForUser() {
            return this.word.letters()
                .split('')
                .map(letter => this.state === 'open' && this.lettersStillToFind.indexOf(letter) > -1 ? undefined : letter.toUpperCase());
        }

        getState() {
            return this.state;
        }

        attempts() {

            return [this.fails, this.maxFails];
        }

        suggest(letter) {

            this.inputStatus = undefined;

            if (this.state !== 'open') {
                this.inputStatus = 'not-open';
                return false;
            }

            letter = letter && letter.toLowerCase();
            if (!letter || letter.length > 1) {
                this.inputStatus = 'invalid-letter';
                return false;
            }

            this.lastSuggestion = letter;

            if (this.suggestedLetters.indexOf(letter) > -1) {
                this.inputStatus = 'already-suggested';
                return false;
            }

            this.suggestions++;

            const foundLetterIndex = this.lettersStillToFind.indexOf(letter);
            this.suggestedLetters.push(letter);
            if (foundLetterIndex > -1) {
                this.lettersStillToFind.splice(foundLetterIndex, 1);

                if (this.lastSuggestionWorked)
                    this.streak.push(letter);
                else
                    this.streak = [letter];

                this.lastSuggestionWorked = true;
                if (this.lettersStillToFind.length === 0) {
                    this.state = 'won';
                }
                return true;
            }

            this.fails++;

            if (!this.lastSuggestionWorked)
                this.streak.push(letter);
            else
                this.streak = [letter];

            this.lastSuggestionWorked = false;

            if (this.fails >= this.maxFails) {
                this.state = 'lost';
            }

            return false;
        }

    }

    class HangManUI {
        constructor(selector, game, wordFetcher) {
            this.game = game;
            this.wordFetcher = wordFetcher;
            this.element = document.querySelector(selector);
            this.buttonMap = new Map();
            this.letterDivs = [];
            this.initElements();
        }

        initElements() {
            this.panelsDiv = this.element.appendChild(document.createElement('div'));
            this.panelsDiv.classList.add('hangman-panels');

            let header = this.panelsDiv.appendChild(document.createElement('div'));
            header.classList.add('hangman-header', 'hangman-panel');

            this.centerDiv = this.panelsDiv.appendChild(document.createElement('div'));
            this.centerDiv.classList.add('hangman-center');

            this.redDiv = this.centerDiv.appendChild(document.createElement('div'));
            this.redDiv.classList.add('hangman-red');

            this.titleDiv = header.appendChild(document.createElement('div'));
            this.titleDiv.classList.add('hangman-title');
            this.titleDiv.innerText = 'Play for a chance to leave';

            this.initGameButton = header.appendChild(document.createElement('div'));
            this.initGameButton.classList.add('hangman-init-game', 'button');
            this.initGameButton.innerText = 'New Game [SPACE]';

            this.wordDiv = this.centerDiv.appendChild(document.createElement('div'));
            this.wordDiv.classList.add('hangman-word');

            this.commentDiv = this.centerDiv.appendChild(document.createElement('div'));
            this.commentDiv.classList.add('hangman-comment');

            this.hint1Div = this.centerDiv.appendChild(document.createElement('div'));
            this.hint1Div.classList.add('hangman-hint', 'hangman-hint-1');
            this.hint1Div.style.opacity = 0;
            this.hint2Div = this.centerDiv.appendChild(document.createElement('div'));
            this.hint2Div.classList.add('hangman-hint', 'hangman-hint-2');
            this.hint2Div.style.opacity = 0;

            const keyboardDiv = this.panelsDiv.appendChild(document.createElement('div'));
            keyboardDiv.classList.add('hangman-keyboard', 'hangman-panel');
            [['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'],
                ['n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']].forEach(row => {
                const keyboardRowDiv = keyboardDiv.appendChild(document.createElement('div'));
                keyboardRowDiv.classList.add('hangman-keyboard-row', 'buttons');
                row.forEach(letter => {
                    const letterDiv = keyboardRowDiv.appendChild(document.createElement('div'));
                    letterDiv.classList.add('key', 'button');
                    letterDiv.innerText = letter.toUpperCase();
                    this.buttonMap.set(letter, letterDiv.classList);
                });
            });

            this.element.addEventListener('click', event => {
                if (event.target.classList.contains('key')) {
                    const letter = event.target.innerText;
                    if (letter.length === 1) {
                        this.suggest(letter);

                    }
                }
                if (event.target === this.initGameButton) {
                    this.start();

                }
            });

            window.addEventListener('keypress', () => {
                const letter = String.fromCharCode(window.event.charCode).toUpperCase();
                if (letter >= 'a' && letter <= 'z' || letter >= 'A' && letter <= 'Z') {
                    this.suggest(letter);
                }
                else if (letter === ' ')
                    this.start();



                else {
                    return;
                }
                window.event.preventDefault();

            }, false);
        }

        start() {
          document.getElementById('hangman').style.visibility = "hidden";

            this.wordFetcher.fetch(word => {
                this.game.init(word);
                this.letterDivs = [];
                while (this.wordDiv.hasChildNodes()) {
                    this.wordDiv.removeChild(this.wordDiv.lastChild);
                }
                this.game.word.letters().split('').forEach(letter => {
                    const letterDiv = this.wordDiv.appendChild(document.createElement('div'));
                    letterDiv.classList.add('hangman-letter', 'unresolved');
                    letterDiv.innerText = '_';
                    this.letterDivs.push(letterDiv);
                });

                this.update();
            });
        }

        suggest(letter) {
            this.game.suggest(letter.toLowerCase());
            this.update();
        }

        update() {
            const escapedLetters = this.game.wordForUser().map(letter => !letter ? '_' : letter);
            const escapedWord = escapedLetters.join('');
            this.hint1Div.innerText = this.game.word.hint1();
            this.hint2Div.innerText = this.game.word.hint2().toLowerCase().replace(this.game.word.letters(), escapedWord.toLowerCase());

            const [fails, max, full] = this.game.attempts();

            const state = this.game.getState();
            if (state === 'open') {
                this.hint1Div.innerText = 'Hint: ' + this.hint1Div.innerText;
                this.hint2Div.innerText = 'Hint: ' + this.hint2Div.innerText;
            }

            this.commentDiv.innerText = pickOne(this.buildComment(state, fails, max), this.commentDiv.innerText);

            const problematic = fails / max > 0.1;
            this.hint1Div.style.opacity = state !== 'open' || problematic ? 0.8 : 0;

            const catastrophic = fails / max > 0.6;
            this.hint2Div.style.opacity = state !== 'open' || catastrophic ? 0.8 : 0;

            const animationDuration = 1100 - (fails * 100);

            const animator = (div, enable = true) => {
                if (enable && catastrophic && state === 'open') {
                    div.style.animationName = Math.random() > 0.5 ? 'swing661' : 'swing660';
                    div.style.animationDuration = `${animationDuration}ms`;
                    div.style.animationIterationCount = 'infinite';
                }
                else if (enable && problematic && state === 'open') {
                    div.style.animationName = Math.random() > 0.5 ? 'swing331' : 'swing330';
                    div.style.animationDuration = `${animationDuration}ms`;
                    div.style.animationIterationCount = 'infinite';
                }
                else {
                    div.style.animationName = undefined;
                    div.style.animationDuration = undefined;
                    div.style.animationIterationCount = undefined;
                }
            };

            this.redDiv.style.transform = `scaleX(${state === 'won' ? 0 : (fails / max)})`;
            this.redDiv.style.opacity = `${0.1 + (fails / max) * 0.3}`;

            this.letterDivs.forEach((letterDiv, index) => {
                letterDiv.innerText = escapedLetters[index];
                animator(letterDiv, letterDiv.innerText === '_')
            });

            this.buttonMap.forEach((classList, letter) => {
                classList.toggle('disabled', state !== 'open' || this.game.suggestedLetters.indexOf(letter) > -1);
            });
        }

        buildComment(state, fails, max) {
            const suggestions = this.game.suggestions;
            const lastSuggestionWorked = this.game.lastSuggestionWorked;
            const lastSuggestion = this.game.lastSuggestion && this.game.lastSuggestion.toUpperCase();
            const streakLength = this.game.streak.length;
            const streak = this.game.streak.map(letter => letter.toUpperCase());

            const thing = this.game;
            function pageRedirect(){
             var delay = 2000; // time in milliseconds

             // Display message

             setTimeout(function(){
              window.location = "nightopenning.html";
             },delay);

            }

            if (state === 'lost') {
              document.getElementById('hangman').style.visibility = "visible";
              var audio5 = new Audio("img/jumpscare.mp3");
              audio5.play();
              audio5.pause();
              setTimeout(function() {
                audio5.play();
              }, 1700);

              return ['You lose.'];


            }

            if (state === 'won') {
              pageRedirect();
              return [`You have won your freedom, too bad it doesn't play by the rules.`];
            }



            const inputStatus = this.game.inputStatus;
            if (inputStatus === 'not-open') {
                return [`The game is not open.`];
            }
            if (inputStatus === 'invalid') {
                return [`The letter is not recognized.`];
            }
            if (inputStatus === 'already-suggested') {
                if (this.game.word.contains(this.game.lastSuggestion)) {
                    return [`"${lastSuggestion}" has already been selected`];
                }

            }

            if (suggestions === 0) {
                return [
                    `You only have 10 chances to win, after each lose you will suffer a punishment`,

                ];
            }

            if (fails === 0 && streakLength > 2) {
                return [`${verboseNumber(streakLength)} guesses already and nothing wrong so far...`];
            }

            if (fails === 0 && streakLength === 1) {
                return [`Starting with a correct guess is certainly a good omen.`,
                ];
            }

            if (fails === 0) {
                return [`Good for you.`
                    ];
            }

            if (lastSuggestionWorked && streakLength > 1) {
                return [`${capitalize(verboseNumber(streakLength))} correct in a row ...`,
                    `You're having a nice run, wouldn't want you to mess up`];
            }
            if (lastSuggestionWorked && streakLength > 2) {
                return [`He is getting impatient.`
                    ];
            }

            if (!lastSuggestionWorked && streakLength > 3) {
                const no = ['Your poor thing', 'he is excited now', 'we can taste your frustation', 'haha no'];
                return [`You will surely lose your soul.`,
                    `Keep this up, and you shall certainly lose.`,
                    `${streak.map((letter, index) => `"${letter}"? ${no[Math.floor(Math.random() * no.length)]}.`).join(' ')} And you still want to win?`];
            }

            if (!lastSuggestionWorked && streakLength > 2) {
                return [` ${verboseNumber(streakLength)} wrong in a row.`
                ];
            }

            if (!lastSuggestionWorked && streakLength > 1) {
                return [`${capitalize(verboseNumber(streakLength))} wrong in a row ...`
                ];
            }

            if (!lastSuggestionWorked && streakLength === 1) {
                return [` "${lastSuggestion}" is a fail.`
                    ];
            }

            if (fails > 0 && lastSuggestionWorked) {
                return [`"${lastSuggestion}" is correct.`,
                    `Yes, "${lastSuggestion}" is correct.`,
                    `Sadly, "${lastSuggestion}" would have been a failure in many other words, but not in this one.`,
                    ];
            }

            if (fails > 5) {
                return [
                    `${capitalize(verboseNumber(fails))} wrong ${plural('guess', 'guesses', fails)} already - ${verboseNumber(max)} and you're mine`,
                    `${capitalize(verboseNumber(fails))} ${plural('guess was', 'guesses were', fails)} wrong already, ${verboseNumber(max - fails)} more and you're dead`
                ];
            }

            return [
                `${capitalize(verboseNumber(fails))} wrong ${plural('guess', 'guesses', fails)}, try to survive.`,
                `${capitalize(verboseNumber(fails))} ${plural('guess was', 'guesses were', fails)}, you better start picking correct letters now.`
            ];
        }
    }

    class Word {
        constructor(letters, hint1, hint2) {
            this._letters = letters.toLowerCase();
            this._hint1 = hint1;
            this._hint2 = hint2;
        }

        letters() {
            return this._letters;
        }

        hint1() {
            return this._hint1;
        }

        hint2() {
            return this._hint2;
        }

        contains(letter) {
            return this._letters.indexOf(letter.toLowerCase()) > -1;
        }
    }

    class WordFetcher {
        constructor() {
            this.words = [];
            this.fetched = [];
        }

        add(letters, hint1, hint2) {
            this.words.push(new Word(letters, hint1, hint2));
        }

        fetch(cb) {
            if (this.words.length === 0) {
                this.words = this.fetched;
                this.fetched = [];
            }
            let word = this.words.splice(Math.floor(Math.random() * this.words.length), 1)[0];
            this.fetched.push(word);
            cb(word);
        }

        url(word) {
            return `http://www.wordthink.com/${word.letters()}/`;
        }
    }

    const wordFetcher = new WordFetcher();
    wordFetcher.add('malignant', 'adj.  tending to produce death or deterioration', 'The malignant creature stalked me from the shadows.');
    wordFetcher.add('nefarious', 'adj.  Infamous by way of being extremely wicked. Wicked in the extreme; abominable; iniquitous; atrociously villainous; execrable; detestably vile', 'His nefarious whispers were stuck in my head.');
    wordFetcher.add('mercurial', 'adj.  1. Quick and changeable in temperament; volatile', 'His mercurial temperament made me fear him.');
    wordFetcher.add('visceral', 'adj. 1. Instinctual: proceeding from instinct rather than from reasoned thinking or intellect. 2. Emotional: characterized by or showing crude or elemental emotions.', 'A visceral experience left her as a shell.');
    wordFetcher.add('acerbic', 'adj. Sharp or biting, as in character or expression.', 'The demon spoke in a acerbic tone that drove people mad.');
    wordFetcher.add('pugnacious', 'adj. 1. Quarrelsome or combative in nature; belligerent. 2. Expressing an argument or opinion very forcefully.', 'it was quite pugnacious in its nature.');
    wordFetcher.add('ubiquitous', 'adj.  Being or seeming to be everywhere, or in all places, at the same time; omnipresent', 'the monster was Ubiquitous in my life.');
    wordFetcher.add('mendacious', 'adj Not telling the truth; lying', 'the mendacious spirit wove pretty lies that led children from the light.');


    const game = new HangManUI('.hangman', new Hangman(), wordFetcher);
    game.start();




})();



class TextScramble {
  constructor(el) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#________'
    this.update = this.update.bind(this)
  }
  setText(newText) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => this.resolve = resolve)
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }
  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}

// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————

const phrases = [
  'Have you seen sinister?',
  'You see it is about a true crime writer',
  'Who moves his family into a house',
  'they are not alone.',
  'He finds some old film footage ',
  'but there is a figure in the film.',
  'The more film you watch the more it takes over.',
  'You have 10 chances to win the game below.',
  'If you fail, your soul will be taken.',
  'Good Luck.'


]

const el = document.querySelector('.text')
const fx = new TextScramble(el)

let counter = 0
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 800)
  })
  counter = (counter + 1) % phrases.length
}

next()
