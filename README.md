

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

## AST types

  * extends
  * symbol (roughly, a sequence of unquoted chars with certain exclusions)
  * string
  * number
  * chain
  * function call
  * directive (e.g. get, set, invoke, tree, dir) + args
  * inputs (list of inputs) (named block?)
  * actions (list of actions) (named block?)
  * if/else
  * iteration?