async function search(searchTerm) {
  // get 5 books from OpenLibraryAPI
  // https://openlibrary.org/search.json?q=the+lord+of+the+rings
  const url = new URL("https://openlibrary.org/search.json");

  url.searchParams.append("q", searchTerm);
  url.searchParams.append("limit", "5");
  url.searchParams.append("language", "eng");
  url.searchParams.append(
    "fields",
    "title,author_name,cover_i,first_publish_year,number_of_pages_median,key"
  );

  const req = await fetch(url);

  return req.json();
}

async function getWork(workId) {
  const url = new URL(`https://openlibrary.org/works/${workId}.json`);

  const req = await fetch(url);

  return req.json();
}
