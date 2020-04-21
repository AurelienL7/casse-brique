var canvas = document.getElementById("myCanvas");
//stocke le contexte de rendu 2D — l'outil réel que nous pouvons utiliser pour peindre sur Canvas.
var ctx = canvas.getContext("2d"); 

//La méthode CanvasRenderingContext2D.beginPath() de l'API Canvas 2D permet de commencer un nouveau chemin en vidant
//la liste des sous-chemins. Appelez cette méthode quand vous voulez créer un nouveau chemin.
ctx.beginPath();

// Définit la position de départ de la balle
var x = canvas.width/2; // 480px/2
var y = canvas.height-30; // 320px - 30

// Variables permettant de faire bouger la balle
var dx = 2;
var dy = -2;

// Propriétés de la balle
var ballRadius = 10;
var ballColor = "#0095DD";

// Propriétés du paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2; // 480 - 75 / 2
var paddleSpeed = 3; 

// Booleans pour savoir si une touche est pressée ou non
var rightPressed = false;
var leftPressed = false;


// BRIQUES
var brickRowCount = 3;
var brickColumnCount = 5;
var bricksCount = brickRowCount * brickColumnCount;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for(var c=0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Score
var score = 0;

// VIES 
var lives = 3;

/**
 * FONCTIONS
 */


function drawBall() {
    // le code pour dessiner la balle
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    // le code pour dessiner le paddle
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(var c=0; c < brickColumnCount; c++) {
        for(var r=0; r < brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    bricksCount--;
                }
            }
        }
    }
}
  
function draw() {
    
    // ctx.clearRect(x, y, largeur, hauteur);
    // x = La coordonnée sur l'axe des x du point de départ du rectangle
    // largeur = largeur du canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); // On efface les précédents dessins
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();

    /**
     * Nous devons, à chaque rafraichissement du canvas, regarder si la balle touche le bord du haut. 
     * Si c'est le cas, alors nous devons inverser la direction de la balle pour créer un effet de limite de zone de jeu.
     * Si la position en y de la balle est inférieur à 0, on change la direction du mouvement sur l'axe y juste en inversant le signe du déplacement de la balle! 
     * Par exemple si celle-ci bouge vers le haut (elle a donc une vitesse de -2 car le point (0,0) est en haut à gauche) 
     * et qu'elle rencontre le mur du haut, alors sa vitesse passera à 2 et se mettre à redescendre!
     */

    // x + dx > canvas.width-ballRadius = Mur droit
    // x + dx < ballRadius = Mur gauche
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
  
    // y + dy < ballRadius = Mur du haut
    // y + dy > canvas.height-ballRadius = Mur du bas
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height-ballRadius) {
        // Si la position de ma balle est comprise entre les bords droits et gauche du paddle, faire rebomdir la balle
        if (x > paddleX && x < paddleX + paddleWidth){            
            if (dy < 6){
                dy++;
            }
            dy = -dy;
        }else{
            dy = 0;
            dx = 0;
            // La balle n'a pas touché le paddle, j'enleve 1 de vie
            lives--;
            // Si je n'ai plus de vies, gameover
            if(lives === 0) {
                alert("GAME OVER");
                document.location.reload();
                clearInterval(interval);
            }
            // S'il me reste de la vie, je réinitialise la position de la balle et du paddle
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }


    if (bricksCount === 0){
        alert("BRAVOOOO !!!!");
        document.location.reload();
        clearInterval(interval);
    }

    // On modifie la valeur de position de la balle
    x += dx;
    y += dy;


    // Permet d'empecher le paddle de sortir de l'écran et de modifier la position du paddle
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += paddleSpeed;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
    
}


// Ecoute des touches gauche et droite du clavier
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Le parametre e permet de sauvegarder le keycode de la touche pressée
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

var interval = setInterval(draw, 10);

