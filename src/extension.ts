// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { start } from 'repl';

export function splitLines(text : string): any {
	const myRe = /\(\s*([^)]+?)\s*\)/;
	const args = myRe.exec(text);
	if (args && args[1]) {
		const startIndex = args.index;
		const endIndex = startIndex + args[0].length;
		const splitArgs = args[1].split(/\s*,\s*/).join(',\n');
		const beforeText = text.substr(0, startIndex);
		const afterText = text.substr(endIndex, startIndex);
		const newText = beforeText + '(\n' + splitArgs + '\n)' + afterText;
		return [newText, startIndex, splitArgs.length + 2]
	}
	return [null, null, null];
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "argument-line-splitter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerTextEditorCommand('extension.helloWilliam', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
		try {
			const activeEditor = vscode.window.activeTextEditor;
			if (activeEditor !== undefined) {
				const myLineNumber = activeEditor.selection.active.line;
				const myLine = activeEditor.document.lineAt(myLineNumber);
				const myText = myLine.text;
				const [myNewText, myStartIndex, myNumLines] = splitLines(myText);
				if (myNewText === null)
					return;

				const myEdit = new vscode.WorkspaceEdit();
				myEdit.replace(activeEditor.document.uri, myLine.range, myNewText);
				const start = new vscode.Position(myLineNumber, myStartIndex)
				const end = new vscode.Position(myLineNumber + myNumLines - 1, 0)
				vscode.workspace.applyEdit(myEdit).then(success => {
					activeEditor.selection = new vscode.Selection(start, end);
					vscode.commands.executeCommand('editor.action.formatSelection').then(success => {
						activeEditor.selection = new vscode.Selection(end, end);
					})
				});
				return;
			}
		} catch (e) {
			console.error(e);
			throw e;
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
