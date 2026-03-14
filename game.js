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
    PLAYING: 'playing', 
    GAMEOVER: 'gameover' 
}; 

let currentState = STATES.MENU; 

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
        //bgm.play().catch(() => {});
        
    } 
    
    if (newState === STATES.GAMEOVER) { 
        highScore = Math.max(highScore, Math.floor(score)); 
        //bgm.pause();    //stop music when game over
    } 
} 
    
//
//-----------------------------------KEYBOARD INPUTS-----------------------------------
//
document.addEventListener('keydown', (e) => { 
    if (e.code === 'Space') { 
        e.preventDefault(); 
        
        if (currentState === STATES.MENU) { 
            changeState(STATES.PLAYING); 
            return; 
        } 
    
        if (currentState === STATES.PLAYING) { 
            return; 

        } 
    
        if (currentState === STATES.GAMEOVER) { 
            changeState(STATES.MENU); 

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

function drawBackground() {
    // draw background
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function drawMenu() { 
    drawBackground();
    //drawGround();
    
    ctx.fillStyle = '#000000ff'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'bold 70px Papyrus'; 
    ctx.fillText('Pharaoh\'s Fortune', canvas.width / 2, 140); 
    
    ctx.font = 'bold 20px Papyrus'; 
    ctx.fillText('Press SPACE to Start', canvas.width / 2, 185); 

    // ctx.fillText('During play: ' , canvas.width / 2, 245); 
    // ctx.font = '20px Times New Roman';
    // ctx.fillText('SPACE = shoot', canvas.width / 2, 280);
    // ctx.fillText('UP ARROW = jump up', canvas.width / 2, 305);
    // ctx.fillText('DOWN ARROW = slam down', canvas.width / 2, 330);
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