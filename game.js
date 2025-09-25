// Game State Management
class GameState {
    constructor() {
        this.currentLevel = 1;
        this.currentBossIndex = 0;
        this.gameWon = false;
        this.gameLost = false;
        
        this.bosses = [
            { 
                name: 'Copilot', 
                office: 'Microsoft', 
                hp: 100, 
                maxHp: 100, 
                theme: 'copilot', 
                description: 'Microsoft\'s coding assistant',
                attacks: ['Code Suggestion', 'IntelliSense Blast', 'TypeScript Strike'],
                specialAbilities: ['Auto-complete Shield', 'Variable Mangle'],
                personality: 'Helpful but sometimes buggy'
            },
            { 
                name: 'Windsurf', 
                office: 'Cognition', 
                hp: 100, 
                maxHp: 100, 
                theme: 'windsurf', 
                description: 'Cognition\'s AI developer',
                attacks: ['Neural Network', 'Deep Learning Dive', 'Code Generation'],
                specialAbilities: ['Pattern Recognition', 'Algorithm Boost'],
                personality: 'Thoughtful and methodical'
            },
            { 
                name: 'Codex', 
                office: 'OpenAI', 
                hp: 100, 
                maxHp: 100, 
                theme: 'codex', 
                description: 'OpenAI\'s coding AI',
                attacks: ['GPT Punch', 'Token Strike', 'API Callout'],
                specialAbilities: ['Model Scaling', 'Context Window'],
                personality: 'Creative and adaptable'
            },
            { 
                name: 'Claude Code', 
                office: 'Anthropic', 
                hp: 100, 
                maxHp: 100, 
                theme: 'claude', 
                description: 'Anthropic\'s coding assistant',
                attacks: ['Ethical Strike', 'Reasoning Blow', 'Alignment Burst'],
                specialAbilities: ['Safety Filter', 'Constitutional AI'],
                personality: 'Wise and principled'
            }
        ];
        
        this.player = {
            name: 'Cursor',
            hp: 100,
            maxHp: 100,
            attacks: [
                {
                    name: 'Tab Tab Tab',
                    power: 15,
                    accuracy: 95,
                    description: 'Rapid key-stroke attacks'
                },
                {
                    name: 'Cmd Knockout',
                    power: 30,
                    accuracy: 80,
                    description: 'Terminal command punch'
                },
                {
                    name: 'BugBattler',
                    power: 25,
                    accuracy: 85,
                    description: 'Code debugger swarm'
                },
                {
                    name: 'Agentic Assault',
                    power: 35,
                    accuracy: 70,
                    description: 'AI agent martini strike'
                }
            ]
        };
    }
    
    getCurrentBoss() {
        return this.bosses[this.currentBossIndex];
    }
    
    isGameComplete() {
        return this.currentBossIndex >= this.bosses.length;
    }
}

// Battle System
class BattleSystem {
    constructor(gameState, gameUI) {
        this.gameState = gameState;
        this.gameUI = gameUI;
        this.isPlayerTurn = true;
        this.battleActive = true;
    }
    
    playerAttack(attackIndex) {
        if (!this.isPlayerTurn || !this.battleActive) return;
        
        const attack = this.gameState.player.attacks[attackIndex];
        const boss = this.gameState.getCurrentBoss();
        
        // Check if attack hits
        const hitChance = Math.random() * 100;
        if (hitChance > attack.accuracy) {
            this.addMessage(`${attack.name} missed!`, 'system-text');
            this.endPlayerTurn();
            return;
        }
        
        // Check for critical hit (15% chance) first
        const isCritical = Math.random() < 0.15;
        
        // Calculate damage with some randomness
        let damage = Math.floor(attack.power * (0.8 + Math.random() * 0.4));
        
        if (isCritical) {
            damage = Math.floor(damage * 1.5);
        }
        
        boss.hp = Math.max(0, boss.hp - damage);
        
        const damageMessage = isCritical ? 
            `Cursor used ${attack.name}! Dealt ${damage} CRITICAL damage!` : 
            `Cursor used ${attack.name}! Dealt ${damage} damage!`;
        
        this.addMessage(damageMessage, 'cursor-text');
        this.updateBossHealth(); // Update health immediately
        
        // Check if boss is defeated immediately
        if (boss.hp <= 0) {
            this.addMessage(`*** ${boss.name} FALLS! ***`, 'cursor-text');
            this.addMessage(`Cursor defeats ${boss.name}! Victory!`, 'system-text');
            this.playAttackAnimation(attackIndex, isCritical);
            // Wait for animation then defeat boss
            setTimeout(() => {
                this.bossDefeated();
            }, 1000);
        } else {
            this.playAttackAnimation(attackIndex, isCritical);
            // Wait for animation to complete before ending turn
            setTimeout(() => {
                this.endPlayerTurn();
            }, 1000);
        }
    }
    
    bossAttack() {
        if (this.isPlayerTurn || !this.battleActive) return;
        
        const boss = this.gameState.getCurrentBoss();
        if (boss.hp <= 0) return;
        
        // Each level gets progressively stronger but not too overwhelming
        const baseDamage = 6 + (this.gameState.currentLevel * 2);
        let damage = Math.floor(baseDamage * (0.9 + Math.random() * 0.2));
        
        // Choose from boss-specific attacks
        const attackName = boss.attacks[Math.floor(Math.random() * boss.attacks.length)];
        
        // Special effects based on boss type and attack
        let specialEffect = '';
        if (boss.name === 'Copilot' && Math.random() < 0.3) {
            damage = Math.floor(damage * 0.8); // Sometimes buggy
            specialEffect = ' (Performance issues!)';
        } else if (boss.name === 'Codex' && Math.random() < 0.25) {
            damage = Math.floor(damage * 1.3); // Sometimes very creative
            specialEffect = ' (Innovative approach!)';
        } else if (boss.name === 'Claude Code' && this.gameState.player.hp < 50) {
            damage = Math.floor(damage * 0.7); // Ethical AI goes easy when enemy is low
            specialEffect = ' (Shows mercy!)';
        } else if (boss.name === 'Windsurf' && Math.random() < 0.2) {
            damage = Math.floor(damage * 1.2); // Deep learning adaptation
            specialEffect = ' (Learning from battle!)';
        }
        
        this.gameState.player.hp = Math.max(0, this.gameState.player.hp - damage);
        
        this.addMessage(`${boss.name} used ${attackName}! Dealt ${damage} damage to Cursor!${specialEffect}`, 'boss-text');
        this.playBossAttackAnimation();
        
        // Wait for animation to complete before checking player defeat
        setTimeout(() => {
            this.updatePlayerHealth();
            
            // Check if player is defeated
            if (this.gameState.player.hp <= 0) {
                this.addMessage('Cursor has been defeated!', 'boss-text');
                this.playerDefeated();
            } else {
                this.startPlayerTurn();
            }
        }, 1000); // Wait for boss attack animation to complete
    }
    
    playAttackAnimation(attackIndex, isCritical = false) {
        const player = document.getElementById('player');
        const boss = document.getElementById('boss');
        const gameContainer = document.querySelector('.game-container');
        const attack = this.gameState.player.attacks[attackIndex];
        
        // Button flash
        const buttons = document.querySelectorAll('.attack-btn');
        if (buttons[attackIndex]) {
            buttons[attackIndex].classList.add('attacking');
            setTimeout(() => buttons[attackIndex].classList.remove('attacking'), 200);
        }
        
        // Character animations
        player.classList.add('attacking');
        boss.classList.add('taking-damage');
        
        // Special visual effects based on attack
        const attackClasses = ['tab-tab-tab', 'cmd-knockout', 'bug-battler', 'agentic-assault'];
        const attackClass = attackClasses[attackIndex];
        
        // Add attack visual effects
        player.classList.add(`attack-effort-${attackClass}`);
        
        // Screen shake for powerful attacks
        if (attack.power > 25) {
            gameContainer.classList.add('screen-shake');
        }
        
        // If this is a critical hit, add critical effects
        if (isCritical) {
            boss.classList.add('critical-hit');
        }
        
        setTimeout(() => {
            player.classList.remove('attacking');
            boss.classList.remove('taking-damage');
            player.classList.remove(`attack-effort-${attackClass}`);
            boss.classList.remove('critical-hit');
            gameContainer.classList.remove('screen-shake');
        }, 1000);
    }
    
    playBossAttackAnimation() {
        const boss = document.getElementById('boss');
        const player = document.getElementById('player');
        
        boss.classList.add('attacking');
        player.classList.add('taking-damage');
        
        setTimeout(() => {
            boss.classList.remove('attacking');
            player.classList.remove('taking-damage');
        }, 300);
    }
    
    startPlayerTurn() {
        this.isPlayerTurn = true;
        document.getElementById('battle-controls').style.opacity = '1';
    }
    
    endPlayerTurn() {
        this.isPlayerTurn = false;
        document.getElementById('battle-controls').style.opacity = '0.5';
        
        // Delayed boss attack
        setTimeout(() => {
            this.bossAttack();
        }, 2000);
    }
    
    bossDefeated() {
        this.battleActive = false;
        document.getElementById('battle-controls').style.display = 'none';
        
        setTimeout(() => {
            // Move to next level and check if we've completed all levels
            this.gameState.currentBossIndex++;
            this.gameState.currentLevel++;
            
            // Check if we've now completed all bosses
            if (this.gameState.currentBossIndex >= this.gameState.bosses.length) {
                // All bosses defeated - show victory screen
                this.gameUI.showVictoryScreen();
            } else {
                // Still more bosses to fight - directly advance to next level
                this.addMessage(`*** VICTORY! Proceeding to next level... ***`, 'system-text');
                setTimeout(() => {
                    this.gameUI.nextLevel();
                }, 1000);
            }
        }, 1000);
    }
    
    playerDefeated() {
        this.battleActive = false;
        document.getElementById('battle-controls').style.display = 'none';
        
        setTimeout(() => {
            this.gameUI.showGameOverScreen();
        }, 2000);
    }
    
    addMessage(text, className = 'system-text') {
        const messagesContainer = document.getElementById('battle-messages');
        const messageLine = document.createElement('div');
        messageLine.className = 'message-line';
        
        const messageSpan = document.createElement('div');
        messageSpan.className = className;
        messageSpan.textContent = text;
        
        messageLine.appendChild(messageSpan);
        messagesContainer.appendChild(messageLine);
        
        // Auto-scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Limit message history
        const messages = messagesContainer.children;
        if (messages.length > 10) {
            messagesContainer.removeChild(messages[0]);
        }
    }
    
    updatePlayerHealth() {
        const healthFill = document.querySelector('.player-health .health-fill');
        const healthText = document.getElementById('player-health');
        const percentage = (this.gameState.player.hp / this.gameState.player.maxHp) * 100;
        
        healthFill.style.width = `${percentage}%`;
        healthText.textContent = `${this.gameState.player.hp}/${this.gameState.player.maxHp}`;
    }
    
    updateBossHealth() {
        const boss = this.gameState.getCurrentBoss();
        const healthFill = document.getElementById('boss-health-fill');
        const healthText = document.getElementById('boss-health');
        const percentage = (boss.hp / boss.maxHp) * 100;
        
        healthFill.style.width = `${percentage}%`;
        healthText.textContent = `${boss.hp}/${boss.maxHp}`;
    }
}

// UI Management
class GameUI {
    constructor(gameState, battleSystem = null) {
        this.gameState = gameState;
        this.battleSystem = battleSystem;
        this.initializeUI();
    }
    
    initializeUI() {
        this.updateHeader();
        this.updateBossDisplay();
        this.updateOfficeTheme();
        this.setupEventListeners();
        this.refreshUI();
    }
    
    updateHeader() {
        document.getElementById('current-level').textContent = this.gameState.currentLevel;
        
        if (!this.gameState.isGameComplete()) {
            const currentBoss = this.gameState.getCurrentBoss();
            document.getElementById('current-boss').textContent = currentBoss.name;
            document.getElementById('current-office').textContent = currentBoss.office;
        }
    }
    
    updateBossDisplay() {
        if (this.gameState.isGameComplete()) return;
        
        const currentBoss = this.gameState.getCurrentBoss();
        const bossNameElement = document.getElementById('boss-name');
        const bossSvgElement = document.getElementById('boss-svg');
        
        bossNameElement.textContent = currentBoss.name;
        
        // Map boss theme to SVG file
        const svgFileMap = {
            'copilot': 'copilot_character.svg',
            'windsurf': 'windsurf_character.svg',
            'codex': 'codex_character.svg',
            'claude': 'claude_character.svg'
        };
        
        // Update the SVG source
        if (bossSvgElement && svgFileMap[currentBoss.theme]) {
            bossSvgElement.src = svgFileMap[currentBoss.theme];
            bossSvgElement.alt = currentBoss.name + ' Character';
        }
        
        this.updateOfficeTheme();
    }
    
    updateOfficeTheme() {
        if (this.gameState.isGameComplete()) return;
        
        const currentBoss = this.gameState.getCurrentBoss();
        const officeBg = document.getElementById('office-background');
        
        officeBg.className = `office-background ${currentBoss.office.toLowerCase()}`;
    }
    
    setupEventListeners() {
        // Attack buttons
        const attackButtons = document.querySelectorAll('.attack-btn');
        attackButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.battleSystem.playerAttack(index);
            });
        });
        
        // Keyboard listeners for Enter key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.handleEnterKey();
            }
        });
        
        // Game over / victory screen buttons
        document.getElementById('continue-btn').addEventListener('click', () => {
            this.nextLevel();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    handleEnterKey() {
        // Check if we're on the level complete screen
        const gameOverScreen = document.getElementById('game-over-screen');
        const continueBtn = document.getElementById('continue-btn');
        
        if (gameOverScreen.style.display === 'flex' && continueBtn.style.display !== 'none') {
            this.nextLevel();
        }
        // Check if we're on the victory screen
        else if (document.getElementById('victory-screen').style.display === 'flex') {
            this.restartGame();
        }
        // Check if we're on the game over screen
        else if (gameOverScreen.style.display === 'flex' && continueBtn.style.display === 'none') {
            this.restartGame();
        }
    }
    
    nextLevel() {
        this.hideGameOverScreen();
        
        // Reset player health for next level to 100
        this.gameState.player.maxHp = 100; // Always start with 100 max HP
        this.gameState.player.hp = 100; // Always start with 100 health
        
        // Initialize next battle
        const battleSystem = new BattleSystem(this.gameState, this);
        this.battleSystem = battleSystem;
        
        this.updateHeader();
        this.updateBossDisplay();
        
        // Reset current boss health to full
        const currentBoss = this.gameState.getCurrentBoss();
        currentBoss.hp = currentBoss.maxHp;
        
        this.refreshUI();
        
        // Clear battle messages
        document.getElementById('battle-messages').innerHTML = '';
        
        // Re-setup battle messages with enhanced boss introduction
        this.battleSystem.addMessage(`>> Cursor enters the ${currentBoss.office} office!`, 'cursor-text');
        this.battleSystem.addMessage(`>> ${currentBoss.name} appears! ${currentBoss.personality}`, 'boss-text');
        this.battleSystem.addMessage(`>> Special abilities: ${currentBoss.specialAbilities.join(', ')}`, 'system-text');
        this.battleSystem.addMessage('Loading battle sequence...', 'system-text');
        
        document.getElementById('battle-controls').style.display = 'block';
        
        // Ensure player turn is active
        this.battleSystem.startPlayerTurn();
    }
    
    restartGame() {
        this.hideGameOverScreen();
        this.hideVictoryScreen();
        
        // Reset game state
        this.gameState = new GameState();
        this.battleSystem = new BattleSystem(this.gameState, this);
        
        this.updateHeader();
        this.updateBossDisplay();
        this.refreshUI();
        
        // Clear battle messages
        document.getElementById('battle-messages').innerHTML = '';
        
        // Re-setup battle messages with enhanced boss introduction
        const currentBoss = this.gameState.getCurrentBoss();
        this.battleSystem.addMessage(`>> Cursor enters the ${currentBoss.office} office!`, 'cursor-text');
        this.battleSystem.addMessage(`>> ${currentBoss.name} appears! ${currentBoss.personality}`, 'boss-text');
        this.battleSystem.addMessage(`>> Special abilities: ${currentBoss.specialAbilities.join(', ')}`, 'system-text');
        this.battleSystem.addMessage('Loading battle sequence...', 'system-text');
        
        document.getElementById('battle-controls').style.display = 'block';
        
        // Ensure player turn is active
        this.battleSystem.startPlayerTurn();
    }
    
    showLevelCompleteScreen() {
        const screen = document.getElementById('game-over-screen');
        const title = document.getElementById('game-over-title');
        const message = document.getElementById('game-over-message');
        const continueBtn = document.getElementById('continue-btn');
        
        const currentBoss = this.gameState.bosses[this.gameState.currentBossIndex - 1];
        
        title.textContent = 'LEVEL COMPLETE!';
        const nextBoss = this.gameState.isGameComplete() ? 'All bosses defeated!' : this.gameState.bosses[this.gameState.currentBossIndex];
        const nextMessage = this.gameState.isGameComplete() ? 
            'Cursor has become the ultimate code warrior!' : 
            `Next up: ${nextBoss.name} at ${nextBoss.office}`;
            
        message.innerHTML = `
            <div style="color: #ffff00;">
                ${currentBoss.name} has been defeated!
            </div>
            <div style="color: #00ff00;">
                ${nextMessage}
            </div>
        `;
        continueBtn.style.display = 'inline-block';
        
        screen.style.display = 'flex';
    }
    
    showLevelCompleteScreenWithAutoAdvance() {
        const screen = document.getElementById('game-over-screen');
        const title = document.getElementById('game-over-title');
        const message = document.getElementById('game-over-message');
        const continueBtn = document.getElementById('continue-btn');
        
        const currentBoss = this.gameState.bosses[this.gameState.currentBossIndex - 1];
        
        title.textContent = 'VICTORY!';
        const nextBoss = this.gameState.bosses[this.gameState.currentBossIndex];
        const nextMessage = `VICTORY! Proceeding to ${nextBoss.name} at ${nextBoss.office}...`;
            
        message.innerHTML = `
            <div style="color: #ffff00;">
                ${currentBoss.name} has been defeated!
            </div>
            <div style="color: #00ff00;">
                ${nextMessage}
            </div>
        `;
        continueBtn.style.display = 'none'; // Hide button since we're auto-advancing
        
        screen.style.display = 'flex';
    }
    
    showVictoryScreen() {
        const screen = document.getElementById('victory-screen');
        screen.style.display = 'flex';
    }
    
    showGameOverScreen() {
        const screen = document.getElementById('game-over-screen');
        const title = document.getElementById('game-over-title');
        const message = document.getElementById('game-over-message');
        const continueBtn = document.getElementById('continue-btn');
        
        title.textContent = 'GAME OVER';
        message.innerHTML = `
            <div style="color: #ff0000;">
                Cursor was defeated!
            </div>
            <div style="color: #ffff00;">
                But the code battle continues...
            </div>
        `;
        continueBtn.style.display = 'none';
        
        screen.style.display = 'flex';
    }
    
    hideGameOverScreen() {
        document.getElementById('game-over-screen').style.display = 'none';
    }
    
    hideVictoryScreen() {
        document.getElementById('victory-screen').style.display = 'none';
    }
    
    refreshUI() {
        if (this.battleSystem) {
            this.battleSystem.updatePlayerHealth();
            this.battleSystem.updateBossHealth();
        }
    }
}

// Game Initialization
let gameState, battleSystem, gameUI;

function initializeGame() {
    gameState = new GameState();
    
    // Create GameUI first without battleSystem, then create BattleSystem and connect them
    gameUI = new GameUI(gameState, null);
    battleSystem = new BattleSystem(gameState, gameUI);
    gameUI.battleSystem = battleSystem; // Connect the reference
    gameUI.refreshUI(); // Refresh UI now that battleSystem is connected
    
    // Initial battle message
    const currentBoss = gameState.getCurrentBoss();
    battleSystem.addMessage(`>> Welcome to Code Battle!`, 'cursor-text');
    battleSystem.addMessage(`>> Cursor enters the ${currentBoss.office} office!`, 'cursor-text');
    battleSystem.addMessage(`>> ${currentBoss.name} appears! ${currentBoss.personality}`, 'boss-text');
    battleSystem.addMessage(`>> Special abilities: ${currentBoss.specialAbilities.join(', ')}`, 'system-text');
    battleSystem.addMessage('>> Choose your attack to begin!', 'system-text');
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initializeGame);
