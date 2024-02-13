let searchResults = [];

/**
 * @type {Array.<Book>}
 */
let myLibrary = getLibrary();

const searchForm = document.getElementById("search-form");
const resultsElement = document.getElementById("results");
const libraryElement = document.getElementById("library");

renderLibraryName();
renderLibrary();

searchForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const searchTerm = e.target["search"].value;

  resultsElement.innerHTML = "";

  const { docs } = await search(searchTerm);

  searchResults = docs
    .filter((doc) => doc.cover_i)
    .map((doc) => ({
      ...doc,
      cover_img: getCoverImg(doc.cover_i),
    }));

  renderResults(searchResults);
});

// Rendering

function renderResults(docs) {
  for (const doc of docs) {
    const el = buildResultElement(doc);
    resultsElement.appendChild(el);
  }
}

function renderLibrary() {
  for (const book of myLibrary) {
    const el = buildBookElement(book);
    libraryElement.appendChild(el);
  }
}

function renderLibraryName() {
  const myName = localStorage.getItem("name");
  const libraryName = document.getElementById("library-name");

  if (!myName || myName === "null") {
    const nameInput = prompt("Please tell me your name");

    if (nameInput) {
      localStorage.setItem("name", nameInput);
      libraryName.innerText = `${nameInput}'s Library`;
    } else {
      libraryName.innerText = "My Library";
    }
  } else {
    libraryName.innerText = `${myName}'s Library`;
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
      <div class="col result-action">
        <button 
          class="btn btn-light result-add"
          onclick="addBookToLibrary('${doc.key}')"
        >
          <img src="images/book-plus-outline.svg" alt="add book icon"/>
        </button>
      </div>
    </div>
  </div>
  `;

  return div;
}

function buildBookElement(book) {
  const div = document.createElement("div");

  div.id = book.id;

  div.innerHTML = `
  <div class="card">
    <div class="row g-0">
      <div class="col-md-4">
        <img
          src="${book.coverImg}"
          class="img-thumbnail rounded-start h-auto"
          alt="..."
        />
      </div>
      <div class="col-md-8">
        <button
          class="btn btn-light book-remove btn-action"
          onclick="removeBookFromLibrary('${book.id}')"
        >
          <img src="images/close-box-outline.svg" alt="add book icon"/>
        </button>
        <div class="card-body">
          <h5 class="card-title mb-0 
            ${book.title.length > 39 ? "fs-6" : ""}">
            ${book.title}
          </h5>
        <p class="book-author"><em>by ${book.author}</em></p>
        <p class="card-text book-text">
          ${truncateStr(getSentences(book.description, 2), 140)}
          </p>
          <p class="card-text">
            <small class="text-body-secondary">
              First published ${book.publishYear}
            </small>
            <br/>
            ${renderPages(book.pages)}
          </p>
          <div class="btn-actions">
            <button 
              class="btn btn-light btn-action"
              id="readBook"
              onclick="toggleProperty('${book.id}', 'read')"
            >
              <img 
                src="${
                  book.read
                    ? "images/book-check.svg"
                    : "images/book-check-outline.svg"
                }"
                alt="add book icon"
              />
              Mark as Read
            </button>
            <button 
              class="btn btn-light btn-action"
              id="loveBook"
              onclick="toggleProperty('${book.id}', 'love')"
            >
              <img
                src="${
                  book.love
                    ? "images/book-heart.svg"
                    : "images/book-heart-outline.svg"
                }"
                alt="add book icon"
              />Loved it
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  return div;
}

// Actions
async function addBookToLibrary(key) {
  // /works/OL45804W
  const workId = key.split("/")[2];

  if (getBook(workId)) return;

  const { description } = await getWork(workId);
  const result = searchResults.find((el) => el.key === key);
  const book = new Book({
    id: workId,
    author: result.author_name[0],
    coverImg: result.cover_img,
    description: description
      ? getDescription(description)
      : "No description available",
    publishYear: result.first_publish_year,
    pages: result.number_of_pages_median,
    title: result.title,
  });

  myLibrary.push(book);

  const bookElement = buildBookElement(book);
  libraryElement.appendChild(bookElement);

  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function toggleProperty(workId, prop) {
  const idx = myLibrary.findIndex((book) => {
    console.log(workId, book.id);
    return workId === book.id;
  });
  const toggleTo = !myLibrary[idx][prop];
  myLibrary[idx][prop] = toggleTo;

  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));

  const icon = document
    .getElementById(workId)
    .querySelector(`#${prop}Book img`);

  if (prop === "read") {
    if (toggleTo) icon.src = "images/book-check.svg";
    else icon.src = "images/book-check-outline.svg";
  } else if (prop === "love") {
    if (toggleTo) icon.src = "images/book-heart.svg";
    else icon.src = "images/book-heart-outline.svg";
  }
}

function removeBookFromLibrary(workId) {
  const bookElement = document.getElementById(workId);
  bookElement.remove();

  myLibrary = myLibrary.filter((book) => workId !== book.id);

  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

// Helpers

function getLibrary() {
  const library = localStorage.getItem("myLibrary");

  return library ? JSON.parse(library) : [];
}

function getBook(workId) {
  return myLibrary.find((book) => workId === book.id);
}

function getCoverImg(coverId) {
  if (coverId) return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;

  return "images/book-off.svg";
}

function getDescription(description) {
  if (typeof description === "string") return description;
  return description.value;
}

function truncateStr(str, atIndex) {
  if (str.length > atIndex) return str.slice(0, atIndex) + "...";
  return str;
}

function getSentences(str, amount) {
  const sentences = str.split(".");

  if (sentences.length > amount)
    return sentences.slice(0, amount).join(".") + ".";
  return str;
}

function renderPages(pages) {
  if (pages)
    return `
      <small class="text-body-secondary">
      ${pages} pages
      </small>
    `;
  return "";
}
