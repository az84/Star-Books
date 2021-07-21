/** */
var searchButton = $("#search-btn");
var searchInput = $("#search-bar");
//var resultsText = $("#results-list");
var resultsList = $("#list-results");
var PrevSearchList = $("#previous-searches-list-results");
var resultCard = $(".result-card");
var favoriteLabel = $('.label');
var favoriteMenu = $('.favorite-menu');
var storageArr = [];

// For loop to persist HTML data 
for (var i = 0; i < localStorage.length; i++) {

  var prevSearch = localStorage.getItem(i);
  var prevSearchItem = $("#previous-searches-list-results").addClass("list-group-item");

  console.log(localStorage.getItem(i));

  prevSearchItem.append("<li>" + prevSearch + "</li>");
}

// Key count for local storage
var keyCount = 0;


// || Displaying favorites from local storage
function getFavorites() {
  if (localStorage.getItem('book') === null) {

  } else {
    storageArr = storageArr.concat(JSON.parse(localStorage.getItem('book')));
    console.log(storageArr);

    for (var i = 0; i < storageArr.length; i++) {
      var requestUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${storageArr[i]}&key=AIzaSyA3C3fX17i43ey6iVthUwijF1A1MySz0lU`;

      fetch(requestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          var bookCard = document.createElement('li');
          bookCard.setAttribute('class', 'card cell medium-2 small-4 result-card');

          var linkBook = document.createElement('a');
          linkBook.href = data.items[0].volumeInfo.infoLink;
          linkBook.setAttribute('target', '_blank');
          bookCard.append(linkBook);

          console.log(data.items[0].volumeInfo.imageLinks.thumbnail);
          var thumbImg = document.createElement('img');
          thumbImg.setAttribute('alt', `${data.items[0].volumeInfo.title}`)
          thumbImg.src = data.items[0].volumeInfo.imageLinks.thumbnail;
          linkBook.append(thumbImg);

          var favoriteEl = document.createElement('span');
          favoriteEl.setAttribute('class', 'label warning');
          favoriteEl.textContent = 'Remove';
          bookCard.append(favoriteEl);

          var isbnNumber = document.createElement('span');
          isbnNumber.textContent = data.items[0].volumeInfo.industryIdentifiers[0].identifier;
          isbnNumber.setAttribute('style', 'display: none');
          bookCard.append(isbnNumber);

          favoriteMenu.append(bookCard);
        })
    }
  }
}
getFavorites();

// || Clear search results
var clearSearch = $("#clear") 
function clear(event) {
  event.preventDefault()
  resultsList.empty();
}
clearSearch.on('click', clear);

// || Clear previous search list
var clearPrevSearch = $("#clearPrev")
function clear2(event) {
  event.preventDefault()
  PrevSearchList.empty();
}
clearPrevSearch.on('click', clear2);

// || Retrieving results from search and displaying on screen
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
      var prevSearch = $("#previous-searches-list-results").addClass("list-group-item");
      prevSearch.append("<li>" + searchInput + "</li>");
      console.log(searchInput);
      console.log(prevSearch);
      //console.log(requestUrl)
      console.log(response);
      //console.log(response.kind);
      //console.log(response.totalItems);
      console.log(response);
      //console.log(response.items.volumeInfo.authors);
      for (var i = 0; i < response.items.length; i++) {
        var bookCard = document.createElement('li');
        bookCard.setAttribute('class', 'card cell small-2 result-card');

        var linkBook = document.createElement('a');
        linkBook.href = response.items[i].volumeInfo.infoLink;
        linkBook.setAttribute('target', '_blank');
        bookCard.append(linkBook);

        //console.log(response.items[i].volumeInfo);
        //console.log(response.items[i].volumeInfo.imageLinks.thumbnail);
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

searchInput.on('keyup', function (e) {
  if (e.keyCode === 13) {
    getApi(e)
  }
})

var bestSellersList = $("#best-seller-list-results");
var submitBtn = $("#submit");

function getNytApi(event) {
  event.preventDefault()

  bestSellersList.empty();
  var listType = document.getElementById('list-type');
  var listValue = listType.options[listType.selectedIndex].value;

  listType.addEventListener("change", (e) => {
    const value = e.target.value;
    const text = listType.options[listType.selectedIndex].value;

    if (value) {
      //document.getElementById("pick").textContent = `Value Selected: ${value}`;
      listValue = listType.options[listType.selectedIndex].value;
      console.log(listValue)
    } else {
      document.getElementById("pick").textContent = "";
    }
  });

  var requestUrlNyt = "https://api.nytimes.com/svc/books/v3/lists/current/" + listValue + ".json?&api-key=sRQWJNPgmG9zigAss0SflGl9oOG4nTnU";
  console.log(requestUrlNyt);

  fetch(requestUrlNyt)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(requestUrlNyt)

      for (var i = 0; i < response.results.books.length; i++) {
        //console.log(response.results.books[i].title)
        var bookCard = document.createElement('li');
        bookCard.setAttribute('class', 'card cell small-2 result-card');

        var linkBook = document.createElement('a');
        linkBook.href = response.results.books[i].amazon_product_url;
        linkBook.setAttribute('target', '_blank');
        bookCard.append(linkBook);

        var thumbImg = document.createElement('img');
        thumbImg.setAttribute('alt', `${response.results.books[i].title}`)
        thumbImg.src = response.results.books[i].book_image;
        linkBook.append(thumbImg);

        var favoriteEl = document.createElement('span');
        favoriteEl.setAttribute('class', 'label warning');
        favoriteEl.textContent = 'Favorite Me';
        bookCard.append(favoriteEl);

        var isbnNumber = document.createElement('span');
        isbnNumber.textContent = response.results.books[i].primary_isbn13;
        console.log(response.results.books[i].primary_isbn13);
        console.log(isbnNumber.textContent);
        isbnNumber.setAttribute('style', 'display: none');
        bookCard.append(isbnNumber);

        bestSellersList.append(bookCard);

        console.log(response.results.books[i].amazon_product_url);
        console.log(resultCard);

      }
    })
}
submitBtn.on('click', getNytApi)

// || Saving book to favorites section
function saveBook() {
  // || Finding unique International Standard Book Number(isbn) tied to book and adding to local storage
  var isbnRetrieval = $(this).siblings().eq(2).prevObject[1].innerHTML;
  console.log(isbnRetrieval);
  storageArr = storageArr.concat(isbnRetrieval);
  console.log(storageArr);
  localStorage.setItem('book', JSON.stringify(storageArr));
  console.log(localStorage.getItem('book'));
  console.log('click');

  var requestUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnRetrieval}&key=AIzaSyA3C3fX17i43ey6iVthUwijF1A1MySz0lU`;

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

      console.log(data.items[0].volumeInfo.imageLinks.thumbnail);
      var thumbImg = document.createElement('img');
      thumbImg.setAttribute('alt', `${data.items[0].volumeInfo.title}`)
      thumbImg.src = data.items[0].volumeInfo.imageLinks.thumbnail;
      linkBook.append(thumbImg);

      var favoriteEl = document.createElement('span');
      favoriteEl.setAttribute('class', 'label warning');
      favoriteEl.textContent = 'Remove';
      bookCard.append(favoriteEl);

      var isbnNumber = document.createElement('span');
      isbnNumber.textContent = data.items[0].volumeInfo.industryIdentifiers[0].identifier;
      isbnNumber.setAttribute('style', 'display: none');
      bookCard.append(isbnNumber);

      favoriteMenu.append(bookCard);
    })
}

resultsList.on('click', '.label', saveBook);

// || Removing item from favorites section
function removeBook() {
  $(this).parent().attr('style', 'display: none');
  var isbnRetrieval = $(this).siblings().eq(2).prevObject[1].innerHTML;
  for (var i = 0; i < storageArr.length; i++) {
    if (isbnRetrieval === storageArr[i]) {
      var indexRemoval = storageArr.indexOf(isbnRetrieval);
      storageArr.splice(indexRemoval, 1);
      localStorage.setItem('book', JSON.stringify(storageArr));
    }
  }
}
favoriteMenu.on('click', '.label', removeBook);




