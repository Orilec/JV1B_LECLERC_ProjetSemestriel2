class sceneTest extends Phaser.Scene {
    constructor() {
        super("sceneTest");

    }

    preload() {
        this.load.spritesheet('perso', 'assets/perso.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image("seed", "assets/graine.png");
        this.load.image("flower", "assets/fleur.png");
        this.load.image("carnivorous", "assets/carnivorous.png");
        this.load.image("ivy", "assets/ivy.png");
        this.load.image("enemy", "assets/enemy.png");
        this.load.image("song", "assets/vide.png");
        this.load.image("tileset", "assets/tileset.png");
        this.load.tilemapTiledJSON("map", "map.json");
    }

    create() {
        this.physics.world.setBounds(0, 0, 1600, 1600);

        const map = this.add.tilemap("map");

        const tileset = map.addTilesetImage(
            "tileset", "tileset"
        );

        const plateforms = map.createLayer(
            "platforms",
            tileset
        );
        plateforms.setCollisionByProperty({ estSolide: true });

        this.wood = map.createLayer(
            "wood",
            tileset
        );
        this.wood.setCollisionByProperty({ estSolide: true });

        this.flowers = this.physics.add.group();

        this.carnivorous = this.physics.add.group();

        this.ivy = this.physics.add.group();

        this.enemies = this.physics.add.group();

        
        map.getObjectLayer('enemies').objects.forEach((enemy) => {
            const enemySprite = this.enemies.create(enemy.x, enemy.y, 'enemy').setOrigin(0);
            enemySprite.setPushable(false);
            enemySprite.setCollideWorldBounds(true);
        })

        this.player = this.physics.add.sprite(180, 1500, 'perso');
        this.player.setCollideWorldBounds(true);
        this.cameras.main.setBounds(0, 0, 1600, 1600);
        this.cameras.main.startFollow(this.player);

        this.seeds = this.physics.add.group();

        this.songs = this.physics.add.group();

        this.physics.add.collider(this.player, plateforms);
        this.physics.add.collider(this.player, this.wood);
        this.physics.add.collider(this.player, this.flowers, bounce, null, this);
        this.physics.add.collider(this.flowers, plateforms);
        this.physics.add.collider(this.carnivorous, plateforms);
        this.physics.add.collider(this.ivy, plateforms);
        this.physics.add.collider(this.ivy, this.wood, desintegrate, null, this);
        this.physics.add.collider(this.enemies, plateforms);
        this.physics.add.collider(this.carnivorous, this.enemies, attackEnnemy, null, this);
        // this.physics.add.collider(this.player, this.enemies, damages, null, this);
        this.physics.add.collider(this.seeds, plateforms, stop, null, this);
        this.physics.add.collider(this.seeds, this.wood, stop, null, this);
        this.physics.add.collider(this.seeds, this.songs, grow, null, this);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('perso', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'perso', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('perso', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors2 = this.input.keyboard.addKeys('A, Z, E');

        this.isThrowing = false;
        this.isPlaying = false;
        this.lastDirection = "right";
        this.plantType = "flower"
        
        function stop(seed){
            seed.setVelocityY(0);
            seed.setVelocityX(0);
            seed.setAccelerationY(0);
            seed.setAccelerationX(0);
        }

        function bounce(player){
            player.setVelocityY(-500);
        }

        function attackEnnemy(plant, enemy){
            enemy.destroy();
            plant.destroy();
        }

        function desintegrate(plant, wood){
            wood.destroy();
        }

        function grow(seed, song){
            if(this.scene.scene.plantType == "flower"){
                this.flowers.create(seed.x, seed.y, 'flower').setPushable(false);
            }
            else if(this.scene.scene.plantType == "carnivorous"){
                this.carnivorous.create(seed.x, seed.y, 'carnivorous').setPushable(false);
            }
            else if(this.scene.scene.plantType == "ivy"){
                this.ivy1 = this.ivy.create(seed.x, seed.y - 10, 'ivy').setPushable(false);
            }
            seed.destroy();
        }

        this.playSong = function playSong(){
            this.scene.scene.song = this.scene.scene.songs.create(this.player.x, this.player.y, 'song');
            this.scene.scene.song.setCollideWorldBounds(true)
            this.scene.scene.song.body.setAllowGravity(false)
            this.scene.scene.isPlaying = true;
            setTimeout(() => {
                this.scene.scene.isPlaying = false;
                this.song.destroy();
            }, 4000);
        }

        this.timer = 0;
        this.timer2 = 0;
        this.lastX = 0;

    }

    update(time, delta) {

        if (this.gameOver) {
            return;
        }

        this.enemies.children.each(function (enemy) {

            this.timer += delta;
            
            this.timer2 += delta;
            
            if(this.lastX == this.currentX && this.enemyLeft){
                this.enemyLeft = false;
                this.enemyRight = true;
            }
            else if (this.lastX == this.currentX && enemy.body.velocity.x >= 0){
                this.enemyLeft = true;
                this.enemyRight = false;
            }

            if(this.enemyLeft){
                enemy.setVelocityX(-180);
            }
            else if (this.enemyRight){
                enemy.setVelocityX(180);
            }

            if (this.timer > 2000) {
                this.lastX = enemy.x;
                this.timer = 0;
            }
            
            if (this.timer2 > 400) {
                this.currentX = enemy.x;
                this.timer2 = 0;
            }

        }, this);

        this.carnivorous.children.each(function (plant) {
            if (this.lastDirection == "right"){
                plant.setVelocityX(200);
            }
            else if (this.lastDirection == "left"){
                plant.setVelocityX(-200);
            }

        }, this);

        if (this.cursors.left.isDown && !this.scene.scene.isPlaying) {//si la touche gauche est appuyée
            this.lastDirection = "left";
            this.player.setVelocityX(-200);//alors vitesse négative en X
            this.player.anims.play('left', true);//et animation => gauche
        }
        else if (this.cursors.right.isDown && !this.scene.scene.isPlaying) {//si la touche droite est appuyée
            this.lastDirection = "right";
            this.player.setVelocityX(200);//alors vitesse positive en X
            this.player.anims.play('right', true);//et animation => droite
        }
        else { // sinon
            this.player.setVelocityX(0); //vitesse nulle
            this.player.anims.play('turn');//animation fait face caméra
        }

        if (this.cursors.up.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(-360);
        }

        if (this.cursors2.A.isDown && this.player.body.onFloor() && !this.scene.scene.isPlaying) {
            this.scene.scene.plantType = "flower"
            this.playSong()
        }

        if (this.cursors2.Z.isDown && this.player.body.onFloor() && !this.scene.scene.isPlaying) {
            this.scene.scene.plantType = "carnivorous"
            this.playSong()
        }

        
        if (this.cursors2.E.isDown && this.player.body.onFloor() && !this.scene.scene.isPlaying) {
            this.scene.scene.plantType = "ivy"
            this.playSong()
        }


        if (this.scene.scene.isPlaying){
            this.song.scale += 0.045;
        }

        if (this.cursors.space.isDown && !this.scene.scene.isThrowing) {
            this.scene.scene.isThrowing = true;
            this.seed = this.scene.scene.seeds.create(this.player.x, this.player.y, 'seed');
            this.seed.body.setSize(8, 8); 
            this.seed.setCollideWorldBounds(true)
            if (this.lastDirection == "right"){
                this.seed.setAccelerationY(-800);
                this.seed.setAccelerationX(500);
                setTimeout(() => {
                    this.seed.setAccelerationY(0);
                    this.seed.setAccelerationX(300);
                }, 500);
                setTimeout(() => {
                    this.seed.setAccelerationX(0);
                }, 1300);
                setTimeout(() => {
                    this.scene.scene.isThrowing = false;
                }, 1450);
            }
            if (this.lastDirection == "left"){
                this.seed.setAccelerationY(-800);
                this.seed.setAccelerationX(-500);
                setTimeout(() => {
                    this.seed.setAccelerationY(0);
                    this.seed.setAccelerationX(-300);
                }, 500);
                setTimeout(() => {
                    this.seed.setAccelerationX(0);
                }, 1300);
                setTimeout(() => {
                    this.scene.scene.isThrowing = false;
                }, 1450);
            }

        }
    }
}
