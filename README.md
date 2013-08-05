## [Drawerjs](http://codepen.io/rolandjitsu/pen/CgmGd)
=======================================================
> A simple off canvas navigation built with JavaScript &amp; CSS3. It's library agnostic, provides support for jQuery and AMD and it's simple to set up and use.

### Documentaion
-----------------
To have a brief idea about what this library does, I'll describe it to you in a few words. If you have an iOS device or Google Maps on your mobile device you have definitely used the left side navigation. The one that you touch and drag to reveal it's contents. Well, this library does pretty much the same thing, it turns the layout it's required to have into a sliding navigation.

It could also be used a simple click and open navigation too as the library provides two API methods that you can use to open / close the menu manually.

#### Usage
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
There you go, you got yourself an off canvas navigation.

#### Options
As mentioned above, you can change the default ids to the ids that you want, for that there are a few options available:

+ **content** *String / DOM Object* (Default: "#drawerjs-content") - with this option you specify the *id* o the content. There is a built in selector method that will query the DOM and get the id that you have passed, if you will not send an id you must query it and send the DOM object:

``` js
var drawerjs = new Drawerjs(document.body, {
	content: document.getElementsByClassName("content")
});
```
+ **offset** *Integer* (Default: 120) - this options will set the amount of pixels that will be visible from the content when the navigation is visible;
+ **navigation** *String / DOM Object* (Default: "#drawerjs-navigation") - with this option you specify the *id* o the navigation. The behavior is the same as the *content* option has:

``` js
var drawerjs = new Drawerjs(document.body, {
	navigation: document.getElementsByClassName("navigation")
});
```
+ **speed** *Integer* (Default: 250) - this options sets the speed of the animation when the navigation is closed or opened;
+ **onOpen** *Function* - it's a function that it's triggerd each time the navigation is opened (when the content is slided out), but it is not triggered if the content slides back in case it's not dragged more than half the viewport width:

``` js
var drawerjs = new Drawerjs(document.body, {
	onOpen: function () {}
});
```
+ **onClose** *Function* - the same as the *onOpen* option, but with oposite behavior:

``` js
var drawerjs = new Drawerjs(document.body, {
	onOpen: function () {}
});
```
+ **transitioned** *Function* - this options allows you to do stuff whenever the content is transitioned, no matter if it's pulled back or closed / opened:

``` js
var drawerjs = new Drawerjs(document.body, {
	transitioned: function () {}
});
```

#### API
Along with the options, the class exports two API methods as it follows:

+ **open** *Function* - use this method to open the navigation (slide the content out) after you have instantiated the class:

``` js
var drawerjs = new Drawerjs(document.body);
drawerjs.open();
```
+ **close** *Function* - the same as the *open* method, you can use this one after the class is instantiated and it can close the navigation (slide the content in):

``` js
var drawerjs = new Drawerjs(document.body);
drawerjs.close();
```

#### Using jQuery / Zepto
Drawerjs provides a jQuery plugin if you prefer to use it the jQuery way, though you will need to include `jquery.drawerjs.js` as well after you include the class:

``` js
$("body").drawerjs();
```
You can still use the library the same way as using it without jQuery:

``` js
$("body").drawerjs({
	speed: 450,
	offset: 80,
	onOpen: function () {}
});
```
Calling the API methods would be the same as initiating the plugin, but instead of passing the options object you will pass a string with the API method:

``` js
$("body").drawerjs("open");
```
The options can also be overwritten after you load the library and the jQuery plugin as such:

``` js
$.fn.drawerjs.defaults = {
	speed: 350
};
```

#### Using RequireJS
There is also support for AMD, you can use RequireJS to load your module async, just do not forget to add it to the `paths` object in case you use bower to install it and it is not located under the `baseUrl`:

``` js
requirejs.config({
	paths: {
		"drawerjs": "components/drawerjs.js"
	}
});
```

### Installing
---------------
The library can be downloaded directly from Git or it can be installed with [Bower](http://bower.io/):

``` bash
bower install drawerjs
```

### Compatibility
------------------
Currently this library is using [Flexbox](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Flexible_boxes) for layout (it is not supported by old browsers, check [Caniuse](http://caniuse.com/flexbox) for more information about which browsers do support it), [2D](http://caniuse.com/transforms2d) or [3D](http://caniuse.com/transforms3d) [transforms](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_transforms) to animate the content on pullback / close / open.

The library is also making use of some javascript native methods like [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener) which is not supported in all browsers. To see which browser supports these features, check the table bellow:

| Browser            | Flexbox *(Old)* | Flexbox *(New)* | addEventListener | transition | transforms *(2D)* | transforms *(3D)* |
| ------------------ |:---------------:|:---------------:|:----------------:|:----------:|:-----------------:|:-----------------:|
| Chrome             | 4.0 - 20.0      | 21.0 +          | 1.0 +            | 4.0 +      | 4.0 +             | 12.0 +            |
| Firefox            | 2.0 - 18.0      | 22.0 +          | 1.0 +            | 4.0 +      | 3.5 +             | 10.0 +            |
| Safari             | 3.1 - 6.1       | 7.0 +           | 1.0 +            | 3.1 +      | 3.1 +             | 4.0 +             |
| Opera              | &times;         | 12.1 +          | 7.0 +            | 10.5 +     | 10.5 +            | 15.0 +            |
| IE                 | 10.0 *(Hybrid)* | 11.0 +          | 9.0 +            | 10.0 +     | 9.0 +             | &times;           |
| iOS Safari         | 3.2 - 6.1       | 7.0 +           | 1.0 +            | 3.2 +      | 3.2 +             | 3.2 +             |
| Opera Mini         | &times;         | &times;         | 7.1 +            | &times;    | &times;           | &times;           |
| Android Browser    | 2.1 - 4.2       | &times;         | 1.0 +            | 2.1 +      | 2.1 +             | 3.0 +             |
| Blackberry Browser | 7.0             | 10.0 +          | 7.0 +            | 7.0 +      | 7.0 +             | 7.0 +             |
| Opera Mobile       | &times;         | 12.1 +          | 6.0 +            | 10.0 +     | 11.0 +            | 14.0 +            |
| Android Chrome     | &times;         | 28.0 +          | 28.0 +           | 28.0 +     | 28.0 +            | 28.0 +            |
| Firefox Android    | &times;         | 22.0 +          | 22.0 +           | 22.0 +     | 22.0 +            | 22.0 +            |

Hence the class only supports:

+ **Chrome** *4.0 +*
+ **Firefox** *4.0 +*
+ **Safari** *3.1 +*
+ **Opera** *12.1 +*
+ **IE** *10.0 +* (Support for IE 9 might be added if it won't add too much weight to the class)
+ **iOS Safari** *3.2 +*
+ **Android Browser** *2.1 +*
+ **Blackberry Browser** *7.0 +*
+ **Opera Mobile** *12.1 +*
+ **Android Chrome** *28.0 +*
+ **Firefox Android** *22.0 +*

### Bugs / Feature Requests
----------------------------
I'm still working on this plugin, trying to make the code cleaner and with some comments, organizing it and increasing performance. I'm working on a better browser support and I plan on adding support for scrolling inside the menu and the content without affecting one another. Support for IE 9.0 might be added (due to the fact that there is a large usage of Windows Phones that use that version of IE) if it won't add up to much weight to the plugin.

Please report any bugs or feature requests on the [issues](https://github.com/rolandjitsu/drawerjs/issues) page.