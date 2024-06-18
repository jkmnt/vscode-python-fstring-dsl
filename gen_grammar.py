from dataclasses import dataclass
import argparse
import json
import pathlib


@dataclass
class Spec:
    lang: str
    trigger: str
    source: str


REPOSITORY = {
    "f-escape": {
        "name": "constant.character.escape.python",
        "match": r"(\{\{|\}\})",
    },
    "f-expression": {
        "begin": r"(\{)",
        # "end": r"(\})",
        "end": r"""(?x)
        (
            (?:
                (?: =?)
                (?: ![rsa])?
            )
            (?:
                :
                \w?
                [<>=^]?
                [-+]?
                \#?
                \d*
                ,?
                (?: \.\d+)?
                [bcdeEfFgGnosxX%]?
            )
        )?
        (\})""",
        "name": "meta.embedded.inline.f-expression.python",
        "beginCaptures": {
            "1": {"name": "constant.character.format.placeholder.other.python"},
        },
        "endCaptures": {
            "1": {"name": "storage.type.format.python"},
            "2": {"name": "constant.character.format.placeholder.other.python"},
        },
        "patterns": [{"include": "source.python#f-expression"}],
    },
}


SPECS: list[Spec] = [
    Spec("sql", "sql", "source.sql.inline"),
    Spec("html", "html", "text.html.basic"),
    Spec("css", "css", "source.css"),
    Spec("js", "js", "source.js"),
]


def scopes(*s: str):
    return " ".join(s[::-1])


def make_lang(spec: Spec):
    return {
        "begin": rf"""(?x)
                (?<!def\s+)
                \b
                ({ spec.trigger })
                \s*
                (\()""",
        "end": r"""(?x)
                (\))
                """,
        "name": scopes(
            "meta.function-call.python",
        ),
        "contentName": scopes(
            "meta.function-call.arguments.python",
        ),
        "beginCaptures": {
            2: {
                "name": scopes(
                    "punctuation.definition.arguments.begin.python",
                )
            },
        },
        "endCaptures": {
            1: {
                "name": scopes(
                    "punctuation.definition.arguments.end.python",
                )
            },
        },
        "patterns": [
            {
                "begin": rf"([r|R]?f|F)('''|\"\"\"|'|\")(\\$)?",
                "end": r"(\2)",
                "name": scopes(
                    "string.quoted.python",
                    "string.interpolated.python",
                    "meta.fstring.python",
                ),
                "contentName": scopes(
                    f"meta.embedded.inline.{ spec.lang }",
                ),
                "beginCaptures": {
                    1: {
                        "name": scopes(
                            "storage.type.string.python",
                        )
                    },
                    2: {
                        "name": scopes(
                            "punctuation.definition.string.begin.python",
                        )
                    },
                    3: {
                        "name": scopes(
                            "constant.language.python",
                        )
                    },
                },
                "endCaptures": {
                    1: {
                        "name": scopes(
                            "punctuation.definition.string.end.python",
                        )
                    },
                },
                "patterns": [{"include": "#f-escape"}, {"include": "#f-expression"}, {"include": spec.source}],
            },
            {
                "begin": rf"(r|R)?('''|\"\"\"|'|\")(\\$)?",
                "end": r"(\2)",
                "name": scopes(
                    "string.quoted.python",
                ),
                "contentName": scopes(
                    f"meta.embedded.inline.{ spec.lang }",
                ),
                "beginCaptures": {
                    1: {
                        "name": scopes(
                            "storage.type.string.python",
                        )
                    },
                    2: {
                        "name": scopes(
                            "punctuation.definition.string.begin.python",
                        )
                    },
                    3: {
                        "name": scopes(
                            "constant.language.python",
                        )
                    },
                },
                "endCaptures": {
                    1: {
                        "name": scopes(
                            "punctuation.definition.string.end.python",
                        )
                    },
                },
                "patterns": [{"include": spec.source}],
            },
        ],
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output", help="generated grammar", type=pathlib.Path, default=pathlib.Path("./syntaxes/embed-in-python.json")
    )

    args = parser.parse_args()
    tgt: pathlib.Path = args.output

    grammar = {
        "comment": "This file is autogenerated. Run grammar.py to recreate it.",
        "scopeName": "embed-in-python",
        "fileTypes": [],
        "injectionSelector": "L:source -comment -(string -meta.embedded)",
        "patterns": [make_lang(spec) for spec in SPECS],
        "repository": REPOSITORY,
    }

    with tgt.open("w") as f:
        json.dump(grammar, f, indent=4)


main()
