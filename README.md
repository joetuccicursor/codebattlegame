# Code Battle Game

A retro 90s-style arcade battle game featuring Cursor, the coding character, battling AI-powered bosses in their home offices.

## Overview

You play as **Cursor**, a monster shaped like a computer cursor, battling through 4 levels of AI bosses:
1. **Copilot** at Microsoft (Level 1)
2. **Windsurf** at Cognition (Level 2)  
3. **Codex** at OpenAI (Level 3)
4. **Claude Code** at Anthropic (Level 4)

Each boss has unique abilities and personalities reflecting their company's characteristics.

## How to Play

### Attacks
Choose from 4 different attack types:
- **Tab Tab Tab**: Quick key-stroke attacks (15 dmg, 95% accuracy)
- **Cmd Knockout**: Terminal command punch (30 dmg, 80% accuracy)
- **BugBattler**: Code debugger swarm (25 dmg, 85% accuracy)
- **Agentic Assault**: AI agent martini strike (35 dmg, 70% accuracy)

### Battle System
- Turn-based combat
- Critical hits have a 15% chance and deal 1.5x damage
- Each boss has unique special abilities
- Progressive difficulty with each level
- Win by reducing each boss's HP to 0

### Boss Special Abilities
- **Copilot**: Sometimes has performance issues (buggy)
- **Windsurf**: Adapts and learns from battle
- **Codex**: Can be very creative with attacks
- **Claude Code**: Shows mercy when enemy is low on health (ethical AI)

## Technical Details

- Pure HTML, CSS, and JavaScript
- Retro 90s arcade visual styling
- Responsive design
- No external dependencies
- Runs in any modern web browser

## Running the Game

### Option 1: Direct Browser
1. Open `index.html` in any modern web browser

### Option 2: Local Server
```bash
python3 -m http.server 8080
```
Then visit `http://localhost:8080`

### Option 3: GitHub Pages (Live Demo)
If this repository is available on GitHub:
1. Go to Settings > Pages in your GitHub repository
2. Select source branch (usually `main`)
3. Visit your live demo at `https://yourusername.github.io/your-repo-name`

## Deployment to GitHub

To deploy this game to GitHub:

### Method 1: Command Line
```bash
# Initialize git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Code Battle Game"

# Add remote origin (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Method 2: GitHub Desktop
1. Create new repository on GitHub
2. Clone repository locally
3. Copy all game files to repository folder
4. Commit and push through GitHub Desktop

### Requirements for GitHub Pages
- Repository must be public (for free GitHub Pages)
- Files must be in root directory or `/docs` folder
- Enable GitHub Pages in repository Settings

Enjoy the battle! Show the AI what Cursor can do! 🎮

