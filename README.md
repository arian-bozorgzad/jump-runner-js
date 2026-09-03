# Jump Runner

Jump Runner is a small browser-based endless runner game that I created for a web design course.

The player runs automatically and has to jump over ground obstacles and duck under flying birds. The project was built using only HTML, CSS, and vanilla JavaScript, without any external libraries.

## Live Demo

[Play Jump Runner](https://arian-bozorgzad.github.io/jump-runner-js/)
- Features

* Jump over ground obstacles
* Hold the Down Arrow key to duck under flying obstacles
* Random obstacle generation
* Basic jump physics using velocity and gravity
* Collision detection
* Different collision box while ducking
* Score and high score system
* High score saved using `localStorage`
* Game speed gradually increases
* Start and game-over screens
* Restart using a button or the `R` key
* Sound effects created with the Web Audio API
* Sound on/off button
* Moving ground and clouds
* Responsive layout

## Technologies

* HTML5
* CSS3
* Vanilla JavaScript

No external JavaScript libraries or frameworks are used.

## Controls

| Key              | Action                  |
| ---------------- | ----------------------- |
| Space / Arrow Up | Jump                    |
| Hold Arrow Down  | Duck                    |
| R                | Restart after game over |

## JavaScript Concepts Used

This project gave me practice with:
 

* DOM manipulation
* Event listeners
* Keyboard events
* Creating and removing HTML elements with JavaScript
* `requestAnimationFrame()`
* Random number generation
* Basic game physics
* Rectangle collision detection
* `localStorage`
* Web Audio API
- This project also gave me a better understanding of JavaScript and how it is used to make websites interactive.
## Project Structure

```text
jump-runner-game/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── game.js
├── assets/
│   └── images/
│       └── favicon.png
└── README.md
```
The game graphics are created mainly with CSS, so no external game images are required. Sound effects are generated directly in JavaScript using the Web Audio API.

## How to Run

1. Download or clone the repository.
2. Open the project folder.
3. Open `index.html` in a web browser.
4. Click **Start Game**.

## How It Works

The game uses `requestAnimationFrame()` for the main game loop. While the game is running, JavaScript updates the player movement, obstacles, background, collision detection, and score.

Jumping is controlled using a simple velocity and gravity system. Obstacles are generated randomly and move from right to left across the screen.

The game uses rectangular collision boxes to check whether the player hits an obstacle. The player's collision box becomes shorter while ducking so flying obstacles can pass above the player.

The high score is stored in the browser with `localStorage`, so it remains available after refreshing or reopening the game.

## What I Learned

This project helped me understand front-end development better and showed me how HTML, CSS, and JavaScript work together to create an interactive application.

I also practiced working with animation loops, keyboard input, collision detection, browser storage, DOM manipulation , responsive design, and the Web Audio API.

## Future Improvements

If I continue exploring front-end development, some features I would like to add are:


* More obstacle types
* Different backgrounds
* Character color options
* Levels or difficulty modes
* Collectible coins
* Tailwind CSS or Bootstrap 5 for a more professional and responsive design.
