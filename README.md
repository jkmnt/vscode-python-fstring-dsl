# vscode-python-fstring-dsl
Syntax highlighting for HTML, SQL, JS, CSS in Python f-strings

## Usage
To trigger the syntax highlight you must wrap your
DSL-string in a specific function (or method) call: `html(...),` `sql(...)`, `js(...)`, `css(...)`. This function may be noop like the Python's `typing.cast()` or do something useful, i.e. trimming whitespaces.

```python
def html(s: str):
    return s
```

If the string is template (f-string), the internal f-expressions will be syntax highlighted too.

## Sample
![sample.png](https://raw.githubusercontent.com/jkmnt/vscode-python-fstring-dsl/sample.png)

This sample shows the well-typed server-side Dialog component with
bootsrap styling, htmx magic and text escaping.


## Note

- The syntax matching is naive. It will work only for the simple common cases. If something don't color the way it should, the best solution is to simplify the template.

- This extension deals with the highlighting  only, so no Intellisence, hovers, etc.

- f-strings are not very useful with CSS and JS. These languages are brace-heavy - too many braces to be escaped.

- To underline the embedded areas as in the sample above, add following to the VSCode settings.json:
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
