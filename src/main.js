import Phaser from 'phaser';
import GameScene from './scenes/GameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#F5F5DC', // Beige background
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 }, // Reduced from 600 - slower fall
            debug: false
        }
    },
    scene: [GameScene]
};

const game = new Phaser.Game(config);
