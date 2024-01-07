import * as vscode from "vscode";
import * as fs from "fs";
import * as assert from "assert";
import * as sinon from "sinon"; // Add import statement for sinon package
import { activate } from "../extension";

suite("Extension Activation Test Suite", () => {
  let sandbox: sinon.SinonSandbox;

  setup(() => {
    sandbox = sinon.createSandbox();
  });

  teardown(() => {
    sandbox.restore();
  });

  test("Should register a command", () => {
    const registerCommandStub = sandbox.stub(
      vscode.commands,
      "registerCommand"
    );
    activate({ subscriptions: [] } as unknown as vscode.ExtensionContext);
    assert.ok(registerCommandStub.calledOnce);
  });

  test("Should read package.json", () => {
    const readFileSyncStub = sandbox.stub(fs, "readFileSync");
    activate({ subscriptions: [] } as unknown as vscode.ExtensionContext); // Fix the incorrect type assertion
    assert.ok(
      readFileSyncStub.calledWith(
        vscode.workspace.rootPath + "/package.json",
        "utf8"
      )
    );
  });

  test("Should show quick pick with scripts", async () => {
    const showQuickPickStub = sandbox.stub(vscode.window, "showQuickPick");
    activate({ subscriptions: [] } as unknown as vscode.ExtensionContext); // Fix the incorrect type assertion
    assert.ok(showQuickPickStub.calledOnce);
  });

  test("Should handle error when reading package.json", () => {
    sandbox.stub(fs, "readFileSync").throws(new Error());
    const showErrorMessageStub = sandbox.stub(
      vscode.window,
      "showErrorMessage"
    );
    activate({ subscriptions: [] } as unknown as vscode.ExtensionContext); // Fix the incorrect type assertion
    assert.ok(showErrorMessageStub.calledWith("Error reading package.json"));
  });
});
