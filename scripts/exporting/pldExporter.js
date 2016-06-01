//This class is for the exporting of .pld level files.

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

class PLDExporter
{
    constructor(outputFilePath, layerCollection, levelWidth, levelHeight)
    {
        this.outputPath = outputFilePath;
        this.xmlBuilder = new XmlStringBuilder();
        this.layers = layerCollection;
        this.totalWidth = Number(levelWidth);
        this.totalHeight = Number(levelHeight);
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
        var entrances = [];
        var exits = [];
        
        for(var i = 0; i < this.layers.length; i++)
        {
            var layer = this.layers[i];
                   
            var layerBackdrops = layer.GetAllRectsByCategory(PLD_BACKDROP_TAG);
            backdrops = backdrops.concat(layerBackdrops);
            
            var layerFloors = layer.GetAllRectsByCategory(PLD_FLOOR_TAG);
            floors = floors.concat(layerFloors);
            
            var layerWalls = layer.GetAllRectsByCategory(PLD_WALL_TAG);
            walls = walls.concat(layerWalls);  
            
            var layerProps = layer.GetAllRectsByCategory(PLD_PROP_TAG);
            props = props.concat(layerProps);
            
            var layerEnemies = layer.GetAllRectsByCategory(PLD_ENEMY_TAG);
            enemies = enemies.concat(layerEnemies);
            
            var layerEntrances = layer.GetAllRectsByCategory(PLD_ENTRANCE_TAG);
            entrances = entrances.concat(layerEntrances);
            
            var layerExits = layer.GetAllRectsByCategory(PLD_EXIT_TAG);
            exits = exits.concat(layerExits);
              
        }
        
        //Global property serialization
        this.WriteGlobalLevelProperties();
        
        //Trigger serialziation
        this.WriteTriggers(entrances, exits);
        
        //Object serialization
        this.WriteObjects(backdrops, floors, walls, props, enemies);
             
        this.xmlBuilder.EndNode(PLD_LEVEL_TAG);
        
        this.WriteExportFile();
    }
    
    //Private Methods
    WriteGlobalLevelProperties()
    {
        this.xmlBuilder.AddChild(PLD_GLOBAL_TAG, true);
        
        this.WriteLevelSize();   
        //todo Viewport
        
        this.xmlBuilder.EndNode(PLD_GLOBAL_TAG);       
    }
    
    WriteTriggers(entrances, exits)
    {
        var hasExits = exits.length > 0;
        var hasEntrances = entrances.length > 0;
        
        if(!hasExits && !hasEntrances)
        {
            this.xmlBuilder.AddBlankChild(PLD_TRIGGER_TAG, false);
            return
        }
        
        this.xmlBuilder.AddChild(PLD_TRIGGER_TAG, false);
        
        if(hasExits)
            this.WriteExits(exits);
            
        if(hasEntrances)
            this.WriteEntrance(entrances);
        
        this.xmlBuilder.EndNode(PLD_TRIGGER_TAG);
    }
    
    WriteObjects(backdrops, floors, walls, props, enemies)
    {
        var hasBackdrop = backdrops.length == 1;
        var hasFloor = floors.length == 1;
        var hasWall = walls.length == 1;
        var hasProps = props.length > 0;
        var hasEnemies = enemies.length > 0;
        
        if(!hasBackdrop && !hasFloor && !hasWall && !hasProps && !hasEnemies)
        {
            this.xmlBuilder.AddBlankChild(PLD_OBJECT_TAG, false);
            return;
        }
        
        this.xmlBuilder.AddChild(PLD_OBJECT_TAG, false);
        
        //Backdrop serialization
        if(backdrops.length > 1)
            throw "More than one backdrop defined.";
        if(hasBackdrop)
            this.WriteBackdrop(backdrops[0]);
            
        //Floor serialization
        if(floors.length > 1)
            throw "More than one floor defined.";
        if(hasFloor)
            this.WriteFloor(floors[0]);
            
        //Wall serialization
        if(walls.length > 1)
            throw "More than one wall defined.";
        if(hasWall)
            this.WriteWall(walls[0]);
            
        //Prop serialization
        if(hasProps)
            this.WriteProps(props);
            
        //Enemy serialization
        if(hasEnemies)
            this.WriteEnemies(enemies);
        
        this.xmlBuilder.EndNode(PLD_OBJECT_TAG);
    }
    
    WriteLevelSize()
    {
        if(this.totalWidth == undefined || this.totalHeight == undefined)
            throw "Invalid level bounds.";
        
        this.xmlBuilder.AddChild(PLD_LEVEL_SIZE_TAG, true);
        this.xmlBuilder.AddCompleteChild(PLD_WIDTH_TAG, this.totalWidth.toFixed(0), true);
        this.xmlBuilder.AddCompleteChild(PLD_HEIGHT_TAG, this.totalHeight.toFixed(0), false);
        this.xmlBuilder.EndNode(PLD_LEVEL_SIZE_TAG);
    }
    
    WriteExits(exits)
    {
        if(exits == undefined || exits.length == 0) return;
        
        this.xmlBuilder.AddChild(PLD_EXIT_TAG, true);
        
        for(var i = 0; i < exits.length; i++)
        {
            var exit = exits[i];
            var isFirst = (i == 0);
            
            var extName = exit.Name;
                                    
            switch(extName.toUpperCase())
            {
                case "LEFT":
                case "RIGHT":
                case "TOP":
                case "BOTTOM":
                    extName = extName.toUpperCase(); 
                    break;        
                default:
                    throw "Invalid exit name (type): " +extName;
            }
            
            this.xmlBuilder.AddChild(this.BuildTagWithIndex(i), isFirst);
            this.WriteRectProperties(exit, true);                            
            this.xmlBuilder.EndNode(this.BuildTagWithIndex(i));
        }
        
        this.xmlBuilder.EndNode(PLD_EXIT_TAG);
    }
    
    WriteEntrance(entrances)
    {
        if(entrances == undefined || entrances.length == 0) return;
        
        this.xmlBuilder.AddChild(PLD_ENTRANCE_TAG, false);
        
        for(var i = 0; i < entrances.length; i++)
        {
            var entrance = entrances[i];
            var isFirst = (i == 0);
            
            var entName = entrance.Name;
                                    
            switch(entName.toUpperCase())
            {
                case "LEFT":
                case "RIGHT":
                case "TOP":
                case "BOTTOM":
                    entName = entName.toUpperCase(); 
                    break;        
                default:
                    throw "Invalid entrance name (type): " +entName;
            }
            
            this.xmlBuilder.AddChild(this.BuildTagWithIndex(i), isFirst);
            this.WriteRectProperties(entrance, true);                            
            this.xmlBuilder.EndNode(this.BuildTagWithIndex(i));
        }
        
        this.xmlBuilder.EndNode(PLD_ENTRANCE_TAG);
    }
    
    WriteBackdrop(backdropRect)
    {
        if(backdropRect == undefined) return;
        
        this.xmlBuilder.AddChild(PLD_BACKDROP_TAG, true);
        this.xmlBuilder.AddChild(this.BuildTagWithIndex(0), true);
        this.WriteRectProperties(backdropRect, true);
        this.xmlBuilder.EndNode(this.BuildTagWithIndex(0));
        this.xmlBuilder.EndNode(PLD_BACKDROP_TAG);
    }
    
    WriteFloor(floorRect)
    {
        if(floorRect == undefined) return;
        
        this.xmlBuilder.AddChild(PLD_FLOOR_TAG, false);
        this.xmlBuilder.AddChild(this.BuildTagWithIndex(0), true);
        this.WriteRectProperties(floorRect, true);
        this.xmlBuilder.EndNode(this.BuildTagWithIndex(0));
        this.xmlBuilder.EndNode(PLD_FLOOR_TAG);
    }
    
    WriteWall(wallRect)
    {
        if(wallRect == undefined) return;
        
        this.xmlBuilder.AddChild(PLD_WALL_TAG, false);
        this.xmlBuilder.AddChild(this.BuildTagWithIndex(0), true);
        this.WriteRectProperties(wallRect, true);
        this.xmlBuilder.EndNode(this.BuildTagWithIndex(0));
        this.xmlBuilder.EndNode(PLD_WALL_TAG);
    }
    
    WriteProps(props)
    {
        if(props == undefined || props.length == 0) return;
        
        this.xmlBuilder.AddChild(PLD_PROP_TAG, false);
        for(var i = 0; i < props.length; i++)
        {
            var prop = props[i];
            
            if(i == 0)
                this.xmlBuilder.AddChild(this.BuildTagWithIndex(i), true);
            else
                this.xmlBuilder.AddChild(this.BuildTagWithIndex(i), false);
                  
            this.WriteRectProperties(prop, true);    
                
            this.xmlBuilder.EndNode(this.BuildTagWithIndex(i));
        } 
        this.xmlBuilder.EndNode(PLD_PROP_TAG);
    }
    
    WriteEnemies(enemies)
    {
        if(enemies == undefined || enemies.length == 0) return;
        
        this.xmlBuilder.AddChild(PLD_ENEMY_TAG, false);
        for(var i = 0; i < enemies.length; i++)
        {
            var enemy = enemies[i];
            
            if(i == 0)
                this.xmlBuilder.AddChild(this.BuildTagWithIndex(i), true);
            else
                this.xmlBuilder.AddChild(this.BuildTagWithIndex(i), false);
            
            //Adding a blank group tag for enemy addition via script
            this.xmlBuilder.AddBlankChild(PLD_GROUP_TAG, true);   
                
            this.WriteRectProperties(enemy, false);

            this.xmlBuilder.EndNode(this.BuildTagWithIndex(i));
        } 
        this.xmlBuilder.EndNode(PLD_ENEMY_TAG);
    }
    
    WriteRectProperties(rect, isFirst)
    {
        if(rect == undefined) return;
        
        this.xmlBuilder.AddCompleteChild(PLD_NAME_TAG, rect.Name, isFirst);
        this.WriteRectType(rect, false);
        this.xmlBuilder.AddCompleteChild(PLD_X_TAG, rect.XLocation.toFixed(0), false);
        this.xmlBuilder.AddCompleteChild(PLD_Y_TAG, rect.YLocation.toFixed(0), false);
        this.xmlBuilder.AddCompleteChild(PLD_WIDTH_TAG, rect.Width.toFixed(0), false);
        this.xmlBuilder.AddCompleteChild(PLD_HEIGHT_TAG, rect.Height.toFixed(0), false);
        this.xmlBuilder.AddCompleteChild(PLD_RENDER_TAG, rect.RenderIdx.toFixed(0), false);
    }    
    
    WriteRectType(rect, isFirst)
    {      
        if(rect == undefined) return;
        
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
    
    BuildTagWithIndex(index)
    {
        if(isNaN(index) || index < 0)
            throw "Invalid index for tag name.";
        return PLD_I_TAG + index.toString();     
    }
    
    WriteExportFile()
    {
        fs.writeFileSync(this.outputPath, this.xmlBuilder.GetXml(), 'utf8');
    }
}