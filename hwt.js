let request = require("request");
let cheerio = require("cheerio");

let url = "https://www.espncricinfo.com/series/india-in-australia-2020-21-1223867/australia-vs-india-4th-test-1223872/full-scorecard";
request(url, cb);
function cb(error, response, html){
    if(error){
        console.log("Error -> ", error);
    } else if (response.statusCode == 404){
        console.log("Page Not Found");
    } else{
        dataExtractor(html);
    }
}

function dataExtractor(html){
    let searchTool = cheerio.load(html);
    let bowlers = searchTool(".table.bowler tbody tr");

    let name = "";
    let wick = 0;
    for(let i = 0; i < bowlers.length; i++){
        let cols = searchTool(bowlers[i]).find("td");
        let curname = searchTool(cols[0]).text();
        let wickets = searchTool(cols[4]).text();
        if( wickets >= wick ){
            name = curname;
            wick = wickets;
        }
        console.log(curname + " : " , wickets);
    }
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("Highest Wicket Taker : " , name + " : " , wick);
}