# template-anything

Turn any git repository into a project template!

## Examples

```
inputs:
    
get project_title, prompt: "Project title: "

get module_name, prompt: "Module name: ",
                 default: $project_title | underscore() | replace('_', '-')

yesno create_git_repo, prompt: "Create git repository? [y/n]: ",
                       default: "y"

actions:

tree src=www target=.
dir config

if $create_git_repo
    file optional/.gitignore, dest=.gitignore
    shell "git init"
    shell "git add ."
    shell "git commit -m 'Initial revision'"
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

## TODO

  - [x] Parser - fix sections
  - [x] Parser - fix directive args
  - [x] Parser - add predicate

  - [x] Parse plan into AST
  - [x] Parse strings
  - [x] Parse filter pipeline
  - [x] Parse function call
  - [x] Implement functions
  - [x] If/else
  - [ ] yesno
  - [ ] Finish implementation of get (prompt, default)
  - [ ] Finish implementation of tree (exclusions)
  - [ ] Unify parsing & handling of templates/plans

  - [ ] Extract expression evaluation & test