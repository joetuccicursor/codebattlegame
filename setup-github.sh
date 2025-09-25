#!/bin/bash

# GitHub Setup Script for Code Battle Game
echo "🚀 Setting up Code Battle Game for GitHub..."

# Initialize git repository (if not already done)
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git repository initialized"
else
    echo "ℹ️  Git repository already exists"
fi

# Add all files to git
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit"
else
    # Make initial commit
    git commit -m "Initial commit: Code Battle Game with SVG characters
    
- Turn-based battle game with Cursor character vs AI assistants
- Features Copilot, Windsurf, Codex, and Claude as bosses  
- SVG character animations and office battle backgrounds
- 90s arcade-style gameplay with 4 attack types
- Progressive difficulty across 4 levels"

    echo "✅ Files committed to git"
fi

# Check if we have a remote origin
if git remote get-url origin > /dev/null 2>&1; then
    echo "ℹ️  Remote origin already configured"
else
    echo "⚠️  No remote origin configured"
    echo ""
    echo "📋 Next steps to push to GitHub:"
    echo ""
    echo "1. Go to GitHub.com and create a new repository"
    echo "2. Name it 'code-battle-game' (or any name you prefer)"
    echo "3. Copy the repository URL"
    echo "4. Run these commands:"
    echo ""
    echo "   git remote add origin <YOUR_REPOSITORY_URL>"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "   (Replace <YOUR_REPOSITORY_URL> with your actual GitHub repo URL)"
fi

echo ""
echo "🎮 Your Code Battle Game is ready for GitHub!"
echo "Files included:"
echo "  - index.html (main game file)"
echo "  - styles.css (game styling)"
echo "  - game.js (game logic)"
echo "  - README.md (project documentation)"
echo "  - cursor_character.svg"
echo "  - copilot_character.svg"
echo "  - windsurf_character.svg"
echo "  - codex_character.svg"
echo "  - claude_character.svg"
echo "  - .gitignore"
