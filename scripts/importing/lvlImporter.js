var IMAGE_TAG = "Images";
var PLATFORM_TAG = "Platform";


var X_TAG = "X";
var Y_TAG = "Y";
var WIDTH_TAG = "Width";
var HEIGHT_TAG = "Height";

class LvlImporter
{
    constructor(inputPath)
    {
        this.inputFile = inputPath;
    }
    
    ImportLvlFile()
    {
        var xmlInputString = fs.readFileSync(this.inputFile, 'utf8');
        var parser = new DOMParser();
        var xml  = parser.parseFromString(xmlInputString,"text/xml");
       
        var images = xml.getElementsByTagName(IMAGE_TAG);
        var platforms = xml.getElementsByTagName(PLATFORM_TAG);
        
       
    }
}