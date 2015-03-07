### Built-in Directives

#### Inputs

##### `prompt`

Prompt the user for input and assign the response to a variable.

  * `name`: name of variable to assign; do not include the `$` prefix __(required)__
  * `prompt`: prompt to display
  * `default`: default value to be used if user does not enter anything
  * `filter`: a partial pipeline that will be applied to the submitted value
  * `postfilter`: a partial pipeline that will be applied to the submitted value, after validation
  * `validate`: a partial pipeline that will be used to validate the returned value. If the pipeline is falsey the user will be prompted to re-enter the value.

Example:

    prompt username,
           prompt: "Enter username: ",
           filter: | downcase()

##### `set`

Sets a variable to a specified value.

  * `name`: name of variable to assign; do not include the `$` prefix __(required)__
  * `value`: value to assign __(required)__

Example: `set name, "Jason"`

##### `yesno`

  * `name`: name of variable to assign; do not include the `$` prefix __(required)__
  * `prompt`: prompt to display
  * `default`: default value (should be either `1` or `0`)

Example: `prompt create_git_repo, prompt: "Create git repository? "`

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

##### `create_git_repo`

Initialise a git repository in the target directory and optionally commit its contents.

  * `commit`: set to 1 or string to commit target directory to git repo; when a string is specified this will be the commit message.

Example: `create_git_repo commit: "Initial commit!"`

##### `dir`

Create a (possibly nested) subdirectory directory in in the target directory.

  * `name`: directory name __(required)__

Example: `dir name: a/b/c`

##### `echo`

Write a message to standard output.

  * `msg`: message to write; newline will be added __(required)__

Example: `echo "hello world!"`

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
