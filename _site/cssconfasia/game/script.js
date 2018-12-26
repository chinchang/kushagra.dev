var W = window.innerWidth,
	H = 500,
	GROUND = H - 200,
	SPEED = 400,
	game = new Phaser.Game(W, H),
	WIN_RATIO = 0.5;

var mainState = {
	preload: function () {
		game.stage.backgroundColor = '#71c5cf';
		game.load.image('player', 'game/player.png');
		game.load.image('block', 'game/bird.png');
		game.load.image('pipe', 'game/pipe.png');
		game.load.image('enemy', 'game/enemy.png');
		game.load.image('flag', 'game/flag.png');
		game.load.image('particle', 'game/particle.png');

		game.load.audio('hurt', 'game/hurt.wav');
		game.load.audio('flag', 'game/flag.wav');
	},

	create: function () {
		game.world.setBounds(-10, 0, W + 100, 700);
		this.currentKbdInput = '';

		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.player = this.createChar('player', 300, 45);

		this.platforms = game.add.group();
		this.platforms.enableBody = true;
		this.addPlatforms();


	  	this.emitter = game.add.emitter(game.world.centerX, 100, 100);
	    this.emitter.makeParticles('particle');
	    this.emitter.gravity = 200;
	    this.emitter.width = W;

		// HUD
		this.scoreLabel = game.add.text(20, 20, "0/0", {
			font: "70px Arial",
			fill: '#FFFFFF'
		});

		this.hurtSound = this.game.add.audio('hurt');
		this.flagSound = this.game.add.audio('flag');

		this.socket = io.connect('http://localhost:8000');
		this.initSocketListeners();
		this.initKeyboardListeners();
	},

	createChar: function (sprite, x, y, container) {
		var c = game.add.sprite(x, y, sprite);
		c.anchor.setTo(0.5, 0.5);
		game.physics.arcade.enable(c);
		c.body.gravity.y = 6000;
		// c.body.bounce = 0.5;
		return c;
	},

	initKeyboardListeners: function () {
		var self = this;

		this.cursor = this.game.input.keyboard.createCursorKeys();
		var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

		// upKey.onDown.add(this.jump, this);

		window.addEventListener('keydown', function (e) {
			if(!window.noRevealKeyboard) return;

			var c = String.fromCharCode(e.which).toLowerCase();
			self.currentKbdInput += c;

        	self.handleKbdShortcuts();
		});
	},

	handleKbdShortcuts: function () {
		var REGEX_LOAD_LEVEL = /l(\d{1})/;
			REGEX_CLEAR = /clear/;
			REGEX_RESET = /reset/;
			REGEX_WIN = /win/;
			REGEX_RATIO = /ratio(\d+)d/;

		if (this.currentKbdInput.match(REGEX_CLEAR)) {
			this.currentKbdInput = '';
        	this.showMessage('Clear');
        	this.clearLevel();
		}
		else if (this.currentKbdInput.match(REGEX_RESET)) {
			this.currentKbdInput = '';
        	this.showMessage('Reset');
        	this.player.reset(300, 100);
		}
		else if (this.currentKbdInput.match(REGEX_LOAD_LEVEL)) {
			var match = this.currentKbdInput.match(REGEX_LOAD_LEVEL);
			this.currentKbdInput = '';
			this.setLevel(match[1]);

        	this.showMessage('Level ' + match[1]);
		}
		else if (this.currentKbdInput.match(REGEX_WIN)) {
			this.currentKbdInput = '';
			this.win();
		}
		else if (this.currentKbdInput.match(REGEX_RATIO)) {
			var match = this.currentKbdInput.match(REGEX_RATIO);
			this.currentKbdInput = '';
			WIN_RATIO = match[1] / 100;
		}
	},

	handlePlayerMotion : function () {
		if(!window.noRevealKeyboard) return;

		this.player.body.velocity.x = 0;

	    if (this.cursor.left.isDown && this.player.alive) {
	        this.player.body.velocity.x = -1 * SPEED;
	    }
	    else if (this.cursor.right.isDown && this.player.alive) {
	        this.player.body.velocity.x = SPEED;
	    }
	},

	clearLevel: function () {
		if (this.enemy1) {
			this.enemy1.destroy();
			this.enemy1 = null;
		}
		else if (this.l2block1) {
			this.l2block1.destroy();
			this.l2block2.destroy();
			this.l2block1 = null;
			this.l2block2 = null;
		}
		else if (this.l3block1) {
			this.l3block1.destroy();
			this.l3block1 = null;
		}
		if (this.flag) {
			this.flag.destroy();
			this.flag = null;
		}
	},

	setLevel: function (level) {
		this.clearLevel();
		this.level = level = parseInt(level, 10);
		this.socket.emit('set-level', level);

		if (level === 1) {
			this.enemy1 = this.createChar('enemy', W - 100, 30);
		}

		if (level === 2) {
			this.l2block1 = this.createChar('pipe', W/2, 100);
			this.l2block1.body.allowGravity = false;
			this.l2block1.body.immovable = true;

			this.flag = this.createChar('flag', W/2, 50);

			this.l2block2 = this.createChar('pipe', W/2 + 60, 150);
			this.l2block2.body.allowGravity = false;
			this.l2block2.body.immovable = true;


			this.player.reset(W/2 + 60, 50);
		}

		if (level === 3) {
			this.player.reset(W/2 - 200, 100);

			this.l3block1 = this.createChar('pipe', W/2, GROUND - 50);
			this.l3block1.body.allowGravity = false;
			this.l3block1.body.immovable = true;

			this.flag = this.createChar('flag', W/2 + 200, GROUND - 50);
		}
	},

	update: function () {
		game.physics.arcade.collide(this.player, this.platforms);

		if (this.enemy1) {
			game.physics.arcade.collide(this.enemy1, this.platforms);
			this.enemy1.body.velocity.x = - 400;
			if (this.enemy1.overlap(this.player)) {
				this.hurtSound.play();
				this.showMessage('Ouch :(', this.player.x, this.player.y - 70, 'red');
				this.shakeScreen(2, 80);
				this.enemy1.reset(W - 100, 100);
			}
			if (this.block1) {
				game.physics.arcade.collide(this.block1, this.platforms);
				if(this.enemy1.overlap(this.block1)) {
					this.showMessage('SQUASH!!', this.block1.x, this.block1.y - 70);
					this.enemy1.destroy();
					this.enemy1 = null;
				}
			}
		}

		if (this.l2block1) {
			game.physics.arcade.collide(this.player, this.l2block1);
			game.physics.arcade.collide(this.player, this.l2block2);
			game.physics.arcade.collide(this.flag, this.l2block1);
		}

		if (this.l3block1) {
			game.physics.arcade.collide(this.player, this.l3block1);
			game.physics.arcade.collide(this.flag, this.platforms);
		}

		if (this.flag && this.flag.overlap(this.player)) {
			this.flagSound.play();
			this.showMessage('AWESOME!', W/2, 30);
			this.flag.destroy();
			this.flag = null;
		}

		this.handlePlayerMotion();
	},

	jump: function () {
		if (this.player.body.touching.down) {
			this.player.body.velocity.y = - 1200;
		}
		//Reveal.next();
	},

	addPlatforms: function () {
		for (var i = 0; i < W / 50; i++) {
			var platform = this.platforms.create(i * 50, GROUND, 'pipe');
			platform.anchor.setTo(0.5, 0.5);
		}

		this.platforms.setAll('body.immovable', true);
	},

	restartGame: function restartGame() {
		game.state.start('main');
	},

	win: function () {
    	this.emitter.start(true, 2000, null, 50);

    	if (this.level === 1) {
			this.block1 = this.createChar('block', this.player.x + 100, 50);
    	}

    	if (this.level === 2) {
			game.add.tween(this.l2block1).to({y: 150 }, 400).start();
    	}

    	if (this.level === 3) {
			game.add.tween(this.l3block1.scale).to({y: 0}, 500, Phaser.Easing.Cubic.InOut).start().onComplete.add(function () {
				this.l3block1.destroy();
			}, this);
		}
	},

	showMessage: function showMessage(data, x, y, color) {
		var x = x || game.rnd.integerInRange(100, W - 100),
			y = y || game.rnd.integerInRange(15, H - 80);
		var scoreLabel = game.add.text(x, y, data, {
			font: "45px Arial",
			fill: color || '#FFFFFF'
		});
		scoreLabel.anchor.setTo(0.5, 0.5);
		game.add.tween(scoreLabel.scale).from({x: 0, y: 0}, 200).to({x: 1, y: 1 }, 200).start();

		game.add.tween(scoreLabel).to({ angle: 3 }, 300, Phaser.Easing.Cubic.InOut)
    	.to({ angle: -3 }, 300, Phaser.Easing.Cubic.InOut).loop().start();

    	setTimeout(function () {
			game.add.tween(scoreLabel).to({ alpha: 0, y: scoreLabel.y - 10 }, 500, Phaser.Easing.Cubic.InOut).start().onComplete.add(function () {
    			scoreLabel.destroy();
			});
    	}, 3000);
	},

	// Credits: http://www.lessmilk.com/games/4/js/play.js
	shakeScreen: function(i, t) {
		this.game.add.tween(this.game.camera).to({y : i}, t, Phaser.Easing.Linear.None)
        .to({y : -i}, t, Phaser.Easing.Linear.None)
        .to({y : 0}, t, Phaser.Easing.Linear.None).start();

        this.game.add.tween(this.game.camera).to({x : i}, t, Phaser.Easing.Linear.None)
        .to({x : -i}, t, Phaser.Easing.Linear.None)
        .to({x : 0}, t, Phaser.Easing.Linear.None).start();
	},


	initSocketListeners: function initSocketListeners() {
		var socket = this.socket,
			self = this;

        socket.on('welcome', function (data) {
            id = data.id;
            socket.emit('set-data', {
	            name: 'Slides'
	        });
        });

        socket.on('msg', function (data) {
            console.log(data);
        });

        socket.on('submission', function (data) {
        	// console.log('Got submission: ', data)
        	self.showMessage(data);
        });

        socket.on('update-stats', function (data) {
           	self.scoreLabel.text = data.correct + '/' + data.total;
            //updatePie(data.correct, data.total);

            if (data.correct/data.total >= WIN_RATIO) {
            	self.win();
            }
        });
    }
};

game.state.add('main', mainState);
game.state.start('main');