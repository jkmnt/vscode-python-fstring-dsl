# vscode-python-fstring-dsl

Syntax highlighting for HTML, SQL, JS, CSS in Python f-strings

## Usage

The syntax highlighting is triggered by wrapping the DSL-string in a
specific function (or method) call:

- `html(...)`
- `sql(...)`
- `js(...)`
- `css(...)`

<!-- like the Python's `typing.cast()` -->

This function may be a noop. Perhaps it could do something useful, e.g. trimming whitespaces or logging.

```python
def html(s: str):
    return s.trim()
```

```python
def sql(s: str):
    logging.info(s)
    return s
```

If the string is the template (f-string), the internal f-expressions will be syntax highlighted too.

## Sample

![sample.png](https://raw.githubusercontent.com/jkmnt/vscode-python-fstring-dsl/sample.png)

This sample shows the well-typed server-side Dialog component with
bootsrap styling, htmx magic, and text escaping.

## Note

- The syntax matching is naive. It will work only for the simple common cases. If something don't color the way it should, the best workaround will be the template simplification.

- This extension deals with the highlighting only, so no Intellisence, hovers, etc.

- f-strings are not very useful with CSS and JS. These languages are brace-heavy - too many braces to be escaped.

- Add these lines to the VSCode settings.json to underline the embedded scopes as in the sample above:
  ```json
  "editor.tokenColorCustomizations": {
      "textMateRules": [
          {
              "scope": "meta.embedded.inline.f-expression",
              "settings": {
                  "fontStyle": "underline",
              },
          },
      ]
  },
  ```
