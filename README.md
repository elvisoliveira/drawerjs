# [Drawer](http://drawerjs.rolandjitsu.com/)
> A simple off canvas navigation built with JavaScript &amp; CSS3. It's library agnostic, provides support for jQuery and AMD (RequireJS) and it's simple to set up and use.

To have a brief idea about what this library does, I'll describe it to you in a few words. If you have an iOS device and Google Maps / Facebook as native applications on your mobile device you have definitely used the left side sliding navigation. The one that you drag to reveal it's contents. Well, this library does pretty much the same thing, it turns the layout (it's required to have a certain structure for it to work, but it's described bellow) of your page into a sliding content.

It could also be used a simple click to toggle navigation too, as the library provides two API methods (see [API](https://github.com/rolandjitsu/drawerjs#api) section) that you can use to toggle the menu manually in case you want the dragging disabled or if isn't working on some device.

This library provides support for the non touch enabled devices too. By that I mean that the new Windows Phones with Windows Metro OS will not support touch, they have merged all input events (touch, pen and mouse) into just one, the [Pointer](http://msdn.microsoft.com/en-US/library/ie/hh673557.aspx), therefore support for these events has been added.

### Documentation
-----------------

#### Usage
There are some prerequisites in order to instantiate the **Drawer** class or to initiate the **jQuery** plugin. It needs the following HTML structure:

``` html
<body>
	<nav id="drawer-navigation" class="drawer-navigation">
	    <ul>
	        <li><a href="#">Dashboard</a></li>
	        <li><a href="#">Statistics</a></li>
	        <li><a href="#">Milestones</a></li>
	        <li><a href="#">Settings</a></li>
	        <li><a href="#">Logout</a></li>
	    </ul>
	</nav>
	<section id="drawer-content" class="drawer-content">
</body>
```
Using the `drawer-navigation` and `drawer-content` ids isn't required, but if you choose to, you will need to specify that in the options (see [Options](https://github.com/rolandjitsu/drawerjs#options) section). As far as the styling goes, there are no requirements, you can style the navigation and the content as you wish, jut make sure you don't overwrite some of the styles already applied when the class is instantiated (or if you do, check the [source](https://github.com/rolandjitsu/drawerjs/blob/master/src/drawer.js) code before).

At this point you can instantiate the class:

``` js
/**
 * The class needs the body element sent through when instantiated, becase it uses it to apply some of the necessary styles to make the content sliding work, if it isn't passed it will default to document.body anyway
 */

var drawer = new Drawer(document.body);
```

#### Options
I have made a few options available that can be used for various things, such as changing the default content and navigation ids, or having a callback function on close / open, read the following description to find out what options are available.

+ **content** *String / DOM Object* (Default: `#drawer-content`) - with this option you specify the *id* of the content. If you pass an id, the class will be able to query the DOM and retrieve the node for usage, otherwise (in case you have some class names instead or you prefer data attributes) you will have to query it and send the node object yourself as the value of this option:

``` js
var drawer = new Drawer(document.body, {
	content: document.getElementsByClassName("content")
});
```
+ **offset** *Integer* (Default: `120`) - this options will set the amount of pixels of content visible when the navigation is revealed;
+ **navigation** *String / DOM Object* (Default: `#drawerjs-navigation`) - with this option you specify the *id* o the navigation. The behavior is the same as the *content* option has:

``` js
var drawer = new Drawer(document.body, {
	navigation: document.getElementsByClassName("navigation")
});
```
+ **speed** *Integer* (Default: `250`) - this options sets the speed of the animation when the navigation is closed or opened;
+ **onOpen** *Function* - it's a function that it's triggerd each time the navigation is revealed in the exact moment the animation starts, but it is not triggered if the content slides back in:

``` js
var drawer = new Drawer(document.body, {
	onOpen: function () {}
});
```
+ **onOpened** *Function* - it's a function that it's triggerd each time the navigation is revealed and when the animation has ended:

``` js
var drawer = new Drawer(document.body, {
	onOpened: function () {}
});
```
+ **onClose** *Function* - the same as the *onOpen* option, but with oposite behavior:

``` js
var drawer = new Drawer(document.body, {
	onClose: function () {}
});
```
+ **onClosed** *Function* - it's a function that it's triggerd each time the navigation is hidden and when the animation has ended:

``` js
var drawer = new Drawer(document.body, {
	onClosed: function () {}
});
```
+ **transitioned** *Function* - this options allows you to do stuff whenever the content is transitioned, no matter if it's closed / opened / pulled back:

``` js
var drawer = new Drawer(document.body, {
	transitioned: function () {}
});
```

#### API
Along with the options, the class exports two API methods:

+ **open** *Function* - use this method to reveal the navigation (slide the content out) after you have instantiated the class:

``` js
var drawer = new Drawer(document.body);
drawer.open();
```
+ **close** *Function* - the same as the *open* method, you can use this one after the class is instantiated and it can hide the navigation (slide the content back in):

``` js
var drawer = new Drawer(document.body);
drawer.close();
```

#### Using jQuery / Zepto
Drawer provides a jQuery plugin if you prefer to use it the jQuery way, though you will need to include `jquery.drawer.js` instead of the `drawer.js` file:

``` js
$("body").drawer();
```
The options can still be used the same way as using it without jQuery:

``` js
$("body").drawer({
	speed: 450,
	offset: 80,
	onOpen: function () {}
});
```
Calling the API methods would be the same as initiating the plugin, but instead of using dot notation on the returned object you will pass a string with the API method:

``` js
$("body").drawer("open");
```
The options can also be overwritten after you load the library and the jQuery plugin as such:

``` js
$.fn.drawer.defaults = {
	speed: 350
};
```

#### Using RequireJS
There is also support for AMD, you can use RequireJS to load your module async, just do not forget to add it to the `paths` object in case you use bower to install it and it is not located under the `baseUrl`:

``` js
requirejs.config({
	paths: {
		"drawer": "components/drawer.js"
	}
});
```

### Installing
---------------
The library can be downloaded directly from [Git](https://github.com/rolandjitsu/drawerjs/archive/master.zip) or it can be installed with [Bower](http://bower.io/):

``` bash
bower install drawerjs
```


### Compatibility
------------------
Currently this library is using:
+ [Flexbox](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Flexible_boxes) for styling some of the elements (it is not supported by old browsers, check [Caniuse](http://caniuse.com/flexbox) for more information about which browsers do support it) with fallback to `display: block`;
+ [2D](http://caniuse.com/transforms2d) or [3D](http://caniuse.com/transforms3d) [transforms](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_transforms) to translate the content when it's dragged;
+ [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_transitions) (see [support](http://caniuse.com/css-transitions)) or  [RequestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame) (see [support](http://caniuse.com/requestanimationframe)) or a fallback polyfill in none of the mentioned are supported to animate the content on open / close / pulled back;

The library is also making use of some javascript native methods which are not supported in all browsers. Check the table bellow for a better overview:

| Browser            | Flexbox *(Old)* | Flexbox *(New)* | requestAnimationFrame | transition | transforms *(2D)* | transforms *(3D)* |
| ------------------ |:---------------:|:---------------:|:---------------------:|:----------:|:-----------------:|:-----------------:|
| Chrome             | 4.0 - 20.0      | 21.0 +          | 10.0 +                | 4.0 +      | 4.0 +             | 12.0 +            |
| Firefox            | 2.0 - 18.0      | 22.0 +          | 4.0 +                 | 4.0 +      | 3.5 +             | 10.0 +            |
| Safari             | 3.1 - 6.1       | 7.0 +           | 6.0 +                 | 3.1 +      | 3.1 +             | 4.0 +             |
| Opera              | &times;         | 12.1 +          | 15.0 +                | 10.5 +     | 10.5 +            | 15.0 +            |
| IE                 | 10.0 *(Hybrid)* | 11.0 +          | 10.0 +                | 10.0 +     | 9.0 +             | &times;           |
| iOS Safari         | 3.2 - 6.1       | 7.0 +           | 6.0 +                 | 3.2 +      | 3.2 +             | 3.2 +             |
| Opera Mini         | &times;         | &times;         | &times;               | &times;    | &times;           | &times;           |
| Android Browser    | 2.1 - 4.2       | &times;         | &times;               | 2.1 +      | 2.1 +             | 3.0 +             |
| Blackberry Browser | 7.0             | 10.0 +          | 10.0 +                | 7.0 +      | 7.0 +             | 7.0 +             |
| Opera Mobile       | &times;         | 12.1 +          | 14.0 +                | 10.0 +     | 11.0 +            | 14.0 +            |
| Android Chrome     | &times;         | 28.0 +          | 29.0 +                | 28.0 +     | 28.0 +            | 28.0 +            |
| Firefox Android    | &times;         | 22.0 +          | 23.0 +                | 22.0 +     | 22.0 +            | 22.0 +            |
| IE Mobile          | 10.0 *(Hybrid)* | &times;         | 10.0 +                | 10.0 +     | 10.0 +            | 10.0 +            |

Hence the class only supports:

+ **Chrome** *4.0 +*
+ **Firefox** *3.5 +*
+ **Safari** *3.1 +*
+ **Opera** *10.5 +*
+ **IE** *9.0 +*
+ **iOS Safari** *3.2 +*
+ **Android Browser** *2.1 +*
+ **Blackberry Browser** *7.0 +*
+ **Opera Mobile** *10.0 +*
+ **Android Chrome** *28.0 +*
+ **Firefox Android** *22.0 +*
+ **IE Mobile** *10.0 +*


### Bugs / Feature Requests
----------------------------
I'm still working on this plugin, trying to make the code cleaner and with some comments, organizing it and increasing performance. I'm working on a better browser support and I plan on adding support for scrolling inside the menu and the content without affecting one another.

Please report any bugs or feature requests on the [issues](https://github.com/rolandjitsu/drawerjs/issues) page.