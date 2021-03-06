let path = require("path");
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard";
let bowlersArr = [];
let bowlersCount = 0;
console.log("Before");
request(url, cb);
function cb(error, response, html) {
    // console.error('error:', error); // Print the error if one occurred
    // console.log('body:', html); // Print the HTML for the Google homepage.
    if (error) {
        console.log(error); // Print the error if one occurred
    } else if (response.statusCode == 404) {
        console.log("Page Not Found")
    }
    else {
        // console.log(html); // Print the HTML for the request made 
        dataExtracter(html);
    }
}
// insights -> You don't get all the  data initially  
function dataExtracter(html) {
    // search tool
    let searchTool = cheerio.load(html);
    // global tool
    // page -> tables -> row get 
    let bowlers = searchTool(".table.bowler tbody tr");
    // only to get the length of bowlers
    for (let i = 0; i < bowlers.length; i++) {
        let cols = searchTool(bowlers[i]).find("td");
        if (cols.length > 1) {
            bowlersCount++;
        }
    }

    for (let i = 0; i < bowlers.length; i++) {
        // row -> col
        let cols = searchTool(bowlers[i]).find("td");
        if (cols.length > 1) {
            let aElem = searchTool(cols[0]).find("a")
            let link = aElem.attr("href");
            // new page -> link get -> complete -> request 
            let fullLink = `https://www.espncricinfo.com${link}`;
            //    async function 
            request(fullLink, newcb);
        }
    }
}
function newcb(error, response, html) {
    if (error) {
        console.log(error); // Print the error if one occurred
    } else if (response.statusCode == 404) {
        console.log("Page Not Found")
    } else {
        // console.log(html); // Print the HTML for the request made
        // console.log("`````````````````````");
        getBirthDay(html);
        // check 
        if (bowlersArr.length == bowlersCount) {
            console.table(bowlersArr);
            sortBirthDay(bowlersArr);
        }
    }
}

function getBirthDay(html) {
    let searchTool = cheerio.load(html);
    let headingsArr = searchTool(".player-card-description");
    let age = searchTool(headingsArr[2]).text();
    let name = searchTool(headingsArr[0]).text();
    bowlersArr.push({ "name": name, "age": age });
}
console.log("After");

function sortBirthDay(bowlersArr) {
    let newArr = bowlersArr.map(singlefn); // replica of for loop travels through whole array
    function singlefn(obj) {
        let name = obj.name;
        let age = obj.age;
        let ageArr = age.split(" ");
        let years = ageArr[0].slice( 0, ageArr[0].length - 1 );
        let days = ageArr[1].slice(0, ageArr[1].length - 1);
        let ageInDays = Number(years) * 365 + Number(days);
        // console.log( ageInDays);
        return {
            name: name,
            age: age, 
            ageInDays: ageInDays,
        }
    }
    let sortedArr = newArr.sort(comparator);
    function comparator(objA, objB){
        return objA.ageInDays - objB.ageInDays;
    }
    console.table(sortedArr);
    let finalArr = sortedArr.map(removeInDays);
    function removeInDays(obj){
        return {
            name: obj.name,
            age: obj.age,
        }
    }
    console.table(finalArr);
}