;(function(NS) {

	// proto code
	var player = null,
		health = 3,
		score = 0,
		highscore = 0,
		collectibles = 0;

	function initListeners () {
		$('.js-play-again-button').click(function () {
			NS.startGame();
		});

		// override stage's onClicked method
		stage.onClicked = function () {
			if(player.is_on_ground) {
				player.jump();
			}
		};

		// Keyup listeners
		document.addEventListener('keyup', function(e) {
			// Escape key
			if(e.which === 27) {
				PAUSE ^= 1;
			}
			else if(e.which == 13) {
				NS.startGame();
				e.preventDefault();
			}
		});
	}


	function initSounds() {
		NS.Globals.sounds.hit = document.getElementById('hit');
		NS.Globals.sounds.note1 = document.getElementById('note1');
		NS.Globals.sounds.note2 = document.getElementById('note2');
		NS.Globals.sounds.note3 = document.getElementById('note3');
		NS.Globals.sounds.note4 = document.getElementById('note4');
		// NS.sounds.shoot = document.getElementById('shoot');
	}

	
	NS.init = function () {
		log('game initialized');
		initSounds();
		initListeners();

		NS.Globals.player_x = ~~(W / 4);
		NS.Globals.ground_height = ~~(H * 0.5);

		player = new NS.Player();
		player.is_under_user_control = true;
		addChild(player);

		// addChild(new NS.BlackCurtain());
		
		// addChild(emitter);

		// add level manager
		addChild(level_manager);
		
		PAUSE = false;

		// get saved data and populated stats
		var data = NS.SaveManager.getData();
		collectibles = data.collectibles;
		highscore = data.highscore;
		$('.js-highscore').html(highscore);
		$('.js-collectibles').html(collectibles);

		NS.startGame();
	};

	NS.onLevelComplete = function () {
		score = level_manager.getScore();
		if(score > highscore) {
			highscore = score;
			$('.js-highscore').text(highscore + '');
		}
		NS.saveScore();
	};

	NS.stopGame = function (amount) {
		score = level_manager.getScore();
		if(score > highscore) {
			highscore = score;
			$('.js-highscore').text(highscore + '');
		}

		NS.saveScore();
		level_manager.reset();
		// remove bullets, asteroids and bonus items
		var entities = getAllOfType('obstacle collectible');
		for (var i = entities.length - 1; i >= 0; i--) {
			removeChild(entities[i]);
		}
		$('body').addClass('gameover');
		NS.Globals.state = 'STOPPED';
	};

	NS.startGame = function (amount) {
		log(NS.Globals.state);
		if(NS.Globals.state == 'PLAYING') return;

		$('body').removeClass('gameover');
		level_manager.startLevel(1);
		health = 3;
		score = 0;
		$('.hud--life').removeClass('l1 l2');
		NS.Globals.state = 'PLAYING';
	};

	NS.updateHealth = function (amount) {
		health += amount;
		NS.Globals.sounds['hit'].play();

		$('.hud--life')
			.removeClass('l1')
			.removeClass('l2')
			.addClass('l' + health);
		if(!health) {
			this.stopGame();
		}
	};

	NS.takeCollectible = function () {
		collectibles++;
		$('.js-collectibles').text(collectibles + '');
		NS.Globals.sounds['note' + getRandomFromList([1, 2, 3, 4])].play();
	};
	
	NS.createExplosion = function (x, y, level, color) {
		var num_particles = 15 + (level > 2 ? level * 8 : 0),
			particle = null;
		while (num_particles--) {
			particle = new NS.ExplosionParticle(x, y, level, color);
			addChild(particle);
		}
		particle = null;
	};


	NS.saveScore = function () {
		var data = NS.SaveManager.getData();
		data.collectibles = collectibles;

		// save global highscore
		if(score > data.highscore) {
			data.highscore = score;
		}

		// // save level highscore
		// if(!data.level_stats[current_level]) {
		// 	data.level_stats[current_level] = $.extend({}, NS.dummy_save_data.level_stats['1']);
		// }
		// if(level_score > data.level_stats[current_level].highscore) {
		// 	data.level_stats[current_level].highscore = level_score;
		// }
		NS.SaveManager.saveData(data);
	};


})(window.game = window.game || {});


window.addEventListener('load', function () {
	// init engine
	init('c', undefined, 300);
});
