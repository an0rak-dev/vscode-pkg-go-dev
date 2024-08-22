import * as vscode from 'vscode';
import * as commands from './commands';

export function activate(context: vscode.ExtensionContext) { 
	console.log("Activating extension pkg-go-dev");

	const searchCommand = vscode.commands.registerCommand('pkg-go-dev.search', commands.Search);
	
	context.subscriptions.push(searchCommand);
}

export function deactivate() {}
