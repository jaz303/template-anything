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