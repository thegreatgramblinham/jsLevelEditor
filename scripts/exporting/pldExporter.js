//This class is for the exporting of .pld level files.

//Private Constants
var FILE_EXTENSION = "pld";

var LEVEL_TAG = "Stage";
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


class PLDExporter
{
    constructor(outputFilePath, layerCollection)
    {
        this.outputPath = outputFilePath;
        this.xmlBuilder = new XmlStringBuilder();
        this.layers = layerCollection;
    }
    
    //Public Methods
    /**
     * Outputs the class-held layer collection in .pld format to the class-held path.
     * @returns boolean Export completed successfully.
     */
    Export()
    {
        if(this.layers == undefined) return false;   
        
        this.xmlBuilder.BeginNode(LEVEL_TAG);
        
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
        
        
        this.xmlBuilder.EndNode(LEVEL_TAG);
        
        this.WriteExportFile();
    }
    
    //Private Methods
    WriteBackdrop(backdropRect)
    {
        this.xmlBuilder.AddChild(BACKDROP_TAG, true);
        this.xmlBuilder.AddChild(backdropRect.Name, true);
        this.xmlBuilder.AddCompleteChild("X", backdropRect.XLocation, true);
        this.xmlBuilder.AddCompleteChild("Y", backdropRect.YLocation, false);
        this.xmlBuilder.EndNode(backdropRect.Name);
        this.xmlBuilder.EndNode(BACKDROP_TAG);
    }
    
    WriteFloor(floorRect)
    {
        this.xmlBuilder.AddChild(FLOOR_TAG, false);
        this.xmlBuilder.AddChild(floorRect.Name, true);
        this.xmlBuilder.AddCompleteChild("X", floorRect.XLocation, true);
        this.xmlBuilder.AddCompleteChild("Y", floorRect.YLocation, false);
        this.xmlBuilder.EndNode(floorRect.Name);
        this.xmlBuilder.EndNode(FLOOR_TAG);
    }
    
    WriteWall(wallRect)
    {
        this.xmlBuilder.AddChild(WALL_TAG, false);
        this.xmlBuilder.AddChild(wallRect.Name, true);
        this.xmlBuilder.AddCompleteChild("X", wallRect.XLocation, true);
        this.xmlBuilder.AddCompleteChild("Y", wallRect.YLocation, false);
        this.xmlBuilder.EndNode(wallRect.Name);
        this.xmlBuilder.EndNode(WALL_TAG);
    }
    
    WriteProps(props)
    {
        this.xmlBuilder.AddChild(PROP_TAG, false);
        for(var i = 0; i < props.length; i++)
        {
            var prop = props[i];
            
            this.xmlBuilder.AddChild(prop.Name, true);
            this.xmlBuilder.AddCompleteChild("X", prop.XLocation, true);
            this.xmlBuilder.AddCompleteChild("Y", prop.YLocation, false);
            this.xmlBuilder.EndNode(prop.Name);
        } 
        this.xmlBuilder.EndNode(PROP_TAG);
    }
    
    WriteEnemies(enemies)
    {
        this.xmlBuilder.AddChild(ENEMY_TAG, false);
        for(var i = 0; i < enemies.length; i++)
        {
            var enemy = enemies[i];
            
            this.xmlBuilder.AddChild(enemy.Name, true);
            this.xmlBuilder.AddCompleteChild("X", enemy.XLocation, true);
            this.xmlBuilder.AddCompleteChild("Y", enemy.YLocation, false);
            this.xmlBuilder.EndNode(enemy.Name);
        } 
        this.xmlBuilder.EndNode(ENEMY_TAG);
    }
    
    WriteExportFile()
    {
        fs.writeFileSync(this.outputPath, this.xmlBuilder.GetXml(), 'utf8');
    }
}