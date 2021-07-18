var searchButton = $("#search-btn");
//var searchInput = $("#searchBar").val();
//var resultsText = $("#results-list");
var resultsList = $("#list-results");
var resultCard = $(".result-card");
var favoriteLabel = $('.label');
var favoriteMenu = $('.favorite-menu');
var storageArr = [];

function getFavorites() {
  // storageArr = storageArr.concat(JSON.parse(localStorage.getItem('book')));
  // console.log(storageArr);

  // var testItem = $('<li>');
  // testItem.text('THIS IS A TEST');
  // favoriteMenu.append(testItem);

  // for (var i = 0; i < storageArr.length; i++) {
  //   favoriteMenu.append(storageArr[i]);
  // }
}
getFavorites();

// || Clear search results
var clearSearch = $("#clear")
function clear(event) {
  event.preventDefault()
  resultsList.empty();
}
clearSearch.on('click', clear);

function getApi(event) {
  event.preventDefault()
  var searchInput = $("#search-bar").val();
  console.log(searchInput)
  var requestUrl = "https://www.googleapis.com/books/v1/volumes?q=" + searchInput + "&key=AIzaSyA3C3fX17i43ey6iVthUwijF1A1MySz0lU";
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(searchInput);
      //console.log(requestUrl)
      console.log(response);
      //console.log(response.kind);
      //console.log(response.totalItems);
      console.log(response.items);
      for (var i = 0; i < response.items.length; i++) {
        var bookCard = document.createElement('li');
        bookCard.setAttribute('class', 'card cell small-2 result-card');

        var linkBook = document.createElement('a');
        linkBook.href = response.items[i].volumeInfo.infoLink;
        linkBook.setAttribute('target', '_blank');
        bookCard.append(linkBook);

        //console.log(response.items[i].volumeInfo);
        console.log(response.items[i].volumeInfo.imageLinks.thumbnail);
        var thumbImg = document.createElement('img');
        thumbImg.setAttribute('alt', `${response.items[i].volumeInfo.title}`)
        thumbImg.src = response.items[i].volumeInfo.imageLinks.thumbnail;
        linkBook.append(thumbImg);

        var favoriteEl = document.createElement('span');
        favoriteEl.setAttribute('class', 'label warning');
        favoriteEl.textContent = 'Favorite Me';
        bookCard.append(favoriteEl);

        var isbnNumber = document.createElement('span');
        isbnNumber.textContent = response.items[i].volumeInfo.industryIdentifiers[0].identifier;
        console.log(response.items[i].volumeInfo.industryIdentifiers[0].identifier);
        console.log(isbnNumber.textContent);
        isbnNumber.setAttribute('style', 'display: none');
        bookCard.append(isbnNumber);

        resultsList.append(bookCard);

        console.log(response.items[i].volumeInfo.infoLink);
        console.log(resultCard);
        //console.log(response.items[i].volumeInfo.industryIdentifiers)
      }
      if (searchInput != "") {
        console.log(searchInput);
      } else {
        (function (response) {
          console.log(searchInput)
        })
      }
    });
}
searchButton.on('click', getApi);


var bestSellersList = $("best-seller-list-results")
var requestUrlNyt = "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?&api-key=sRQWJNPgmG9zigAss0SflGl9oOG4nTnU"
function getNytApi(requestUrlNyt) {
  fetch(requestUrlNyt)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response)
      //response.results.books.forEach(title => console.log(title));
      var title;
      for (var i = 0; i < response.results.books.length; i++) {
        //console.log(response.results.books[i].title)
        title = response.results.books[i].title;
        console.log(title)
      }
    })
}

getNytApi(requestUrlNyt);

function saveBook() {

  var isbnRetrieval = $(this).siblings().eq(2).prevObject[1].innerHTML;
  console.log(isbnRetrieval);
  storageArr = storageArr.concat(isbnRetrieval);
  console.log(storageArr);
  localStorage.setItem('book', JSON.stringify(storageArr));
  console.log(localStorage.getItem('book'));
  console.log('click');

  var requestUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnRetrieval}`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var bookCard = document.createElement('li');
      bookCard.setAttribute('class', 'card cell small-2 result-card');

      var linkBook = document.createElement('a');
      linkBook.href = data.items[0].volumeInfo.infoLink;
      linkBook.setAttribute('target', '_blank');
      bookCard.append(linkBook);

      //console.log(response.items[i].volumeInfo);
      console.log(data.items[0].volumeInfo.imageLinks.thumbnail);
      var thumbImg = document.createElement('img');
      thumbImg.setAttribute('alt', `${data.items[0].volumeInfo.title}`)
      thumbImg.src = data.items[0].volumeInfo.imageLinks.thumbnail;
      linkBook.append(thumbImg);

      var favoriteEl = document.createElement('span');
      favoriteEl.setAttribute('class', 'label warning');
      favoriteEl.textContent = 'Favorite Me';
      bookCard.append(favoriteEl);

      var isbnNumber = document.createElement('span');
      isbnNumber.textContent = data.items[0].volumeInfo.industryIdentifiers[0].identifier;
      // console.log(response.items[i].volumeInfo.industryIdentifiers[0].identifier);
      // console.log(isbnNumber.textContent);
      isbnNumber.setAttribute('style', 'display: none');
      bookCard.append(isbnNumber);

      favoriteMenu.append(bookCard);

      // console.log(response.items[i].volumeInfo.infoLink);
      // console.log(resultCard);

    })
}

resultsList.on('click', '.label', saveBook);