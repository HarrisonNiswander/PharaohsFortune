const canvas = document.getElementById('game'); 
const ctx = canvas.getContext('2d'); 

//
//-----------------------------------AUDIO FUNCTIONS-----------------------------------
//


//
//-----------------------------------GAME STATES-----------------------------------
//
const STATES = { 
    MENU: 'menu', 
    NUM_PLAYER: 'number of players', 
    INSTRUCTIONS: 'instructions',
    PLAYING: 'playing', 
    GAMEOVER: 'gameover' 
}; 

let currentState = STATES.MENU; 
let multiplayer = false;

//
//-----------------------------------GAME VARIABLES-----------------------------------
//

//variables

function resetGame() { 
    //reset game variables

} 

resetGame();

function changeState(newState) { 
    currentState = newState; 
    
    if (newState === STATES.PLAYING) { 
        resetGame(); 
        
        
    } 
    
    if (newState === STATES.GAMEOVER) { 
        highScore = Math.max(highScore, Math.floor(score)); 
        
    } 
} 
    
//
//-----------------------------------KEYBOARD INPUTS-----------------------------------
//
document.addEventListener('keydown', (e) => { 
    if (e.code === 'Space') { 
        e.preventDefault(); 
        
        if (currentState === STATES.MENU) { 
            changeState(STATES.NUM_PLAYER); 
            return; 
        }  
    
        if (currentState === STATES.PLAYING) { 
            return; 

        } 
    
        if (currentState === STATES.GAMEOVER) { 
            changeState(STATES.MENU); 

        } 

    } 

    if (e.code === 'Digit1') { 
        e.preventDefault(); 

        if (currentState === STATES.NUM_PLAYER) { 
            multiplayer = false;
            changeState(STATES.INSTRUCTIONS); 
            return; 
        }

    }

    if (e.code === 'Digit2') { 
        e.preventDefault(); 

        if (currentState === STATES.NUM_PLAYER) { 
            multiplayer = true;
            changeState(STATES.INSTRUCTIONS); 
            return; 
        }

    }
}); 

//
//-----------------------------------COLLISION FUNCTIONS-----------------------------------
//

//square on square collision
function aabb(a, b) { 
    return a.x < b.x + b.w && 
        a.x + a.w > b.x && 
        a.y < b.y + b.h && 
        a.y + a.h > b.y; 
}

//circle on circle collision
function circleCircle(c1, c2) { 
    const dx = c1.x - c2.x; 
    const dy = c1.y - c2.y; 
    const distSq = dx * dx + dy * dy; 
    const radiusSum = c1.r + c2.r; 
    return distSq <= radiusSum * radiusSum; 
} 

//circle on square collision
function rectCircle(rect, circle) { 
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w)); 
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h)); 
    
    const dx = circle.x - closestX; 
    const dy = circle.y - closestY; 
    
    return (dx * dx + dy * dy) <= circle.r * circle.r; 
} 

//
//-----------------------------------UPDATE PLAYING-----------------------------------
//

function updatePlaying() { 
    
}

//
//-----------------------------------DRAW FUNCTIONS-----------------------------------
//

function drawGround() { 
    ctx.fillStyle = '#2f2f2f'; 
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y); 
} 

//set background
const background = new Image();
background.src = "./images/pyramid_background.jpg"; // Set image source

//set jewels
const diamond = new Image();
const gold = new Image();
const green = new Image();
const purple = new Image();
const red = new Image();
diamond.src = "./images/jewels/diamond-jewel.png";
gold.src = "./images/jewels/gold-jewel.png";
green.src = "./images/jewels/green-jewel.png";
purple.src = "./images/jewels/purple-jewel.png";
red.src = "./images/jewels/red-jewel.png";

function drawBackground() {
    // draw background
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function drawMenu() { 
    drawBackground();
    
    ctx.fillStyle = '#000000ff'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'bold 70px Papyrus'; 
    ctx.fillText('Pharaoh\'s Fortune', canvas.width / 2, 140); 
    
    ctx.font = 'bold 20px Papyrus'; 
    ctx.fillText('Press SPACE to Start', canvas.width / 2, 185); 

} 

function drawNumPlayer() {
    drawBackground();

    ctx.fillStyle = '#000000ff'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'bold 50px Papyrus'; 
    ctx.fillText('Select Game Mode', canvas.width / 2, 100); 
    
    ctx.textAlign = 'left'; 
    ctx.font = 'bold 25px Papyrus'; 
    ctx.fillText('Single Player', canvas.width / 4, 165); 

    ctx.font = 'bold 20px Papyrus'; 
    ctx.fillText('Press 1', canvas.width / 3 - 35, 195); 

    ctx.textAlign = 'right'; 
    ctx.font = 'bold 25px Papyrus'; 
    ctx.fillText('Multiplayer', canvas.width / 4 * 3, 165); 

    ctx.font = 'bold 20px Papyrus'; 
    ctx.fillText('Press 2', canvas.width / 3 * 2 + 45, 195); 
}

function drawInstructions() {
    drawBackground();

    //Single Player Instructions
    if(multiplayer === false)
    {
        ctx.fillStyle = '#000000ff'; 
        ctx.textAlign = 'left'; 
        ctx.font = 'bold 20px Papyrus'; 
        ctx.fillText('Single Player', 10, 30); 

        ctx.textAlign = 'center'; 
        ctx.font = 'bold 50px Papyrus'; 
        ctx.fillText('How to Play!', canvas.width / 2, 80); 

        ctx.font = 'bold 30px Papyrus'; 
        ctx.fillText('Race to Collect all 5 of the Pharaoh\'s Jewels!', canvas.width / 2, 130); 

        ctx.drawImage(diamond, 0, 35);
        ctx.drawImage(gold, 125, 35);
        ctx.drawImage(green, 250, 35);
        ctx.drawImage(purple, 375, 35);
        ctx.drawImage(red, 500, 45);

    }

    //Multiplayer Instructions
    else{
        ctx.fillStyle = '#000000ff'; 
        ctx.textAlign = 'center'; 
        ctx.font = 'bold 50px Papyrus'; 
        ctx.fillText('How to Play!', canvas.width / 2, 80);

        ctx.font = 'bold 20px Papyrus'; 
        ctx.fillText('Multiplayer', canvas.width / 2, 120); 
    }
}

function drawPlaying() { 
    // draw stuff while playing

} 

function drawGameOver() { 
    drawPlaying(); 
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
    
    ctx.fillStyle = '#ff4d4d'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'bold 72px Arial'; 
    ctx.fillText('GAME OVER', canvas.width / 2, 140); 
    
    ctx.fillStyle = '#ffffff'; 
    ctx.font = '24px Arial'; 
    ctx.fillText(`Final Score: ${Math.floor(score)}`, canvas.width / 2, 205); 
    ctx.fillText('Press SPACE for menu', canvas.width / 2, 250); 
} 

function gameLoop() { 
    switch (currentState) { 
        case STATES.MENU: 
        drawMenu(); 
        break; 
        case STATES.NUM_PLAYER: 
        drawNumPlayer(); 
        break; 
        case STATES.INSTRUCTIONS: 
        drawInstructions(); 
        break; 
        case STATES.PLAYING: 
        updatePlaying(); 
        drawPlaying(); 
        break; 
        case STATES.GAMEOVER: 
        drawGameOver(); 
        break; 
    } 
    
    requestAnimationFrame(gameLoop); 
} 

gameLoop();