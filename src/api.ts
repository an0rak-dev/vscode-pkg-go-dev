import parse from 'node-html-parser';

const searchLimit = 100;
const baseURL = "https://pkg.go.dev"

interface Package {
	name: string;
    link: URL;
	import: string;
	synopsis: string;
};

export async function searchPackages(input : string) : Promise<Package[]> {
	const got = (await import("got")).got;
	const uri = encodeURI(`${baseURL}/search?q=${input}&limit=${searchLimit}`);
	console.debug(`Searching a Go package documentation for ${input}`)
	const body = (await got.get(uri)).body;

    const dom = parse(body);
	const searchResults = dom.querySelectorAll('.SearchSnippet');
	console.debug(`Found ${searchResults.length} results for this search.`)
	
    let result : Package[] = [];
	for (var searchResult of searchResults) {
        const goPkgLink = searchResult.querySelector('a');
		const header = goPkgLink?.innerText;
		if (!header) {
			console.warn("No header found in search result, skipping it.")
			continue;
		}
		const sanitizedHeader = header.replace(/(\n|\s\s+)/gm, "").split('(');
		result = result.concat({
			name: sanitizedHeader[0],
            link: new URL(`${baseURL}${goPkgLink?.getAttribute("href") || ""}`),
			import: sanitizedHeader[1].substring(0, sanitizedHeader[1].length-1),
			synopsis: (searchResult.querySelector('p')?.innerText || "").trim()
		});
	}
	return result;
}