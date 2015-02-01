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

tree src: www, dest: .
dir config

if $create_git_repo
    copy optional/.gitignore, dest: .gitignore
    shell "git init"
    shell "git add ."
    shell "git commit -m 'Initial revision'"
end
```

## TODO

  - [ ] add source dir, target dir, target basename to default env
  - [ ] dictionary type + indexing syntax
  - [ ] user defaults dictionary JSON
