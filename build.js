const fs = require("fs");

const gen_grammar = require("./out/gen_grammar");

const result = gen_grammar.gen(gen_grammar.DEF_SPECS);
fs.writeFileSync("./syntaxes/embed-in-python.json", JSON.stringify(result, null, 4));

// patch package.json defaults for the lang triggers
defs = Object.fromEntries(gen_grammar.DEF_SPECS.map((spec) => [spec.lang, spec.trigger]));
package_json = JSON.parse(fs.readFileSync("package.json"));
package_json.contributes.configuration.properties["python-fstring-dsl.grammar.triggers"].default =
  defs;
fs.writeFileSync("package.json", JSON.stringify(package_json, null, 4));
