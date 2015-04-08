var router = require('..');

console.log('-- case 1 --------------');
var test_urls = [
	'/',
	'/hello',
	'/app/hello'
];


for(var i in test_urls)
	console.log( test_urls[i], ' => ', router.resolve(test_urls[i]) );


console.log('-- case 2 --------------');

router.add('/login', {controller: 'user', action: 'login'});
router.add('/join', {controller: 'user', action: 'join'});

test_urls = [
	'/join',
	'/login'
];
for(var i in test_urls)
	console.log( test_urls[i], ' => ', router.resolve(test_urls[i]) );



console.log('-- case 3 --------------');

router.add('/:controller/:id/:action');

test_urls = [
	'/user/1/new',
	'/user/1000/create'
];

for(var i in test_urls)
	console.log( test_urls[i], ' => ', router.resolve(test_urls[i]) );


console.log('-- case 4 --------------');

router.add('/api/v:api_ver/:action/:api_token', {controller: 'api'});

test_urls = [
	'/api/v1.0/getinfo/0932i3a4c3b2',
	'/api/v1.0/no_token'
];

for(var i in test_urls)
	console.log( test_urls[i], ' => ', router.resolve(test_urls[i]) );