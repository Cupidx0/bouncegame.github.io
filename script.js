const canvas = document.getElementById("portId");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById('hu');
const lifeline = document.getElementById('life');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ncard = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    dx: 4,
    dy: 4,
    color: getRandomColor()
};

let paddle = {
    width: 100,
    height: 5,
    arc: 8,
    x: canvas.width / 2 - 65,
    y: canvas.height / 1.04,
    dx: 8,
    color: "white"
};

let count = 0;
let life = 3;
function getRandomColor() {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

function cardDrawing() {
    ctx.beginPath();
    ctx.arc(ncard.x, ncard.y, ncard.radius, 0, Math.PI * 2);
    ctx.fillStyle = ncard.color;
    ctx.fill();
    ctx.closePath();
}

function drawLog() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();
}


function sanitize(input) {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
}

function update() {
    ncard.x += ncard.dx;
    ncard.y += ncard.dy;

    if (ncard.x - ncard.radius <= 0 || ncard.x + ncard.radius >= canvas.width) {
        ncard.dx *= -1;
    }
    if (ncard.y - ncard.radius <= 0) {
        ncard.dy *= -1;
    }
    // paddle collision interaction
    if (ncard.y + ncard.radius >= paddle.y && ncard.x >= paddle.x && ncard.x <= paddle.x + paddle.width) {
        ncard.dy *= -1;
        ncard.color = getRandomColor();
        count++;
    }
    function createModal(content, buttons) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.padding = '20px';
        modal.style.backgroundColor = 'white';
        modal.style.border = '1px solid black';
        modal.style.zIndex = '1000';
        modal.innerHTML = content;
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.id = button.id;
            btn.textContent = button.text;
            btn.addEventListener('click', button.onClick);
            modal.appendChild(btn);
        });
        document.body.appendChild(modal);
        return modal;
    }
    
    if (ncard.y + ncard.radius >= canvas.height) {
        life --;
        ncard.x = canvas.width / 2;
        ncard.y = canvas.height / 2;
        ncard.color = getRandomColor();
        ncard.dy = 0;
        ncard.dx = 0;
        if(life>0){
            ncard.x = canvas.width / 2;
            ncard.y = canvas.height / 2;
            ncard.color = getRandomColor();
            ncard.dy = 4;
            ncard.dx = 4;
            paddle.x = canvas.width / 2 - paddle.width / 2;
        }else{
            const gameOverModal = createModal(
                '<p>Game over, do you want to restart?</p>',
                [
                    {
                        id: 'yesButton',
                        text: 'Yes',
                        onClick: function() {
                            document.body.removeChild(gameOverModal);
                            ncard.x = canvas.width / 2;
                            ncard.y = canvas.height / 2;
                            ncard.color = getRandomColor();
                            ncard.dy = 4;
                            ncard.dx = 4;
                            count = 0;
                            life = 3;
                            paddle.x = canvas.width / 2 - paddle.width / 2;
                        }
                    },
                    {
                        id: 'noButton',
                        text: 'No',
                        onClick: function() {
                            document.body.removeChild(gameOverModal);
                            const highScoreModal = createModal(
                                `<p>New highscore is ${count}</p>`,
                                [
                                    {
                                        id: 'closeButton',
                                        text: 'Close',
                                        onClick: function() {
                                            document.body.removeChild(highScoreModal);
                                            ncard.x = canvas.width / 2;
                                            ncard.y = canvas.height / 2;
                                            ncard.radius = 15;
                                        }
                                    }
                                ]
                            );
                        }
                    }
                ]
            );
        }
    }
    if(life <=0){
        life = 0;
    }
 }

function movePaddle() {
    if (rightPressed && paddle.x + paddle.width < canvas.width) {
        paddle.x += paddle.dx;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", function(e) {
    if (e.key == "right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
});

document.addEventListener("keyup", function(e) {
    if (e.key == "right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
});

function final() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cardDrawing();
    drawLog();
    movePaddle();
    update();
    requestAnimationFrame(final);
    lifeline.textContent = `${life}`;
    scoreDisplay.textContent = `${count}`;
}
final();