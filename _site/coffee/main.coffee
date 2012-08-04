
###
  Text masked spring particles
    Author: Kushagra Gour a.k.a. Chin Chang
    @chinchang457
    Made this as a codepen experiment
###
# requestanimationframe polyfill
window.requestAnimFrame = (->
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     ||  
		  (callback) ->
			window.setTimeout callback, 1000 / 60
)();

# variables
canvas = null
ctx = null
num_particles = 850
density = 10
min_distance = 70
text_array = []
display_list = []
last_time = null
spring_constant = 0.2
damping_constant = 0.08
colors = ['#184DF4', '#F49A03', '#E01730', '#00A415']
#colors = ['#000']
W = 1000
H = 200

init = (e) ->
	canvas = document.getElementById 'c'
	ctx = canvas.getContext '2d'
	canvas.width = W
	canvas.height = H
	canvas.addEventListener 'mousemove', onMouseMove
	
	changeWord 'Kushagra Gour'

	# create particles
	if text_array.length
		for i in [0...num_particles]
			display_list.push new Particle
	animate()

getTextArray = (ox, oy, w, h) ->
	text_array = []
	data = ctx.getImageData(ox, oy, w, h).data
	for i in [0...h] by density
		for j in [0...w] by density
			linear_index = (i * w + j) * 4
			if data[linear_index + 3] isnt 0
				text_array.push {x: j, y: i}

	return text_array

onMouseMove = (e) ->
	mx = e.offsetX || e.pageX
	my = e.offsetY || e.pageY
	for child in display_list
		dx = child.x - mx
		dy = child.y - my
		d = Math.sqrt dx * dx + dy * dy
		if d < min_distance
			child.speed_x += dx * 0.05
			child.speed_y += dy * 0.05

changeWord = (str) ->
	# clear the canvas first
	ctx.clearRect 0, 0, W, H

	# draw the new text
	ctx.fillStyle = "#000"
	ctx.textBaseline = 'middle'
	ctx.textAlign = 'center'
	ctx.font = "140px Arial"
	ctx.fillText str, W/2, H/2

	# get the text points
	text_array = getTextArray 0, 0, W, H
	for child in display_list
		child.reposition()

animate = ->
	animationLoop()
	requestAnimFrame animate

animationLoop = ->
	if !last_time then last_time = (new Date).getTime()
	current_time = (new Date).getTime()
	dt = (current_time - last_time) / 1000
	last_time = current_time
	window.fps = 1 / dt
	
	draw()
	update()

draw = ->
	ctx.fillStyle = "#f8f8f8"
	ctx.fillRect 0, 0, W, H

	for child in display_list
		continue if typeof child.draw isnt 'function'
		ctx.save();
		ctx.translate child.x, child.y unless isNaN child.x or isNaN child.y 
		ctx.scale child.scale_x, child.scale_y unless isNaN child.scale_x or isNaN child.scale_y 
		ctx.globalAlpha = child.alpha unless isNaN child.alpha 
		child.draw()
		ctx.restore();

update = ->
	# update particles
	for child in display_list
		child.update() if typeof child.update is 'function'

class Particle
	constructor: (@radius = 1, @x = Math.random() * W, @y = Math.random() * H) ->
		@speed_x = 10 - Math.random() * 20
		@speed_y = 10 - Math.random() * 20
		@color = "#ff0"
		@alpha = 1
		@reposition()
		@reset()
		
	draw: ->
		#ctx.drawImage canvas2, 0, 0
		ctx.fillStyle = @color
		ctx.beginPath()
		ctx.arc 4, 4, 4, 0, Math.PI*2, true
		ctx.fill()

	update: ->
		acc_x = -spring_constant * (@x - @ox) - damping_constant * @speed_x
		acc_y = -spring_constant * (@y - @oy) - damping_constant * @speed_y
		@speed_x +=  acc_x
		@speed_y +=  acc_y
		@alpha -= 0.019
		@scale_x += 0.06
		@scale_y += 0.06
		@x += @speed_x
		@y += @speed_y

		if @alpha <= 0
			@reset()
        
	reset: ->
		@alpha = Math.random()
		@scale_x = @scale_y = 0
		@color = colors[~~(Math.random() * colors.length)]

	reposition: ->
		point = text_array[~~(Math.random() * text_array.length)]
		@ox = @x = point.x + ~~(3 + Math.random() * 6)
		@oy = @y = point.y + ~~(3 + Math.random() * 6)

window.addEventListener "load", init
#init()
