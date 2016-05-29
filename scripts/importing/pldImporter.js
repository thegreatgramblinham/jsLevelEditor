//This file is for the importing of pld files.

//Private Constants
var FILE_EXTENSION = "pld";

var LEVEL_TAG = "Stage";
var GLOBAL_TAG = "Global";
var LEVEL_SIZE_TAG = "LevelSize";
var BACKDROP_TAG = "Backdrop";
var FLOOR_TAG = "Floor";
var WALL_TAG = "Wall";
var PROP_TAG = "Props";
var ENEMY_TAG = "Enemies";
var EXIT_TAG = "Exits";
var ENTRY_POINT_TAG = "Entries";
//todo scripted event triggers.

var X_TAG = "X";
var Y_TAG = "Y";
var WIDTH_TAG = "Width";
var HEIGHT_TAG = "Height";

class PLDImporter
{
    constructor(filePath)
    {
        this.filePath = filePath;
        this.OpenFile();
    }
    
    Import()
    {
        ResetCanvas();
        
        this.SetLevelBounds();
        
        
    }
    
    OpenFile()
    {
        try
        {
            var xmlString = fs.readFileSync(this.filePath, 'utf8');
            var parser = new DOMParser();
            this.xmlDoc = parser.parseFromString(xmlString,"text/xml");
        }
        catch(ex)
        {
            throw "Failed to open xml doc: "+ex.toString();
        }
    }
    
    SetLevelBounds()
    {
        var levelSize = this.xmlDoc.getElementsByTagName(LEVEL_SIZE_TAG);
        
        if(levelSize == undefined || levelSize.length != 1)
            throw "Level size doesn't exist or is invalid.";
        if(levelSize[0].children.length != 2)
            throw "Level dimensions are invalid";
            
        var levelsizeTag = levelSize[0];
        
        var width;
        var height;
        
        for(var i = 0; i < levelsizeTag.children.length; i++)
        {
            var child = levelsizeTag.children[i];
            
            if(child.tagName == WIDTH_TAG)
                width = Number(child.innerHTML);
                
            if(child.tagName == HEIGHT_TAG)
                height = Number(child.innerHTML);
        }    
        
        if(width == undefined || isNaN(width))
            throw "Level width not found.";
        if(height == undefined || isNaN(height))
            throw "Level height not found.";
        
        ImportLevelBounds(width, height);
    }
}