const gameStart = document.getElementsByClassName('game-start')[0];
const gameArea = document.getElementsByClassName('game-area')[0];
const gameOver = document.getElementsByClassName('game-over')[0];
const gameScore = document.getElementsByClassName('game-score')[0];
const gamePoints = gameScore.querySelector('.points');

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

let keys = {};
let player = {
    x: 150,
    y: 100,
    width: 0,
    height: 0,
    lastTimeFiredFireBall: 0
};
let game = {
    speed: 2,
    movingMultiplier: 4,
    fireBallMultiplier: 5,
    fireInterval: 300,
    cloudSpawnInterval: 3000,
    bugSpawnInterval: 1000,
    bugMultiplier: 3,
    bugKillBonus: 2000,
    logoSpawnInterval: 4000
};
let scene = {
    score: 0,
    lastCloudSpawn: 0,
    lastBugSpawn: 0,
    isActiveGame: true,
    bugsKilledCount: 0,
    lastLogoSpawn: 0
};

gameStart.addEventListener('click', onGameStart);

function onGameStart() {
    gameStart.classList.add('hide');

    const wizard = document.createElement('div');
    wizard.classList.add('wizard');
    wizard.style.top = player.y + 'px';
    wizard.style.left = player.x + 'px';

    gameArea.appendChild(wizard);

    player.width = wizard.offsetWidth;
    player.height = wizard.offsetHeight;

    // defining the loop of the game
    window.requestAnimationFrame(gameAction);
}

function onKeyDown(event) {
    keys[event.code] = true;
}

function onKeyUp(event) {
    keys[event.code] = false;
}

function gameAction(timestamp) {
    const wizard = document.querySelector('.wizard');
    const killedBugs = document.querySelector('.killed-bugs');

    scene.score++;

    //Adding bugs
    if (timestamp - scene.lastBugSpawn > game.bugSpawnInterval + 5000 * Math.random()) {
        let bug = document.createElement('div');
        bug.classList.add('bug');
        bug.x = gameArea.offsetWidth - 60;
        bug.style.left = bug.x + 'px';
        bug.style.top = (gameArea.offsetHeight - 60) * Math.random() + 'px';
        gameArea.appendChild(bug);
        scene.lastBugSpawn = timestamp;
    }

    //Making the bugs move
    let bugs = document.querySelectorAll('.bug');
    bugs.forEach(bug => {
        bug.x -= game.speed * game.bugMultiplier;
        bug.style.left = bug.x + 'px';

        if (bug.x + bug.offsetWidth <= 0) {
            bug.parentElement.removeChild(bug);
        }
    });

    //Adding logo
    if (timestamp - scene.lastLogoSpawn > game.logoSpawnInterval + 25000 * Math.random()) {
        let logo = document.createElement('div');
        logo.classList.add('logo');
        logo.x = gameArea.offsetWidth - 197;
        logo.style.left = logo.x + 'px';
        logo.style.top = (gameArea.offsetHeight - 149) * Math.random() + 'px';

        gameArea.appendChild(logo);

        scene.lastLogoSpawn = timestamp;
    };

    //Making the logo move
    let logos = document.querySelectorAll('.logo');
    logos.forEach(logo => {
        logo.x -= game.speed;
        logo.style.left = logo.x + 'px';

        if (logo.x + logo.offsetWidth <= 0) {
            logo.parentElement.removeChild(logo);
        };
    });

    //Adding clouds
    if (timestamp - scene.lastCloudSpawn > game.cloudSpawnInterval + 20000 * Math.random()) {
        let cloud = document.createElement('div');
        cloud.classList.add('cloud');
        cloud.x = gameArea.offsetWidth - 197;
        cloud.style.left = cloud.x + 'px';
        cloud.style.top = (gameArea.offsetHeight - 101) * Math.random() + 'px';

        gameArea.appendChild(cloud);

        scene.lastCloudSpawn = timestamp;
    };

    // Making the clouds move
    let clouds = document.querySelectorAll('.cloud');
    clouds.forEach(cloud => {
        cloud.x -= game.speed;
        cloud.style.left = cloud.x + 'px';

        if (cloud.x + cloud.offsetWidth <= 0) {
            cloud.parentElement.removeChild(cloud);
        };
    });

    // Making the fireballs fly
    let fireballs = document.querySelectorAll('.fire-ball');
    fireballs.forEach(fireBall => {
        fireBall.x += game.speed * game.fireBallMultiplier;
        fireBall.style.left = fireBall.x + 'px';

        if (fireBall.x + fireBall.offsetWidth > gameArea.offsetWidth) {
            fireBall.parentElement.removeChild(fireBall);
        }
    })

    let isInAir = (player.y + player.height) <= gameArea.offsetHeight;

    if (isInAir) {
        player.y += game.speed;
    }

    if (keys.ArrowUp && player.y > 0) {
        player.y -= game.speed * game.movingMultiplier;
    }

    if (keys.ArrowDown && isInAir) {
        player.y += game.speed * game.movingMultiplier;
    }

    if (keys.ArrowLeft && player.x > 0) {
        player.x -= game.speed * game.movingMultiplier;
    }

    if (keys.ArrowRight && player.x + player.width < gameArea.offsetWidth) {
        player.x += game.speed * game.movingMultiplier;
    }

    if (keys.Space && timestamp - player.lastTimeFiredFireBall >= game.fireInterval) {
        wizard.classList.add('wizard-fire');
        addFireBall(player);
        player.lastTimeFiredFireBall = timestamp;
    }
    else {
        wizard.classList.remove('wizard-fire');
    }

    wizard.style.top = player.y + 'px';
    wizard.style.bottom = player.y + 'px';
    wizard.style.left = player.x + 'px';
    wizard.style.right = player.x + 'px';

    gamePoints.textContent = scene.score;
    killedBugs.textContent = scene.bugsKilledCount;

    //Check for collision
    bugs.forEach(bug => {
        if (isCollision(wizard, bug)) {
            gameOverAction();
        }

        try {
            fireballs.forEach(fireBall => {
                if (isCollision(fireBall, bug)) {
                    scene.score += game.bugKillBonus;
                    scene.bugsKilledCount++;
                    bug.parentElement.removeChild(bug);
                    fireBall.parentElement.removeChild(fireBall);
                    game.speed += 0.1;
                }
            });
        }
        catch {
            console.log('Collision Error: In Progress of Resolving..');
        }
    });

    if (scene.isActiveGame) {
        window.requestAnimationFrame(gameAction);
    };
}

function addFireBall(player) {
    let fireBall = document.createElement('div');
    fireBall.classList.add('fire-ball');

    fireBall.style.top = (player.y + player.height / 3 + 5) + 'px';
    fireBall.x = player.x + player.width;
    fireBall.style.left = fireBall.x + 'px';

    gameArea.appendChild(fireBall);
}

function isCollision(firstElement, secondElement) {
    let firstRect = firstElement.getBoundingClientRect();
    let secondRect = secondElement.getBoundingClientRect();

    return !(firstRect.top > secondRect.bottom ||
        firstRect.bottom < secondRect.top ||
        firstRect.right < secondRect.left ||
        firstRect.left > secondRect.right);
}

function gameOverAction() {
    scene.isActiveGame = false;
    gameOver.classList.remove('hide');
}