// import { getMetadata } from '../../scripts/aem.js';
// const placeholders = await fetchPlaceholders(getMetadata("locale"));

function getResourceFromURL(){
    const path = window.location.pathname;
    const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path;
    const segments = cleanPath.split('/');
    const lastSegment = segments[segments.length -1];

    console.log(`extracted reousece from URL: ${lastSegment}`);
    return lastSegment;
}


// Default labels (in case cannot fetch from google drive sheet)
const defaultLabels = {
    sNo: "S.No",
    countries: "Country",
    capital: "Capital",
    continent: "Continent",
    abbreviation: "Abbreviation",
    allCountries: "All Countries",
    asia: "Asia",
    europe: "Europe",
    africa: "Africa",
    america: "America",
    australia: "Australia"
  };

//   Fetch data and extract headers from the first row
async function fetchDataAndHeaders(jsonURL) {
    try{
        const response = await fetch(jsonURL);
        if(!response.ok){
            throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const json = await response.json();
        console.log("fetched JSON data:", json);

        // Extract the sheet names if available
        const sheetNames = json.sheets || [];
        console.log("Available sheets:", sheetNames);

        // get headers from the 1st row of data
        const headers = {};
        if(json.data && json.data.length > 0){
            const firstRow = json.data[0];

            // Map each property to a corresponding header in our labels object
            if (firstRow.Country) headers.countries = "Country";
            if (firstRow.Capital) headers.capital = "Capital";
            if (firstRow.Continent) headers.continent = "Continent";
            if (firstRow.Abbreviation) headers.abbreviation = "Abbreviation";
        }

        console.log("Extracted headers:", headers);

        return {
            data: json.data || [],
            headers: headers,
            sheetNames: sheetNames
        };

    }catch(error){
        console.error("error fetching data: ", error);
        return {
            data: [],
            headers: {},
            sheetNames: []
        };
    }
    
}

async function createTableHeader(table, labels) {

    const tr = document.createElement("tr");

    const sno = document.createElement("th");
    sno.appendChild(document.createTextNode(labels.sNo || defaultLabels.sNo));
    tr.appendChild(sno);

    const country = document.createElement("th");
    country.appendChild(document.createTextNode(labels.countries || defaultLabels.countries));
    tr.appendChild(country);

    const capital = document.createElement("th");
    capital.appendChild(document.createTextNode(labels.capital || defaultLabels.capital));
    tr.appendChild(capital);
    
    // Continent column
    const continent = document.createElement("th");
    continent.appendChild(document.createTextNode(labels.continent || defaultLabels.continent));
    tr.appendChild(continent);
    
    // Abbreviation column
    const abbr = document.createElement("th");
    abbr.appendChild(document.createTextNode(labels.abbreviation || defaultLabels.abbreviation));
    tr.appendChild(abbr);

    table.appendChild(tr);
    return table;
}


async function createTableRow(table, row, i) {
    const tr = document.createElement("tr");

    const sno = document.createElement("td");
    sno.appendChild(document.createTextNode(i));
    tr.appendChild(sno);

    const country = document.createElement("td");
    country.appendChild(document.createTextNode(row.Country));
    tr.appendChild(country);

    const capital = document.createElement("td");
    capital.appendChild(document.createTextNode(row.Capital));
    tr.appendChild(capital);

    const continent = document.createElement("td");
    continent.appendChild(document.createTextNode(row.Continent));
    tr.appendChild(continent);

    const abbr = document.createElement("td");
    abbr.appendChild(document.createTextNode(row.Abbreviation || ""));
    tr.appendChild(abbr);
    
    table.appendChild(tr);
    return table;
}



async function createSelectMap(jsonURL, sheetNames, labels) {
    const optionsMap = new Map();

    optionsMap.set("all", labels.allCountries || defaultLabels.allCountries);

    
//     if (sheetNames && sheetNames.length > 0) {
//     sheetNames.forEach(sheet => {
//       // Extract the region name from sheet name (e.g., "helix-asia" -> "asia")
//       const regionMatch = sheet.match(/helix-(.+)/);
//       if (regionMatch && regionMatch[1]) {
//         const region = regionMatch[1];
//         const labelKey = region.toLowerCase();
//         optionsMap.set(region, labels[labelKey] || region.charAt(0).toUpperCase() + region.slice(1));
//       }
//     });
//   } 
    
    
    if(sheetNames && sheetNames.length > 0){
        sheetNames.forEach(sheet => {
            const regionMatch = sheet.match(/helix-(.+)/);
            if(regionMatch && regionMatch[1]) {
                const region = regionMatch[1];
                const labelKey = region.toLowerCase();
                optionsMap.set(region, labels[labelKey] || region.charAt(0).toUpperCase() + region.slice(1));
            }else {
                // If sheet names are already clean
                const labelKey = sheet.toLowerCase();
                optionsMap.set(sheet, labels[labelKey] || sheet.charAt(0).toUpperCase() + sheet.slice(1));
            }
        });
    } else{
        optionsMap.set("asia", labels.asia || defaultLabels.asia);
        optionsMap.set("europe", labels.europe || defaultLabels.europe);
        optionsMap.set("africa", labels.africa || defaultLabels.africa);
        optionsMap.set("america", labels.america || defaultLabels.america);
        optionsMap.set("australia", labels.australia || defaultLabels.australia);
    }

    const select = document.createElement("select");
    select.id = "region";
    select.name = "region";

    optionsMap.forEach((val, key)=>{
        const option = document.createElement('option');
        option.textContent = val;
        option.value = key;
        select.appendChild(option);
    });

    const div = document.createElement('div');
    div.classList.add('region-select');
    div.appendChild(select);
    return div;

}

function createTable(data, labels) {
    const table = document.createElement('table');
    createTableHeader(table, labels);

    if(data && data.length > 0){
        data.forEach((row, i)=>{
            createTableRow(table, row, i+1);
        });
    }

    return table;
}

export default async function decorate(block){
    try{
        console.log("decorating table block");

        const resource = getResourceFromURL();

        const jsonURL = `/${resource}.json`;
        console.log(`JSON URL:${jsonURL}`);

        const{data, headers, sheetNames} = await fetchDataAndHeaders(jsonURL);

        const labels = {...defaultLabels, ...headers};

        const parentDiv = document.createElement('div');
        parentDiv.classList.add(`${resource}-block`);

        parentDiv.appendChild(await createSelectMap(jsonURL, sheetNames, labels));

        const table = createTable(data, labels);
        parentDiv.appendChild(table);

        // Replace block content
        block.innerHTML = '';
        block.appendChild(parentDiv);

        // add event listener for region changes
        setTimeout(()=>{
            const dropdown = document.getElementById('region');
            if(dropdown){
                dropdown.addEventListener('change', async()=>{
                    const region = dropdown.value;
                    let url = jsonURL;

                    if(region !== 'all'){
                        url = `${jsonURL}?sheet=${region}`;
                    }

                    try{
                        const response = await fetch(url);
                        if(!response.ok){
                            throw new Error(`Failed to fetch filtered data: ${response.status}`);
                        }

                        const filteredJson = await response.json();
                        console.log(`Filtered data for ${region}:`,filteredJson);

                        const newTable = await createTable(filteredJson.data || [], labels);

                        const oldTable = parentDiv.querySelector('table');
                        if(oldTable){
                            oldTable.replaceWith(newTable);
                        }

                    } catch (error) {
                    console.error("Error updating region data:", error);
                    }
                });
            }

        }, 100);
    }catch(error){
        console.error("Error in table block decoration:", error);
        block.innerHTML = `<div class = "error-message">Error loading data: ${error.message}</div>`;

    }
}


