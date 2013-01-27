;(function (NS) {

	/**
	 * Main player
	 */
	function Player() {
		this.type = 'player';
		this.layer = 4;
		this.speed_x = 0;
		this.speed_y = 0;
		this.max_speed = 300;
		this.acceleration = 300;
		this.rotation = 0;
		this.width = 20;
		this.height = 20;
		this.ground_y = 0;
		this.is_on_ground = true;
		this.is_under_user_control = false;

		this.hitarea = new Rectangle(-this.width / 2, -this.height / 2 , this.width, this.height);
		this.color = '#0f0';

		this.reset = function() {
			this.x = NS.Globals.player_x;
			this.y = H / 2;
			this.speed_x = 0;
			this.speed_y = 0;
		};

		this.checkCollision = function() {
			var obstacles = getAllOfType('obstacle collectible');
			for (var i = obstacles.length; i--;) {
				var obj = obstacles[i];
				if(this.hitTestObject(obj)) {
					if(obj.type === 'obstacle') {
						NS.updateHealth(-1);
						$('body')
							.css('background-color', 'hsl(0, 50%, 50%)')
							.removeClass('hit');
						setTimeout(function () {
							$('body')
								.addClass('hit')
								.css('background-color', 'hsl(0, 0%, 80%)');
						}, 10);

						$('.player').css({
							'top': this.y + 'px'
						});
						$('.callout').css({
							'top': this.y + 'px'
						}).text(getRandomFromList(['Holy cow!', 'Ouccch!!!', 'Uhh! This hurts.']));
						PAUSE = true;
						setTimeout(function () {
							$('.player, .callout').css({
								'top': '-9999px'
							});
							PAUSE = false;
						}, 800);
					}
					else if(obj.type === 'collectible') {
						NS.takeCollectible();
						NS.createExplosion(obj.x, obj.y, 3, '#0087F5');
					}
					removeChild(obj);
				}
			}
			obj = null;
		};

		this.jump = function () {
			this.is_on_ground = false;
			this.speed_y = -650;
		};
	
		this.reset();
	}

	Player.prototype = new DisplayObject();

	Player.prototype.draw = function(context) {
		context.fillStyle = "#D5544F";
		context.beginPath();
		context.rect(this.hitarea.x, this.hitarea.y, this.hitarea.width, this.hitarea.height);
		context.closePath();
		context.fill();

		if(debug) {
			context.strokeStyle = this.color;
			context.beginPath();
			context.rect(this.hitarea.x, this.hitarea.y, this.hitarea.width, this.hitarea.height);
			context.stroke();
		}
	};

	Player.prototype.update = function(dt) {
		if(!this.is_under_user_control) return;
		
		if(!this.is_on_ground) {
			this.speed_y += NS.Globals.gravity * dt;
			this.rotation += 280 * dt;
		}

		// jump
		if((keys[38] || keys[32] || keys[87] || keys[119]) && this.is_on_ground) {
			this.jump();
		}

		if(this.y > H - NS.Globals.ground_height) {
			this.speed_y = 0;
			this.y = H - NS.Globals.ground_height;
			this.rotation = 0;
			this.is_on_ground = true;
			NS.createExplosion(this.x, this.y, 1, '#D5544F');

			// make all obstacles jump proportional to distance from player
			var obstacles = getAllOfType('obstacle');
			for (var i = obstacles.length; i--;) {
				var obj = obstacles[i];
				var distance = Math.abs(obj.x - this.x);
				distance < W / 3 ? distance = W / 3 : 0;
				obj.speed_y =  W / (distance * distance) * -65000;
				obj.is_on_ground = false;
			}
		}

		this.x += this.speed_x * dt;
		this.y += this.speed_y * dt;
		
		this.checkCollision();
	};

	/**
	 * Obstacle
	 */
	function Obstacle(speed_x, time_to_collide) {
		this.type = 'obstacle';
		this.layer = 3;
		this.speed_x = speed_x || 0;
		this.time_to_collide = time_to_collide;
		this.speed_y = 0;
		this.width = 30;
		this.height = 30;
		this.is_on_ground = true;

		this.hitarea = new Rectangle(-this.width / 2, -this.height / 2 , this.width, this.height);
		this.color = '#0f0';
		this.t = 0;
	}

	Obstacle.prototype = new DisplayObject();

	Obstacle.prototype.draw = function(context) {
		context.fillStyle = "#333";
		context.beginPath();
		context.rect(this.hitarea.x, this.hitarea.y, this.hitarea.width, this.hitarea.height);
		context.closePath();
		context.fill();

		if(debug) {
			context.strokeStyle = this.color;
			context.beginPath();
			context.rect(this.hitarea.x, this.hitarea.y, this.hitarea.width, this.hitarea.height);
			context.stroke();
		}
	};

	Obstacle.prototype.update = function(dt) {
		this.t += dt;
		var fade_param = level_manager.getCurrentLevelData().fade_param;
		if(fade_param) {
			var new_alpha = Math.abs(Math.cos(Math.sin(this.t * fade_param) + this.t * fade_param));
			this.alpha = 1 - new_alpha;
		}
		else {
			this.alpha = 1;
		}

		if(!this.is_on_ground) {
			this.speed_y += NS.Globals.gravity * dt;
		}

		if(this.y > H - NS.Globals.ground_height) {
			this.speed_y = 0;
			this.y = H - NS.Globals.ground_height;
			this.is_on_ground = true;
			// NS.createExplosion(this.x, this.y, 1, '#333');
		}
		
		if(this.x < W / 8) {
			// this.alpha -= dt;
			// if(this.alpha < 0) {
				removeChild(this);
			// }
		}

		this.x += this.speed_x * dt;
		this.y += this.speed_y * dt;
	};


	/**
	 * Obstacle
	 */
	function Collectible(speed_x) {
		this.type = 'collectible';
		this.layer = 2;
		this.speed_x = speed_x || 0;
		this.speed_y = 0;
		this.width = 15;
		this.height = 15;

		this.hitarea = new Rectangle(-this.width / 2, -this.height / 2 , this.width, this.height);
		this.color = '#0f0';
	}

	Collectible.prototype = new DisplayObject();

	Collectible.prototype.draw = function(context) {
		context.fillStyle = "#0087F5";
		context.beginPath();
		context.moveTo(-this.width / 2, 0);
		context.lineTo(0, this.height / 2);
		context.lineTo(this.width / 2, 0);
		context.lineTo(0, -this.height / 2);
		context.closePath();
		context.fill();

		if(debug) {
			context.strokeStyle = this.color;
			context.beginPath();
			context.rect(this.hitarea.x, this.hitarea.y, this.hitarea.width, this.hitarea.height);
			context.stroke();
		}
	};

	Collectible.prototype.update = function(dt) {
		this.x += this.speed_x * dt;

		if(this.x < W / 4) {
			this.alpha -= dt;
			if(this.alpha < 0) {
				removeChild(this);
			}
		}
	};

	/**
	 * Black curtain
	 */
	function BlackCurtain(speed_x) {
		this.type = 'curtain';
		this.layer = 6;
		this.width = W;
		this.height = H;
		this.color = '#0f0';
		this.alpha = 0;
		this.dir = 1;
		this.t = 0;
	}

	BlackCurtain.prototype = new DisplayObject();

	BlackCurtain.prototype.draw = function(context) {
		context.fillStyle = "#111";
		context.beginPath();
		context.rect(0, 0, W, H);
		context.closePath();
		context.fill();
	};

	BlackCurtain.prototype.update = function(dt) {
		this.t += dt;
		var fade_param = level_manager.getCurrentLevelData().fade_param;
		if(fade_param) {
			var new_alpha = Math.abs(Math.cos(Math.sin(this.t * fade_param) + this.t * fade_param));
			this.alpha = new_alpha;
		}
		else {
			this.alpha = 0;
		}
	};

	/**
	 * [ExplosionParticle description]
	 * @param {[type]} x     [description]
	 * @param {[type]} y     [description]
	 * @param {[type]} level [description]
	 */
	function ExplosionParticle(x, y, level, color) {
		this.type = 'explosion-particle';
		this.x = x;
		this.y = y;
		this.level = level;
		this.color = color || '#FFF';
		this.init({x: x, y: y, level: level});
	}
	ExplosionParticle.prototype = new DisplayObject();
	ExplosionParticle.prototype.init = function(params) {
		this.x = params.x;
		this.y = params.y;
		this.alpha = 1;
		var theta = Math.random() * 360;
		this.speed = ~~(this.level * 50 + Math.random() * this.level * 70);
		this.speed_x = ~~(Math.cos(theta * pi_by_180) * this.speed);
		this.speed_y = ~~(Math.sin(theta * pi_by_180) * this.speed * 0.4);
		this.scale_x = this.scale_y = 1;
	};

	ExplosionParticle.prototype.draw = function(context) {
		context.fillStyle = this.color;
		context.fillRect(-1, -1, 15, 15);
	};

	ExplosionParticle.prototype.update = function(dt) {
		this.scale_x -= 2 * dt;
		this.scale_y -= 2 * dt;
		this.x += this.speed_x * dt;
		this.y += this.speed_y * dt;
		this.alpha -= 2 * dt;
		if(this.alpha <= 0) {
			removeChild(this);
		}
	};

	NS.Player = Player;
	NS.Obstacle = Obstacle;
	NS.Collectible = Collectible;
	NS.BlackCurtain = BlackCurtain;
	NS.ExplosionParticle = ExplosionParticle;

})(window.game = window.game || {});