import * as vscode from 'vscode';
import * as commands from './commands';

export function activate(context: vscode.ExtensionContext) { 
	console.log("Activating extension pkg-go-dev");

	const searchCommand = vscode.commands.registerCommand('pkg-go-dev.search', commands.Search);
	const showCommand = vscode.commands.registerCommand('pkg-go-dev.show', async (packageDocUrl) => {
		const webview = vscode.window.createWebviewPanel("pkg-go-dev.detailView", `Detail of Hello World`, vscode.ViewColumn.Active, {
			enableScripts: true,
			enableFindWidget: true,
		});

		const got = (await import("got")).got;
		const detailResponse = await got.get(packageDocUrl.toString());
		if (200 !== detailResponse.statusCode) {
			vscode.window.showErrorMessage(`Unable to fetch documentation from ${packageDocUrl} : ${detailResponse.statusMessage}`);
			return;
		}
		const htmlDoc = detailResponse.body;
		webview.webview.html = htmlDoc;

		webview.reveal();
	});
	
	context.subscriptions.push(searchCommand);
	context.subscriptions.push(showCommand);
}

export function deactivate() {}
