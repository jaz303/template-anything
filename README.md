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
