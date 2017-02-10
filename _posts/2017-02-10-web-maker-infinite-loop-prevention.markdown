---
layout: post
title: "Web Maker: Preventing Infinite Loops"
---

## The Problem

When you write JavaScript in [Web Maker](https://kushagragour.in/lab/web-maker), it renders that JavaScript inside the preview window in realtime. What this means is in case you using any loop structure in your code, there will probably be a point when you mid way defining your loop variables, conditions, variant etc. And at that point if Web Maker renders your JavaScript, it would result in an infinite loop. Lets see with an example. Suppose I want to write a for loop to iterate 10 times, I'll start with

```
for (var i = 0; i<10; [cursor_here]) {
}
```

Note that my cursor would be where it says `[cursor_here]` and I am still defining my loop and going to write `i++` there. But as we render in realtime, this incomplete code would get executed in preview, resulting in an infinite loop.

Therefore we need a way to prevent such intermediate incomplete loops from running infinitely and choking the browser.

## Solution

There is a [lot of discussion on the Web](http://mca.nowgray.com/2017/01/can-runtime-environment-detect-infinite.html) regarding how difficult it is to detect an infinite loop in runtime, simply because any runtime cannot actually diffrentiate between a normal loop and one that is going to run infinitely. There are some analyzers that try to solve this issue but static analysis can only do so much.

The approach Web Maker takes to solve this is by keeping a check on the time spent inside a loop. To be specific, I check if the loop isn't taking more than 1 second. Otherwise its marked as an infinite loop. To be able to keep track of this time, we need to have a time check inside the loop and hence this requires changing the actual loop code, also called as [Code Instrumentation](https://en.wikipedia.org/wiki/Instrumentation_(computer_programming)).

So if we have a code like this:

```
for ( var i = 0; i < 10;) {
}
```

After our instrumentation, it should change to:

```
var startTime = Date.now();
for ( var i = 0; i < 10;) {
	if (Date.now() - startTime > 1000) { break; }
}
```

To analyze a piece of code, we need a JavaScript parser. I used Esprima for that. Lets see how we can use Esprima to instrument our code.

### Detecting a loop

Esprima converts a string of JavaScript code into an [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST), which is basically a tree like structure representing the code snippet.

```
function instrumentCode(code) {
	var ast = esprima.parse(code);
}
```

To get a sense of what an AST looks like, lets run esprima on the following code:

```
var foo = 3;
for (var i = 0; i < 10; i++) {}
```

This is what we'll get:

![](/images/ast.png)

Notice how the return AST is a repeating nested array structure (`body` inside `body`), with each identifiable unit as an instance of some class. Eg. `VariableDeclaration`, `ForStatement` etc. This is something we can easily traverse using recursion, like so:

```
function processAst(ast) {
	var currentElement;
	// If this ins't actual body, recurse with the body
	if (!Array.isArray(astBody)) {
		processAst(astBody.body);
		return;
	}
    // Traverse the body
    for (var i = ast.length; i--;) {
    	var currentElement = ast[i];
    }
}
function instrumentCode(code) {
	var ast = esprima.parse(code);
    processAst(ast);
}
```

With the above code in place, we'll keep getting different syntax structures in `currentElement`. Next, we check them and inject the actual loop protection code.

### Injecting the loop protection checks

We are concerned when `currentElement` is a `for`, `while` or `do-while` loop. This can be checked by simply testing `currentElement.type`. Lets add that.

```
function processAst(ast) {
	var currentElement;
	// If this ins't actual body, recurse with the body
	if (!Array.isArray(astBody)) {
		processAst(astBody.body);
		return;
	}
    // Traverse the body
    for (var i = ast.length; i--;) {
    	var currentElement = ast[i];
        if (currentElement &&
        	currentElement.type === 'ForStatement' ||
            currentElement.type === 'WhileStatement' ||
            currentElement.type === 'DoWhileStatement') {
            // We got a loop!
        }
        // Recurse on inner body
        if (currentElement.body) {
        	processAst(currentElement.body);
        }
    }
}
```

Next we need two of our statements to be injected in AST syntax. For that we can again use esprima. Once we covert the statements into AST objects, its just a matter of adding them to the right `body` in our AST.

```
if (currentElement &&
    currentElement.type === 'ForStatement' ||
    currentElement.type === 'WhileStatement' ||
    currentElement.type === 'DoWhileStatement') {

    var ast1 = esprima.parse('var myvar = Date.now();');
    var ast2 = esprima.parse('while(a){if (Date.now() - myvar > 1000) { break;}}');
    var insertionBlocks = {
        before: ast1.body[0],
        inside: ast2.body[0].body.body[0]
    };
}
```

Notice, that we have assigned the current time in `myVar`. Now there could be multiple loops (even nested) in a single code snippet and they all need to be handled with their unique variables. So we replace the variable names in our insertion blocks with a 3 digit random string:

```
if (currentElement &&
    currentElement.type === 'ForStatement' ||
    currentElement.type === 'WhileStatement' ||
    currentElement.type === 'DoWhileStatement') {

    var ast1 = esprima.parse('var myvar = Date.now();');
    var ast2 = esprima.parse('while(a){if (Date.now() - myvar > 1000) { break;}}');
    var insertionBlocks = {
        before: ast1.body[0],
        inside: ast2.body[0].body.body[0]
    };
    randomVariableName = '_' + generateRandomId(3);
    insertionBLocks.before.declarations[0].id.name = insertionBLocks.inside.test.left.right.name = randomVariableName;
}
```

All that is left now is to insert the insertion blocks at right places:

```
if (currentElement &&
    currentElement.type === 'ForStatement' ||
    currentElement.type === 'WhileStatement' ||
    currentElement.type === 'DoWhileStatement') {

    var ast1 = esprima.parse('var myvar = Date.now();');
    var ast2 = esprima.parse('while(a){if (Date.now() - myvar > 1000) { break;}}');
    var insertionBlocks = {
        before: ast1.body[0],
        inside: ast2.body[0].body.body[0]
    };
    randomVariableName = '_' + generateRandomId(3);
    insertionBLocks.before.declarations[0].id.name = insertionBLocks.inside.test.left.right.name = randomVariableName;

    // Insert time variable assignment as first child in the body array.
    ast.splice(i, 0, insertionBLocks.before);

    // If the loop's body is a single statement, then convert it into a block statement
    // so that we can insert our conditional break inside it.
    if (!Array.isArray(el.body)) {
    	currentElement.body = {
        	body: [ el.body ],
        	type: 'BlockStatement'
      	};
    }

    // Insert the `If` Statement check
    currentElement.body.body.unshift(insertionBLocks.inside);
}
```

And we are done.

You can also see the actual Web Maker [source code for this logic](https://github.com/chinchang/web-maker/blob/master/src/utils.js).

