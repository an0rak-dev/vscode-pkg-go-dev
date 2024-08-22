import parse from 'node-html-parser';

const searchLimit = 100;

interface Package {
	name: string;
	import: string;
	synopsis: string;
};

export async function searchPackages(input : string) : Promise<Package[]> {
	const got = (await import("got")).got;
	const uri = encodeURI(`https://pkg.go.dev/search?q=${input}&limit=${searchLimit}`);
	console.debug(`Searching a Go package documentation for ${input}`)
	const body = (await got.get(uri)).body;

    const dom = parse(body);
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
			synopsis: (searchResult.querySelector('p')?.innerText || "").trim()
		});
	}
	return result;
}