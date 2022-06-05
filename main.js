var config = {
    type: Phaser.CANVAS,
    width: 1280, height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y : 1500},
            debug: false
            
        }
    },

    scene: [sceneTest2, sceneTest, zone1, zone2, zone3]
};
new Phaser.Game(config);