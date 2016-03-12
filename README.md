# Front-End Gulp Boilerplate
A nice Gulp Boilerplate for Front-End Development using RiotJS (http://riotjs.com/)
## Setup:
Just clone the repository or download and run:
```javascript
npm install
```

Happy Coding!

## Includes:
- RiotJS
- Browserify
- Sass
- Browser Sync
- Source Maps for JS & CSS on Debug Mode
- JS Lint
- Optimize Images
- Run Tests with Jasmine
- Include Partials (@@include) or Templates (%%include)

### Custom modules
- settings.js: An easy way to handle settings inside your app
- loader.js: An example about how you can isolate your tags load
- models.js: An example about how you can create observable models using RiotJS 
- data.js: An easy way to handle data inside your app (you can use it with models.js)
- lang.js: A language lib that handle Yaml files to inject content in your app (it uses request.js)
- router.js: A nice way to handle your SPA routing (it uses settings.js)


### Custom tools
- request.js: Ajax Implementation

## Build Commands
### Debug Mode
```javascript
gulp
```
### Release Mode
```javascript
gulp -r // gulp --release
```
### Gzip Mode
```javascript
gulp -g // gulp --gzip
```
### Live Development
```javascript
gulp live 
// Live on Release Mode
gulp live -r // gulp live --release
```
// Live on Gzip Mode
gulp live -g // gulp live --gzip
```
### Tests
```javascript
gulp test
// Watch Mode
gulp test -w // gulp test --watch