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
    const playerHealthPercent = Math.max(0, (gameState.player.health / gameState.player.maxHealth) * 100);
    const enemyHealthPercent = Math.max(0, (gameState.enemy.health / gameState.enemy.maxHealth) * 100);
    
    playerHealth.style.width = `${playerHealthPercent}%`;
    enemyHealth.style.width = `${enemyHealthPercent}%`;
    
    // Change color based on health
    playerHealth.style.backgroundColor = gameState.player.health < 30 ? '#f44336' : 
                                      gameState.player.health < 60 ? '#ff9800' : '#4CAF50';
    
    enemyHealth.style.backgroundColor = gameState.enemy.health < 30 ? '#f44336' : 
                                      gameState.enemy.health < 60 ? '#ff9800' : '#4CAF50';
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
    if (gameState.gameOver) {
        addMessage("Game over! Start a new game to continue.", 'ineffective');
        return;
    }
    
    const damage = calculateDamage(gameState.player.element, gameState.enemy.element, false);
    gameState.enemy.health = Math.max(0, gameState.enemy.health - damage);
    
    playerElement.classList.add('attacking');
    setTimeout(() => {
        playerElement.classList.remove('attacking');
        
        addMessage(`You attack for ${damage} damage!`, damage > 15 ? 'critical-hit' : '');
        updateHealthBars();
        
        if (gameState.enemy.health <= 0) {
            gameState.enemy.health = 0;
            addMessage("You defeated the enemy! 🎉", 'effective');
            gameState.gameOver = true;
            return;
        }
        
        setTimeout(enemyAttack, 500);
    }, 300);
}

// Player special attack
function playerSpecialAttack() {
    if (gameState.gameOver) {
        addMessage("Game over! Start a new game to continue.", 'ineffective');
        return;
    }
    
    if (gameState.player.specialAttackCharges <= 0) {
        addMessage("No special attacks left!", 'ineffective');
        return;
    }
    
    gameState.player.specialAttackCharges--;
    const damage = calculateDamage(gameState.player.element, gameState.enemy.element, true);
    gameState.enemy.health = Math.max(0, gameState.enemy.health - damage);
    
    playerElement.classList.add('attacking');
    setTimeout(() => {
        playerElement.classList.remove('attacking');
        
        addMessage(`You use a SPECIAL ATTACK for ${damage} damage! (${gameState.player.specialAttackCharges} left)`, 'critical-hit');
        updateHealthBars();
        
        if (gameState.enemy.health <= 0) {
            gameState.enemy.health = 0;
            addMessage("You defeated the enemy! 🎉", 'effective');
            gameState.gameOver = true;
            return;
        }
        
        setTimeout(enemyAttack, 500);
    }, 300);
}

// Player heal
function playerHeal() {
    if (gameState.gameOver) {
        addMessage("Game over! Start a new game to continue.", 'ineffective');
        return;
    }
    
    const healAmount = 25;
    gameState.player.health = Math.min(gameState.player.health + healAmount, gameState.player.maxHealth);
    
    addMessage(`You heal for ${healAmount} health!`, 'effective');
    updateHealthBars();
    
    setTimeout(enemyAttack, 500);
}

// Enemy attack
function enemyAttack() {
    if (gameState.gameOver) return;
    
    const damage = calculateDamage(gameState.enemy.element, gameState.player.element, false);
    gameState.player.health = Math.max(0, gameState.player.health - damage);
    
    enemyElement.classList.add('enemy-attacking');
    setTimeout(() => {
        enemyElement.classList.remove('enemy-attacking');
        
        addMessage(`Enemy attacks for ${damage} damage!`, damage > 15 ? 'critical-hit' : '');
        updateHealthBars();
        
        if (gameState.player.health <= 0) {
            gameState.player.health = 0;
            addMessage("You were defeated! 💀", 'ineffective');
            gameState.gameOver = true;
        }
    }, 300);
}

// Calculate damage with elemental strengths/weaknesses
function calculateDamage(attackerElement, defenderElement, isSpecial) {
    const baseDamage = isSpecial ? Math.floor(Math.random() * 20) + 15 : Math.floor(Math.random() * 10) + 5;
    let damage = baseDamage;
    
    if (elements[attackerElement].strongAgainst === defenderElement) {
        addMessage("It's super effective!", 'effective');
        damage = Math.floor(baseDamage * 1.5);
    } else if (elements[attackerElement].weakAgainst === defenderElement) {
        addMessage("It's not very effective...", 'ineffective');
        damage = Math.floor(baseDamage * 0.5);
    }
    
    return damage;
}

// Select player element
function selectElement(element) {
    gameState.player.element = element;
    gameState.player.specialAttackCharges = 3;
    gameState.enemy.element = getRandomElement();
    gameState.gameOver = false;
    
    updateElementDisplays();
    addMessage(`You chose ${element}! Enemy chose ${gameState.enemy.element}.`);
}

// Get random element for enemy
function getRandomElement() {
    const elementKeys = Object.keys(elements);
    const