import * as vscode from 'vscode';

async function search(input : string) {
	const got = (await import("got")).got;
	const uri = encodeURI(`https://pkg.go.dev/search?q=${input}`);
	const req = await got.get(uri);
	return req.body;
}

export function activate(context: vscode.ExtensionContext) { 
	console.log("Activating extension pkg-go-dev");

	const searchCommand = vscode.commands.registerCommand('pkg-go-dev.search', async () => {
		console.debug("Searching for package");
		const searchInput = await vscode.window.showInputBox({title: "Pkg-go-dev: Search", prompt:"Search packages or symbols"});
		if (searchInput) {
			const result = await search(searchInput);
			console.debug({r: result});
		}
	});


	context.subscriptions.push(searchCommand);
}

export function deactivate() {}
