import * as vscode from "vscode";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "firestarter.runScript",
    async () => {
      const packageJsonPath = vscode.workspace.rootPath + "/package.json";
      try {
        const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
        const packageJson = JSON.parse(packageJsonContent);
        const scripts = packageJson.scripts;

        if (scripts) {
          const selectedScript = await vscode.window.showQuickPick(
            Object.keys(scripts),
            {
              placeHolder: "Select a script to run",
            }
          );

          if (selectedScript) {
            const terminal = vscode.window.createTerminal();
            terminal.sendText(`npm run ${selectedScript}`);
            terminal.show();
          }
        } else {
          vscode.window.showInformationMessage(
            "No scripts found in package.json"
          );
        }
      } catch (error) {
        vscode.window.showErrorMessage("Error reading package.json");
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
