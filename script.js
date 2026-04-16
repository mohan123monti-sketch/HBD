// Smooth scrolling and section animations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations and interactions
    initScrollAnimations();
    initParallaxEffects();
    initTypewriterEffect();
    initGalleryInteractions();
    initSoundEffects();
    initPhotoUpload();
    initCricketGame();
    initBirthdayCardGenerator();
});

// Photo Upload and Gallery Management
function initPhotoUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const photoInput = document.getElementById('photoInput');
    const galleryGrid = document.getElementById('galleryGrid');
    const photoCarousel = document.getElementById('photoCarousel');
    const memoryTimeline = document.getElementById('memoryTimeline');
    
    // Admin controls
    const adminToggle = document.getElementById('adminToggle');
    const adminPanel = document.getElementById('adminPanel');
    const adminPassword = document.getElementById('adminPassword');
    const lockGalleryBtn = document.getElementById('lockGallery');
    const unlockGalleryBtn = document.getElementById('unlockGallery');
    const exportGalleryBtn = document.getElementById('exportGallery');
    const importGalleryBtn = document.getElementById('importGallery');
    const importFile = document.getElementById('importFile');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    let uploadedPhotos = [];
    let currentView = 'grid';
    let currentPhotoIndex = 0;
    
    // Initialize gallery from backend
    loadGalleryFromBackend();
    updateGalleryStatus();
    
    // Upload area click
    uploadArea.addEventListener('click', () => {
        photoInput.click();
    });
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    // File input change
    photoInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    // View control buttons
    document.getElementById('gridBtn').addEventListener('click', () => {
        showGridView();
    });
    
    document.getElementById('carouselBtn').addEventListener('click', () => {
        showCarouselView();
    });
    
    document.getElementById('timelineBtn').addEventListener('click', () => {
        showTimelineView();
    });
    
    // Carousel navigation
    document.getElementById('prevBtn').addEventListener('click', () => {
        navigateCarousel(-1);
    });
    
    document.getElementById('nextBtn').addEventListener('click', () => {
        navigateCarousel(1);
    });
    
    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const photo = {
                        id: Date.now() + Math.random(),
                        src: e.target.result,
                        title: `Memory ${uploadedPhotos.length + 1}`,
                        date: new Date().toLocaleDateString(),
                        timestamp: Date.now()
                    };
                    uploadedPhotos.push(photo);
                    addPhotoToGallery(photo);
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    function addPhotoToGallery(photo) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${photo.src}" alt="${photo.title}" loading="lazy">
            <div class="photo-overlay">
                <h3>${photo.title}</h3>
                <p>${photo.date}</p>
            </div>
        `;
        
        galleryItem.addEventListener('click', () => {
            showPhotoInCarousel(photo);
        });
        
        galleryGrid.appendChild(galleryItem);
        updateTimeline();
    }
    
    function showGridView() {
        currentView = 'grid';
        galleryGrid.style.display = 'grid';
        photoCarousel.style.display = 'none';
        memoryTimeline.style.display = 'none';
        
        // Update button states
        document.querySelectorAll('.gallery-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('gridBtn').classList.add('active');
    }
    
    function showCarouselView() {
        if (uploadedPhotos.length === 0) {
            showMessage('No photos uploaded yet! Upload some photos to use carousel view.');
            return;
        }
        
        currentView = 'carousel';
        galleryGrid.style.display = 'none';
        photoCarousel.style.display = 'block';
        memoryTimeline.style.display = 'none';
        
        // Update button states
        document.querySelectorAll('.gallery-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('carouselBtn').classList.add('active');
        
        // Show first photo
        if (uploadedPhotos.length > 0) {
            showPhotoInCarousel(uploadedPhotos[0]);
        }
    }
    
    function showTimelineView() {
        if (uploadedPhotos.length === 0) {
            showMessage('No photos uploaded yet! Upload some photos to use timeline view.');
            return;
        }
        
        currentView = 'timeline';
        galleryGrid.style.display = 'none';
        photoCarousel.style.display = 'none';
        memoryTimeline.style.display = 'block';
        
        // Update button states
        document.querySelectorAll('.gallery-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('timelineBtn').classList.add('active');
        
        updateTimeline();
    }
    
    function showPhotoInCarousel(photo) {
        const carouselImage = document.getElementById('carouselImage');
        const carouselTitle = document.getElementById('carouselTitle');
        const carouselDate = document.getElementById('carouselDate');
        
        carouselImage.src = photo.src;
        carouselTitle.textContent = photo.title;
        carouselDate.textContent = photo.date;
        
        currentPhotoIndex = uploadedPhotos.findIndex(p => p.id === photo.id);
    }
    
    function navigateCarousel(direction) {
        currentPhotoIndex += direction;
        
        if (currentPhotoIndex < 0) {
            currentPhotoIndex = uploadedPhotos.length - 1;
        } else if (currentPhotoIndex >= uploadedPhotos.length) {
            currentPhotoIndex = 0;
        }
        
        showPhotoInCarousel(uploadedPhotos[currentPhotoIndex]);
    }
    
    function updateTimeline() {
        const timelineItems = document.getElementById('timelineItems');
        timelineItems.innerHTML = '';
        
        // Sort photos by timestamp
        const sortedPhotos = [...uploadedPhotos].sort((a, b) => a.timestamp - b.timestamp);
        
        sortedPhotos.forEach((photo, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <div class="timeline-content">
                    <div class="timeline-date">${photo.date}</div>
                    <img src="${photo.src}" alt="${photo.title}" class="timeline-image">
                    <div class="timeline-title">${photo.title}</div>
                </div>
                <div class="timeline-dot"></div>
            `;
            
            timelineItems.appendChild(timelineItem);
        });
    }
    
    function showMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(249, 205, 5, 0.9);
            color: #000;
            padding: 15px 30px;
            border-radius: 25px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            z-index: 10000;
            animation: slideDown 0.3s ease;
        `;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
    
    // Backend integration functions
    function loadGalleryFromBackend() {
        const galleryData = window.galleryBackend.getAllImages();
        uploadedPhotos = galleryData;
        
        // Clear existing gallery items
        const existingItems = galleryGrid.querySelectorAll('.gallery-item');
        existingItems.forEach(item => item.remove());
        
        // Add loaded photos to gallery
        galleryData.forEach(photo => {
            addPhotoToGallery(photo);
        });
    }
    
    function updateGalleryStatus() {
        const status = window.galleryBackend.getGalleryStatus();
        
        if (status.locked) {
            statusIndicator.textContent = '🔴';
            statusText.textContent = 'Gallery Locked';
            uploadArea.classList.add('locked');
        } else {
            statusIndicator.textContent = '🟢';
            statusText.textContent = 'Gallery Unlocked';
            uploadArea.classList.remove('locked');
        }
    }
    
    // Admin panel toggle
    adminToggle.addEventListener('click', () => {
        adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
    });
    
    // Lock gallery
    lockGalleryBtn.addEventListener('click', () => {
        const password = adminPassword.value;
        const result = window.galleryBackend.lockGallery(password);
        
        if (result.success) {
            showMessage(result.message);
            updateGalleryStatus();
            adminPassword.value = '';
        } else {
            showMessage(result.message);
        }
    });
    
    // Unlock gallery
    unlockGalleryBtn.addEventListener('click', () => {
        const password = adminPassword.value;
        const result = window.galleryBackend.unlockGallery(password);
        
        if (result.success) {
            showMessage(result.message);
            updateGalleryStatus();
            adminPassword.value = '';
        } else {
            showMessage(result.message);
        }
    });
    
    // Export gallery
    exportGalleryBtn.addEventListener('click', () => {
        const result = window.galleryBackend.exportGallery();
        showMessage(result.message);
    });
    
    // Import gallery
    importGalleryBtn.addEventListener('click', () => {
        importFile.click();
    });
    
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = window.galleryBackend.importGallery(e.target.result);
                showMessage(result.message);
                
                if (result.success) {
                    loadGalleryFromBackend();
                }
            };
            reader.readAsText(file);
        }
    });
    
    // Modify handleFiles to use backend
    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const photoData = {
                        src: e.target.result,
                        title: `Memory ${uploadedPhotos.length + 1}`,
                        date: new Date().toLocaleDateString(),
                        uploadedBy: 'Admin'
                    };
                    
                    const result = window.galleryBackend.addImage(photoData);
                    
                    if (result.success) {
                        addPhotoToGallery(result.image);
                        showMessage(result.message);
                    } else {
                        showMessage(result.message);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Realistic Cricket Game
function initCricketGame() {
    const startBtn = document.getElementById('startGameBtn');
    const resetBtn = document.getElementById('resetGameBtn');
    const shotButtons = document.querySelectorAll('.shot-btn');
    const powerUps = document.querySelectorAll('.power-up');
    
    // Game elements
    const batsman = document.getElementById('batsman');
    const ball = document.getElementById('ball');
    const bowler = document.getElementById('bowler');
    const bowlerArm = document.getElementById('bowlerArm');
    const bails = document.getElementById('bails');
    const boundary = document.getElementById('boundary');
    const shotResult = document.getElementById('shotResult');
    const crowd = document.getElementById('crowd');
    
    let gameState = {
        isPlaying: false,
        score: 0,
        overs: 0,
        balls: 0,
        wickets: 0,
        activePowerUp: null,
        ballsRemaining: 30,
        isShotInProgress: false,
        playerStats: {
            defensive: 0,
            straight: 0,
            cover: 0,
            pull: 0,
            six: 0
        }
    };
    
    let leaderboard = [
        { name: 'Mithun Raam', score: 0 }
    ];
    
    // Game controls
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    
    // Shot buttons
    shotButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (gameState.isPlaying && !gameState.isShotInProgress) {
                const shot = btn.dataset.shot;
                playShot(shot);
            }
        });
    });
    
    // Power-ups
    powerUps.forEach(powerUp => {
        powerUp.addEventListener('click', () => {
            if (gameState.isPlaying && !gameState.activePowerUp) {
                activatePowerUp(powerUp.id);
            }
        });
    });
    
    function startGame() {
        gameState.isPlaying = true;
        gameState.ballsRemaining = 30;
        gameState.isShotInProgress = false;
        updateDisplay();
        showShotResult('Game Started! Choose your shots wisely!');
        animateCrowd(true);
        
        // Enable shot buttons
        shotButtons.forEach(btn => btn.disabled = false);
        
        // Disable start button
        startBtn.disabled = true;
        
        // Start bowler animation
        startBowlerAnimation();
    }
    
    function resetGame() {
        gameState = {
            isPlaying: false,
            score: 0,
            overs: 0,
            balls: 0,
            wickets: 0,
            activePowerUp: null,
            ballsRemaining: 30,
            isShotInProgress: false,
            playerStats: {
                defensive: 0,
                straight: 0,
                cover: 0,
                pull: 0,
                six: 0
            }
        };
        
        updateDisplay();
        showShotResult('Game Reset. Press Start to play again!');
        animateCrowd(false);
        
        // Reset UI
        shotButtons.forEach(btn => btn.disabled = true);
        startBtn.disabled = false;
        powerUps.forEach(powerUp => powerUp.classList.remove('active'));
        
        // Reset power-up counts
        document.getElementById('cskCount').textContent = '3';
        document.getElementById('vijayCount').textContent = '2';
        document.getElementById('natureCount').textContent = '2';
        
        // Reset animations
        resetBallPosition();
        bails.classList.remove('fallen');
        boundary.classList.remove('hit');
    }
    
    function startBowlerAnimation() {
        if (gameState.isPlaying && !gameState.isShotInProgress) {
            bowlBall();
            setTimeout(() => {
                if (gameState.isPlaying) {
                    startBowlerAnimation();
                }
            }, 2000);
        }
    }
    
    function bowlBall() {
        if (!gameState.isPlaying || gameState.isShotInProgress) return;
        
        const ballElement = ball.querySelector('.cricket-ball');
        const ballTrail = document.getElementById('ballTrail');
        
        // Reset ball position
        ball.style.right = '100px';
        ball.style.top = '50%';
        
        // Add bowling animation
        ball.classList.add('bowling');
        ballTrail.style.opacity = '1';
        
        // Animate ball movement
        setTimeout(() => {
            ball.style.transition = 'right 1s ease-in-out';
            ball.style.right = '20px';
        }, 100);
        
        // Ball reaches batsman
        setTimeout(() => {
            ball.classList.remove('bowling');
            ballTrail.style.opacity = '0';
            ball.style.transition = '';
            
            // Auto-play defensive shot if no player input
            if (gameState.isPlaying && !gameState.isShotInProgress) {
                setTimeout(() => {
                    autoPlayShot();
                }, 500);
            }
        }, 1100);
    }
    
    function autoPlayShot() {
        if (!gameState.isPlaying || gameState.isShotInProgress) return;
        
        // Random defensive shot for auto-play
        const defensiveShots = ['defensive', 'straight'];
        const randomShot = defensiveShots[Math.floor(Math.random() * defensiveShots.length)];
        playShot(randomShot, true);
    }
    
    function playShot(shotType, isAutoPlay = false) {
        if (!gameState.isPlaying || gameState.isShotInProgress) {
            endGame();
            return;
        }
        
        gameState.isShotInProgress = true;
        
        // Animate batting
        const gameBat = document.getElementById('gameBat');
        const ballElement = ball.querySelector('.cricket-ball');
        
        // Add batting animation
        batsman.classList.add('batting');
        gameBat.style.animation = 'batSwing 0.6s ease-out';
        
        // Calculate shot outcome
        const runs = calculateRuns(shotType);
        gameState.score += runs;
        gameState.ballsRemaining--;
        gameState.balls++;
        
        if (gameState.balls >= 6) {
            gameState.overs++;
            gameState.balls = 0;
        }
        
        gameState.playerStats[shotType]++;
        
        // Animate ball based on shot
        animateShotResult(shotType, runs);
        
        // Update display
        updateDisplay();
        
        // Show shot result
        if (!isAutoPlay) {
            showShotResultMessage(shotType, runs);
        }
        
        // Check game end
        if (gameState.ballsRemaining <= 0) {
            setTimeout(endGame, 1500);
        } else {
            // Continue bowling after shot
            setTimeout(() => {
                gameState.isShotInProgress = false;
                batsman.classList.remove('batting');
                gameBat.style.animation = '';
                resetBallPosition();
            }, 1500);
        }
        
        // Clear active power-up after use
        if (gameState.activePowerUp) {
            gameState.activePowerUp = null;
            powerUps.forEach(powerUp => powerUp.classList.remove('active'));
        }
    }
    
    function animateShotResult(shotType, runs) {
        const ballElement = ball.querySelector('.cricket-ball');
        const ballTrail = document.getElementById('ballTrail');
        
        // Different animations based on shot type
        switch(shotType) {
            case 'defensive':
                // Gentle push forward
                ballElement.style.transition = 'right 0.8s ease-out, top 0.8s ease-out';
                ballElement.style.right = '200px';
                ballElement.style.top = '45%';
                break;
                
            case 'straight':
                // Straight drive
                ballElement.style.transition = 'right 1s ease-out, top 0.5s ease-out';
                ballElement.style.right = '300px';
                ballElement.style.top = '40%';
                if (runs >= 4) {
                    boundary.classList.add('hit');
                    setTimeout(() => boundary.classList.remove('hit'), 1000);
                }
                break;
                
            case 'cover':
                // Cover drive to the side
                ballElement.style.transition = 'right 1s ease-out, top 0.8s ease-out';
                ballElement.style.right = '280px';
                ballElement.style.top = '30%';
                if (runs >= 4) {
                    boundary.classList.add('hit');
                    setTimeout(() => boundary.classList.remove('hit'), 1000);
                }
                break;
                
            case 'pull':
                // Pull shot upwards
                ballElement.style.transition = 'right 1.2s ease-out, top 1s ease-out';
                ballElement.style.right = '250px';
                ballElement.style.top = '20%';
                if (runs >= 6) {
                    boundary.classList.add('hit');
                    setTimeout(() => boundary.classList.remove('hit'), 1200);
                    animateCrowd(true, true);
                }
                break;
                
            case 'six':
                // Massive six shot
                ballElement.style.transition = 'right 1.5s ease-out, top 1.5s ease-out';
                ballElement.style.right = '400px';
                ballElement.style.top = '10%';
                boundary.classList.add('hit');
                setTimeout(() => boundary.classList.remove('hit'), 1500);
                animateCrowd(true, true);
                createConfetti();
                break;
        }
        
        // Hide trail after animation
        setTimeout(() => {
            ballTrail.style.opacity = '0';
        }, 500);
    }
    
    function calculateRuns(shotType) {
        const baseRuns = {
            defensive: 1,
            straight: 3,
            cover: 4,
            pull: 6,
            six: 6
        };
        
        let runs = baseRuns[shotType];
        
        // Apply power-up bonuses
        if (gameState.activePowerUp === 'cskPower') {
            runs = Math.floor(runs * 1.5);
        } else if (gameState.activePowerUp === 'vijayPower') {
            runs = Math.floor(runs * 2);
        } else if (gameState.activePowerUp === 'naturePower') {
            runs = Math.max(runs, 4);
        }
        
        // Add realistic randomness
        const randomFactor = Math.random();
        if (randomFactor > 0.8) {
            runs += Math.floor(Math.random() * 3); // Bonus runs
        } else if (randomFactor < 0.2 && shotType !== 'defensive') {
            runs = Math.max(0, runs - 1); // Sometimes miss-hit
        }
        
        return runs;
    }
    
    function activatePowerUp(powerUpId) {
        const powerUpElement = document.getElementById(powerUpId);
        const countElement = powerUpElement.querySelector('.power-count');
        let count = parseInt(countElement.textContent);
        
        if (count > 0) {
            gameState.activePowerUp = powerUpId;
            powerUpElement.classList.add('active');
            countElement.textContent = (count - 1).toString();
            
            showShotResult(`${powerUpElement.querySelector('.power-name').textContent} activated!`);
        }
    }
    
    function showShotResultMessage(shotType, runs) {
        const messages = {
            defensive: ['Solid defense!', 'Nice block!', 'Safe shot!'],
            straight: ['Beautiful drive!', 'Straight to boundary!', 'Classic shot!'],
            cover: ['Elegant cover drive!', 'Perfect timing!', 'Great placement!'],
            pull: ['Powerful pull shot!', 'Massive hit!', 'Excellent pull!'],
            six: ['SIX! What a shot!', 'Out of the ground!', 'Maximum!']
        };
        
        const messageList = messages[shotType];
        const randomMessage = messageList[Math.floor(Math.random() * messageList.length)];
        
        showShotResult(`${randomMessage} +${runs} runs`);
        
        // Add celebration animation for sixes
        if (runs >= 6) {
            animateCrowd(true, true);
        }
    }
    
    function animateCrowd(excitement = false, massive = false) {
        if (massive) {
            crowd.style.animation = 'crowdWave 0.5s ease-in-out infinite';
            crowd.style.opacity = '0.8';
        } else if (excitement) {
            crowd.style.animation = 'crowdWave 2s ease-in-out infinite';
            crowd.style.opacity = '0.6';
        } else {
            crowd.style.animation = 'crowdWave 3s ease-in-out infinite';
            crowd.style.opacity = '0.3';
        }
    }
    
    function resetBallPosition() {
        const ballElement = ball.querySelector('.cricket-ball');
        ballElement.style.transition = '';
        ballElement.style.right = '100px';
        ballElement.style.top = '50%';
        ball.classList.remove('bowling');
    }
    
    function updateDisplay() {
        document.getElementById('gameScore').textContent = gameState.score;
        document.getElementById('gameOvers').textContent = `${gameState.overs}.${gameState.balls}`;
        document.getElementById('gameWickets').textContent = gameState.wickets;
        
        // Update run rate
        const totalBalls = (gameState.overs * 6) + gameState.balls;
        const runRate = totalBalls > 0 ? (gameState.score / totalBalls * 6).toFixed(1) : '0.0';
        document.getElementById('runRate').textContent = runRate;
    }
    
    function endGame() {
        gameState.isPlaying = false;
        animateCrowd(false);
        
        // Update leaderboard
        const playerName = 'Mithun Raam';
        const existingPlayer = leaderboard.find(p => p.name === playerName);
        
        if (existingPlayer) {
            if (gameState.score > existingPlayer.score) {
                existingPlayer.score = gameState.score;
                showShotResult(`New High Score: ${gameState.score}! 🎉`);
            } else {
                showShotResult(`Game Over! Score: ${gameState.score}`);
            }
        } else {
            leaderboard.push({ name: playerName, score: gameState.score });
            showShotResult(`Game Over! Score: ${gameState.score}`);
        }
        
        // Sort leaderboard
        leaderboard.sort((a, b) => b.score - a.score);
        updateLeaderboard();
        
        // Disable shot buttons
        shotButtons.forEach(btn => btn.disabled = true);
        startBtn.disabled = false;
        
        // Check for birthday wishes unlock
        if (gameState.score >= 50) {
            setTimeout(() => {
                showBirthdayWish();
            }, 2000);
        }
    }
    
    function updateLeaderboard() {
        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '';
        
        leaderboard.slice(0, 5).forEach((player, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.innerHTML = `
                <span class="rank">${index + 1}</span>
                <span class="player-name">${player.name}</span>
                <span class="player-score">${player.score}</span>
            `;
            leaderboardList.appendChild(item);
        });
    }
    
    function showBirthdayWish() {
        const wishes = [
            "🎉 Happy Birthday Mithun! You're a cricket champion! 🏏",
            "🌟 Amazing game! Your birthday is as special as your cricket skills! ⭐",
            "🎂 Birthday six! You hit it out of the park! 🚀",
            "� MI wishes you a very happy birthday! Paltan forever! �"
        ];
        
        const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
        showShotResult(randomWish);
        
        // Add special effects
        createConfetti();
        animateCrowd(true, true);
    }
    
    function showShotResult(message) {
        shotResult.textContent = message;
        shotResult.style.animation = 'pulse 0.5s ease';
        
        setTimeout(() => {
            shotResult.style.animation = '';
        }, 500);
    }
}

// Birthday Card Generator
function initBirthdayCardGenerator() {
    const templateBtns = document.querySelectorAll('.template-btn');
    const recipientName = document.getElementById('recipientName');
    const cardMessage = document.getElementById('cardMessage');
    const cardColor = document.getElementById('cardColor');
    const cardFont = document.getElementById('cardFont');
    const colorPresets = document.querySelectorAll('.color-preset');
    const generateBtn = document.getElementById('generateCard');
    const downloadBtn = document.getElementById('downloadCard');
    const shareBtn = document.getElementById('shareCard');
    const resetBtn = document.getElementById('resetCard');
    
    // Preview elements
    const previewTitle = document.getElementById('previewTitle');
    const previewName = document.getElementById('previewName');
    const previewMessage = document.getElementById('previewMessage');
    const cardPreview = document.getElementById('cardPreview');
    
    let currentTemplate = 'cricket';
    
    // Template selection
    templateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            templateBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTemplate = btn.dataset.template;
            applyTemplate(currentTemplate);
        });
    });
    
    // Color presets
    colorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            cardColor.value = color;
            updateCardPreview();
        });
    });
    
    // Real-time preview updates
    recipientName.addEventListener('input', updateCardPreview);
    cardMessage.addEventListener('input', updateCardPreview);
    cardColor.addEventListener('input', updateCardPreview);
    cardFont.addEventListener('change', updateCardPreview);
    
    // Action buttons
    generateBtn.addEventListener('click', generateCard);
    downloadBtn.addEventListener('click', downloadCard);
    shareBtn.addEventListener('click', shareCard);
    resetBtn.addEventListener('click', resetCard);
    
    function applyTemplate(template) {
        const templates = {
            cricket: {
                title: 'Happy Birthday',
                message: 'Wishing you a fantastic birthday, cricket champion!',
                color: '#F9CD05',
                decorations: ['cricket-bat', 'cricket-ball']
            },
            mi: {
                title: 'MI Birthday',
                message: 'MI Paltan wishes you a very happy birthday!',
                color: '#004BA0',
                decorations: ['cricket-bat', 'cricket-ball']
            },
            nature: {
                title: 'Nature\'s Gift',
                message: 'May your birthday be as beautiful as nature itself!',
                color: '#4CAF50',
                decorations: ['stars']
            },
            vijay: {
                title: 'Mass Birthday',
                message: 'Vijay-level swag birthday wishes to you!',
                color: '#FFD700',
                decorations: ['stars']
            },
            car: {
                title: 'Speed & Dreams',
                message: 'May your birthday journey be full of speed and success!',
                color: '#FF6B6B',
                decorations: ['confetti']
            },
            classic: {
                title: 'Happy Birthday',
                message: 'Wishing you joy, happiness, and success on your special day!',
                color: '#F9CD05',
                decorations: ['confetti', 'stars']
            }
        };
        
        const selectedTemplate = templates[template];
        if (selectedTemplate) {
            recipientName.value = 'Mithun Raam';
            cardMessage.value = selectedTemplate.message;
            cardColor.value = selectedTemplate.color;
            updateCardPreview();
            updateDecorations(selectedTemplate.decorations);
        }
    }
    
    function updateCardPreview() {
        previewTitle.textContent = recipientName.value || 'Happy Birthday';
        previewName.textContent = recipientName.value || 'Mithun Raam';
        previewMessage.textContent = cardMessage.value || 'Happy 18th Birthday! May all your dreams come true!';
        
        // Update card background
        cardPreview.style.background = `linear-gradient(135deg, ${cardColor.value}, ${adjustColor(cardColor.value, -20)})`;
        
        // Update text color based on background
        const textColor = getContrastColor(cardColor.value);
        previewTitle.style.color = textColor;
        previewName.style.color = textColor;
        previewMessage.style.color = textColor;
    }
    
    function updateDecorations(decorations) {
        const decorationElements = document.querySelectorAll('.decoration');
        decorationElements.forEach(el => {
            el.style.display = 'none';
        });
        
        decorations.forEach(decoration => {
            const element = document.querySelector(`.${decoration}`);
            if (element) {
                element.style.display = 'block';
            }
        });
    }
    
    function adjustColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, ((num & 0x0000FF) + amount)));
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    }
    
    function getContrastColor(hexcolor) {
        const r = parseInt(hexcolor.substr(1, 2), 16);
        const g = parseInt(hexcolor.substr(3, 2), 16);
        const b = parseInt(hexcolor.substr(5, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? '#000' : '#fff';
    }
    
    function generateCard() {
        // Add generation animation
        cardPreview.style.animation = 'cardGenerate 1s ease';
        createConfetti();
        
        setTimeout(() => {
            cardPreview.style.animation = '';
            showMessage('Birthday card generated successfully! 🎂');
        }, 1000);
    }
    
    function downloadCard() {
        // Create canvas from card preview
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        
        // Draw card background
        const gradient = ctx.createLinearGradient(135, 0, 0, 800, 600);
        gradient.addColorStop(0, cardColor.value);
        gradient.addColorStop(1, adjustColor(cardColor.value, -20));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // Draw text
        ctx.fillStyle = getContrastColor(cardColor.value);
        ctx.font = 'bold 48px Bebas Neue';
        ctx.textAlign = 'center';
        ctx.fillText(previewTitle.textContent, 400, 100);
        
        ctx.font = 'bold 36px Bebas Neue';
        ctx.fillText(previewName.textContent, 400, 180);
        
        ctx.font = '24px Inter';
        ctx.fillText(previewMessage.textContent, 400, 280);
        
        // Download
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mithun-birthday-card-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
        
        showMessage('Birthday card downloaded! 📥');
    }
    
    function shareCard() {
        // Create share data
        const shareData = {
            title: previewTitle.textContent,
            text: `${previewName.textContent}: ${previewMessage.textContent}`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData);
            showMessage('Card shared successfully! 📤');
        } else {
            // Fallback: Copy to clipboard
            const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            navigator.clipboard.writeText(text).then(() => {
                showMessage('Card details copied to clipboard! 📋');
            });
        }
    }
    
    function resetCard() {
        recipientName.value = 'Mithun Raam';
        cardMessage.value = 'Happy 18th Birthday! May all your dreams come true!';
        cardColor.value = '#F9CD05';
        cardFont.value = 'bebas';
        
        templateBtns.forEach(btn => btn.classList.remove('active'));
        templateBtns[0].classList.add('active');
        currentTemplate = 'cricket';
        
        updateCardPreview();
        updateDecorations(['cricket-bat', 'cricket-ball']);
        showMessage('Card reset to default! 🔄');
    }
    
    // Add card generation animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cardGenerate {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(2deg); }
            100% { transform: scale(1) rotate(0deg); }
        }
    `;
    document.head.appendChild(style);
}

// Scroll animations for sections
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animations for specific sections
                if (entry.target.classList.contains('character-highlights')) {
                    animateCharacterCards();
                } else if (entry.target.classList.contains('motivational-quotes')) {
                    animateQuotes();
                } else if (entry.target.classList.contains('sports-mode')) {
                    animateStats();
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Parallax effects for hero section
function initParallaxEffects() {
    const heroBackground = document.querySelector('.hero-background');
    const particles = document.querySelector('.particles');
    
    if (heroBackground && particles) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            particles.style.transform = `translateY(${scrolled * parallaxSpeed * 0.3}px)`;
        });
    }
}

// Typewriter effect for quotes
function initTypewriterEffect() {
    const quotes = document.querySelectorAll('.quote-text');
    
    quotes.forEach((quote, index) => {
        const text = quote.textContent;
        quote.textContent = '';
        quote.style.opacity = '1';
        
        setTimeout(() => {
            typeWriter(quote, text, 50);
        }, index * 500);
    });
}

function typeWriter(element, text, speed) {
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Animate character cards on scroll
function animateCharacterCards() {
    const cards = document.querySelectorAll('.character-card');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 150);
    });
}

// Animate quotes with scoreboard effect
function animateQuotes() {
    const quoteContainers = document.querySelectorAll('.quote-container');
    
    quoteContainers.forEach((container, index) => {
        setTimeout(() => {
            container.style.opacity = '0';
            container.style.transform = 'translateX(-100px)';
            container.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                container.style.opacity = '1';
                container.style.transform = 'translateX(0)';
            }, 100);
        }, index * 200);
    });
}

// Animate stats with counter effect
function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const finalValue = stat.textContent;
        const isNumeric = !isNaN(finalValue) && finalValue !== '100%';
        
        if (isNumeric) {
            animateCounter(stat, 0, parseInt(finalValue), 2000);
        } else {
            // For text values, just fade them in
            stat.style.opacity = '0';
            stat.style.transform = 'scale(0.5)';
            stat.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                stat.style.opacity = '1';
                stat.style.transform = 'scale(1)';
            }, 300);
        }
    });
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Gallery interactions
function initGalleryInteractions() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(1deg)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
        
        item.addEventListener('click', function() {
            // Add click animation
            this.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });
}

// Sound effects (placeholder - would need actual audio files)
function initSoundEffects() {
    // Create audio context for sound effects
    let audioContext;
    
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    // Play crowd cheer on hero section
    const heroSection = document.querySelector('#hero-intro');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            initAudio();
            playCrowdCheer();
        });
    }
    
    function playCrowdCheer() {
        // Placeholder for crowd cheer sound
        // In production, you'd load and play actual audio files
        console.log('Playing crowd cheer sound');
    }
}

// Smooth scroll for navigation
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Performance optimization - throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Mobile touch interactions
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Add swipe gestures for mobile navigation
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            // Navigate to next/previous section based on swipe direction
            const currentSection = getCurrentSection();
            if (diff > 0) {
                // Swipe left - next section
                scrollToNextSection(currentSection);
            } else {
                // Swipe right - previous section
                scrollToPreviousSection(currentSection);
            }
        }
    }
}

function getCurrentSection() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.pageYOffset + window.innerHeight / 2;
    
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            return i;
        }
    }
    return 0;
}

function scrollToNextSection(currentIndex) {
    const sections = document.querySelectorAll('.section');
    if (currentIndex < sections.length - 1) {
        sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToPreviousSection(currentIndex) {
    const sections = document.querySelectorAll('.section');
    if (currentIndex > 0) {
        sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
    }
}

// Loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Easter egg: Konami code for special animation
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        triggerEasterEgg();
    }
});

function triggerEasterEgg() {
    // Create confetti effect
    createConfetti();
    
    // Play special sound
    console.log('🎉 Happy Birthday Mithun Raam! 🎉');
}

function createConfetti() {
    const colors = ['#F9CD05', '#FFD700', '#4CAF50', '#1E3A5F'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: ${Math.random() * 0.8 + 0.2};
            transform: rotate(${Math.random() * 360}deg);
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(confetti);
        
        // Animate confetti falling
        const duration = Math.random() * 3000 + 2000;
        const horizontalMovement = (Math.random() - 0.5) * 200;
        
        confetti.animate([
            { 
                transform: `translateY(0) translateX(0) rotate(0deg)`,
                opacity: 1
            },
            { 
                transform: `translateY(${window.innerHeight + 20}px) translateX(${horizontalMovement}px) rotate(${Math.random() * 720}deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => confetti.remove();
    }
}
