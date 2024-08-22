import * as vscode from 'vscode';
import parse from 'node-html-parser';

interface Package {
	name: string;
	import: string;
	synopsis: string;
};

async function search(input : string) {
	const got = (await import("got")).got;
	const uri = encodeURI(`https://pkg.go.dev/search?q=${input}&limit=100`);
	console.debug(`Searching a Go package documentation for ${input}`)
	const req = await got.get(uri);
	return req.body;
}

function transformToPackage(rawHtml: string) : Package[] {
	const dom = parse(rawHtml);
	const searchResults = dom.querySelectorAll('.SearchSnippet');
	console.debug(`Found ${searchResults.length} results for this search.`)
	let result : Package[] = [];
	for (var searchResult of searchResults) {
		const header = searchResult.querySelector('a')?.innerText;
		if (!header) {
			console.warn("No header found in search result, skipping it.")
			continue;
		}
		const sanitizedHeader = header.replace(/(\n|\s\s+)/gm, "").split('(');
		result = result.concat({
			name: sanitizedHeader[0],
			import: sanitizedHeader[1].substring(0, sanitizedHeader[1].length-1),
			synopsis: searchResult.querySelector('p')?.innerText || ""
		});
	}
	return result;
}

export function activate(context: vscode.ExtensionContext) { 
	console.log("Activating extension pkg-go-dev");

	const searchCommand = vscode.commands.registerCommand('pkg-go-dev.search', async () => {
		console.debug("Searching for package");
		const searchInput = await vscode.window.showInputBox({title: "Pkg-go-dev: Search", prompt:"Search packages or symbols"});
		if (searchInput) {
			const rawHtml = await search(searchInput);
			const searchResults = transformToPackage(rawHtml);
			vscode.window.showQuickPick(searchResults.map(r => { return {label: r.name, description: r.import, detail: r.synopsis } }));
		}
	});


	context.subscriptions.push(searchCommand);
}

export function deactivate() {}
