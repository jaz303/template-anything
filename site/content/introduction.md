# template-anything

Turn any git repository into a project template! Just upload your template to Github - or any other publicly accessible Git URL - and then use the `ta` command to generate a new project instance.

### Umm, that sounds like you've just reinvented `git clone`...

The key to `template-anything`'s power is that its behaviour can be fully customized by adding a _template plan_ to your template. This plan, written in a file called `plan.tpl` in your template's root directory, can gather user input, set variables and orchestrate necessary filesystem operations to configure a new project. `template-anything` also includes a template expansion language that allows file contents to be customized based on user input.

### Umm, that sounds like you've just reinvented `yeoman`...

`template-anything` is a far simpler tool than Yeoman; Yeoman supports cra . On the other hand, `template-anything` is a simple tool designed for circumstances where you have a skeleton project that you want. While `template-anything` is . Additionally, because `template-anything` implements its own DSL and runner, you don't need to use crazy callbacks just to get input from the user.

## Core Principles
  
  * __Simple:__ template plans should be straightforward to both read and write. Ease of writing matters because authoring templates is a mundane operation and users should be able to dive in, make a template and get out with minimal time investment. Ease of reading matters because template plans should be easy to review in terms of both fitness for purpose and security.

  * __Fat-core/no plugins:__ everything required to scaffold any kind of project should be included in the core distribution. Common high-level operations should be extracted to their own directives and contributed back to the core tool. __Not supporting plugins is a feature__, and will hopefully a) guarantee that templates will work anywhere and b) make it easy to review `template-anything`'s suitability for a given use-case - without having to trawl the web for a bunch of plugins.

  * __No centralised registries:__ publishing a template should be as simple as publishing a git repository - there is no reason to make users sign up to a 3rd party service.

`template-anything`s design has been strongly influenced by [Ansible](http://www.ansible.com/home).