import { resolve } from "path";
import { writeFileSync } from "fs";

import * as vscode from "vscode";
import * as gen from "./gen_grammar";

function generate_grammar(root: string) {
  return async () => {
    try {
      console.warn("here");

      const triggers: { [k: string]: string | boolean } =
        vscode.workspace
          .getConfiguration()
          .get("python-fstring-dsl.grammar.triggers") || {};

      const specs = [];
      for (const spec of gen.DEF_SPECS) {
        const trigger = triggers[spec.lang];
        if (trigger === undefined || trigger === true) {
          // not set, use default
          specs.push(spec);
        } else if (typeof trigger === "string") {
          // defined, use it
          specs.push({ ...spec, trigger });
        }
      }

      const grammar = gen.gen(specs);
      const json = JSON.stringify(grammar, null, 4);
      writeFileSync(
        resolve(root, "syntaxes/embed-in-python.json"),
        json,
        "utf-8"
      );
    } catch (e) {
      console.error((e as Error).stack);
      vscode.window.showErrorMessage(
        "Failed to generate f-string DSL grammar. Check `python-fstring-dsl.grammar.triggers`"
      );
      return;
    }

    const action = await vscode.window.showInformationMessage(
      "Successfully generated f-string DSL grammar. Reload VS Code to enable it.",
      "Reload"
    );
    if (action === "Reload") {
      vscode.commands.executeCommand("workbench.action.reloadWindow");
    }
  };
}

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "python-fstring-dsl.generate_grammar",
      generate_grammar(context.extensionPath)
    )
  );
}
