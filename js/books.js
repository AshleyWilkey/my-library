//https://www.theodinproject.com/lessons/node-path-javascript-objects-and-object-constructors

function Book(book) {
  this.id = book.id;
  this.author = book.author;
  this.coverImg = book.coverImg;
  this.description = book.description;
  this.publishYear = book.publishYear;
  this.pages = book.pages;
  this.read = false;
  this.title = book.title;
}

// & this is a second way to define a method
Book.prototype.markAsRead = function () {
  this.read = true;
};
