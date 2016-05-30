//This class is for the exporting of .pld level files.

//Private Constants
var PLD_FILE_EXTENSION = "pld";

var PLD_LEVEL_TAG = "Stage";
var PLD_GLOBAL_TAG = "Global";
var PLD_LEVEL_SIZE_TAG = "LevelSize";
var PLD_OBJECT_TAG = "Objects";
var PLD_BACKDROP_TAG = "Backdrop";
var PLD_FLOOR_TAG = "Floor";
var PLD_WALL_TAG = "Wall";
var PLD_PROP_TAG = "Prop";
var PLD_ENEMY_TAG = "Enemy";
var PLD_EXIT_TAG = "Exit";
var PLD_ENTRY_POINT_TAG = "Entrance";
//todo scripted event triggers.

var PLD_X_TAG = "X";
var PLD_Y_TAG = "Y";
var PLD_WIDTH_TAG = "Width";
var PLD_HEIGHT_TAG = "Height";
var PLD_RENDER_TAG = "RenderLayer";

var PLD_TYPE_TAG = "Type";
var PLD_IMAGERECT_CLASS = "ImageRectangle";
var PLD_BASICRECT_CLASS = "NamedRectangle";

class PLDExporter
{
    constructor(outputFilePath, layerCollection, levelWidth, levelHeight)
    {
        this.outputPath = outputFilePath;
        this.xmlBuilder = new XmlStringBuilder();
        this.layers = layerCollection;
        this.totalWidth = levelWidth;
        this.totalHeight = levelHeight;
    }
    
    //Public Methods
    /**
     * Outputs the class-held layer collection in .pld format to the class-held path.
     * @returns boolean Export completed successfully.
     */
    Export()
    {
        if(this.layers == undefined) return false;   
        
        this.xmlBuilder.AddChild(PLD_LEVEL_TAG);
        
        var backdrops = [];
        var floors = []; 
        var walls = [];
        var props = [];
        var enemies = [];
        
        for(var i = 0; i < this.layers.length; i++)
        {
            var layer = this.layers[i];
                   
            var layerBackdrops = layer.GetAllRectsByCategory("Backdrop");
            backdrops = backdrops.concat(layerBackdrops);
            
            var layerFloors = layer.GetAllRectsByCategory("Floor");
            floors = floors.concat(layerFloors);
            
            var layerWalls = layer.GetAllRectsByCategory("Wall");
            walls = walls.concat(layerWalls);  
            
            var layerProps = layer.GetAllRectsByCategory("Prop");
            props = props.concat(layerProps);
            
            var layerEnemies = layer.GetAllRectsByCategory("Enemy");
            enemies = enemies.concat(layerEnemies);    
        }
        
        //Global property serialization
        this.WriteGlobalLevelProperties();
        
        this.xmlBuilder.AddChild(PLD_OBJECT_TAG, false);
        
        //Backdrop serialization
        if(backdrops.length > 1)
            throw "More than one backdrop defined.";
        if(backdrops.length == 1)
            this.WriteBackdrop(backdrops[0]);
            
        //Floor serialization
        if(floors.length > 1)
            throw "More than one floor defined.";
        if(floors.length == 1)
            this.WriteFloor(floors[0]);
            
        //Wall serialization
        if(walls.length > 1)
            throw "More than one wall defined.";
        if(walls.length == 1)
            this.WriteWall(walls[0]);
            
        //Prop serialization
        if(props.length > 0)
            this.WriteProps(props);
            
        //Enemy serialization
        if(enemies.length > 0)
            this.WriteEnemies(enemies);
        
        this.xmlBuilder.EndNode(PLD_OBJECT_TAG);
        
        this.xmlBuilder.EndNode(PLD_LEVEL_TAG);
        
        this.WriteExportFile();
    }
    
    //Private Methods
    WriteGlobalLevelProperties()
    {
        this.xmlBuilder.AddChild(PLD_GLOBAL_TAG, true);
        this.xmlBuilder.AddChild(PLD_LEVEL_SIZE_TAG, true);
        this.xmlBuilder.AddCompleteChild(PLD_WIDTH_TAG, this.totalWidth, true);
        this.xmlBuilder.AddCompleteChild(PLD_HEIGHT_TAG, this.totalHeight, false);
        this.xmlBuilder.EndNode(PLD_LEVEL_SIZE_TAG);
        this.xmlBuilder.EndNode(PLD_GLOBAL_TAG); 
        
        //todo viewport
    }
    
    WriteBackdrop(backdropRect)
    {
        this.xmlBuilder.AddChild(PLD_BACKDROP_TAG, true);
        this.xmlBuilder.AddChild(backdropRect.Name, true);
        this.WriteRectType(backdropRect, true);
        this.WriteRectProperties(backdropRect);
        this.xmlBuilder.EndNode(backdropRect.Name);
        this.xmlBuilder.EndNode(PLD_BACKDROP_TAG);
    }
    
    WriteFloor(floorRect)
    {
        this.xmlBuilder.AddChild(PLD_FLOOR_TAG, false);
        this.xmlBuilder.AddChild(floorRect.Name, true);
        this.WriteRectType(floorRect, true);
        this.WriteRectProperties(floorRect);
        this.xmlBuilder.EndNode(floorRect.Name);
        this.xmlBuilder.EndNode(PLD_FLOOR_TAG);
    }
    
    WriteWall(wallRect)
    {
        this.xmlBuilder.AddChild(PLD_WALL_TAG, false);
        this.xmlBuilder.AddChild(wallRect.Name, true);
        this.WriteRectType(wallRect, true);
        this.WriteRectProperties(wallRect);
        this.xmlBuilder.EndNode(wallRect.Name);
        this.xmlBuilder.EndNode(PLD_WALL_TAG);
    }
    
    WriteProps(props)
    {
        this.xmlBuilder.AddChild(PLD_PROP_TAG, false);
        for(var i = 0; i < props.length; i++)
        {
            var prop = props[i];
            
            if(i == 0)
                this.xmlBuilder.AddChild(prop.Name, true);
            else
                this.xmlBuilder.AddChild(prop.Name, false);
                  
            this.WriteRectType(prop, true);
            this.WriteRectProperties(prop);    
                
            this.xmlBuilder.EndNode(prop.Name);
        } 
        this.xmlBuilder.EndNode(PLD_PROP_TAG);
    }
    
    WriteEnemies(enemies)
    {
        this.xmlBuilder.AddChild(PLD_ENEMY_TAG, false);
        for(var i = 0; i < enemies.length; i++)
        {
            var enemy = enemies[i];
            
            if(i == 0)
                this.xmlBuilder.AddChild(enemy.Name, true);
            else
                this.xmlBuilder.AddChild(enemy.Name, false);
                
            this.WriteRectType(enemy, true);
            this.WriteRectProperties(enemy);

            this.xmlBuilder.EndNode(enemy.Name);
        } 
        this.xmlBuilder.EndNode(PLD_ENEMY_TAG);
    }
    
    WriteRectProperties(rect)
    {
        this.xmlBuilder.AddCompleteChild(PLD_X_TAG, rect.XLocation, false);
        this.xmlBuilder.AddCompleteChild(PLD_Y_TAG, rect.YLocation, false);
        this.xmlBuilder.AddCompleteChild(PLD_WIDTH_TAG, rect.Width, false);
        this.xmlBuilder.AddCompleteChild(PLD_HEIGHT_TAG, rect.Height, false);
        this.xmlBuilder.AddCompleteChild(PLD_RENDER_TAG, rect.RenderIdx, false);
    }    
    
    WriteRectType(rect, isFirst)
    {      
        if(rect instanceof ImageRectangle)
        {
            this.xmlBuilder.AddCompleteChild(PLD_TYPE_TAG, PLD_IMAGERECT_CLASS, isFirst);
            return;
        }
        
        if(rect instanceof NamedRectangle)
        {
            this.xmlBuilder.AddCompleteChild(PLD_TYPE_TAG, PLD_BASICRECT_CLASS, isFirst);
            return;
        }
            
        throw "Invaild rectangle type serialization attempted.";
    }
    
    WriteExportFile()
    {
        fs.writeFileSync(this.outputPath, this.xmlBuilder.GetXml(), 'utf8');
    }
}