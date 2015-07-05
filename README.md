# Angular-carousel
An adaptive carousel based on angularJS directive.

![alt tag](http://cdn.makeagif.com/media/7-05-2015/Y0NTl_.gif)
## Installation
You can install directive via bower
```sh
    $ bower install angular-es-carousel
```
Add dependences to your **html** file
```html
    <script src="/bower_components/angular-es-carousel/js/esCarousel.js"></script>
    <link rel="stylesheet" href="/bower_components/angular-es-carousel/css/carousel.css"/>
```
Don't forget add **'carousel'** module to your angular dependences.
```javascript
    angular.module('appName', ['carousel']);
```
## Usage
Carousel has three display modes that are specified by element attribute **es-carousel**.
- es-carousel="3" - display three card in front
- es-carousel="5" - display five card in front
- es-carousel="7" - display seven card in front

Inner html of node element with attribute **es-card** will be used as a template for card. The function that will set for attribute **card-action** on the same element will be used as action when you click on the card.

**Usage with unique html templates for each cards**
```html
    <div es-carousel="7">
        <div es-card card-action="someActionFromScope(someParam)">
             <!-- template for first card -->
        </div>

        <div es-card card-action="otherActionFromScope(someParam)">
            <!-- template for second card -->
        </div>
       <!-- ... templates for the next cards -->
    </div>
```
**Usage with html template cloned via ng-repeat directive**
```html
    <div es-carousel="7">
        <div ng-repeat="card in cardsArrayFromScope" es-card="card" card-action="card.action()" last-card="$last">
            <span>{{card.title}}</span>
            <img class="image image-1" ng-src={{card.image}} alt={{card.alt}}/>
        </div>
    </div>
```
**Also you can mix repeated cards with unique templated**
```html
    <div es-carousel="7">
        <div ng-repeat="card in cardsArrayFromScope" es-card="card" card-action="card.action()" last-card="$last">
            <span>{{card.title}}</span>
            <img class="image image-1" ng-src={{card.image}} alt={{card.alt}}/>
        </div>
        
        <div es-card card-action="someActionFromScope(someParam)">
            <!-- some template for next card -->
        </div>
    </div>
```
