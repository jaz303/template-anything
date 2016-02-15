## Contributing

### Adding a function

Adding a function is as straightforward writing a Javascript function and registering it with the default environment.

  1. have a look in `lib/functions`... does your new function fit into one of the existing libraries? If so, edit that file. If not, create a new library using one of the existing libraries (e.g. `lib/functions/math.js`) as a starting point.

  2. add your new function to the library file. Note: functions always run synchronously.

  3. if you created a new library in step 1, update `lib/Context.js` to ensure the library is included when an environment is created.

### Adding a directive

Adding a directive is a two-step process - firstly you must write the "raw" version as a single function with conforming signature, and then write some wrapper code that will expose it to the `template-anything`'s scripting environment. The wrapper code also specifies parameter names, required parameters and default values.

#### 1. Implement raw directive

Create a new file in `lib/directives/raw` with the same name as your new directive. This file should export a single function with the signature:

```javascript
module.exports = function(ctx, env, opts, cb) {
    // ...
}
```

The arguments are as follows:

  * `ctx`: instance of `lib/Context.js`; stores the paths of the template and target, as well as a reference to the root environment.
  * `env`: the execution environment; an instance of `lib/Environment.js`. Use this to access defined variables, functions and directives.
  * `opts`: object containing all arguments passed to the directive. This will be preprocessed by the directive's wrapper so the raw implementation does not need to worry about default values, checking for presence of required arguments, or the difference between positional/named arguments.
  * `cb`: callback to invoke on completion or error. Pass no arguments if directive executed successfully, or an `Error` instance in the event of error.

#### 2. Implement wrapper

Wrappers are defined in `lib/directives/index.js` in alphabetical order. A fluent builder syntax is used to keep their definition reasonably succinct. Here's an example:

```javascript
directive('copy')
    .param('src', {
        required: true,
        key: 'sourcePath'
    })
    .param('dest', {
        required: true,
        key: 'destinationPath'
    })
    .handler(require('./raw/copy'));
```

This wrapper exposes the `copy` directive to the scripting environment which accepts two parameters, `src` and `dest`, both of which are required. The function exported by `./raw/copy` is then registered as the handler for this wrapper.

Available builder functions:

  * `param(name, [opts])`: add a new parameter to this directive with given `name`; this is the same name that will be used when passing a corresponding argument by name from within a template plan. The order of `param()` calls on the builder determines the order that positional arguments will be assigned.
  * `requiredParams(paramGroups)`: used to denote that the directive accepts two or more groups of mutually exclusive arguments (see the `template` directive for an example). `paramGroups` is an array wherein each entry is an object mapping parameter names to booleans, denoting whether not an argument with that name must (`true`) or must not (`false`) be present. When the directive is invoked, this list of constraints will be searched and the invocation will succeed if and only if one parameter group matches the supplied arguments.
  * `handler(fn)`: register `fn` as the handler for this directive; this should have the signature `(ctx, env, opts, cb)`, as described above.

Supported parameter option keys:

  * `key`: used to specify an alternative name for the parameter when it is dispatched to the raw handler function; this allows for brevity in the template itself but more descriptive names in the implementation of the directive.
  * `required`: this parameter must be specified otherwise invocation is erroneous
  * `defaultValue`: default value for this parameter if unspecified
