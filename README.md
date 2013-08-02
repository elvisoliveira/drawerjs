### [Drawerjs](http://codepen.io/rolandjitsu/pen/CgmGd)

A simple off canvas navigation build with JavaScript &amp; CSS3. It's library agnostic, provides support for jQuery and AMD and it's simple to set up and use.

#### Documentaion


##### Usage

There are some prerequisites in order to instantiate the **Drawerjs** class or to initiate the **jQuery** plugin. It needs the following HTML structure:

``` html
<body>
	<nav id="drawerjs-navigation" class="drawerjs-navigation">
	    <ul>
	        <li><a href="#">Dashboard</a></li>
	        <li><a href="#">Statistics</a></li>
	        <li><a href="#">Milestones</a></li>
	        <li><a href="#">Settings</a></li>
	        <li><a href="#">Logout</a></li>
	    </ul>
	</nav>
	<section id="drawerjs-content" class="drawerjs-navigation"></section>
</body>
```
Using the `drawerjs-navigation` and `drawerjs-content` ids isn't required, but if you choose to, you will need to specify that in the options. As far as the classes go, it needs a minimum setup:

``` css
body {
    visibility: hidden;
}

.drawerjs-navigation {
	position: absolute;
}
```
At this point you can instantiate the class:

``` js
var drawerjs = new Drawerjs(document.body);
```
The navigation should now be working.

##### Options

As mentioned above, you can change the default ids to the ids that you want, for that there are a few options available:

- **content** *String / DOM Object* (Default: "#drawerjs-content") - with this option you specify the *id* o the content. There is a built in selector method that will query the DOM and get the id that you have passed, if you will not send an id you must query it and send the DOM object:

``` js
var drawerjs = new Drawerjs(document.body, {
	
	content: document.getElementsByClassName("content")
});

```
- **offset** *Integer* (Default: 120) - this options will set the amount of pixels that will be visible from the content when the navigation is visible;
- **navigation** *String / DOM Object* (Default: "#drawerjs-navigation") - with this option you specify the *id* o the navigation. The behavior is the same as the *content* option has:

``` js
var drawerjs = new Drawerjs(document.body, {
	
	navigation: document.getElementsByClassName("navigation")
});
```

- **speed** *Integer* (Default: 250) - this options sets the speed of the animation when the navigation is closed or opened;
- **onOpen** *Function* - it's a function that it's triggerd each time the navigation is opened (when the content is slided out), but it is not triggered if the content slides back in case it's not dragged more than half the viewport width:

``` js
var drawerjs = new Drawerjs(document.body, {
	
	onOpen: function () {}
});
```

- **onClose** *Function* - the same as the *onOpen* option, but with oposite behavior:

``` js
var drawerjs = new Drawerjs(document.body, {
	
	onOpen: function () {}
});
```

- **transitioned** *Function* - this options allows you to do stuff whenever the content is transitioned, no matter if it's pulled back or closed / opened:

``` js
var drawerjs = new Drawerjs(document.body, {
	
	transitioned: function () {}
});
```
#### Compatibility

This library is using Flexbox, it is not supported by old browsers, check [Flexbox](http://caniuse.com/flexbox) for more information about which browsers do support it.