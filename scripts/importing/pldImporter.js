//This file is for the importing of pld files.

//Private Constants
var FILE_EXTENSION = "pld";

var LEVEL_TAG = "Stage";
var GLOBAL_TAG = "Global";
var LEVEL_SIZE_TAG = "LevelSize";
var OBJECT_TAG = "Objects";
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
var RENDER_TAG = "RenderLayer";

var TYPE_TAG = "Type";
var IMAGERECT_CLASS = "ImageRectangle";
var BASICRECT_CLASS = "NamedRectangle";

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
        
        this.ReconstituteBackground();
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
    
    ReconstituteBackground()
    {
        var backgroundTags = this.xmlDoc.getElementsByTagName(BACKDROP_TAG);
        var backgroundContainer = backgroundTags[0];
        
        if(backgroundContainer == undefined) return; //no background present
        
        var background = backgroundContainer.children[0];
         
        var propertyArr = this.DeserializeRectProperties(background);
        
        if(propertyArr[TYPE_TAG] == IMAGERECT_CLASS)
        {
            var image = GetImageElementByFileName(background.tagName);    
            if(image == undefined)
                throw "Could not find background "+ background.tagName +" in open images.";
               
            AddImage(propertyArr[X_TAG], propertyArr[Y_TAG], image, background.tagName);
        }
        else if(propertyArr[TYPE_TAG] == BASICRECT_CLASS)
        {
            
        }
        else   
            throw "Rectangle type not intializable."

    }
    
    //Private Methods
    DeserializeRectProperties(rectTag)
    {    
        var propertyArr = [];
        
        for(var i = 0; i < rectTag.children.length; i++)
        {
            var propertyTag = rectTag.children[i];
            
            if(propertyTag.tagName == TYPE_TAG)
                propertyArr[TYPE_TAG] = propertyTag.innerHTML;
            
            if(propertyTag.tagName == X_TAG)
                propertyArr[X_TAG] = Number(propertyTag.innerHTML);
                
            if(propertyTag.tagName == Y_TAG)
                propertyArr[Y_TAG] = Number(propertyTag.innerHTML);
                
            if(propertyTag.tagName == WIDTH_TAG)
                propertyArr[WIDTH_TAG] = Number(propertyTag.innerHTML);
                
            if(propertyTag.tagName == HEIGHT_TAG)
                propertyArr[HEIGHT_TAG] = Number(propertyTag.innerHTML);
                
            if(propertyTag.tagName == RENDER_TAG)
                propertyArr[RENDER_TAG] = Number(propertyTag.innerHTML);
        }
        
        if(propertyArr[TYPE_TAG] == undefined || propertyArr[TYPE_TAG] == "")
            throw rectTag.tagName + " Type not found.";
        if(propertyArr[X_TAG] == undefined || isNaN(propertyArr[X_TAG]))
            throw rectTag.tagName + " X not found.";
        if(propertyArr[Y_TAG] == undefined || isNaN(propertyArr[Y_TAG]))
            throw rectTag.tagName + " Y not found.";
        if(propertyArr[WIDTH_TAG] == undefined || isNaN(propertyArr[WIDTH_TAG]))
            throw rectTag.tagName + " Width not found.";
        if(propertyArr[HEIGHT_TAG] == undefined || isNaN(propertyArr[HEIGHT_TAG]))
            throw rectTag.tagName + " Height not found.";
        if(propertyArr[RENDER_TAG] == undefined || isNaN(propertyArr[RENDER_TAG]))
            throw rectTag.tagName + " RenderGroup not found.";
            
        return propertyArr;
    }
}