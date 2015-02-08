# template-anything

Turn any git repository into a project template! Just upload it to Github - or any other publicly accessible Git URL - and then use the `ta` command to create new instances of it.

"Sir that sounds great but it sounds like you've just reinvented `git clone`."

In it's simplest use-case, `template-anything` indeed creates a new project by performing a simple copy of the template. But the key to 

## Installation

    npm install -g template-anything

## Usage

    $ ta <template> <target>

`template` can be either a git URL or a path to a local directory. So, to start a new project based on my `site-template` template you would do this:

    $ ta git@github.com:jaz303/site-template.git my-new-site

That's a bit of mouthful so there is special shortcut syntax for using templates hosted on Github:

    $ ta jaz303/site-template my-new-site

## Example plan.tpl

## plan.tpl

```
inputs:

# Get project name from the user
prompt project_name, prompt: "Project name: ",
                     default: "site-template"

# Ask user if they'd like to create a git repo
yesno create_repo, prompt: "Create git repo?",
                   default: 1

actions:

# Copy everything from 'contents', within the template directory,
# to the target directory.
tree contents

# Perform in-place template substitions to the file package.json,
# located within the target directory
template inplace: package.json

# Shell command!
shell "npm install"

# Check to see if user wanted to create a git repo...
if $create_repo then
  # ... if they did, copy in a .gitignore file...
    copy optional/gitignore, .gitignore
    # ... and initialize the repo
    shell "git init"
    shell "git add ."
    shell "git commit -m 'First commit'"
end
```


### Terminology

`template path` is the source directory of the original template.

`target directory` is the target directory where we are creating our new project.

### Format

The format of a plan is:

    inputs:
    [input directives]

    actions:
    [action directives]
    
Generally speaking, input directives are variable-setting directives like `set`, `prompt` and `yesno`, and action directives are those which actually do the work, such as `copy`, `tree` and `template`.

When executing a plan, all `inputs` sections will be executed in source order, followed by the `actions` sections.

### Syntax

## Directives

### Inputs

#### `prompt`

  * `name`: 
  * `prompt`: 
  * `default`: 
  * `filter`: 
  * `postfilter`:
  * `validate`:

#### `set`

  * `name`:
  * `value`:

#### `yesno`

  * `name`:
  * `prompt`:
  * `default`:

### Actions

#### `copy`

Copy a single file from the template to the target directory.

  * `src`: source file __(required)__
  * `dest`: destination file __(required)__

Example: `copy src: foo.txt, dest: bar.txt`

#### `dir`

Create a (possibly nested) subdirectory directory in in the target directory.

  * `name`: directory name __(required)__

Example: `dir name: a/b/c`

#### `shell`

Execute a shell command. The working directory will be the target directory.

  * `cmd`: shell command to execute __(required)__

Example: `shell cmd: "git init && git add . && git commit -m 'Initial'"`

#### `template`

Perform template substitution in a single file, either in-place or by copy.

  * `src`: source template file
  * `dest`: destination file
  * `inplace`: in-place file
  
If `src` and `dest` are specified, `src` will be copied from the template path to `dest` inside the target directory, with all template expressions expanded.

`inplace`, if specified, is relative to the target directory. The file will be opened, template expressions expanded, and the updated file saved back to the same path.

`src`/`dest` and `inplace` are mutually exclusive.

For more information about expression/template syntax, see below.

#### `tree`

Copy an entire tree of files from the template to the target directory.

  * `src`: source directory, relative to template (default: `.`)
  * `dest`: destination directory, relative to target (default: `.`)
  
## Expression Syntax

The basic expression literals are:

  * string: `"able was I ere I saw elba"`
  * integer: `42`
  * symbols: `foo/bar/baz.txt`

Symbols can include the special characters `./_-`, making it possible to express filenames without wrapping them in quotes. They can also include `:` as long as it does not appear at the end of the symbol.

Variable references are dollar-prefixed and evaluate to the contents of the variable. For example: `$name` evaluates to the value of the variable `name`.

Arrays are denoted with the familiar syntax `[1, 2, 3]`. Arrays are not particularly useful yet but as `template-anything` grows to support repetition and iteration I expect their importance to increase.

Expressions can be filtered through functions using the pipeline syntax:

    $name | prepend("hello ") | upcase()

Given `$name => "Bob"` the above would evaluate to "HELLO BOB".

Strings can contain template interpolations e.g. `"Mr {{ $name | upcase() }}"`.

## Template Syntax

A template is simply a text file, optionally containing moustache-delimited (`{{ ... }}`) expressions. For example, evaluating the following template:

    {
      "name": "{{ $name | downcase() }}"
    }
    
with an environment of `{ "name": "Sauron" }` yields:

    {
      "name": "sauron"
    }
    
All variables currently defined by the template plan are available for use in templates.

## Functions

When used in a pipeline, the result of the previous operation is passed as the first argument to the next function. It is usually denoted in function parameter lists by `subject`.

### Array

#### `join(subject, str)`

Join elements of `subject` with string `str`.

### Comparison

#### `eq(subject, other)`

Compare `subject` with `other`. Returns `1` if equal, `0` otherwise. Equivalent to Javascript's `==` operator.

#### `is(subject, other)`

Compare identity of `subject` with `other`. Returns `1` if identical, `0` otherwise. Equivalent to Javascript's `===` operator.

### Math

#### `random()`

Return a random number between `0` and `1`.

#### `random(n)`

Return a random integer between `0` and `n-1`, inclusive.

#### `random(min, max)`

Return a random integer between `min` and `max-1`, inclusive.

### String

#### `append(subject, suffix)`

Append `suffix` to `subject`.

#### `prepend(subject, prefix)`

Prepend `prefix` to `subject`.

#### `replace(subject, needle, replacement)`

Replace all occurrences `needle` with `replacement` in `subject`.

#### `dasherize(subject)`

Replace all runs of 1 or more spaces in `subject` with dashes.

#### `substr(subject, start, length)`

Equivalent to Javascripts `substr()` method.

#### `substring(subject, start, end)`

Equivalent to Javascripts `substring()` method.

#### `downcase(subject)`

Convert `subject` to lower case.

#### `upcase(subject)`

Convert `subject` to upper case.

#### `trim(subject)`

Remove leading and trailing space from `subject`.