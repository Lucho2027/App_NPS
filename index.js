'use strict';
// this is my NPS Key

const apiKey = 'dml2fxq2KtGZgCZdgiNNWinECXXBxfcZRslJolPA'
const parksURL = 'https://developer.nps.gov/api/v1/parks'


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson) {
    // if there are previous results, remove them
    console.log(responseJson);
    $('#results-list').empty();
    // iterate through the items array
    for (let i = 0; i < responseJson.data.length; i++) {
        // for each video object in the items 
        //array, add a list item to the results 
        //list with the video title, description,
        //and thumbnail
        $('#results-list').append(
            `<li><h3>${responseJson.data[i].fullName}</h3>
            <h4><a href='${responseJson.data[i].directionsUrl}' target='_blank'>How to get there</a></h4>
      <p>${responseJson.data[i].description}</p>
      <a href='${responseJson.data[i].url}' target="_blank">${responseJson.data[i].url}</a>
      </li>`
        )
    };
    //display the results section  
    $('#results').removeClass('hidden');
};

function getParksInState(query, maxResults = 10) {
    const params = {
        stateCode: query,
        limit: maxResults,
        api_key: apiKey,

    };
    const queryString = formatQueryParams(params)
    const url = parksURL + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchState = $('#js-search-term').val();
        const maxResults = $('#js-max-results').val();
        getParksInState(searchState, maxResults);
    });
}

$(watchForm);