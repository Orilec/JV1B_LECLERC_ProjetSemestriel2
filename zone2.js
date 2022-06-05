class zone2 extends Phaser.Scene {
    constructor() {
        super("zone2");

    }
    init(data) { this.sceneQuitee = data.sceneQuitee, this.seedCount = data.seedCount, this.intro = data.intro, this.aPartition = data.aPartition, this.zPartition = data.zPartition, this.ePartition = data.ePartition, this.hp = data.hp };
    preload() {
        //spritesheets
        this.load.spritesheet('perso', 'assets/test_spritesheet.png', { frameWidth: 256, frameHeight: 512 });
        this.load.spritesheet('perso_gauche', 'assets/spritesheet_gauche.png', { frameWidth: 256, frameHeight: 512 });

        //images
        this.load.image("uiGraines", "assets/ui_compteur_graines.png");
        this.load.image("uiPartitions1", "assets/ui_partitions1.png");
        this.load.image("uiPartitions2", "assets/ui_partitions2.png");
        this.load.image("uiPartitions3", "assets/ui_partitions3.png");
        this.load.image("hp3", "assets/hp3.png");
        this.load.image("hp2", "assets/hp2.png");
        this.load.image("hp1", "assets/hp1.png");
        this.load.image("petitSinge", "assets/petit_singe.png");
        this.load.image("flying_enemy", "assets/flying_enemy.png");
        this.load.image("seed", "assets/seed2.png");
        this.load.image("back3", "assets/back_zone2.png");
        this.load.image("wood", "assets/wood.png");
        this.load.image("flower", "assets/fleur2.png");
        this.load.image("carnivorous", "assets/carnivorous2.png");
        this.load.image("ivy", "assets/ivy2.png");
        this.load.image("enemy", "assets/enemy2.png");
        this.load.image("enemyLeft", "assets/enemy2_left.png");
        this.load.image("seedBag", "assets/sac_graines.png");
        this.load.image("song", "assets/vide2.png");
        this.load.image("partition", "assets/partition.png");
        this.load.image("tileset2", "assets/tileset2.png");

        //audio
        this.load.audio("ivyRiff", "assets/ivy_test.wav");
        this.load.audio("carnivorousRiff", "assets/carnivorous_test.wav");
        this.load.audio("flowerRiff", "assets/flower_test.wav");

        //map
        this.load.tilemapTiledJSON("map4", "map4.json");
    }

    create() {
        this.physics.world.setBounds(0, 0, 6400, 12800);

        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.add.tileSprite(3200, 6400, 6400, 12800, 'back3');

        this.carnivorousRiff = this.sound.add('carnivorousRiff');
        this.flowerRiff = this.sound.add('flowerRiff');
        this.ivyRiff = this.sound.add('ivyRiff');

        const map4 = this.add.tilemap("map4");

        const tileset2 = map4.addTilesetImage(
            "tileset2", "tileset2"
        );

        const plateforms = map4.createLayer(
            "platforms",
            tileset2
        );
        plateforms.setCollisionByProperty({ estSolide: true });


        const portail = map4.createLayer(
            "portail",
            tileset2
        );
        portail.setCollisionByProperty({ portail: true });

        const ennemiesColliders = map4.createLayer(
            "ennemies_colliders",
            tileset2
        );
        ennemiesColliders.setCollisionByProperty({ collider: true });

        this.flowers = this.physics.add.group();

        this.carnivorous = this.physics.add.group();

        this.ivy = this.physics.add.group();

        this.partitions = this.physics.add.group();
        if (!this.ePartition) {
            map4.getObjectLayer('partition').objects.forEach((partition) => {
                const partitionSprite = this.partitions.create(partition.x, partition.y, 'partition').setOrigin(0);
                partitionSprite.setPushable(false);
                partitionSprite.setCollideWorldBounds(true);
                partitionSprite.body.setAllowGravity(false);
            })
        }

        this.enemies = this.physics.add.group();


        map4.getObjectLayer('enemies').objects.forEach((enemy) => {
            const enemySprite = this.enemies.create(enemy.x, enemy.y - 100, 'enemy').setOrigin(0);
            enemySprite.setPushable(false);
            enemySprite.setCollideWorldBounds(true);
            enemySprite.lastTurnTimer = 0;
            enemySprite.turn = false;
            enemySprite.right = true;
        })


        this.flying_enemies = this.physics.add.group();


        map4.getObjectLayer('flying_enemies').objects.forEach((enemy) => {
            const enemySprite = this.flying_enemies.create(enemy.x, enemy.y - 100, 'flying_enemy').setOrigin(0);
            enemySprite.setPushable(false);
            enemySprite.setCollideWorldBounds(true);
            enemySprite.lastTurnTimer = 0;
            enemySprite.turn = false;
            enemySprite.up = true;
        })


        this.static_enemies = this.physics.add.group();
        map4.getObjectLayer('static_enemies').objects.forEach((enemy) => {
            const enemySprite = this.static_enemies.create(enemy.x, enemy.y - 100, 'enemy').setOrigin(0);
            enemySprite.setPushable(false);
            enemySprite.setCollideWorldBounds(true);
        })

        this.seedBags = this.physics.add.group();

        map4.getObjectLayer('seeds').objects.forEach((seedBag) => {
            const seedBagSprite = this.seedBags.create(seedBag.x, seedBag.y, 'seedBag').setOrigin(0);
            seedBagSprite.setPushable(false);
            seedBagSprite.body.setAllowGravity(false);
            seedBagSprite.setCollideWorldBounds(true);
        })

        this.petitSinge = this.physics.add.sprite(4189, 2800, 'petitSinge').setScale(2).setPushable(false);
        this.petitSinge.body.setAllowGravity(false);

        this.player = this.physics.add.sprite(4000, 11000, 'perso');
        this.player.setScale(1.1);
        this.player.setSize(180, 490);
        this.player.setCollideWorldBounds(true);
        this.cameras.main.setBounds(0, 0, 6400, 12800);
        this.cameras.main.setZoom(0.25);
        this.cameras.main.startFollow(this.player);

        this.seeds = this.physics.add.group();

        this.songs = this.physics.add.group();

        this.petitSingeHitbox = this.physics.add.sprite(4300, 3158, 'song').setScale(4).setPushable(false);
        this.petitSingeHitbox.body.setAllowGravity(false);


        this.physics.add.collider(this.player, this.petitSingeHitbox, dialoguePetitSinge, null, this);
        this.physics.add.collider(this.player, plateforms);
        this.physics.add.collider(this.player, this.seedBags, regenSeeds, null, this);
        this.physics.add.collider(this.player, portail, passageScene1, null, this);
        this.physics.add.collider(this.player, this.partitions, getEPartition, null, this);
        this.physics.add.collider(this.player, this.wood);
        this.physics.add.collider(this.player, this.flowers, bounce, null, this);
        this.physics.add.collider(this.flowers, plateforms);
        this.physics.add.collider(this.carnivorous, plateforms);
        this.physics.add.collider(this.ivy, plateforms);
        this.physics.add.collider(this.ivy, this.wood, desintegrate, null, this);
        this.physics.add.collider(this.enemies, plateforms);
        this.physics.add.collider(this.static_enemies, plateforms);
        this.physics.add.collider(this.enemies, ennemiesColliders, switchEnemy, null, this);
        this.physics.add.collider(this.flying_enemies, ennemiesColliders, switchEnemy, null, this);
        this.physics.add.collider(this.player, this.enemies, damages, null, this);
        this.physics.add.collider(this.player, this.flying_enemies, damages, null, this);
        this.physics.add.collider(this.seeds, plateforms, stop, null, this);
        this.physics.add.collider(this.seeds, this.wood, stop, null, this);
        this.physics.add.collider(this.seeds, this.songs, grow, null, this);
        this.physics.add.collider(this.carnivorous, this.enemies, attackEnnemy, null, this);

        // this.anims.create({
        //     key: 'left',
        //     frames: this.anims.generateFrameNumbers('perso', { start: 0, end: 3 }),
        //     frameRate: 10,
        //     repeat: -1
        // });

        this.anims.create({
            key: 'bass',
            frames: [{ key: 'perso', frame: 0 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'perso', frame: 1 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('perso', { start: 1, end: 17 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('perso_gauche', { start: 0, end: 17 }),
            frameRate: 24,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors2 = this.input.keyboard.addKeys('A, Z, E');

        // this.xText = this.add.text(50, 100, this.player.x).setScrollFactor(0).setScale(5);
        // this.yText = this.add.text(50, 300, this.player.y).setScrollFactor(0).setScale(5);

        this.isThrowing = false;
        this.isPlaying = false;
        this.lastDirection = "right";
        this.plantType = "flower";

        this.hpText = this.add.text(-1200, -600, this.hp).setScrollFactor(0).setScale(5);
        this.seedText = this.add.text(2850, 1500,  this.seedCount).setScrollFactor(0).setScale(10);
        this.dialogueBox = this.add.image(-1900, -1100, 'dialogue').setOrigin(0, 0).setScale(4);
        this.dialogueBox.setScrollFactor(0);
        this.dialogueBox.setAlpha(0);
        this.dialogueText = this.add.text(-1700, 1100, 'Ceci est un test').setScrollFactor(0).setScale(5);
        this.dialogueText.setAlpha(0);
        this.activeDialogue = false;
        this.currentDialogue = [""];
        this.stepDialogue = 0;
        this.dialoguePetitSinge = ["Enfin un visage sympathique! \n C'est Symitriel qui t'envoies? \n Ah je vois, il te reste donc \n l'un des notres à retrouver.", "Prends la partition derrière \n moi, je te souhaite bon courage !"]

        this.hpBar = this.add.image(-1950 , -1000,'hp3').setOrigin(0, 0).setScale(4);
        this.hpBar.setScrollFactor(0);

        this.uiPartitions = this.add.image(-1950 , -1000,'uiPartitions1').setOrigin(0, 0).setScale(4);
        this.uiPartitions.setScrollFactor(0);

        this.uiGraines = this.add.image(-1950 , -1100,'uiGraines').setOrigin(0, 0).setScale(4);
        this.uiGraines.setScrollFactor(0);

        function stop(seed) {
            seed.setVelocityY(0);
            seed.setVelocityX(0);
            seed.setAccelerationY(0);
            seed.setAccelerationX(0);
        }

        function bounce(player) {
            player.setVelocityY(-2100);
            player.setVelocityY(-2000);
        }

        function attackEnnemy(plant, enemy) {
            enemy.destroy();
            plant.destroy();
        }

        function desintegrate(plant, wood) {
            wood.destroy();
        }

        function getEPartition(player, partition) {
            this.scene.scene.ePartition = true;
            partition.destroy();
            this.scene.start("sceneTest2", { sceneQuitee: "scene3", seedCount: this.seedCount, intro: this.intro, aPartition: this.aPartition, zPartition: this.zPartition, ePartition: this.ePartition, hp: this.hp });
        }

        function grow(seed, song) {
            if (this.scene.scene.plantType == "flower") {
                this.flower = this.flowers.create(seed.x, seed.y - 100, 'flower').setPushable(false);
                this.flower.body.setSize(256, 200);
            }
            else if (this.scene.scene.plantType == "carnivorous") {
                this.carnivorousPlant = this.carnivorous.create(seed.x, seed.y - 100, 'carnivorous').setPushable(false);
                this.carnivorousPlant.body.setSize(256, 200);
            }
            else if (this.scene.scene.plantType == "ivy") {
                this.ivy1 = this.ivy.create(seed.x, seed.y - 100, 'ivy').setPushable(false);
            }
            seed.destroy();
        }

        this.playSong = function playSong() {
            this.scene.scene.song = this.scene.scene.songs.create(this.player.x, this.player.y, 'song');
            this.scene.scene.song.setCollideWorldBounds(true)
            this.scene.scene.song.body.setAllowGravity(false)
            this.scene.scene.isPlaying = true;
            setTimeout(() => {
                this.scene.scene.isPlaying = false;
                this.song.destroy();
            }, 4000);
        }

        function regenSeeds(player, seedBag) {
            this.scene.scene.seedCount += 10;
            seedBag.destroy();
        }

        function switchEnemy(enemy, collider) {
            if (enemy.turn == false) {
                enemy.turn = true;
            }
        }

        function damages(player, enemy) {
            if (!this.scene.scene.invicible) {
                this.scene.scene.invicible = true;
                this.scene.scene.hp -= 1;
                setTimeout(() => {
                    this.scene.scene.invicible = false;
                }, 3000);
            }
        }

        function passageScene1() {
            this.scene.start("sceneTest2", { sceneQuitee: "scene3", seedCount: this.seedCount, intro: this.intro, aPartition: this.aPartition, zPartition: this.zPartition, ePartition: this.ePartition, hp: this.hp });
        }

        function dialoguePetitSinge(player, hitbox) {
            this.scene.scene.activeDialogue = true;
            hitbox.destroy();
            this.scene.scene.intro = false;
            this.scene.scene.currentDialogue = this.scene.scene.dialoguePetitSinge;

        }

        this.timer = 0;
        this.timer2 = 0;
        this.lastX = 0;

    }

    update(time, delta) {

        if (this.hp <= 0) {
            this.hp = 0;
            this.scene.start("zone2", { seedCount: this.seedCount, intro: this.intro, playerY: this.player.y, aPartition: this.aPartition, zPartition: this.zPartition, ePartition: this.ePartition, hp: 3 });
        }

        // this.xText.setText(this.player.x);

        // this.yText.setText(this.player.y);

        this.seedText.setText(this.seedCount);

        this.hpText.setText(this.hp);

        if(this.hp == 3){
            this.hpBar.setTexture('hp3');
        }
        if(this.hp == 2){
            this.hpBar.setTexture('hp2');
        }
        else if(this.hp == 1){
            this.hpBar.setTexture('hp1');
        }

        if(this.zPartition){
            this.uiPartitions.setTexture('uiPartitions2');
        }
        if(this.ePartition){
            this.uiPartitions.setTexture('uiPartitions3');
        }

        this.carnivorous.children.each(function (plant) {
            if (this.lastDirection == "right") {
                plant.setVelocityX(800);
            }
            else if (this.lastDirection == "left") {
                plant.setVelocityX(-800);
            }

        }, this);

        this.enemies.children.each(function (enemy) {
            enemy.lastTurnTimer += delta;
            if (enemy.turn && enemy.lastTurnTimer > 2000) {
                if (enemy.right) {
                    enemy.right = false;
                }
                else {
                    enemy.right = true;
                }
                enemy.body.velocity.x *= -1;
                enemy.lastTurnTimer = 0;
            }
            else {
                enemy.turn = false;
            }
            if (enemy.right) {
                enemy.setVelocityX(600);
                enemy.setTexture('enemy')
            }
            else {
                enemy.setVelocityX(-600);
                enemy.setTexture('enemyLeft')
            }

        }, this);


        this.flying_enemies.children.each(function (enemy) {
            enemy.lastTurnTimer += delta;
            if(enemy.turn && enemy.lastTurnTimer > 2000){
                if(enemy.up){
                    enemy.up = false;
                }
                else{
                    enemy.up = true;
                }
                enemy.lastTurnTimer = 0;
            }
            else{
                enemy.turn = false;
            }
            if(enemy.up){
                enemy.setVelocityY(600);
            }
            else{
                enemy.setVelocityY(-600);
            }

        }, this);

        if (this.cursors.left.isDown && !this.scene.scene.isPlaying && !this.scene.scene.activeDialogue) {//si la touche gauche est appuyée
            this.lastDirection = "left";
            this.player.setVelocityX(-900);//alors vitesse négative en X
            this.player.anims.play('left', true);//et animation => gauche
        }
        else if (this.cursors.right.isDown && !this.scene.scene.isPlaying && !this.scene.scene.activeDialogue) {//si la touche droite est appuyée
            this.lastDirection = "right";
            this.player.setVelocityX(900);//alors vitesse positive en X
            this.player.anims.play('right', true);//et animation => droite
        }
        else { // sinon
            this.player.setVelocityX(0); //vitesse nulle
            this.player.anims.play('turn', true);
            // this.player.anims.play('turn');//animation fait face caméra
        }

        if (this.cursors.up.isDown && this.player.body.onFloor() && !this.scene.scene.isPlaying) {
            this.player.setVelocityY(-1200);
            setTimeout(() => {
                this.player.setVelocityY(-1000);
            }, 200);
        }

        if (this.cursors2.Z.isDown && this.zPartition && this.player.body.onFloor() && !this.scene.scene.isPlaying && !this.scene.scene.activeDialogue) {
            this.flowerRiff.play();
            this.scene.scene.plantType = "flower"
            this.playSong()
        }

        if (this.cursors2.A.isDown && this.aPartition && this.player.body.onFloor() && !this.scene.scene.isPlaying && !this.scene.scene.activeDialogue) {
            this.carnivorousRiff.play();
            this.scene.scene.plantType = "carnivorous"
            this.playSong()
        }


        if (this.cursors2.E.isDown && this.ePartition && this.player.body.onFloor() && !this.scene.scene.isPlaying && !this.scene.scene.activeDialogue) {
            this.ivyRiff.play();
            this.scene.scene.plantType = "ivy"
            this.playSong()
        }

        if (this.player.body.velocity.y > 800) {
            this.player.setVelocityY(300);
        }

        if (this.scene.scene.isPlaying) {
            this.song.scale += 0.045;
            this.player.anims.play('bass', true);

        }

        if (this.cursors.space.isDown && !this.scene.scene.isThrowing && !this.scene.scene.isPlaying && this.scene.scene.seedCount > 0) {
            this.scene.scene.isThrowing = true;
            this.seed = this.scene.scene.seeds.create(this.player.x, this.player.y, 'seed');
            this.seed.body.setSize(70, 70);
            // this.seed.body.setMaxVelocityY(600);
            this.seed.setCollideWorldBounds(true);
            this.scene.scene.seedCount -= 1;
            if (this.lastDirection == "right") {
                this.seed.setVelocityY(-1200);
                this.seed.setVelocityY(-1000);
                this.seed.body.setMaxVelocityY(1000);
                this.seed.setVelocityX(800);
                setTimeout(() => {
                    this.scene.scene.isThrowing = false;
                }, 2000);

            }
            if (this.lastDirection == "left") {
                this.seed.setVelocityY(-1200);
                this.seed.setVelocityY(-1000);
                this.seed.body.setMaxVelocityY(1000);
                this.seed.setVelocityX(-800);
                setTimeout(() => {
                    this.scene.scene.isThrowing = false;
                }, 2000);

            }

        }

        if (this.activeDialogue) {
            const buttonDDown = Phaser.Input.Keyboard.JustDown(this.keyD);
            this.dialogueBox.setAlpha(1);
            this.dialogueText.setAlpha(1);
            this.dialogueText.setText(this.currentDialogue[this.stepDialogue]);
            if (buttonDDown) {
                if (this.stepDialogue < this.currentDialogue.length - 1) {
                    this.stepDialogue += 1;

                } else {
                    this.activeDialogue = false;
                    this.stepDialogue = 0;
                }
            }
        }
        else {
            this.dialogueBox.setAlpha(0);
            this.dialogueText.setAlpha(0);
        }
    }
}
