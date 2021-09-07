// npm i request
let request = require("request");
// npm i cheerio
let cheerio = require("cheerio");

let url = "https://www.espncricinfo.com/series/england-tour-of-india-2020-21-1243364/india-vs-england-3rd-odi-1243395/ball-by-ball-commentary";
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
    let element = searchTool(".match-comment-wrapper");

    // Initial Commentary
    let shortComm = searchTool(element[0]).find(".match-comment-short-text");
    let sComm = searchTool(shortComm[0]).text();
    console.log("Initial Commentary - ", sComm);

    // Long Commentary
    let longComm = searchTool(element[0]).find(".match-comment-long-text");
    let lComm = searchTool(longComm[0]).text();
    console.log("Commentart - ", lComm);
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("Full Commentary : ");
    // let lbc = searchTool(element[0]).text();
    console.log("Last Ball Commentary - ", sComm , lComm);
}