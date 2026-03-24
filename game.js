//Game Development
//Project 2
//Riley Tate
//Harrison Niswander
const canvas = document.getElementById('game'); 
const ctx = canvas.getContext('2d'); 

//
//-----------------------------------AUDIO FUNCTIONS-----------------------------------
//
//music
    const title_music = new Audio('assets/audio/title_music.mp3');
    title_music.loop = true;
    title_music.volume = 0.35; // 0.0 to 1.0

    const level_music = new Audio('assets/audio/level_music.mp3');
    level_music.loop = true;
    level_music.volume = 0.35; // 0.0 to 1.0

    //allow music to player after first button iteraction
    let audioUnlocked = false;
    function unlockAudioAndStartMusic() {
        if (audioUnlocked) return;
        audioUnlocked = true;
        title_music.play().catch(() => {
            // Browser may still block; try again on next user input
        });
    }
    document.addEventListener('keydown', () => {
        unlockAudioAndStartMusic();
    }, { once: false });

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
//-----------------------------------SCREEN FADE-----------------------------------
//

//screen fades
let fadeAlpha = 1;           // 0 = clear, 1 = fully black 
let fadeSpeed = 0.04;        // adjust for faster/slower fade 
let fadeDirection = -1;       // 1 = fade out, -1 = fade in, 0 = idle 
let pendingState = null;     // which state we switch to at black screen 

function changeStateWithFade(nextState) { 
    // ignore if already transitioning 
    if (fadeDirection !== 0) return; 
    pendingState = nextState; 
    fadeDirection = 1; // start fade out 
} 

function updateTransition() { 
    if (fadeDirection === 0) return; 
    
    fadeAlpha += fadeSpeed * fadeDirection; 
    
    // Reached full black: switch state, then fade back in 
    if (fadeDirection === 1 && fadeAlpha >= 1) { 
        fadeAlpha = 1; 
        currentState = pendingState; 
        pendingState = null; 
        fadeDirection = -1; 
    } 
    
    // Reached clear screen: stop transition 
    if (fadeDirection === -1 && fadeAlpha <= 0) { 
        fadeAlpha = 0; 
        fadeDirection = 0; 
    } 
} 

//
//-----------------------------------GAME VARIABLES-----------------------------------
//

//ground location and gravity
const GROUND_Y = 400; 
const GRAVITY = 0.75;

//player
let player1 = { x: 0, y: 0, w: 0, h: 0};    
let player2 = { x: 0, y: 380, w: 140, h: 95};
// const platform = {
//     x: 0,
//     y: 0,
//     w: 200,
//     h: 100
// };

platform = [];
jewel = [];

player1_score = 0;
player_2score = 0;

function resetGame() { 
    //reset game variables
    player1 = { 
        x: 0, 
        y: 400, 
        w: 0, 
        h: 70, 
        vx: 0,
        vy: 0, 
        onGround: true,
        facing: 'right' 
    };
    player2 = { 
        x: canvas.width - 40, 
        y: 400, 
        w: 0, 
        h: 70, 
        vx: 0,
        vy: 0, 
        onGround: true,
        facing: 'right' 
    };

    platform = [];
    jewel = [];

    player1_score = 0;
    player2_score = 0;
} 

resetGame();

function changeState(newState) { 
    changeStateWithFade(newState);
    //currentState = newState; 
    
    if (newState === STATES.PLAYING) { 
        resetGame();
        spawnPlatform();
        spawnJewels();
        startTimer();
    } 
    
    if (newState === STATES.GAMEOVER) { 
        //highScore = Math.max(highScore, Math.floor(score)); 
        stopTimer();
    } 
} 

let startTime;
function startTimer() {
    startTime = Date.now(); // Record the start time in milliseconds

}

let endTime;
function endTimer() {
    endTime = Date.now();
}
    
//
//-----------------------------------KEYBOARD INPUTS-----------------------------------
//
// Movement variables
let wPressed = false;
let aPressed = false;
let sPressed = false;
let dPressed = false;

let iPressed = false;
let jPressed = false;
let kPressed = false;
let lPressed = false;

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

    //
    //Player 1 Controls
    //

    if( e.code === 'KeyW')
    {
        e.preventDefault();
        if(currentState === STATES.PLAYING)
        {
            // Implement player jump logic here
            if (currentState === STATES.PLAYING && player1.onGround === true) { 
                player1.vy = -13; 
                player1.onGround = false; 

            }
        }
    }

    if( e.code === 'KeyA')
    {
        e.preventDefault();
        if(currentState === STATES.PLAYING)
        {
            // move left
            if (currentState === STATES.PLAYING) { 
                aPressed = true;
                // player1.vx = -10; 
                player1.facing = 'left';

            }
        }
    }

    if( e.code === 'KeyS')
    {
        e.preventDefault();
        if(currentState === STATES.PLAYING)
        {
            // drop down
            if (currentState === STATES.PLAYING) { 
                player1.y += 90;
                player1.onGround = false; 
                
            }
        }
    }

    if( e.code === 'KeyD')
    {
        e.preventDefault();
        if(currentState === STATES.PLAYING)
        {
            // move right
            if (currentState === STATES.PLAYING) { 
                // player1.vx = 10; 
                dPressed = true;
                player1.facing = 'right';
                
            }
        }
    }

    //
    //Player 2 Controls
    //

    if( e.code === 'KeyI')
    {
        e.preventDefault();
        if(currentState === STATES.PLAYING)
        {
            // Implement player jump logic here
            if (currentState === STATES.PLAYING) { 
                player2.vy = -13; 
                player2.onGround = false; 

            }
        }
    }

    if( e.code === 'KeyJ')
    {
        e.preventDefault();
        if(currentState === STATES.PLAYING)
        {
            // player2.vx = -20;
            jPressed = true;
            player2.facing = 'left';
        }
    }

    if( e.code === 'KeyK')
    {
        e.preventDefault();
        if(currentState === STATES.PLAYING)
        {
            // drop down
            if (currentState === STATES.PLAYING) { 
                player2.y += 90;
                player2.onGround = false; 
                
            }
        }
    }

    if( e.code === 'KeyL')
    {
        e.preventDefault();
        if(currentState === STATES.PLAYING)
        {
            // player2.vx = 20;
            lPressed = true;
            player2.facing = 'right';
        }
    }
}); 

// Keyup events
document.addEventListener('keyup', function(e) {

    // Player 1 keyup events for x movement 
    if( e.code === 'KeyA')
    {
        e.preventDefault();
        if(currentState === STATES.PLAYING)
        {
            // move left
            if (currentState === STATES.PLAYING) { 
                aPressed = false;
                // player1.vx = -10; 
                player1.facing = 'left';

            }
        }
    }

    if( e.code === 'KeyD')
    {
        e.preventDefault();
        if(currentState === STATES.PLAYING)
        {
            // move right
            if (currentState === STATES.PLAYING) { 
                // player1.vx = 10; 
                dPressed = false;
                player1.facing = 'right';
                
            }
        }
    }

    // Player 2 keyup events for x movement
    if( e.code === 'KeyJ')
    {
        e.preventDefault();
        if(currentState === STATES.PLAYING)
        {
            // move left
            if (currentState === STATES.PLAYING) { 
                jPressed = false;
                // player2.vx = -10; 
                player2.facing = 'left';

            }
        }
    }

    if( e.code === 'KeyL')
    {
        e.preventDefault();
        if(currentState === STATES.PLAYING)
        {
            // move right
            if (currentState === STATES.PLAYING) { 
                // player2.vx = 10; 
                lPressed = false;
                player2.facing = 'right';
                
            }
        }
    }
})

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
//-----------------------------------SPAWNING FUNCTIONS-----------------------------------
//
function spawnPlatform()
{
    //0
    platform.push({
        x: 80,
        y: 300,
        w: 120,
        h: 15
    });

    //1
    platform.push({
        x: canvas.width / 2 - 60,
        y: 300,
        w: 120,
        h: 15
    });

    //2
    platform.push({
        x: 700,
        y: 300,
        w: 120,
        h: 15
    });

    //3
    platform.push({
        x: canvas.width / 3 - 60,
        y: 210,
        w: 120,
        h: 15
    });

    //4
    platform.push({
        x: canvas.width / 3 * 2 - 60,
        y: 210,
        w: 120,
        h: 15
    });

    //5
    platform.push({
        x: 80,
        y: 110,
        w: 120,
        h: 15
    });

    //6
    platform.push({
        x: 700,
        y: 110,
        w: 120,
        h: 15
    });

}

function spawnJewels()
{
    //determine location
    const uniqueNumbers = new Set();

    while (uniqueNumbers.size < 5) {
        const r = Math.floor(Math.random() * 10);
        uniqueNumbers.add(r);
    }

    // Convert Set back to an Array
    const result = Array.from(uniqueNumbers);

    /*
        Possible Jewel Locations (10)
        0 - (x = 120, y = 250)
        1 - (x = canvas.width / 2 - 20, y = 250)
        2 - (x = 740, y = 250)
        3 - (x = canvas.width / 3 - 20, y = 160)
        4 - (x = canvas.width / 3 * 2 - 20, y = 160)
        5 - (x = 120, y = 60)
        6 - (x = 740, y = 60)
        7 - (x = canvas.width / 3 * 2 - 20, y = 350)
        8 - (x = 270, y = 350)
        9 - (x = canvas.width / 2 - 20, y = 50)

        0, 1, 2 --> Row 1
        3, 4 --> Row 2
        5, 6 --> Row 3
        7, 8 --> Ground
        9 --> In the Air
    
    */

    //determine jewel color that is spawned (random) 
    const jewelResult = Array(9);
    let randJewel;

    for(let i=0; i<jewelResult.length; i++) {
        randJewel = Math.floor(Math.random() * 5);
        console.log(randJewel)
        uniqueNumbers.add(jewelResult);
    }

    /*
        Jewel Color
        0 - Diamond
        1 - Gold 
        2 - Green
        3 - Purple
        4 - Red
    */

    // HELLO HARRISON just to test the collisions and the score count, 
    // I am spawning every gem at once. 
    // Or not I do not have a lot of time

    //place jewel at location of each chosen location in result array
    //only place next jewel once one before is picked up
    for(let i=0; i<jewelResult.length; i++)
    {
        let jewelIMG;
        jewelIMG = setColor(jewelResult[i]);

        jewel.push({
            x: 120,
            y: 250,
            w: 40,
            h: 40
        });

        jewel.push({
            x: canvas.width / 2 - 20,
            y: 50,
            w: 40,
            h: 40
        });

    }

    //WHEN PLACING JEWELS INTO THE WORLD USE FORMAT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    /*
        jewel.push(
            x: _______,
            y: _______,
            w: 40,
            h: 40
        );
    */

    jewel.push({
        x: 120,
        y: 250,
        w: 40,
        h: 40
    });   


}

function setColor(num) {
    switch(num)
    {
        case 0:
            //Diamond Selected (0)
            return IMG_diamond;
        break;

        case 1:
            //Gold Selected (1) 
            return IMG_gold;
        break;

        case 2: 
            //Green Selected (2) 
            return IMG_green;
        break;

        case 3:
            //Purple Selected (3) 
            return IMG_purple;
        break;

        default:
            //Red Selected (4)
            return IMG_red;

    }

}



//
//-----------------------------------UPDATE PLAYING-----------------------------------
//

function updatePlaying() { 
    // Physics 
    //y direction
    player1.vy += GRAVITY; 
    player1.y += player1.vy; 

    //x direction
    // player1.x += player1.vx;
    // player1.vx *= 0.85;          //friction

    if (aPressed && player1.x > 0) {
        player1.x -= 6;
    }
    if (dPressed) {
        player1.x += 6;
    }

    
    //make sure plater doesn't go through floor
    if (player1.y + player1.h >= GROUND_Y) { 
        player1.y = GROUND_Y - player1.h; 
        player1.vy = 0; 
        player1.onGround = true; 
    } 

    //make sure they can't jump off top of screen
    if(player1.y < 0)
    {
        player1.y = 0;
        player1.vy = 0;
    }

    //make sure they can't run off left side of screen
    if(player1.x < -55)
    {
        player1.x = -55;
        player1.vy = 0;
    }

    //make sure they can't run off the right side of screen
    if(player1.x > 860)
    {
        player1.x = 860;
        player1.vy = 0;
    }

    //check collision with player and platforms
    for(let i = 0; i < platform.length; i++)
    {
        if(aabb(player1, platform[i]) && player1.vy > 0) 
        {
            player1.y = platform[i].y - player1.h;
            player1.vy = 0; 
            player1.onGround = true;
        }
    }

    // MULTIPLAYER MOVEMENT / COLLISIONS
    if(multiplayer) {
        // Physics 
        //y direction
        player2.vy += GRAVITY; 
        player2.y += player2.vy; 

        //x direction
        if (jPressed && player2.x > 0) {
            player2.x -= 6;
        }
        if (lPressed) {
            player2.x += 6;
        }

        
        //make sure plater doesn't go through floor
        if (player2.y + player2.h >= GROUND_Y) { 
            player2.y = GROUND_Y - player2.h; 
            player2.vy = 0; 
            player2.onGround = true; 
        } 

        //make sure they can't jump off top of screen
        if(player2.y < 0)
        {
            player2.y = 0;
            player2.vy = 0;
        }

        //make sure they can't run off left side of screen
        if(player2.x < -55)
        {
            player2.x = -55;
            player2.vy = 0;
        }

        //make sure they can't run off the right side of screen
        if(player2.x > 860)
        {
            player2.x = 860;
            player2.vy = 0;
        }

        //check collision with player and platforms
        for(let i = 0; i < platform.length; i++)
        {
            if(aabb(player2, platform[i]) && player2.vy > 0) 
            {
                player2.y = platform[i].y - player2.h;
                player2.vy = 0; 
                player2.onGround = true;
            }
        }
    }

    //check collisions with jewels
    //check collision with player and platforms
    for(let i = 0; i < jewel.length; i++){
        //if(aabb(player1, jewel[i]) || aabb(player2, jewel[i]))
        if(aabb(player1, jewel[i]))
        {
            jewel.splice(i, 1);
            player1_score++;
        }
    }

}

function updateTimer() {
    // Calculate elapsed time in seconds
    let elapsedTimeInSeconds = Math.floor((Date.now() - startTime) / 10);

    // Format the time as minutes:seconds
    let minutes = Math.floor((elapsedTimeInSeconds / 100) / 60);
    let seconds = Math.floor(elapsedTimeInSeconds / 100) % 60;
    let hund = elapsedTimeInSeconds % 100;

    // Add leading zeros if needed for better display (e.g., 05:02)
    let formattedTime = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0') + '.' + hund.toString().padStart(2, '0');
    
    return formattedTime;
}

//
//-----------------------------------IMAGES-----------------------------------
//
//set background
const IMG_title = new Image();
const IMG_level = new Image()
IMG_title.src = "./assets/images/pyramid_background.jpg";
IMG_level.src = "./assets/images/level_background.png";

//set jewels
const IMG_diamond = new Image();
const IMG_gold = new Image();
const IMG_green = new Image();
const IMG_purple = new Image();
const IMG_red = new Image();
IMG_diamond.src = "./assets/images/jewels/diamond-jewel.png";
IMG_gold.src = "./assets/images/jewels/gold-jewel.png";
IMG_green.src = "./assets/images/jewels/green-jewel.png";
IMG_purple.src = "./assets/images/jewels/purple-jewel.png";
IMG_red.src = "./assets/images/jewels/red-jewel.png";

//set WASD & IJKL
const IMG_wasd = new Image();
const IMG_ijkl = new Image();
IMG_wasd.src = "./assets/images/key_pics/WASD_Keys.png";
IMG_ijkl.src = "./assets/images/key_pics/IJKL_Keys.png";

//set player characters
const IMG_player1 = new Image();
const IMG_player2 = new Image();
IMG_player1.src = "./assets/images/player1.png";
IMG_player2.src = "./assets/images/player2.png";

//set platforms
const IMG_platform = new Image();
IMG_platform.src = "./assets/images/platform.png";

//
//-----------------------------------DRAW FUNCTIONS-----------------------------------
//

function drawGround() { 
    ctx.fillStyle = '#2f2f2f'; 
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y); 
}

function drawTransitionOverlay() { 
    if (fadeAlpha <= 0) return; 
    ctx.save(); 
    ctx.globalAlpha = fadeAlpha; 
    ctx.fillStyle = 'black'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
    ctx.restore(); 
} 

function drawMenu() { 
    ctx.drawImage(IMG_title, 0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgb(255, 255, 255)'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'bold 70px Papyrus'; 
    ctx.fillText('Pharaoh\'s Fortune', canvas.width / 2, 140); 
    ctx.fillStyle = 'rgb(0, 0, 0)'; 
    ctx.fillText('Pharaoh\'s Fortune', canvas.width / 2+3, 137); 
    
    ctx.font = 'bold 20px Papyrus'; 
    ctx.fillText('Press SPACE to Start', canvas.width / 2, 185); 

    ctx.fillStyle = '#000000'; 
    ctx.textAlign = 'left'; 
    ctx.font = 'bold 15px Papyrus'; 
    // ctx.fillText('Created by', 5, canvas.height - 45);
    // ctx.fillText('Riley Tate', 5, canvas.height - 25);
    // ctx.fillText('Harrison Niswander', 5, canvas.height - 5);

    ctx.fillText('Created by', 5, 20);
    ctx.fillText('Riley Tate', 5, 40);
    ctx.fillText('Harrison Niswander', 5, 60);

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

    ctx.drawImage(IMG_player1, 280, 210, 40, 70);

    ctx.textAlign = 'right'; 
    ctx.font = 'bold 25px Papyrus'; 
    ctx.fillText('Multiplayer', canvas.width / 4 * 3, 165); 

    ctx.font = 'bold 20px Papyrus'; 
    ctx.fillText('Press 2', canvas.width / 3 * 2 + 45, 195); 

    ctx.drawImage(IMG_player1, 570, 210, 40, 70);
    ctx.drawImage(IMG_player2, 620, 210, 40, 70);
    
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
        ctx.drawImage(IMG_diamond, 250, 150, 40, 40);
        ctx.drawImage(IMG_gold, 350, 150, 40, 40);
        ctx.drawImage(IMG_green, canvas.width / 2, 150, 40, 40);
        ctx.drawImage(IMG_purple, 550, 150, 40, 40);
        ctx.drawImage(IMG_red, 650, 150, 40, 40);

        //WASD
        ctx.font = 'bold 25px Papyrus'; 
        ctx.fillText('Controls', canvas.width / 2, 260);

        ctx.drawImage(IMG_wasd, 215, 210, 260, 260);

        ctx.font = 'bold 20px Papyrus'; 
        ctx.fillText('W   -->  Jump', canvas.width / 3 * 2 - 50, 300); 
        ctx.fillText('A   -->  Left', canvas.width / 3 * 2 - 50, 330); 
        ctx.fillText('S   -->  Drop', canvas.width / 3 * 2 - 50, 360); 
        ctx.fillText('D   -->  Right', canvas.width / 3 * 2 - 50, 390); 

        //players
        ctx.drawImage(IMG_player1, canvas.width - 60, 10, 40, 70);
        
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
        ctx.drawImage(IMG_diamond, 250, 150, 40, 40);
        ctx.drawImage(IMG_gold, 350, 150, 40, 40);
        ctx.drawImage(IMG_green, canvas.width / 2, 150, 40, 40);
        ctx.drawImage(IMG_purple, 550, 150, 40, 40);
        ctx.drawImage(IMG_red, 650, 150, 40, 40);

        //WASD
        ctx.font = 'bold 25px Papyrus'; 
        ctx.fillText('Controls', canvas.width / 2, 260);

        ctx.drawImage(IMG_wasd, 70, 210, 260, 260);

        ctx.font = 'bold 20px Papyrus'; 
        ctx.fillText('W   -->  Jump', canvas.width / 2 - 70, 300); 
        ctx.fillText('A   -->  Left', canvas.width / 2 - 70, 330); 
        ctx.fillText('S   -->  Drop', canvas.width / 2 - 70, 360); 
        ctx.fillText('D   -->  Right', canvas.width / 2 - 70, 390); 

        //IJKL
        ctx.drawImage(IMG_ijkl, 450, 210, 260, 260);

        ctx.fillText('I   -->  Jump', canvas.width / 2 + 310, 300); 
        ctx.fillText('J   -->  Left', canvas.width / 2 + 310, 330); 
        ctx.fillText('K   -->  Drop', canvas.width / 2 + 310, 360); 
        ctx.fillText('L   -->  Right', canvas.width / 2 + 310, 390); 

        //players
        ctx.drawImage(IMG_player1, canvas.width - 110, 10, 40, 70);
        ctx.drawImage(IMG_player2, canvas.width - 60, 10, 40, 70);
        
        ctx.fillStyle = '#ffffff'; 
        ctx.textAlign = 'right'; 
        ctx.font = 'bold 30px Papyrus'; 
        ctx.fillText('Press Space to Begin!', canvas.width - 5, canvas.height - 15); 
    }
}

function drawCharacter(character, image) {
    const drawW = 40;
    const drawH = 70;

    if (character.facing === 'left') {
        ctx.save();
        ctx.translate(character.x + drawW, character.y);
        ctx.scale(-1, 1);
        ctx.drawImage(image, 0, 0, drawW, drawH);
        ctx.restore();
    } else {
        ctx.drawImage(image, character.x, character.y, drawW, drawH);
    }
}

let currTime;
function drawPlaying() { 
    //level background
    ctx.drawImage(IMG_level, 0, 0, canvas.width, canvas.height);

    //draw ground
    drawGround();

    //draw platforms (before character so they appear behind)
    for(let i = 0; i < platform.length; i++)
    {
        // ctx.drawImage(IMG_platform, platform[i].x, platform[i].y, platform[i].w, platform[i].h);
        ctx.fillStyle = '#000000'; 
        ctx.fillRect(platform[i].x, platform[i].y, platform[i].w, platform[i].h); 
    }

    // Draw the player
    drawCharacter(player1, IMG_player1);

    // Draw the player's score
    ctx.fillStyle = '#ffffff'; 
    ctx.textAlign = 'left'; 
    ctx.font = 'bold 30px Papyrus';
    ctx.fillText('Player 1 Score: ' + player1_score, 5, canvas.height - 15); 

    if(multiplayer) {
        drawCharacter(player2, IMG_player2);

        // Draw player 2's score
        ctx.textAlign = 'right'; 
        ctx.fillText('Player 2 Score: ' + player2_score, canvas.width - 5, canvas.height - 15); 
    }
    else {
        // Draw the time if a single player game
        currTime = updateTimer();
        ctx.textAlign = 'center'; 
        ctx.fillText(currTime, canvas.width / 2, canvas.height - 15); 
    }
    
    for (const j of jewel) { 
        ctx.drawImage(IMG_green, j.x, j.y, j.h, j.w);
    }
    // ctx.drawImage(IMG_diamond, 120, 250, 40, 40);
    // ctx.drawImage(IMG_gold, canvas.width / 2 - 20, 250, 40, 40);
    // ctx.drawImage(IMG_green, 740, 250, 40, 40);
    // ctx.drawImage(IMG_purple, canvas.width / 3 - 20, 160, 40, 40);
    // ctx.drawImage(IMG_red, canvas.width / 3 * 2 - 20, 160, 40, 40);
    
} 

function drawGameOver() { 
    // drawPlaying(); 
    ctx.drawImage(IMG_level, 0, 0, canvas.width, canvas.height);
    
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
    updateTransition();

    switch (currentState) { 
        case STATES.MENU:
            level_music.pause();
            title_music.play().catch(() => {}); 
            drawMenu();
            drawTransitionOverlay();    
        break; 

        case STATES.NUM_PLAYER: 
            drawNumPlayer(); 
            drawTransitionOverlay(); 
        break; 

        case STATES.INSTRUCTIONS: 
            drawInstructions(); 
            drawTransitionOverlay(); 
        break; 

        case STATES.PLAYING: 
            title_music.pause();
            level_music.play().catch(() => {}); 
            updatePlaying(); 
            drawPlaying(); 
            drawTransitionOverlay(); 
        break; 

        case STATES.GAMEOVER: 

            drawGameOver(); 
        break; 
    } 
    
    requestAnimationFrame(gameLoop); 
} 

gameLoop();