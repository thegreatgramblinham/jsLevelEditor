//This file is for the importing of .pld files.

//Private Constants
var PLD_FILE_EXTENSION = "pld";

//Labeling Tags
var PLD_LEVEL_TAG = "Stage";
var PLD_GLOBAL_TAG = "Global";
var PLD_TRIGGER_TAG = "Triggers";
var PLD_OBJECT_TAG = "Objects";
var PLD_GROUP_TAG = "Group";
var PLD_I_TAG = "I";

//Category Tags
var PLD_BACKDROP_TAG = "Backdrop";
var PLD_FLOOR_TAG = "Floor";
var PLD_WALL_TAG = "Wall";
var PLD_PROP_TAG = "Prop";
var PLD_ENEMY_TAG = "Enemy";
var PLD_EXIT_TAG = "Exit";
var PLD_ENTRANCE_TAG = "Entrance";
var PLD_VIEWPORT_TAG = "ViewPort";

//Value Tags
var PLD_LEVEL_SIZE_TAG = "LevelSize";
var PLD_NAME_TAG = "Name";
var PLD_X_TAG = "X";
var PLD_Y_TAG = "Y";
var PLD_WIDTH_TAG = "Width";
var PLD_HEIGHT_TAG = "Height";
var PLD_RENDER_TAG = "RenderLayer";
var PLD_TYPE_TAG = "Type";

//Const Inner Values
var PLD_IMAGERECT_CLASS = "ImageRectangle";
var PLD_BASICRECT_CLASS = "NamedRectangle";

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
        this.ReconstituteViewPort();
        
        this.ReconstituteExits();
        this.ReconstituteEntrances();
        
        this.ReconstituteBackground();
        this.ReconstituteFloor();
        this.ReconstituteWall();
        this.ReconstituteProps();
        this.ReconstituteEnemies();
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
        var levelSize = this.xmlDoc.getElementsByTagName(PLD_LEVEL_SIZE_TAG);
        
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
            
            if(child.tagName == PLD_WIDTH_TAG)
                width = Number(child.innerHTML);
                
            if(child.tagName == PLD_HEIGHT_TAG)
                height = Number(child.innerHTML);
        }    
        
        if(width == undefined || isNaN(width))
            throw "Level width not found.";
        if(height == undefined || isNaN(height))
            throw "Level height not found.";
        
        ImportLevelBounds(width, height);
    }
    
    ReconstituteViewPort()
    {
        var viewPort = this.xmlDoc.getElementsByTagName(PLD_VIEWPORT_TAG);
        
        if(viewPort == undefined || viewPort.length == 0) return;
        
        var propertyArr = this.DeserializeRectProperties(viewPort[0]);       
        this.AddToCanvas(propertyArr, viewPort[0], PLD_VIEWPORT_TAG);       
    }
    
    ReconstituteExits()
    {
        var exitTags = this.xmlDoc.getElementsByTagName(PLD_EXIT_TAG);
        var exitContainer = exitTags[0]
        
        if(exitContainer == undefined) return;
        
        for(var i = 0; i < exitContainer.children.length; i++)
        {
            var exit = exitContainer.children[i];

            var propertyArr = this.DeserializeRectProperties(exit);       
            this.AddToCanvas(propertyArr, exit, PLD_EXIT_TAG);
        }
    }
    
    ReconstituteEntrances()
    {
        var entranceTags = this.xmlDoc.getElementsByTagName(PLD_ENTRANCE_TAG);     
        var entranceContainer = entranceTags[0]
        
        if(entranceContainer == undefined) return;
        
        for(var i = 0; i < entranceContainer.children.length; i++)
        {
            var entrance = entranceContainer.children[i];

            var propertyArr = this.DeserializeRectProperties(entrance);       
            this.AddToCanvas(propertyArr, entrance, PLD_ENTRANCE_TAG);
        }
    }
    
    ReconstituteBackground()
    {
        var backgroundTags = this.xmlDoc.getElementsByTagName(PLD_BACKDROP_TAG);
        var backgroundContainer = backgroundTags[0];
        
        if(backgroundContainer == undefined) return; //no background present
        
        var background = backgroundContainer.children[0];      
        var propertyArr = this.DeserializeRectProperties(background);
        
        this.AddToCanvas(propertyArr, background, PLD_BACKDROP_TAG);
    }
    
    ReconstituteFloor()
    {
        var floorTags = this.xmlDoc.getElementsByTagName(PLD_FLOOR_TAG);
        var floorContainer = floorTags[0];
        
        if(floorContainer == undefined) return; //no floor present
        
        var floor = floorContainer.children[0];      
        var propertyArr = this.DeserializeRectProperties(floor);
        
        this.AddToCanvas(propertyArr, floor, PLD_FLOOR_TAG);
    }
    
    ReconstituteWall()
    {
        var wallTags = this.xmlDoc.getElementsByTagName(PLD_WALL_TAG);
        var wallContainer = wallTags[0];
        
        if(wallContainer == undefined) return; //no wall present
        
        var wall = wallContainer.children[0];      
        var propertyArr = this.DeserializeRectProperties(wall);
        
        this.AddToCanvas(propertyArr, wall, PLD_WALL_TAG);
    }
    
    ReconstituteProps()  
    {
        var propTags = this.xmlDoc.getElementsByTagName(PLD_PROP_TAG);
        var propContainer = propTags[0];
        
        if(propContainer == undefined) return; //no props present
        
        for(var i = 0; i < propContainer.children.length; i++)
        {
            var prop = propContainer.children[i];

            var propertyArr = this.DeserializeRectProperties(prop);       
            this.AddToCanvas(propertyArr, prop, PLD_PROP_TAG);
        }
    }
    
    ReconstituteEnemies()
    {
        var enemyTags = this.xmlDoc.getElementsByTagName(PLD_ENEMY_TAG);
        var enemyContainer = enemyTags[0];
        
        if(enemyContainer == undefined) return; //no enemy present
        
        for(var i = 0; i < enemyContainer.children.length; i++)
        {
            var enemy = enemyContainer.children[i];

            var propertyArr = this.DeserializeRectProperties(enemy);       
            this.AddToCanvas(propertyArr, enemy, PLD_ENEMY_TAG);
        }
    }
    
    //Private Methods
    DeserializeRectProperties(rectTag)
    {    
        var propertyArr = [];
        
        for(var i = 0; i < rectTag.children.length; i++)
        {
            var propertyTag = rectTag.children[i];
            
            if(propertyTag.tagName == PLD_NAME_TAG)
                propertyArr[PLD_NAME_TAG] = propertyTag.innerHTML;
            
            if(propertyTag.tagName == PLD_TYPE_TAG)
                propertyArr[PLD_TYPE_TAG] = propertyTag.innerHTML;
            
            if(propertyTag.tagName == PLD_X_TAG)
                propertyArr[PLD_X_TAG] = Number(propertyTag.innerHTML);
                
            if(propertyTag.tagName == PLD_Y_TAG)
                propertyArr[PLD_Y_TAG] = Number(propertyTag.innerHTML);
                
            if(propertyTag.tagName == PLD_WIDTH_TAG)
                propertyArr[PLD_WIDTH_TAG] = Number(propertyTag.innerHTML);
                
            if(propertyTag.tagName == PLD_HEIGHT_TAG)
                propertyArr[PLD_HEIGHT_TAG] = Number(propertyTag.innerHTML);
                
            if(propertyTag.tagName == PLD_RENDER_TAG)
                propertyArr[PLD_RENDER_TAG] = Number(propertyTag.innerHTML);
        }
        
        if(propertyArr[PLD_NAME_TAG] == undefined || propertyArr[PLD_NAME_TAG] == "")
            throw rectTag.tagName + " Name not found.";
        if(propertyArr[PLD_TYPE_TAG] == undefined || propertyArr[PLD_TYPE_TAG] == "")
            throw rectTag.tagName + " Type not found.";
        if(propertyArr[PLD_X_TAG] == undefined || isNaN(propertyArr[PLD_X_TAG]))
            throw rectTag.tagName + " X not found.";
        if(propertyArr[PLD_Y_TAG] == undefined || isNaN(propertyArr[PLD_Y_TAG]))
            throw rectTag.tagName + " Y not found.";
        if(propertyArr[PLD_WIDTH_TAG] == undefined || isNaN(propertyArr[PLD_WIDTH_TAG]))
            throw rectTag.tagName + " Width not found.";
        if(propertyArr[PLD_HEIGHT_TAG] == undefined || isNaN(propertyArr[PLD_HEIGHT_TAG]))
            throw rectTag.tagName + " Height not found.";
        if(propertyArr[PLD_RENDER_TAG] == undefined || isNaN(propertyArr[PLD_RENDER_TAG]))
            throw rectTag.tagName + " RenderGroup not found.";
            
        return propertyArr;
    }
    
    AddToCanvas(propertyArr, tag, category)
    {
        if(propertyArr[PLD_TYPE_TAG] == PLD_IMAGERECT_CLASS)
        {
            var image = GetImageElementByFileName(propertyArr[PLD_NAME_TAG]);    
            if(image == undefined)
                throw "Could not find file "+ propertyArr[PLD_NAME_TAG] +" in open images.";
               
            AddImageToLayer(propertyArr[PLD_X_TAG], propertyArr[PLD_Y_TAG], image, propertyArr[PLD_NAME_TAG],
                category, propertyArr[PLD_RENDER_TAG]);
        }
        else if(propertyArr[PLD_TYPE_TAG] == PLD_BASICRECT_CLASS)
        {
            AddRectangleToLayer(propertyArr[PLD_X_TAG], propertyArr[PLD_Y_TAG], propertyArr[PLD_WIDTH_TAG],
                propertyArr[PLD_HEIGHT_TAG], propertyArr[PLD_NAME_TAG], category, propertyArr[PLD_RENDER_TAG]);
        }
        else   
            throw "Rectangle type not intializable."
    }
}