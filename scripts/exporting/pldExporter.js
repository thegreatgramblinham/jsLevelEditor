//This class is for the exporting of .pld level files.

//Private Constants
var FILE_EXTENSION = "pld";

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
        
        this.xmlBuilder.BeginNode("Stage");
        
        var backdrops = []; 
        
        for(var i = 0; i < this.layers.length; i++)
        {
            var layer = this.layer[i];
                   
            var layerBackdrops = layer.GetAllRectsByCategory("Backdrop");
            backDrops = backDrops.concat(layerBackdrops);
            
        }
        
        if(backdrops.length > 1)
            throw "More than one backdrop defined."
        WriteBackdrop(backdrops[0]);
        
    }
    
    //Private Methods
    WriteBackdrop(backdropRect)
    {
        this.xmlBuilder.AddChild(BACKDROP_TAG, true);
        this.xmlBuilder.AddChild(backdropRect.Name);
        this.outputXml.AddCompleteChild("X", backdropRect.XLocation, true);
        this.outputXml.AddCompleteChild("Y", backdropRect.YLocation, false);
        this.xmlBuilder.EndNode(backdropRect.Name);
        this.xmlBuilder.EndNode(BACKDROP_TAG);
    }
}