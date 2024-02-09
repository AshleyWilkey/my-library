const searchForm = document.getElementById("search-form");
const resultsElement = document.getElementById("results");

searchForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const searchTerm = e.target["search"].value;

  // get 5 books from OpenLibraryAPI
  // https://openlibrary.org/search.json?q=the+lord+of+the+rings
  const url = new URL("https://openlibrary.org/search.json");

  url.searchParams.append("q", searchTerm);
  url.searchParams.append("limit", "5");
  url.searchParams.append("language", "eng");
  url.searchParams.append(
    "fields",
    "title,author_name,cover_i,first_publish_year,number_of_pages_median"
  );

  resultsElement.innerHTML = "";

  const req = await fetch(url);
  const { docs } = await req.json();

  renderResults(
    docs
      .filter((doc) => doc.cover_i)
      .map((doc) => ({
        ...doc,
        cover_img: getCoverImg(doc.cover_i),
      }))
  );
});

function renderResults(docs) {
  for (const doc of docs) {
    const el = buildResultElement(doc);
    resultsElement.appendChild(el);
  }
}

function buildResultElement(doc) {
  const div = document.createElement("div");
  div.innerHTML = `
  <div class="card result">
    <div class="row g-0">
      <div class="col result-img" style="background-image: url(${
        doc.cover_img
      });">
      </div>
      <div class="col">
        <div class="result-body">
          <h5 class="result-title">${truncateStr(doc.title, 30)}</h5>
          <p class="result-text">
          ${doc.author_name[0]}
          </p>
          <p class="result-text">
            <small class="text-body-secondary">
            ${doc.first_publish_year} 
            </small>
          </p>
        </div> 
      </div>
    </div>
  </div>
  `;

  return div;
}

function getCoverImg(coverId) {
  if (coverId) return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;

  return "images/book-off.svg";
}

function truncateStr(str, atIndex) {
  if (str.length > atIndex) return str.slice(0, atIndex) + "...";
  return str;
}
