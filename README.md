# 2048

## Description

### What is 2048?

2048 is a popular single-player sliding block puzzle game (<a href="https://play2048.co/">see original</a>). The game screen is divided into a 4x4 grid of grey tiles upon which other tiles, numbered with powers of two, slide. Swiping left, right, up, or down will slide the tiles in the respective direction. The game begins with just two tiles labelled
with the number two. When tiles are slid in a particular direction and have the same value, they stack, causing them to combine into the product of their values. Each type of tile is made distinct by its value, and the colour of the tile. After each swipe a new tile will appear in a random uncoccupied position. Newly spawned tiles always have a value of two.  

### How to play

On desktop the game is played using the arrow keys or the WASD keys. On mobile simply swiping slides the tiles.

### How to win/lose

The objectives of the game are to ensure that the grid is never completely filled, and to combine the tiles so that a tile with the value 2048 is formed. 

## Installation

To download the source code I recommend:

```bash
git clone https://github.com/PBardy/2048
```

Then run a local webserver to server the index.html file. This can be done easily with the Visual Studio Code live server extension. In order for the application to function as a PWA on localhost the URL must be 'http://127.0.0.1:5500/src/index.html'.

There is also a hosted version found at: <a href="https://pbardy.000webhostapp.com/projects/2048/src/">https://pbardy.000webhostapp.com/projects/2048/src/</a>

## Roadmap

Features to add:

* Downloadability on mobile and desktop devices as a PWA
* A game end screen 

Future features:

* A global leaderboard for highscores

## Screenshots

<img src="screenshots/project-2048-1.jpg?raw=true" width="256" />
<img src="screenshots/project-2048-2.jpg?raw=true" width="256" />
<img src="screenshots/project-2048-3.jpg?raw=true" width="256" />
<img src="screenshots/project-2048-4.jpg?raw=true" width="256" />

