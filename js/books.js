//https://www.theodinproject.com/lessons/node-path-javascript-objects-and-object-constructors

function Book(book) {
  this.title = book.title;
  this.author = book.author;
  this.pages = book.pages;
  this.read = false;
}

// & this is a second way to define a method
Book.prototype.markAsRead = function () {
  this.read = true;
};
