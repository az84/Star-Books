var searchButton = $("#search-btn");
var searchInput = $("#search-bar");
var topicSearched;
var resultsList = $("#list-results");
var prevSearchList = $("#previous-searches-list-results");
var resultCard = $(".result-card");
var favoriteLabel = $('.label');
var favoriteMenu = $('.favorite-menu');
var storageArr = [];
var prevSearchArr = [];



// || Displaying search history to page
function loadSearchHistory() {
  if (localStorage.getItem('previous-search') === null) {
  } else if (localStorage.getItem('previous-search') === '') {

  }
  else {
    prevSearchArr = prevSearchArr.concat(JSON.parse(localStorage.getItem('previous-search')));
    console.log(prevSearchArr);
    for (var i = 0; i < prevSearchArr.length; i++) {
      var searchedItem = $('<div>');
      var prevSearchBtn = $('<button>');
      prevSearchBtn.addClass('button secondary');
      prevSearchBtn.text(prevSearchArr[i]);
      searchedItem.attr('style', 'margin-bottom: 15px;')
      searchedItem.append(prevSearchBtn);
      prevSearchList.append(searchedItem);
    }
  }
}
loadSearchHistory();

// Key count for local storage
var keyCount = 0;


// || Displaying favorites from local storage
function getFavorites() {
  if (localStorage.getItem('book') === null) {
  } else {
    storageArr = storageArr.concat(JSON.parse(localStorage.getItem('book')));
    console.log(storageArr);

    for (var i = 0; i < storageArr.length; i++) {
      var requestUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${storageArr[i]}`;

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
  prevSearchList.empty();
  prevSearchArr = [];
  localStorage.setItem('previous-search', prevSearchArr)
}
clearPrevSearch.on('click', clear2);

function checkInputValue() {
  if (searchInput.val() === '') {
    return;
  } else {
    getApi();
  }
}

// || Retrieving results from search and displaying on screen
function getApi(event) {

  console.log(topicSearched);
  var requestUrl = "https://www.googleapis.com/books/v1/volumes?q=" + topicSearched;
  fetch(requestUrl)
    .then(function (response) {
      if (response.status === 400) {
        // || Message displaying that city is invalid
        return;
      } else {
        return response.json();
      }
    })
    .then(function (response) {
      saveSearchItem();
      console.log(searchInput);
      console.log(response);
      console.log(response);
      for (var i = 0; i < response.items.length; i++) {
        var bookCard = document.createElement('li');
        bookCard.setAttribute('class', 'card cell small-2 result-card');

        var linkBook = document.createElement('a');
        linkBook.href = response.items[i].volumeInfo.infoLink;
        linkBook.setAttribute('target', '_blank');
        bookCard.append(linkBook);

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

// || Saving searched topics in local storage
function saveSearchItem() {
  if (topicSearched === '') {

  } else if (topicSearched === null) {

    // || If it has already been searched, don't save it
  } else {
    var searchQuery = topicSearched;
    var repeat;
    for (var i = 0; i < prevSearchArr.length; i++) {
      if (searchQuery === prevSearchArr[i]) {
        repeat = true;
        break;
      }
    }

    // || If it isn't in local storage yet, save it
    if (!repeat) {
      var historyDiv = $('<div>');
      var searchHistoryItem = $('<button>');
      searchHistoryItem.text(searchQuery);
      console.log(searchHistoryItem.text());
      searchHistoryItem.addClass('button secondary');

      historyDiv.append(searchHistoryItem);
      prevSearchList.append(historyDiv);

      prevSearchArr = prevSearchArr.concat(searchQuery);
      console.log(prevSearchArr);
      localStorage.setItem('previous-search', JSON.stringify(prevSearchArr));
    }
  }
}

// || Search button event listener
searchButton.on('click', function () {
  topicSearched = searchInput.val();
  checkInputValue();
});

// || Searching by hitting enter
searchInput.on('keyup', function (e) {
  if (e.keyCode === 13) {
    topicSearched = searchInput.val();
    checkInputValue();
  }
})

var bestSellersList = $("#best-seller-list-results");
var submitBtn = $("#submit");

// || Calling New York Times API
function getNytApi(event) {
  event.preventDefault()

  bestSellersList.empty();
  var listType = document.getElementById('list-type');
  var listValue = listType.options[listType.selectedIndex].value;

  listType.addEventListener("change", (e) => {
    const value = e.target.value;
    const text = listType.options[listType.selectedIndex].value;

    if (value) {
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
// || New york times submit event listener
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
bestSellersList.on('click', '.label', saveBook);

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

// || Event listener on the remove label in Favorites section
favoriteMenu.on('click', '.label', removeBook);

// || Event listener to search by clicking on previously searched items
prevSearchList.on('click', 'button', function () {
  topicSearched = $(this).text();
  getApi();
});


