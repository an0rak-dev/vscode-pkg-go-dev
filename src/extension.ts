import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log("Activating extension pkg-go-dev");

	const searchCommand = vscode.commands.registerCommand('pkg-go-dev.search', () => {
		console.debug("Searching for package");
	});

	context.subscriptions.push(searchCommand);
}

export function deactivate() {}
