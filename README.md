coinbase-bots
======

Add description.

# Install
Run `ts-test % npm install --force`. `--force` is required for typedoc.

# Testing
```
npm run test
```
We use webpack to build a UMD module for testing. This prohibits using ES Modules
in your **Jasmine** tests. While tools like [karma-webpack](https://www.npmjs.com/package/karma-webpack)
can be used to support `imports/exports`, it requires we downgrade the version of webpack,
which is something we prefer not to do. 

Outputting a UMD modules allows you to consume the module in the following ways:
- ES2015 module import
- CommonJS module require
- AMD module require
- Imported in your `karm.config`

Your tests will import the UMD module in Karma's files array:
```javascript
files: [
  "../lib/coinbase-bots.min.js",
  "unit/**/*.js",
},
...
```
Webpack also uses this name to attach a global for your UMD module using the `library` attribute:
```javascript
output: {
    path: path.resolve(__dirname, "lib"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: "coinbaseBots",
    umdNamedDefine: true,
  },
```
All you lib functions are available on the coinbaseBots global. For example:
```javascript
describe('TestFunction', function () {

    it('check TestFunction return values', function () {
        expect(coinbaseBots.TestFunction(5)).toBe('TestFunction value is 5');
    });
});
```
You can learn more about authoring UM modules with webpack [here](https://webpack.js.org/guides/author-libraries/).

If your library is going to consume client side globals such as `window` in its source code,
we recomend changing the `package/json` file from
```JSON
"main": "lib/coinbase-bots.min.js",
```
to
```JSON
"browser": "lib/coinbase-bots.min.js",
```
"If your module is meant to be used client-side the browser field should be used instead of the main field. This is helpful to hint users that it might rely on primitives that aren't available in Node.js modules. (e.g. window)"
Official docs [here](https://docs.npmjs.com/cli/v6/configuring-npm/package-json#main).
# Build
```
npm run build
```

# Docs
```
npm run docs
```
See `pacakge.json` for more commands.
