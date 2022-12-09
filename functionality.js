/*===========================
	SETUP
===========================*/
//#region Setup
$(document).ready(function () {
  makeHidden();
  displayData();
  setRandomColor();
});

function setRandomColor() {
  let colorArray = [".tvshow"];

  for (let colorElement in colorArray) {
    $(colorArray[colorElement]).each(function () {
      $(this).css("background-color", random_color());
    });
  }
}

function random_color() {
  var letters = "0123456789ABCDEF".split("");
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.round(Math.random() * 15)];
  }
  color += "40";
  return color;
}

// Hide everything then display something when dropdown is changed
$("#dataSelection").on("change", function () {
  event.preventDefault();
  makeHidden();
  displayData();
});

//#endregion

//#region Hide/Show

// Hides all elements
function makeHidden() {
  $(".allTVshows").hide();
  $(".genreBox").hide();
}

// Shows the selected section and runs its function
function displayData() {
  switch ($("#dataSelection").val()) {
    case "all":
      allTVshows(1);
      break;
    case "rankedBtn":
      allTVshows(2);
      break;
    case "pubDate":
      allTVshows(3);
      break;
    case "episodeCount":
      allTVshows(4);
      break;
    case "genre":
      genreSetup("showGenre");
      break;
  }

  //setGradient();
}
//#endregion

/*===========================
      ALL TVshows Watched
  ===========================*/
//#region All TVshows
// Pulls all of the tvshows and displays them
function allTVshows(sortingNum) {
  let allTVshows = ``;
  let tvshowsForAll = 0;

  $(".allTVshows").show();

  let tvshowArr = JSON.parse(JSON.stringify(tvshowData));

  if (sortingNum == 2) {
    tvshowArr.sort(function (a, b) {
      return b.rating - a.rating;
    });
  } else if (sortingNum == 3) {
    tvshowArr.sort(function (a, b) {
      return b.yearReleased - a.yearReleased;
    });
  } else if (sortingNum == 4) {
    tvshowArr.sort(function (a, b) {
      return b.episodeCount - a.episodeCount;
    });
  }

  for (let i = 0; i < tvshowArr.length; i++) {
    allTVshows += `<div class="tvshow"><div class="title">${tvshowArr[i].title}</div><div class="year">${tvshowArr[i].yearReleased}</div>
        <div class="year">${tvshowArr[i].episodeCount} episodes</div><div class="rating">Rating: ${tvshowArr[i].rating}/10</div>
        <div class="rating">${tvshowArr[i].watchedAll == true ? "Completed" : "Watched 1+ Seasons"}</div></div>`;
    tvshowsForAll += 1;
    tvshowArr[i].id = i;
  }

  $(".allTVshows").html(`     
              <h3>${tvshowsForAll} shows</h3>
              <div class="tvshowList">${allTVshows}</div>
      `);

  setRandomColor();
}
//#endregion

/*==========================================
      TVshows BY Genre, Director, Country
  ==========================================*/
//#region Keyword
function genreSetup(sortType) {
  $(".genreBox").show();
  let tvshowArr = JSON.parse(JSON.stringify(tvshowData));
  let tvshowGenreArr = [];

  for (let i = 0; i < tvshowArr.length; i++) {
    for (let j = 0; j < tvshowArr[i][sortType].length; j++) {
      if (!tvshowGenreArr.includes(tvshowArr[i][sortType][j])) {
        tvshowGenreArr.push(tvshowArr[i][sortType][j]);
      }
    }
  }
  tvshowGenreArr.sort();
  printGenres(tvshowGenreArr, sortType);
}

function printGenres(tvshowGenreArr, sortType) {
  let tvshowList = ``;
  let tvshowCounts = {};

  for (let i = 0; i < tvshowGenreArr.length; i++) {
    tvshowList += `<div class="genreTitle" id="${tvshowGenreArr[i].replace(/\s/g, "")}">${tvshowGenreArr[i]}<span class="countNum"></span></div>`;
    for (let j = 0; j < tvshowData.length; j++) {
      if (tvshowData[j][sortType] == undefined) {
      } else {
        if (tvshowData[j][sortType].includes(tvshowGenreArr[i]) == true) {
          tvshowList += `<div class="tvshow"><div class="title">${tvshowData[j].title}</div><div class="year">${tvshowData[j].yearReleased}</div>
              <div class="year">${tvshowData[j].episodeCount} episodes</div><div class="rating">Rating: ${tvshowData[j].rating}/10</div>
              <div class="rating">${tvshowData[j].watchedAll == true ? "Completed" : "Watched 1+ Seasons"}</div></div>`;
          tvshowCounts[tvshowGenreArr[i]] = tvshowCounts[tvshowGenreArr[i]] + 1 || 1;
        }
      }
    }
  }

  $(".genreBox").html(`
              <div class="genreTVshows">
                  <div class="tvshowList">${tvshowList}</div>
              </div>
      `);

  console.log(tvshowCounts);

  for (let i = 0; i < tvshowGenreArr.length; i++) {
    console.log(tvshowCounts[tvshowGenreArr[i]]);
    $(`#${tvshowGenreArr[i].replace(/\s/g, "")}`).html(`
              ${tvshowGenreArr[i]}<span class="countNum">${tvshowCounts[tvshowGenreArr[i]]}</span>
          `);
  }

  setRandomColor();
}
//#endregion
