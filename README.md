

## Examples

```
extends github:jaz303/foobar

inputs:
    
get project_title, prompt="Project title: "

get module_name, prompt = "Module name: "
                 default = project_title | underscore | replace('_', '-')

get create_git_repo, prompt = "Create git repository? [y/n]: ",
                     default = "y",
                     filter = downcase | strip | default("y"),
                     limit = [ "y", "n" ]

actions:

invoke github:jaz303/bleem, foo = "bar", bleem = "baz"

tree src=www target=.
dir config

if create_git_repo?
    file optional/.gitignore, dest=.gitignore
    shell 'git init'
    shell 'git add .'
    shell 'git commit -m "Initial revision"'
end
```