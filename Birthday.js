let request = require("request");
let cheerio = require("cheerio");

let url = "https://www.espncricinfo.com/series/england-tour-of-india-2020-21-1243364/india-vs-england-5th-t20i-1243392/full-scorecard";

let batsArr = [];
let batsmancount = 0;
request(url, cb);
function cb(error, response, html) {
    if (error) {
        console.log("Error -> ", error);
    } else if (response.statusCode == 404) {
        console.log("Page Not Found");
    } else {
        dataExtractor(html);
    }
}
function dataExtractor(html) {
    let searchTool = cheerio.load(html);
    let batsman = searchTool(".table.batsman tbody tr");

    for (let i = 0; i < batsman.length; i++) {
        let bmanData = searchTool(batsman[i]).find("td");
        if (bmanData.length == 8) {
            batsmancount++;
        }
    }

    for (let i = 0; i < batsman.length; i++) {
        let bmanData = searchTool(batsman[i]).find("td");
        if (bmanData.length == 8) {

            let bmanLink = searchTool(bmanData[0]).find("a");
            let newLink = bmanLink.attr("href");
            // console.log(newLink);

            let fullLink = `https://www.espncricinfo.com${newLink}`;
            console.log(fullLink);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            request(fullLink, newcb);
        }
    }
    function newcb(error, response, html) {
        if (error) {
            console.log("Error -> ", error);
        } else if (response.statusCode == 404) {
            console.log("Page Not Found");
        } else {
            getBirthDay(html);
            if( batsArr.length == batsmancount ){
                // console.table(batsArr);
                sortBatsman(batsArr);
            }
        }
    }

    function getBirthDay(html) {
        let searchTool = cheerio.load(html);
        let element = searchTool(".player-card-description.gray-900");
        let name = searchTool(element[0]).text();
        let birthday = searchTool(element[2]).text();

        batsArr.push({ name, age: birthday,});
        // console.log(name + " : ", birthday);
    }
}

function sortBatsman(batsArr){
    let newArr = batsArr.map( singlefn);
    function singlefn(obj) {
        let name = obj.name;
        let age = obj.age;
        let ageArr = obj.age.split(" ");
        let years = ageArr[0].slice( 0, ageArr[0].length - 1 );
        let days = ageArr[1].slice(0, ageArr[1].length - 1);
        // console.log("years", years + " days", days);
        let ageInDays = Number(years) * 365 + Number(days);
        return {
            name: name,
            age: age,
            ageInDays: ageInDays
        }
    }
    let sortedArr = newArr.sort(comparator);
    function comparator( objA, objB ){
        return objA.ageInDays - objB.ageInDays;
    }
    console.table(sortedArr);

}