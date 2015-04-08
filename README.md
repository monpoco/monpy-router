# monpy-router

## Installation

```
$ npm install monpy-router
```

## Example

```js
var router = require('monpy-router');

router.resolve('/');
    => { controller: 'home', action: 'index' }

router.resolve('/app');
    => { controller: 'app', action: 'index' }

router.resolve('/app/hello');
    => { controller: 'app', action: 'hello' }

router.add('/:controller/:action/:id');
router.resolve('/user/edit/10');
    => { controller: 'app', action: 'hello', id:10 }


router.add('/join', {controller, 'user', action: 'new'});
router.resolve('/join');
    => { controller: 'user', action: 'new' }


router.add('/api/v:api_ver/:action', {controller, 'api'});
router.resolve('/api/v1/myinfo');
    => { controller: 'api', action: 'myinfo',  api_ver: '1'}


```


## Change root

```js
var router = require('monpy-router');


router.root({
    controller: 'hoge', action: 'fuga'
});

router.resolve('/');
    => { controller: 'hoge', action: 'fuga' }

router.resolve('/app');
    => { controller: 'app', action: 'fuga' }

```