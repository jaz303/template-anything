### Built-in Functions

#### Array

##### `join(subject, str)`

Join elements of `subject` with string `str`.

#### Comparison

##### `eq(subject, other)`

Compare `subject` with `other`. Returns `1` if equal, `0` otherwise. Equivalent to Javascript's `==` operator.

##### `is(subject, other)`

Compare identity of `subject` with `other`. Returns `1` if identical, `0` otherwise. Equivalent to Javascript's `===` operator.

#### Math

##### `random()`

Return a random number between `0` and `1`.

##### `random(n)`

Return a random integer between `0` and `n-1`, inclusive.

##### `random(min, max)`

Return a random integer between `min` and `max-1`, inclusive.

#### String

##### `append(subject, suffix)`

Append `suffix` to `subject`.

##### `prepend(subject, prefix)`

Prepend `prefix` to `subject`.

##### `replace(subject, needle, replacement)`

Replace all occurrences `needle` with `replacement` in `subject`.

##### `dasherize(subject)`

Replace all runs of 1 or more spaces in `subject` with dashes.

##### `substr(subject, start, length)`

Equivalent to Javascripts `substr()` method.

##### `substring(subject, start, end)`

Equivalent to Javascripts `substring()` method.

##### `downcase(subject)`

Convert `subject` to lower case.

##### `upcase(subject)`

Convert `subject` to upper case.

##### `trim(subject)`

Remove leading and trailing space from `subject`.

### Built-in Variables

`template-anything` defines the following variables:

  * `$TEMPLATE_PATH`: absolute path to template source
  * `$TARGET_PATH`: absolute path to target directory
  * `$TARGET_NAME`: basename of target directory