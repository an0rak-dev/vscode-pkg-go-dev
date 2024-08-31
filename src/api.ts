import { JSDOM } from "jsdom";

const searchLimit = 100;
const baseURL = "https://pkg.go.dev"

interface Package {
	name: string;
    link: URL;
	import: string;
	synopsis: string;
};

interface PackageDetail {
	name: string;
};

export async function getPackageDetail(link: string) : Promise<PackageDetail> {
	const got = (await import("got")).got;
    const detailResponse = await got.get(link);
    if (200 !== detailResponse.statusCode) {
        throw Error(`Unable to fetch documentation from ${link} : ${detailResponse.statusMessage}`)
    }

	const dom = new JSDOM(detailResponse.body);
	const pkgName = dom.window.document.querySelector("main > header h1")?.innerHTML;
	// TODO Parse htmlDoc as an object
    return {
		name: pkgName || "",
	};
}

export async function searchPackages(input : string) : Promise<Package[]> {
	const got = (await import("got")).got;
	const uri = encodeURI(`${baseURL}/search?q=${input}&limit=${searchLimit}`);
	console.debug(`Searching a Go package documentation for ${input}`)
	const body = (await got.get(uri)).body;

    const dom = new JSDOM(body);
	const searchResults = dom.window.document.querySelectorAll('.SearchSnippet');
	console.debug(`Found ${searchResults.length} results for this search.`)
	
    let result : Package[] = [];
	for (var searchResult of searchResults) {
        const goPkgLink = searchResult.querySelector('a');
		const header = goPkgLink?.text;
		if (!header) {
			console.warn("No header found in search result, skipping it.")
			continue;
		}
		const sanitizedHeader = header.replace(/(\n|\s\s+)/gm, "").split('(');
		result = result.concat({
			name: sanitizedHeader[0],
            link: new URL(`${baseURL}${goPkgLink?.href || ""}`),
			import: sanitizedHeader[1].slice(0,-1),
			synopsis: (searchResult.querySelector('p')?.innerHTML || "").trim()
		});
	}
	return result;
}