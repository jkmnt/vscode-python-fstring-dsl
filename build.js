const fs = require("fs");

const gen_grammar = require("./out/gen_grammar");

const result = gen_grammar.gen(gen_grammar.DEF_SPECS);
const json = JSON.stringify(result, null, 4);
fs.writeFileSync("./syntaxes/embed-in-python.json", json)