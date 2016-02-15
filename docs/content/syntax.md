### Format

The basic format of `plan.tpl` is:

    inputs:
    [input directives]

    actions:
    [action directives]
    
Generally speaking, input directives are variable-setting directives like `set`, `prompt` and `yesno`, and action directives are those which actually do the work, such as `copy`, `tree` and `template`. `template-anything` doesn't actually enforce which directives are valid for each section, but its good practice to maintain the distinction.

When executing a plan, each `inputs` section will be executed in source order, followed by each `actions` section.

### Syntax

To invoke a directive simply write its name:

    tree

Arguments are separated with commas and can specified either positionally:

    tree ".", "."

Or by name:

    tree src: "contents", dest: "."

You can mix both styles in a single invocation if you like, with positional arguments appearing first:

    prompt my_val, prompt: "please enter a value: ", default: 10

Arguments may be split over multiple lines:

    prompt my_val, 
           prompt: "please enter a value: ",
           default: 10

Conditional blocks are supported and they look like this:

    if {expression} then
        # execute these directives if {expression} is truthy
    end

Else blocks are supported:

    if {expression} then
        # truthy
    else
        # falsey
    end

Empty strings, empty arrays and zero are considered false; everything else is true. `template-anything` does not have a dedicated boolean type.

### Expression Syntax

The basic expression literals are:

  * string: `"able was I ere I saw elba"`
  * integer: `42`
  * symbols: `foo/bar/baz.txt`

Symbols can include the special characters `./_-`, making it possible to express filenames without wrapping them in quotes. They can also include `:` as long as it does not appear at the end of the symbol.

Variable references are dollar-prefixed and evaluate to the contents of the variable. For example: `$name` evaluates to the value of the variable `name`.

Arrays are denoted with the familiar syntax `[1, 2, 3]`. Arrays are not particularly useful yet but as `template-anything` grows to support repetition and iteration I expect their importance to increase.

Function calls are written simply as `function(arg1, arg2, ... argn)`; arguments can be any valid expression.

Expressions can be filtered through functions using the pipeline syntax:

    $name | prepend("hello ") | upcase()

In a pipeline the result of the previous operation is passed as the first argument to the next function (in the function documentation below, this is denoted in  parameter lists by `subject`). For example, given that variable `$name` is `"Bob"` the code above would evaluate to "HELLO BOB".

Strings can contain template interpolations e.g. `"Mr {{ $name | upcase() }}"`.

Some actions (notably `prompt`) accept callbacks in the form of "partial pipelines". A partial pipeline is a standard pipeline with the initial value omitted; this value will instead be supplied by the directive itself when it invokes the callback. The syntax for a partial pipeline is thus:

    | downcase() | dasherize()

And it would be used like this:

    `prompt username, filter: | trim() | downcase() | dasherize()`

The `prompt` directive would take the user's input and then pass it through the `filter` partial pipeline, and use the pipeline's output value as the value to assign to the `username` variable.

### Template Syntax

A template is simply a text file, optionally containing moustache-delimited (`{{ ... }}`) expressions. For example, evaluating the following template:

    {
      "name": "{{ $name | downcase() }}"
    }
    
with an environment of `{ "name": "Sauron" }` yields:

    {
      "name": "sauron"
    }
