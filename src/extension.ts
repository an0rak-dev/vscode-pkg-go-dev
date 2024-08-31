import * as vscode from 'vscode';
import * as commands from './commands';

export function activate(context: vscode.ExtensionContext) { 
	console.log("Activating extension pkg-go-dev");

	const searchCommand = vscode.commands.registerCommand('pkg-go-dev.search', commands.Search);
	const showCommand = vscode.commands.registerCommand('pkg-go-dev.show', commands.ShowDetails);
	
	context.subscriptions.push(searchCommand);
	context.subscriptions.push(showCommand);
}

export function deactivate() {}
