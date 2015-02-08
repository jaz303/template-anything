# template-anything

Turn any git repository into a project template! 

But sir it sounds like you've just reinvented `git clone`!


## Installation

    npm install -g template-anything

## Usage

    $ ta <template> <target>

`template` can be either a git URL or a path to a local directory. So, to start a new project based on my `site-template` template you would do this:

    $ ta git@github.com:jaz303/site-template.git my-new-site

That's a bit of mouthful so there is special shortcut syntax for using templates hosted on Github:

    $ ta jaz303/site-template my-new-site


## 

The format of a plan is:

    inputs:
    [input directives]

    actions:
    [action directives]
    
Generally speaking, input directives are variable-setting directives like `set`, `prompt` and `yesno`, and action directives are those which actually do the work, such as `copy`, `tree` and `template`.

When executing a plan, all `inputs` sections will be executed in source order, followed by the `actions` sections.

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







# template-anything

Turn any git repository into a project template!

## Examples

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

## TODO

  - [ ] add source dir, target dir, target basename to default env
  - [ ] dictionary type + indexing syntax
  - [ ] user defaults dictionary JSON
