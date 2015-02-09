# Examples

## Prompt for a directory and create it

    inputs:
    prompt directory_name, prompt: "Directory name: "

    actions:
    dir $directory_name

## Create a git repository

    actions:
    shell "git init && git add . && git commit -m 'First commit'"

## Conditionally create a git repository

    inputs:
    yesno create_git_repo, prompt: "Create git repo? "

    actions:
    if $create_git_repo then
        shell "git init && git add . && git commit -m 'First commit'"
    end
