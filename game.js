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

        if (currentState === STATES.INSTRUCTIONS) { 
            changeState(STATES.PLAYING); 
            return; 
        } 
    
        // if (currentState === STATES.PLAYING) { 
        //     return; 

        // } 
    
        // if (currentState === STATES.GAMEOVER) { 
        //     changeState(STATES.MENU); 

        // } 

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
const IMG_title = new Image();
const IMG_level = new Image()
IMG_title.src = "./images/pyramid_background.jpg";
IMG_level.src = "./images/level_background.png";

//set jewels
const IMG_diamond = new Image();
const IMG_gold = new Image();
const IMG_green = new Image();
const IMG_purple = new Image();
const IMG_red = new Image();
IMG_diamond.src = "./images/jewels/diamond-jewel.png";
IMG_gold.src = "./images/jewels/gold-jewel.png";
IMG_green.src = "./images/jewels/green-jewel.png";
IMG_purple.src = "./images/jewels/purple-jewel.png";
IMG_red.src = "./images/jewels/red-jewel.png";

//set WASD & IJKL
const IMG_wasd = new Image();
const IMG_ijkl = new Image();
IMG_wasd.src = "./images/key_pics/WASD_Keys.png";
IMG_ijkl.src = "./images/key_pics/IJKL_Keys.png";

//set player characters
const IMG_player1 = new Image();
const IMG_player2 = new Image();
IMG_player1.src = "./images/player1.png";
IMG_player2.src = "./images/player2.png";

function drawMenu() { 
    ctx.drawImage(IMG_title, 0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#000000ff'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'bold 70px Papyrus'; 
    ctx.fillText('Pharaoh\'s Fortune', canvas.width / 2, 140); 
    
    ctx.font = 'bold 20px Papyrus'; 
    ctx.fillText('Press SPACE to Start', canvas.width / 2, 185); 

} 

function drawNumPlayer() {
    ctx.drawImage(IMG_title, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000ff'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'bold 50px Papyrus'; 
    ctx.fillText('Select Game Mode', canvas.width / 2, 100); 
    
    ctx.textAlign = 'left'; 
    ctx.font = 'bold 25px Papyrus'; 
    ctx.fillText('Single Player', canvas.width / 4, 165); 

    ctx.font = 'bold 20px Papyrus'; 
    ctx.fillText('Press 1', canvas.width / 3 - 35, 195); 

    ctx.drawImage(IMG_player1, 230, 180, 140, 140);

    ctx.textAlign = 'right'; 
    ctx.font = 'bold 25px Papyrus'; 
    ctx.fillText('Multiplayer', canvas.width / 4 * 3, 165); 

    ctx.font = 'bold 20px Papyrus'; 
    ctx.fillText('Press 2', canvas.width / 3 * 2 + 45, 195); 

    ctx.drawImage(IMG_player1, 520, 180, 140, 140);
    ctx.drawImage(IMG_player2, 570, 180, 140, 140);
    
}

function drawInstructions() {
    ctx.drawImage(IMG_level, 0, 0, canvas.width, canvas.height);

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

        //jewels
        ctx.drawImage(IMG_diamond, 0, 35);
        ctx.drawImage(IMG_gold, 125, 35);
        ctx.drawImage(IMG_green, 250, 35);
        ctx.drawImage(IMG_purple, 375, 35);
        ctx.drawImage(IMG_red, 500, 45);

        //WASD
        ctx.font = 'bold 25px Papyrus'; 
        ctx.fillText('Controls', canvas.width / 2, 260);

        ctx.drawImage(IMG_wasd, 215, 210, 260, 260);

        ctx.font = 'bold 20px Papyrus'; 
        ctx.fillText('W   -->  Jump', canvas.width / 3 * 2 - 50, 300); 
        ctx.fillText('A   -->  Left', canvas.width / 3 * 2 - 50, 330); 
        ctx.fillText('S   -->  Jump', canvas.width / 3 * 2 - 50, 360); 
        ctx.fillText('D   -->  Right', canvas.width / 3 * 2 - 50, 390); 

        //players
        ctx.drawImage(IMG_player1, canvas.width - 100, -15, 140, 140);
        
        ctx.fillStyle = '#ffffff'; 
        ctx.textAlign = 'right'; 
        ctx.font = 'bold 30px Papyrus'; 
        ctx.fillText('Press Space to Begin!', canvas.width - 5, canvas.height - 15); 

    }

    //Multiplayer Instructions
    else{
        ctx.fillStyle = '#000000ff'; 
        ctx.textAlign = 'left'; 
        ctx.font = 'bold 20px Papyrus'; 
        ctx.fillText('Multiplayer', 10, 30); 

        ctx.textAlign = 'center'; 
        ctx.font = 'bold 50px Papyrus'; 
        ctx.fillText('How to Play!', canvas.width / 2, 80); 

        ctx.font = 'bold 30px Papyrus'; 
        ctx.fillText('Race to Collect 5 of the Pharaoh\'s Jewels!', canvas.width / 2, 130); 

        //jewels
        ctx.drawImage(IMG_diamond, 0, 35);
        ctx.drawImage(IMG_gold, 125, 35);
        ctx.drawImage(IMG_green, 250, 35);
        ctx.drawImage(IMG_purple, 375, 35);
        ctx.drawImage(IMG_red, 500, 45);

        //WASD
        ctx.font = 'bold 25px Papyrus'; 
        ctx.fillText('Controls', canvas.width / 2, 260);

        ctx.drawImage(IMG_wasd, 70, 210, 260, 260);

        ctx.font = 'bold 20px Papyrus'; 
        ctx.fillText('W   -->  Jump', canvas.width / 2 - 70, 300); 
        ctx.fillText('A   -->  Left', canvas.width / 2 - 70, 330); 
        ctx.fillText('S   -->  Jump', canvas.width / 2 - 70, 360); 
        ctx.fillText('D   -->  Right', canvas.width / 2 - 70, 390); 

        //IJKL
        ctx.drawImage(IMG_ijkl, 450, 210, 260, 260);

        ctx.fillText('I   -->  Jump', canvas.width / 2 + 310, 300); 
        ctx.fillText('J   -->  Left', canvas.width / 2 + 310, 330); 
        ctx.fillText('K   -->  Jump', canvas.width / 2 + 310, 360); 
        ctx.fillText('L   -->  Right', canvas.width / 2 + 310, 390); 

        //players
        ctx.drawImage(IMG_player1, canvas.width - 150, -15, 140, 140);
        ctx.drawImage(IMG_player2, canvas.width - 100, -15, 140, 140);
        
        ctx.fillStyle = '#ffffff'; 
        ctx.textAlign = 'right'; 
        ctx.font = 'bold 30px Papyrus'; 
        ctx.fillText('Press Space to Begin!', canvas.width - 5, canvas.height - 15); 
    }
}

function drawPlaying() { 
    //level background
    ctx.drawImage(IMG_level, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFD782'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'bold 72px Arial'; 
    ctx.fillText('PLAYING THE GAME', canvas.width / 2, 140); 

} 

function drawGameOver() { 
    drawPlaying(); 
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
    
    ctx.fillStyle = '#ff4d4d'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'bold 72px Arial'; 
    ctx.fillText('GAME OVER', canvas.width / 2, 140); 
    
    //ctx.fillStyle = '#ffffff'; 
    //ctx.font = '24px Arial'; 
    //ctx.fillText(`Final Score: ${Math.floor(score)}`, canvas.width / 2, 205); 
    //ctx.fillText('Press SPACE for menu', canvas.width / 2, 250); 
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