// Game elements and their strengths/weaknesses
const elements = {
    fire: { emoji: '🔥', strongAgainst: 'earth', weakAgainst: 'water' },
    water: { emoji: '💧', strongAgainst: 'fire', weakAgainst: 'lightning' },
    earth: { emoji: '🌍', strongAgainst: 'air', weakAgainst: 'fire' },
    air: { emoji: '🌪️', strongAgainst: 'lightning', weakAgainst: 'earth' },
    lightning: { emoji: '⚡', strongAgainst: 'water', weakAgainst: 'air' }
};

// Game state
const gameState = {
    player: {
        element: 'fire',
        health: 100,
        maxHealth: 100,
        specialAttackCharges: 3
    },
    enemy: {
        element: 'water',
        health: 100,
        maxHealth: 100
    },
    gameOver: false
};

// DOM elements
const playerElement = document.getElementById('player');
const enemyElement = document.getElementById('enemy');
const playerHealth = document.getElementById('player-health');
const enemyHealth = document.getElementById('enemy-health');
const messageLog = document.getElementById('message-log');
const attackBtn = document.getElementById('attack-btn');
const specialBtn = document.getElementById('special-btn');
const healBtn = document.getElementById('heal-btn');
const newGameBtn = document.getElementById('new-game-btn');
const elementBtns = document.querySelectorAll('.element-btn');

// Initialize the game
function initGame() {
    updateHealthBars();
    updateElementDisplays();
    addMessage("Game started! Choose your element and begin battling!");
    
    // Set up event listeners
    attackBtn.addEventListener('click', playerAttack);
    specialBtn.addEventListener('click', playerSpecialAttack);
    healBtn.addEventListener('click', playerHeal);
    newGameBtn.addEventListener('click', resetGame);
    
    elementBtns.forEach(btn => {
        btn.addEventListener('click', () => selectElement(btn.dataset.element));
    });
}

// Update health bars
function updateHealthBars() {
    playerHealth.style.width = `${(gameState.player.health / gameState.player.maxHealth) * 100}%`;
    enemyHealth.style.width = `${(gameState.enemy.health / gameState.enemy.maxHealth) * 100}%`;
    
    // Change color based on health
    if (gameState.player.health < 30) {
        playerHealth.style.backgroundColor = '#f44336';
    } else if (gameState.player.health < 60) {
        playerHealth.style.backgroundColor = '#ff9800';
    } else {
        playerHealth.style.backgroundColor = '#4CAF50';
    }
    
    if (gameState.enemy.health < 30) {
        enemyHealth.style.backgroundColor = '#f44336';
    } else if (gameState.enemy.health < 60) {
        enemyHealth.style.backgroundColor = '#ff9800';
    } else {
        enemyHealth.style.backgroundColor = '#4CAF50';
    }
}

// Update element displays
function updateElementDisplays() {
    document.querySelector('#player .element-emoji').textContent = elements[gameState.player.element].emoji;
    document.querySelector('#enemy .element-emoji').textContent = elements[gameState.enemy.element].emoji;
}

// Add message to log
function addMessage(message, className = '') {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    if (className) {
        messageElement.classList.add(className);
    }
    messageLog.appendChild(messageElement);
    messageLog.scrollTop = messageLog.scrollHeight;
}

// Player attack
function playerAttack() {
    if (gameState.gameOver) return;
    
    const damage = calculateDamage(gameState.player.element, gameState.enemy.element, false);
    gameState.enemy.health -=