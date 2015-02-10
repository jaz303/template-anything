# template-anything

Turn any git repository into a project template! Just upload your template to Github - or any other publicly accessible Git URL - and then use the `ta` command to generate a new project instance.

### Umm, that sounds like you've just reinvented `git clone`...

The key to `template-anything`'s power is that its behaviour can be fully customized by adding a _template plan_ to your template. This plan, written in a file called `plan.tpl` in your template's root directory, can gather user input, set variables and orchestrate necessary filesystem operations to configure a new project. `template-anything` also includes a template expansion language that allows file contents to be customized based on user input.

## Core Principles
  
  * __Simple:__ template plans should be straightforward to both read and write. Ease of writing matters because authoring templates is a mundane operation and users should be able to dive in, make a template and get out with minimal time investment. Ease of reading matters because template plans should be easy to review in terms of both fitness for purpose and security.

  * __Fat-core/no plugins:__ everything required to scaffold any kind of project should be included in the core distribution. Common high-level operations should be extracted to their own directives and contributed back to the core tool. __Not supporting plugins is a feature__, and will hopefully a) guarantee that templates will work anywhere and b) make it easy to review `template-anything`'s suitability for a given use-case - without having to trawl the web for a bunch of plugins.

  * __No centralised registries:__ publishing a template should be as simple as publishing a git repository - there is no reason to make users sign up to a 3rd party service.

`template-anything`s design has been strongly influenced by [Ansible](http://www.ansible.com/home).

## Installation

    npm install -g template-anything

## Usage - using an existing template

To scaffold a project from an existing template use the command:

    $ ta <template> <target>

`template` can be either a git URL or a path to a local directory, and `target` should be a path to a non-existant target directory. So, to start a new project based on my `site-template` template and put it in `projects/my-new-site` you would do this:

    $ ta git@github.com:jaz303/site-template.git projects/my-new-site

That's a bit of mouthful so there is special shortcut syntax for using templates hosted on Github:

    $ ta jaz303/site-template projects/my-new-site

Once you've run this command and answered a couple of questions about your new project you will have a brand new front end web project all ready to play with based on PHP, browserify, SCSS, livereload and spinup. This is the way I like to work on simple frontend builds, but maybe you prefer something else. Read on to learn how to create your own project templates compatible with `template-anything`...

## Usage - creating a template

To create a template all you need to do is create a directory structure containing your template, (optionally) add a `plan.tpl` declaring the operations to be performed when the template is invoked, and then upload it to a publicly-accessible Git URL.

If `plan.tpl` is omitted the default behaviour is to copy the contents of the template to the target directory.

Here's an example `plan.tpl`:

```
inputs:

# Get project name from the user
# The response will be stored in $project_name
prompt project_name, prompt: "Project name: ",
                     default: "site-template"

# Ask user if they'd like to create a git repo
# The response will be stored in $create_repo
yesno create_repo, prompt: "Create git repo?",
                   default: 1

actions:

# Copy everything from 'contents', within the template directory,
# to the target directory. This directive is using positional,
# rather than named, parameters. The default destination for
# tree is the target directory so in this case it doesn't need
# to specified.
tree contents

# Perform in-place template substitions to the file package.json,
# located within the target directory. All variables are available
# when performing template substitutions.
template inplace: package.json

# Shell command!
shell "npm install"

# Conditional blocks are supported; we only want to create a git
# repo if the user requested it:
if $create_repo then
  # ... if they did, copy in a .gitignore file...
    copy optional/gitignore, .gitignore
    # ... and initialize the repo
    shell "git init"
    shell "git add ."
    shell "git commit -m 'First commit'"
end
```

## Template Plans in Depth

### Terminology

`template path` is the source directory of the original template.

`target directory` is the target directory where we are creating our new project.

### Format

The basic format of `plan.tpl` is:

    inputs:
    [input directives]

    actions:
    [action directives]
    
Generally speaking, input directives are variable-setting directives like `set`, `prompt` and `yesno`, and action directives are those which actually do the work, such as `copy`, `tree` and `template`. `template-anything` doesn't actually enforce which directives are valid for each section, but its good practice to maintain the distinction.

When executing a plan, each `inputs` section will be executed in source order, followed by each `actions` section.

### Syntax

To invoke a directive simply write its name:

    tree

Arguments are separated with commas and can specified either positionally:

    tree ".", "."

Or by name:

    tree src: "contents", dest: "."

You can mix both styles in a single invocation if you like, with positional arguments appearing first:

    prompt my_val, prompt: "please enter a value: ", default: 10

Arguments may be split over multiple lines:

    prompt my_val, 
           prompt: "please enter a value: ",
           default: 10

Conditional blocks are supported and they look like this:

    if {expression} then
        # execute these directives if {expression} is truthy
    end

Else blocks are supported:

    if {expression} then
        # truthy
    else
        # falsey
    end

Empty strings, empty arrays and zero are considered false; everything else is true. `template-anything` does not have a dedicated boolean type.

### Expression Syntax

The basic expression literals are:

  * string: `"able was I ere I saw elba"`
  * integer: `42`
  * symbols: `foo/bar/baz.txt`

Symbols can include the special characters `./_-`, making it possible to express filenames without wrapping them in quotes. They can also include `:` as long as it does not appear at the end of the symbol.

Variable references are dollar-prefixed and evaluate to the contents of the variable. For example: `$name` evaluates to the value of the variable `name`.

Arrays are denoted with the familiar syntax `[1, 2, 3]`. Arrays are not particularly useful yet but as `template-anything` grows to support repetition and iteration I expect their importance to increase.

Function calls are written simply as `function(arg1, arg2, ... argn)`; arguments can be any valid expression.

Expressions can be filtered through functions using the pipeline syntax:

    $name | prepend("hello ") | upcase()

In a pipeline the result of the previous operation is passed as the first argument to the next function (in the function documentation below, this is denoted in  parameter lists by `subject`). For example, given that variable `$name` is `"Bob"` the code above would evaluate to "HELLO BOB".

Strings can contain template interpolations e.g. `"Mr {{ $name | upcase() }}"`.

### Template Syntax

A template is simply a text file, optionally containing moustache-delimited (`{{ ... }}`) expressions. For example, evaluating the following template:

    {
      "name": "{{ $name | downcase() }}"
    }
    
with an environment of `{ "name": "Sauron" }` yields:

    {
      "name": "sauron"
    }

### Built-in Directives

#### Inputs

##### `prompt`

  * `name`: 
  * `prompt`: 
  * `default`: 
  * `filter`: 
  * `postfilter`:
  * `validate`:

##### `set`

  * `name`:
  * `value`:

##### `yesno`

  * `name`:
  * `prompt`:
  * `default`:

#### Actions

##### `append_line`

Append a line to `file`. `file` will be created if it does not exist.

  * `file`: target file __(required)__
  * `line`: line of text append; trailing newline will be added __(required)__

##### `append_string`

Append a string to `file`. `file` will be created if it does not exist.

  * `file`: target file __(required)__
  * `string`: string of text append __(required)__

##### `copy`

Copy a single file from the template to the target directory.

  * `src`: source file __(required)__
  * `dest`: destination file __(required)__

Example: `copy src: foo.txt, dest: bar.txt`

##### `dir`

Create a (possibly nested) subdirectory directory in in the target directory.

  * `name`: directory name __(required)__

Example: `dir name: a/b/c`

##### `shell`

Execute a shell command. The working directory will be the target directory.

  * `cmd`: shell command to execute __(required)__

Example: `shell cmd: "git init && git add . && git commit -m 'Initial'"`

##### `template`

Perform template substitution in a single file, either in-place or by copy.

  * `src`: source template file
  * `dest`: destination file
  * `inplace`: in-place file
  
If `src` and `dest` are specified, `src` will be copied from the template path to `dest` inside the target directory, with all template expressions expanded.

`inplace`, if specified, is relative to the target directory. The file will be opened, template expressions expanded, and the updated file saved back to the same path.

`src`/`dest` and `inplace` are mutually exclusive.

For more information about expression/template syntax, see below.

##### `tree`

Copy an entire tree of files from the template to the target directory.

  * `src`: source directory, relative to template (default: `.`)
  * `dest`: destination directory, relative to target (default: `.`)
    
All variables currently defined by the template plan are available for use in templates.

### Built-in Functions

#### Array

##### `join(subject, str)`

Join elements of `subject` with string `str`.

#### Comparison

##### `eq(subject, other)`

Compare `subject` with `other`. Returns `1` if equal, `0` otherwise. Equivalent to Javascript's `==` operator.

##### `is(subject, other)`

Compare identity of `subject` with `other`. Returns `1` if identical, `0` otherwise. Equivalent to Javascript's `===` operator.

#### Math

##### `random()`

Return a random number between `0` and `1`.

##### `random(n)`

Return a random integer between `0` and `n-1`, inclusive.

##### `random(min, max)`

Return a random integer between `min` and `max-1`, inclusive.

#### String

##### `append(subject, suffix)`

Append `suffix` to `subject`.

##### `prepend(subject, prefix)`

Prepend `prefix` to `subject`.

##### `replace(subject, needle, replacement)`

Replace all occurrences `needle` with `replacement` in `subject`.

##### `dasherize(subject)`

Replace all runs of 1 or more spaces in `subject` with dashes.

##### `substr(subject, start, length)`

Equivalent to Javascripts `substr()` method.

##### `substring(subject, start, end)`

Equivalent to Javascripts `substring()` method.

##### `downcase(subject)`

Convert `subject` to lower case.

##### `upcase(subject)`

Convert `subject` to upper case.

##### `trim(subject)`

Remove leading and trailing space from `subject`.

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

    module.exports = function(ctx, env, opts, cb) {
        // ...
    }

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
