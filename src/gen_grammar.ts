export interface Spec {
  lang: string;
  trigger: string;
  source: string;
}

export const DEF_SPECS: Spec[] = [
  {
    lang: "sql",
    trigger: "sql",
    source: "source.sql.inline",
  },
  {
    lang: "html",
    trigger: "html|hitml\\.m|hitml\\.markup|hitml\\.document|ht\\.m|ht\\.markup|ht\\.document",
    source: "text.html.basic",
  },
  {
    lang: "css",
    trigger: "css|hitml\\.style|hitml\\.stylesheet|ht\\.style|ht\\.stylesheet",
    source: "source.css",
  },
  {
    lang: "js",
    trigger: "js|hitml\\.handler|hitml\\.script|ht\\.handler|ht\\.script",
    source: "source.js",
  },
];

const REPOSITORY = {
  "f-escape": {
    name: "constant.character.escape.python",
    match: `(\\{\\{|\\}\\})`,
  },
  "f-expression": {
    begin: `(\\{)`,
    end: `(?x)
        (
            (?:
                (?: =?)
                (?: ![rsa])?
            )
            (?:
                :
                \\w?
                [<>=^]?
                [-+]?
                \\#?
                \\d*
                ,?
                (?: \\.\\d+)?
                [bcdeEfFgGnosxX%]?
            )
        )?
        (\\})`,
    name: "meta.embedded.inline.f-expression.python",
    beginCaptures: {
      "1": { name: "constant.character.format.placeholder.other.python" },
    },
    endCaptures: {
      "1": { name: "storage.type.format.python" },
      "2": { name: "constant.character.format.placeholder.other.python" },
    },
    patterns: [{ include: "source.python#f-expression" }],
  },
};

function scopes(...s: string[]) {
  return [...s].reverse().join(" ");
}

function make_lang(spec: Spec) {
  return {
    begin: `(?x)
                (?<!def\\s+)
                \\b
                (${spec.trigger})
                \\s*
                (\\()`,
    end: `(?x)
                (\\))
                `,
    name: scopes("meta.function-call.python"),
    contentName: scopes("meta.function-call.arguments.python"),
    beginCaptures: {
      2: {
        name: scopes("punctuation.definition.arguments.begin.python"),
      },
    },
    endCaptures: {
      1: {
        name: scopes("punctuation.definition.arguments.end.python"),
      },
    },
    patterns: [
      {
        begin: `([r|R]?f|F)('''|"""|'|")(\\\\$)?`,
        end: `(\\2)`,
        name: scopes("string.quoted.python", "string.interpolated.python", "meta.fstring.python"),
        contentName: scopes(`meta.embedded.inline.${spec.lang}`),
        beginCaptures: {
          1: {
            name: scopes("storage.type.string.python"),
          },
          2: {
            name: scopes("punctuation.definition.string.begin.python"),
          },
          3: {
            name: scopes("constant.language.python"),
          },
        },
        endCaptures: {
          1: {
            name: scopes("punctuation.definition.string.end.python"),
          },
        },
        patterns: [
          { include: "#f-escape" },
          { include: "#f-expression" },
          { include: spec.source },
        ],
      },
      {
        begin: `(r|R)?('''|"""|'|")(\\\\$)?`,
        end: "(\\2)",
        name: scopes("string.quoted.python"),
        contentName: scopes(`meta.embedded.inline.${spec.lang}`),
        beginCaptures: {
          1: {
            name: scopes("storage.type.string.python"),
          },
          2: {
            name: scopes("punctuation.definition.string.begin.python"),
          },
          3: {
            name: scopes("constant.language.python"),
          },
        },
        endCaptures: {
          1: {
            name: scopes("punctuation.definition.string.end.python"),
          },
        },
        patterns: [{ include: spec.source }],
      },
    ],
  };
}

export function gen(specs: Spec[]) {
  const grammar = {
    comment: "This file is autogenerated.",
    scopeName: "embed-in-python",
    fileTypes: [],
    injectionSelector: "L:source -comment -(string -meta.embedded)",
    patterns: specs.map((spec) => make_lang(spec)),
    repository: REPOSITORY,
  };

  return grammar;
}
