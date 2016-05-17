//Imports
"use strict";
var fs = require('fs');

//Global Variables
var jsString = "";
var globalWriteDirectory = window.location.pathname.substring(1,
            window.location.pathname.lastIndexOf('/'));
var outputFileName = "global.js"

RunBuild();

//Methods
function RunBuild()
{
    var filesInGlobalBuild = 
    [
        "/scripts/mainCanvas.js",
        "/scripts/rectangle.js"
    ];
     
    ConcatFiles(filesInGlobalBuild);
    WriteGlobalFile();
}

function ConcatFiles(filePathList) 
{
    for(var i = 0; i < filePathList.length; i++)
    {
        ConcatFile(filePathList[i]);
    }
}

function ConcatFile(filePath)
{
    console.log("Trying Read - <"+ globalWriteDirectory + filePath +">");
    var fileString = fs.readFileSync(globalWriteDirectory + filePath,"utf8");
    jsString += "//START FILE: "+ filePath +"\n\n" 
        + fileString 
        + "\n\n" + "//END FILE: "+ filePath +"\n\n";
        
    console.log("Completed Read - <"+ filePath +">");
}

function WriteGlobalFile()
{
    var writePath = globalWriteDirectory +"/"+ outputFileName;
    fs.writeFileSync(writePath, jsString, "utf8");
    console.log("Completed Full Write - <"+ writePath +">");
}
