---
layout: post
title: 'Tutorial: Win8 HTML5 app development- Part 2'
---

Finally I got the opportunity to write the second part of the tutorial series on HTML5 game development for Windows 8.
The first part [can be read here](/blog/2012/09/win8-html5-dev-part1/).

Okay, so lets see what are we going to do today.
- First we'll port my game [Bouncy](http://kushagragour.in/Bouncy_HTML5/) to a Visual Studio 2012 project
- Add a paddle below he ball which will be controlled by <a href="http://msdn.microsoft.com/en-us/library/windows/apps/windows.devices.sensors.inclinometer" trget="_blank">Inclinometer</a> sensor

Lets begin!

###PART 2: Writing your first sensor enabled Windows Store game###

To begin with the porting, we need the game source first which we'll fetch by cloning the [game repository on github](https://github.com/chinchang/Bouncy_HTML5). I am using terminal to do so but you could use any possible way to clone it. If you are using the terminal too, run the following command:

{% highlight bash %}
git clone git@github.com:chinchang/Bouncy_HTML5.git
{% endhighlight %}

After you clone the repo, you should have a directory called **Bouncy_HTML5** on your system containing 4 files out which we require <code>index.html</code> and <code>game.js</code>.

####Porting game to Visual Studio:####

Now lets fire up Visual Studio 2012. Once you have it running create a new project and select the **Javascript > Windows Metro style > Blank App** template for your project.

[<img src="/images/html5-sensor-tut-ss1.png" alt="Blank App" title="Select a Blank App">](/images/html5-sensor-tut-ss1.png)

This will create a basic setup for an Windows Store HTML5 app ready to run on Window 8. You can check out the files that are created by the template for you in the right solution panel:

[<img src="/images/html5-sensor-tut-ss2.png" alt="Solution panel" title="Solution panel">](/images/html5-sensor-tut-ss2.png)

Our next step is to integrate our 2 files into the project. So basically first we integrate the markup (<code>index.html</code>) and then the JavaScript (<code>game.js</code>).

Open the <code>default.html</code> file present in your Visual Studio project and delete all the HTML present inside the <code>BODY</code> tag.

Now open up <code>Bouncy_HTML5/index.html</code> in your favourite text-editor (BTW, I use the awesome [Sublime Text 2](http://www.sublimetext.com/)).
From there you only need to copy 2 lines (Yeah, just 2. Rest is all the extra stuff on the page) into <code>default.html</code>. 


Copy the following line:

{% highlight html linenos %}
<canvas id="c" width="640" height="480" style=" border: 1px solid #AAA;"></canvas>
{% endhighlight %}

and paste it inside the <code>BODY</code> tag.

Now back in the <code>index.html</code> file copy the following:

{% highlight html linenos %}
<script type="text/javascript" src="game.js"></script>
{% endhighlight %}

and paste it where other <code>SCRIPT</code> tags are present in <code>default.html</code>. One thing you need to change here is the script path as our JavaScript file will now go in a sub-folder named **js**. Change the line to:

{% highlight html linenos %}
<script type="text/javascript" src="/js/game.js"></script>
{% endhighlight %}

We are done with our HTML. Over to Javascript, developer.

Next we'll add <code>Bouncy_HTML5/game.js</code> to our project. Right-click on the **js** folder in the solution pane. Select **Add > Existing Item** then browse to <code>Bouncy_HTML5/game.js</code> and click Add as shown below:

[<img src="/images/html5-sensor-tut-ss3.png" alt="Add file to project" title="Add file to project">](/images/html5-sensor-tut-ss3.png)

Congratz, that file has now become part of your project. Now you can close the text editor and you have nothing to do with the Bouncy_HTML5 folder. You can delete it if you wish.

If you try to run the project by pressing F5, the game will run just fine. But we'll make a small tweak here.

If you happen to notice in <code>game.js</code>, we call a function called <code>init()</code> on window load event (Line 193). But in our new project we don't explicitly need to listen to window load event. In <code>default.js</code> file that was created with the project you'll see a code that looks like this around Line 13:

{% highlight javascript linenos %}
// TODO: This application has been newly launched. Initialize
// your application here.
{% endhighlight %}

This is essentially a position where we can execute any of our initialization code. But the issue here is that the <code>init()</code> function is inside an anonymous function and hence not available to outer world. It has to be first put in global scope to be able to call from <code>default.js</code>.

Back in <code>game.js</code>, modify the following line:

{% highlight javascript linenos %}
window.addEventListener('load', init);
{% endhighlight %}

to

{% highlight javascript linenos %}
// create a global game object
window.game  = window.game || {};

// set a reference to init function
window.game.init = init;
{% endhighlight %}

So now the function is accessible in global scope using <code>window.game.init()</code>

Switch back to <code>default.js</code> and call the <code>init()</code> function at the place we saw earlier. Your <code>onactivated</code> function should look like this now:


{% highlight javascript linenos %}
app.onactivated = function (args) {
    if (args.detail.kind === activation.ActivationKind.launch) {
        if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
            // TODO: This application has been newly launched. Initialize
            // your application here.
            window.game.init();
        } else {
            // TODO: This application has been reactivated from suspension.
            // Restore application state here.
        }
        args.setPromise(WinJS.UI.processAll());
    }
};
{% endhighlight %}

To verify your change, run the game by pressing F5 and it should work as before.

####Adding the paddle:####
Now that our game is completely ported we'll add paddle to it which will use the **Inclinometer** sensor to move.

As this tutorial doesn't focus on game development, rather using sensors for Windows Store game, we'll not dive into the code to implement the paddle. Simply download the new <code>game-with-paddle.js</code> file and replace the <code>game.js</code> code with its code:

<a href="/uploads/2012/game-with-paddle.js" target="_blank" class="button button-big">Download new game.js</a>

Run your project and you should see a paddle on the screen and the balls bouncing on it. Lets make our paddle move, shall we?

####Enabling Inclinometer to move paddle:####
All the sensors in Windows Runtime (WinRT) are available under the namespace <code>Windows.Devices.Sensors</code>. The class we need to use is <code>Windows.Devices.Sensors.Inclinometer</code>.

In <code>game.js</code>, modify the following line:

{% highlight javascript linenos %}
var ball1, ball2, paddle;
{% endhighlight %}

to

{% highlight javascript linenos %}
var ball1, ball2, paddle, sensor, max_roll = 20;
{% endhighlight %}

which creates a new variable to reference our sensor.

Next, in the <code>init()</code> function, put the following lines:

{% highlight javascript linenos %}
// get the reference to the Inclinometer sensor
try {
    sensor = Windows.Devices.Sensors.Inclinometer.getDefault();
}
catch (e) {
    console.log("You don't have sensor support");
}
{% endhighlight %}

At this point we have initialized the Inclinometer. Now we need to read it to make the paddle move. Modify the paddle's <code>update()</code> function to following:

{% highlight javascript linenos %}
Paddle.prototype.update = function (dt) {
    if (sensor) {
        var reading = sensor.getCurrentReading();
        if (reading) {
            this.x = canvas.width / 2 * (1 + reading.rollDegrees / max_roll);
        }
    }
};
{% endhighlight %}

All we do above is read the sensor's present reading (we are using the device roll amount here) and position the paddle according to it.

Run your project now and try tilting your Windows 8 device. Voila! You can now control the paddle using the device's Inclinometer sensor (if one exists). You can download the Visual Studio project at the following link:

<a href="/uploads/2012/bouncy-sensor.zip" target="_blank" class="button button-big">Download Project</a>

We are done with our first sensor enabled game ready to be put up on the Windows Store. If I find some more interesting stuff about Windows Store app development, I'll share it in my next post :) Till then, here is a screenshot of the game in action:

<img src="/images/html5-sensor-tut-ss4.png" alt="Game in action">

So go now and make your games sensor enabled and rule the world!

Cheers!