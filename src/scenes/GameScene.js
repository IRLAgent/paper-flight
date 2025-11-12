import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // We'll load assets here later
        // For now, we'll use simple shapes
    }

    create() {
        // Create office background layers (parallax effect)
        this.createBackground();

        // Add title text
        this.titleText = this.add.text(400, 100, 'Paper Flight', {
            fontSize: '48px',
            fill: '#333',
            fontStyle: 'bold',
            stroke: '#fff',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(100);

        // Add instructions (store references so we can remove them)
        this.instructionText1 = this.add.text(400, 300, 'Click or Tap to Start', {
            fontSize: '24px',
            fill: '#333',
            backgroundColor: '#ffffffaa',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setDepth(100);

        this.instructionText2 = this.add.text(400, 350, 'Hold to rise, release to fall', {
            fontSize: '18px',
            fill: '#666',
            backgroundColor: '#ffffffaa',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setDepth(100);

        // Create paper airplane container (side view - classic dart style)
        this.airplane = this.add.container(200, 300);
        
        // Use graphics for classic paper airplane side view
        const planeGraphics = this.add.graphics();
        
        // Main body - pointed front, wider back
        // Bottom surface (darker)
        planeGraphics.fillStyle(0xE0E0E0);
        planeGraphics.beginPath();
        planeGraphics.moveTo(30, 0);       // Nose point
        planeGraphics.lineTo(-20, 10);     // Back bottom
        planeGraphics.lineTo(-20, 3);      // Inner fold bottom
        planeGraphics.closePath();
        planeGraphics.fillPath();
        
        // Top surface (lighter)
        planeGraphics.fillStyle(0xFFFFFF);
        planeGraphics.beginPath();
        planeGraphics.moveTo(30, 0);       // Nose point
        planeGraphics.lineTo(-20, -10);    // Back top
        planeGraphics.lineTo(-20, -3);     // Inner fold top
        planeGraphics.closePath();
        planeGraphics.fillPath();
        
        // Center body (middle shade)
        planeGraphics.fillStyle(0xF5F5F5);
        planeGraphics.beginPath();
        planeGraphics.moveTo(30, 0);       // Nose point
        planeGraphics.lineTo(-20, -3);     // Top inner
        planeGraphics.lineTo(-20, 3);      // Bottom inner
        planeGraphics.closePath();
        planeGraphics.fillPath();
        
        // Edge outlines
        planeGraphics.lineStyle(1.5, 0xB0B0B0);
        planeGraphics.beginPath();
        planeGraphics.moveTo(30, 0);
        planeGraphics.lineTo(-20, 10);
        planeGraphics.strokePath();
        
        planeGraphics.beginPath();
        planeGraphics.moveTo(30, 0);
        planeGraphics.lineTo(-20, -10);
        planeGraphics.strokePath();
        
        // Center crease line
        planeGraphics.lineStyle(1, 0xC8C8C8);
        planeGraphics.beginPath();
        planeGraphics.moveTo(30, 0);
        planeGraphics.lineTo(-20, 0);
        planeGraphics.strokePath();
        
        // Inner fold lines
        planeGraphics.lineStyle(0.5, 0xD0D0D0);
        planeGraphics.beginPath();
        planeGraphics.moveTo(10, 0);
        planeGraphics.lineTo(-20, -3);
        planeGraphics.strokePath();
        
        planeGraphics.beginPath();
        planeGraphics.moveTo(10, 0);
        planeGraphics.lineTo(-20, 3);
        planeGraphics.strokePath();
        
        this.airplane.add(planeGraphics);
        
        this.physics.add.existing(this.airplane);
        this.airplane.body.setCollideWorldBounds(true);
        this.airplane.body.setSize(40, 14);
        this.airplane.body.setOffset(-18, -7);
        this.airplane.setDepth(50);

        // Create obstacle group
        this.obstacles = this.physics.add.group();

        // Game state
        this.isGameStarted = false;
        this.score = 0;
        this.obstacleTimer = 0;
        this.obstacleDelay = 2000; // Spawn every 2 seconds (in ms)
        this.highScore = parseInt(localStorage.getItem('paperFlightHighScore')) || 0;

        // Score text
        this.scoreText = this.add.text(16, 16, 'Distance: 0m', {
            fontSize: '20px',
            fill: '#fff'
        }).setDepth(100);
        
        // Current and high score text at bottom
        this.currentScoreText = this.add.text(16, 560, 'Current: 0m', {
            fontSize: '18px',
            fill: '#fff'
        }).setDepth(100);
        
        this.highScoreText = this.add.text(16, 584, `Best: ${this.highScore}m`, {
            fontSize: '18px',
            fill: '#FFD700'
        }).setDepth(100);

        // Input handling
        this.input.on('pointerdown', () => this.startGame());
        this.input.on('pointerup', () => this.releaseAirplane());

        // For continuous holding
        this.isHolding = false;
    }

    createClock(x) {
        const clock = this.add.circle(x, 80, 25, 0xFFFFFF);
        const clockRim = this.add.circle(x, 80, 25, 0x000000, 0)
            .setStrokeStyle(3, 0x000000);
        const hourHand = this.add.line(x, 80, 0, 0, 0, -15, 0x000000, 1)
            .setLineWidth(2);
        const minuteHand = this.add.line(x, 80, 0, 0, 10, 0, 0x000000, 1)
            .setLineWidth(2);
        
        this.clock = { clock, clockRim, hourHand, minuteHand, x };
    }

    createBackground() {
        // Office wall (back layer) - solid beige
        this.add.rectangle(400, 300, 800, 600, 0xD4C5B9).setDepth(0);

        // Windows on the back wall (side view perspective)
        this.windowsLayer = this.add.container(0, 0).setDepth(5);
        
        for (let i = 0; i < 4; i++) {
            const x = i * 220 + 110;
            const y = 250; // Middle of the wall
            
            // Window (sky blue)
            const window = this.add.rectangle(x, y, 150, 180, 0x87CEEB);
            
            // Create curved mountain silhouettes with random shapes
            const numPeaks = Phaser.Math.Between(2, 4);
            for (let p = 0; p < numPeaks; p++) {
                const peakX = x - 60 + (p * 40) + Phaser.Math.Between(-10, 10);
                const peakHeight = Phaser.Math.Between(40, 70);
                const peakWidth = Phaser.Math.Between(30, 50);
                
                // Create curved mountain using graphics
                const mountain = this.add.graphics();
                mountain.fillStyle(0x8B9DC3, Phaser.Math.FloatBetween(0.5, 0.7));
                mountain.beginPath();
                mountain.moveTo(peakX - peakWidth/2, y + 90);
                
                // Curve using multiple line segments to create smooth arc
                const steps = 10;
                for (let s = 0; s <= steps; s++) {
                    const t = s / steps;
                    let curveY;
                    if (t < 0.5) {
                        // Going up
                        const localT = t * 2;
                        curveY = y + 90 - peakHeight * (localT * localT);
                    } else {
                        // Going down
                        const localT = (t - 0.5) * 2;
                        curveY = y + 90 - peakHeight * ((1 - localT) * (1 - localT));
                    }
                    const curveX = peakX - peakWidth/2 + t * peakWidth;
                    mountain.lineTo(curveX, curveY);
                }
                
                mountain.closePath();
                mountain.fillPath();
                
                this.windowsLayer.add(mountain);
            }
            
            // Frame and panes
            const frame = this.add.rectangle(x, y, 150, 180, 0x4A4A4A, 0)
                .setStrokeStyle(4, 0x2C2C2C);
            const crossV = this.add.rectangle(x, y, 2, 180, 0x2C2C2C);
            const crossH = this.add.rectangle(x, y, 150, 2, 0x2C2C2C);
            
            this.windowsLayer.add([window, frame, crossV, crossH]);
        }
        
        // Clock on wall (scrolls with windows)
        this.clockX = 400;
        this.createClock(this.clockX);

        // Ceiling with fluorescent light panels
        this.add.rectangle(400, 0, 800, 40, 0xE8E8E8).setDepth(6);
        // Light panels
        for (let i = 0; i < 4; i++) {
            this.add.rectangle(i * 200 + 100, 20, 150, 25, 0xFFFACD)
                .setStrokeStyle(2, 0xCCCCCC).setDepth(6);
        }

        // Floor - wood/carpet
        this.add.rectangle(400, 575, 800, 50, 0x8B7355).setDepth(1);
        
        // Baseboard along bottom
        this.add.rectangle(400, 553, 800, 8, 0xFFFFFF).setDepth(2);
    }

    startGame() {
        if (!this.isGameStarted) {
            this.isGameStarted = true;
            // Clear instruction and title text
            if (this.titleText) {
                this.titleText.destroy();
            }
            if (this.instructionText1) {
                this.instructionText1.destroy();
            }
            if (this.instructionText2) {
                this.instructionText2.destroy();
            }
        }
        this.isHolding = true;
    }

    releaseAirplane() {
        this.isHolding = false;
    }

    update(time, delta) {
        if (!this.isGameStarted) return;

        // Flap up when holding
        if (this.isHolding) {
            this.airplane.body.setVelocityY(-200); // Reduced from -300 - gentler rise
        }

        // Tilt airplane based on velocity
        const angle = Phaser.Math.Clamp(this.airplane.body.velocity.y / 500, -0.5, 0.5);
        this.airplane.rotation = angle;

        // Update score (distance traveled)
        this.score += delta / 100;
        const currentScore = Math.floor(this.score);
        this.scoreText.setText(`Distance: ${currentScore}m`);
        this.currentScoreText.setText(`Current: ${currentScore}m`);
        
        // Update high score display if current score exceeds it
        if (currentScore > this.highScore) {
            this.highScoreText.setText(`Best: ${currentScore}m`);
        }

        // Scroll background windows (parallax - slow for depth)
        this.windowsLayer.x -= 0.5;
        if (this.windowsLayer.x < -220) {
            this.windowsLayer.x = 0;
        }
        
        // Move clock at same speed as windows
        this.clockX -= 0.5;
        this.clock.clock.x = this.clockX;
        this.clock.clockRim.x = this.clockX;
        this.clock.hourHand.x = this.clockX;
        this.clock.minuteHand.x = this.clockX;
        
        // Respawn clock when it goes off screen
        if (this.clockX < -50) {
            this.clockX = 850;
        }

        // Spawn obstacles
        this.obstacleTimer += delta;
        if (this.obstacleTimer > this.obstacleDelay) {
            this.spawnObstacle();
            this.obstacleTimer = 0;
            
            // Gradually increase difficulty
            if (this.obstacleDelay > 1200) {
                this.obstacleDelay -= 50;
            }
        }

        // Move and clean up obstacles
        this.obstacles.children.entries.forEach(obstacle => {
            if (obstacle && obstacle.active) {
                obstacle.x -= 3; // Move left
                
                // Debug: log position every 30 frames
                if (Math.floor(time) % 500 < 20) {
                    console.log('Obstacle at x:', obstacle.x, 'Active:', obstacle.active);
                }
                
                // Remove if off screen (left edge)
                if (obstacle.x < -100) {
                    console.log('Destroying obstacle at', obstacle.x);
                    obstacle.destroy();
                }
            }
        });

        // Check collision with obstacles
        this.physics.overlap(this.airplane, this.obstacles, (plane, obstacle) => {
            this.gameOver();
        });

        // Simple game over if airplane leaves screen
        if (this.airplane.y > 590 || this.airplane.y < 10) {
            this.gameOver();
        }
    }

    spawnObstacle() {
        // Random gap position and size
        const gapCenter = Phaser.Math.Between(180, 420); // Center of gap (vertical position)
        const gapSize = Phaser.Math.Between(140, 180); // Size of the gap
        
        // CEILING OBSTACLE (pendant light hanging down)
        const ceilingHeight = gapCenter - gapSize / 2; // How far it hangs down
        if (ceilingHeight > 40) {
            const ceilingY = ceilingHeight / 2;
            const ceilingObstacle = this.createCeilingObstacle(850, ceilingY, 40, ceilingHeight);
            this.obstacles.add(ceilingObstacle);
        }
        
        // FLOOR OBSTACLE (desk, plant, or cabinet)
        const obstacleType = Phaser.Math.Between(1, 3);
        const floorTop = gapCenter + gapSize / 2; // Where floor obstacle starts
        const floorHeight = 550 - floorTop; // Height from floor
        
        if (floorHeight > 40) {
            let isStandingDesk = false;
            let actualHeight = floorHeight;
            
            // For desk obstacles, use fixed heights if they fit
            if (obstacleType === 2 && floorHeight > 90) {
                isStandingDesk = floorHeight > 135 && Math.random() < 0.5;
                actualHeight = isStandingDesk ? Math.min(135, floorHeight) : Math.min(90, floorHeight);
            }
            
            const floorY = 550 - actualHeight / 2;
            const floorObstacle = this.createObstacleType(850, floorY, 80, actualHeight, obstacleType, isStandingDesk);
            this.obstacles.add(floorObstacle);
        }
    }

    createObstacleType(x, y, width, height, type, isStandingDesk = false) {
        const container = this.add.container(x, y);

        switch(type) {
            case 1: // Filing cabinet (gray metal)
                const cabinet = this.add.rectangle(0, 0, width, height, 0x808080);
                container.add(cabinet);
                // Add drawer lines with spacing
                const drawerCount = Math.floor(height / 35);
                for (let i = 0; i < drawerCount; i++) {
                    const drawerY = -height/2 + 20 + (i * (height - 30) / drawerCount);
                    const drawer = this.add.rectangle(0, drawerY, width - 10, 25, 0x696969);
                    const handle = this.add.rectangle(0, drawerY, 15, 4, 0x303030);
                    container.add([drawer, handle]);
                }
                // Top edge
                const topEdge = this.add.rectangle(0, -height/2, width, 5, 0x909090);
                container.add(topEdge);
                break;

            case 2: // Office desk
                const deskWidth = width * 2; // Twice as wide
                
                if (isStandingDesk) {
                    // Standing desk (taller)
                    const standingDeskHeight = height;
                    
                    // Tall metal legs
                    const legWidth = 8;
                    const leg1 = this.add.rectangle(-deskWidth/2 + 15, 0, legWidth, standingDeskHeight - 15, 0x505050);
                    const leg2 = this.add.rectangle(deskWidth/2 - 15, 0, legWidth, standingDeskHeight - 15, 0x505050);
                    container.add([leg1, leg2]);
                    
                    // Desk surface at top
                    const surfaceY = -height/2 + 8;
                    const deskSurface = this.add.rectangle(0, surfaceY, deskWidth, 16, 0x8B4513);
                    const deskTop = this.add.rectangle(0, surfaceY - 8, deskWidth, 8, 0xA0826D);
                    container.add([deskSurface, deskTop]);
                    
                    // Monitor on desk
                    const monitorY = surfaceY - 25;
                    const monitorBase = this.add.rectangle(0, monitorY + 15, 20, 10, 0x2C2C2C);
                    const monitorStand = this.add.rectangle(0, monitorY + 5, 8, 15, 0x404040);
                    const monitor = this.add.rectangle(0, monitorY - 10, 35, 30, 0x2C2C2C);
                    const screen = this.add.rectangle(0, monitorY - 10, 30, 25, 0x1E90FF);
                    container.add([monitorBase, monitorStand, monitor, screen]);
                    
                    // Laptop on desk
                    const laptop = this.add.rectangle(20, surfaceY - 5, 20, 15, 0x505050);
                    const laptopScreen = this.add.rectangle(20, surfaceY - 12, 18, 10, 0x1E90FF);
                    container.add([laptop, laptopScreen]);
                    
                } else {
                    // Regular sitting desk
                    const deskHeight = height;
                    
                    // Desk legs
                    const legWidth = 8;
                    const legHeight = deskHeight - 10;
                    const leg1 = this.add.rectangle(-deskWidth/2 + 15, height/2 - legHeight/2, legWidth, legHeight, 0x654321);
                    const leg2 = this.add.rectangle(deskWidth/2 - 15, height/2 - legHeight/2, legWidth, legHeight, 0x654321);
                    container.add([leg1, leg2]);
                    
                    // Desk surface
                    const deskSurface = this.add.rectangle(0, height/2 - deskHeight + 8, deskWidth, 16, 0x8B4513);
                    const deskTop = this.add.rectangle(0, height/2 - deskHeight, deskWidth, 8, 0xA0826D);
                    container.add([deskSurface, deskTop]);
                    
                    // Monitor on desk
                    const monitorY = height/2 - deskHeight - 25;
                    const monitorBase = this.add.rectangle(0, monitorY + 15, 20, 10, 0x2C2C2C);
                    const monitorStand = this.add.rectangle(0, monitorY + 5, 8, 15, 0x404040);
                    const monitor = this.add.rectangle(0, monitorY - 10, 35, 30, 0x2C2C2C);
                    const screen = this.add.rectangle(0, monitorY - 10, 30, 25, 0x1E90FF);
                    container.add([monitorBase, monitorStand, monitor, screen]);
                    
                    // Keyboard
                    const keyboard = this.add.rectangle(-10, height/2 - deskHeight - 5, 25, 8, 0x303030);
                    container.add(keyboard);
                    
                    // Office chair in front
                    const chairY = height/2 - 25;
                    const chairSeat = this.add.rectangle(-deskWidth/2 - 25, chairY, 35, 12, 0x404040);
                    const chairBack = this.add.rectangle(-deskWidth/2 - 25, chairY - 20, 30, 25, 0x404040);
                    const chairLeg = this.add.rectangle(-deskWidth/2 - 25, chairY + 12, 6, 15, 0x303030);
                    container.add([chairLeg, chairSeat, chairBack]);
                }
                break;

            case 3: // Potted plant
                // Pot at bottom
                const potHeight = 35;
                const pot = this.add.rectangle(0, height/2 - potHeight/2, width * 0.7, potHeight, 0x8B4513);
                const potRim = this.add.rectangle(0, height/2 - potHeight + 2, width * 0.75, 6, 0xA0826D);
                container.add([pot, potRim]);
                
                // Plant leaves growing upward from pot
                const plantHeight = height - potHeight;
                const leafCount = Math.max(3, Math.floor(plantHeight / 30));
                const leaves = [];
                
                // Stem going up from pot
                const stemY = (height/2 - potHeight) - plantHeight/2;
                const stem = this.add.rectangle(0, stemY, 6, plantHeight, 0x2D5016);
                leaves.push(stem);
                
                // Leaves at different heights going up
                for (let i = 0; i < leafCount; i++) {
                    const leafY = (height/2 - potHeight - 10) - (i * plantHeight / leafCount);
                    const leaf1 = this.add.ellipse(-12, leafY, 20, 30, 0x3D6B1F);
                    const leaf2 = this.add.ellipse(12, leafY, 20, 30, 0x3D6B1F);
                    const leaf3 = this.add.ellipse(0, leafY - 8, 22, 32, 0x4A7C2F);
                    leaves.push(leaf1, leaf2, leaf3);
                }
                
                container.add(leaves);
                break;
        }

        // Add physics to the container
        this.physics.add.existing(container);
        container.body.setImmovable(true);
        container.body.allowGravity = false;
        container.body.setCollideWorldBounds(false);
        container.body.moves = false;
        container.body.setSize(width, height);
        container.body.setOffset(-width / 2, -height / 2); // Center the hitbox on the container
        container.setDepth(40); // In front of background, behind airplane

        return container;
    }

    createCeilingObstacle(x, y, width, height) {
        const container = this.add.container(x, y);
        
        // Thin wire/cord hanging from ceiling to the light fixture
        const cordLength = height - 60; // Light fixture is now 60px tall, rest is cord
        const cord = this.add.rectangle(0, -height/2 + cordLength/2, 2, cordLength, 0x303030);
        container.add(cord);
        
        // Light fixture (fixed size, always the same)
        const fixtureY = height/2 - 28; // Position at bottom
        
        // Mounting point where cord attaches
        const mount = this.add.circle(0, fixtureY - 28, 6, 0x2C2C2C);
        container.add(mount);
        
        // Lampshade as hemisphere - solid filled dome
        const hemisphere = this.add.graphics();
        hemisphere.fillStyle(0x404040, 1);
        hemisphere.beginPath();
        hemisphere.arc(0, fixtureY, 28, Math.PI, 0, false); // Half circle (bottom half)
        hemisphere.closePath();
        hemisphere.fillPath();
        container.add(hemisphere);
        
        // Light bulb underneath (darker, only half visible)
        const bulb = this.add.arc(0, fixtureY, 18, Math.PI, 0, false, 0xE8D48A);
        container.add(bulb);
        
        // Add physics
        this.physics.add.existing(container);
        container.body.setImmovable(true);
        container.body.allowGravity = false;
        container.body.setCollideWorldBounds(false);
        container.body.moves = false;
        container.body.setSize(56, height); // Hitbox width matches wider fixture
        container.body.setOffset(-28, -height / 2);
        container.setDepth(40);
        
        return container;
    }

    gameOver() {
        if (!this.isGameStarted) return; // Prevent multiple calls
        this.isGameStarted = false;
        
        // Update high score if needed
        const finalScore = Math.floor(this.score);
        if (finalScore > this.highScore) {
            this.highScore = finalScore;
            localStorage.setItem('paperFlightHighScore', this.highScore);
            this.highScoreText.setText(`Best: ${this.highScore}m`);
        }
        
        // Game over text
        this.add.text(400, 250, 'Game Over!', {
            fontSize: '48px',
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(100);

        this.add.text(400, 320, `Final Distance: ${finalScore}m`, {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5).setDepth(100);

        // Restart button
        const restartText = this.add.text(400, 370, 'Click to Restart', {
            fontSize: '20px',
            fill: '#4CAF50',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(100);

        restartText.on('pointerdown', () => {
            this.scene.restart();
        });

        restartText.on('pointerover', () => {
            restartText.setStyle({ fill: '#fff' });
        });

        restartText.on('pointerout', () => {
            restartText.setStyle({ fill: '#4CAF50' });
        });

        // Stop physics
        this.physics.pause();
    }
}
