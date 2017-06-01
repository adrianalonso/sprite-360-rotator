# sprite-360-rotator
Sprite360Rotator is a javascript library for animating horizontal sprites and do 360 effect animation.

# Example of Use

Constructor has two parameters:
- Canvas identifier where it is rendering
- Url with sprite
- Options:
  - speed: default 60
  - numElements: default 30
  

To initialize library:

```javascript
var options = {
    speed: 60,
    numElements: 30
};
var rotator = new Sprite360Rotator('canvas', 'http://domain.com/sprite.png',options);
```
