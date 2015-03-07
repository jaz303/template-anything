## Usage - using an existing template

To scaffold a project from an existing template use the command:

    $ ta <template> <target>

`template` can be either a git URL or a path to a local directory, and `target` should be a path to a non-existant target directory. So, to start a new project based on my `tpl-simple-site` template and put it in `projects/my-new-site` you would do this:

    $ ta git@github.com:jaz303/tpl-simple-site.git projects/my-new-site

That's a bit of mouthful so there is special shortcut syntax for using templates hosted on Github:

    $ ta jaz303/tpl-simple-site projects/my-new-site

Any git URL can be suffixed with `@revsion` to use a specific SHA1/branch/tag:

    $ ta jaz303/tpl-simple-site@master projects/my-new-site
    $ ta git@github.com:jaz303/tpl-simple-site.git@2a78059019a projects/my-new-site

Once you've run this command and answered a couple of questions about your new project you will have a brand new front end web project all ready to play with based on PHP, browserify, SCSS, livereload and spinup. This is the way I like to work on simple frontend builds, but maybe you prefer something else. Read on to learn how to create your own project templates compatible with `template-anything`...