var IMAGE_TAG = "Images";
var PLATFORMS_TAG = "Platforms";
var PLATFORM_TAG = "Platform";
var IMAGENAME_TAG = "ImageName";
var DIMENSIONS_TAG = "Dimensions"
var LEVEL_TAG = "Level";
var IMAGESOURCE_TAG = "Source";

var X_TAG = "X";
var Y_TAG = "Y";
var WIDTH_TAG = "Width";
var HEIGHT_TAG = "Height";
var RENDERIDX_TAG = "RenderIdx";

class LvlExporter
{
    constructor(outputPath, layerCollection, lvlHeight, lvlWidth)
    {
        this.outputFilePath = outputPath;
        this.outputXml = new XmlStringBuilder();
        this.layerCollection = layerCollection;
        this.levelHeight = lvlHeight;
        this.levelWidth = lvlWidth;
    }
    
    ExportLevel()
    {
        this.outputXml.BeginNode(LEVEL_TAG);
        var backDrops = [];
        var platforms = [];
        var enemies = [];
        var props = [];
        for(var i = 0; i<this.layerCollection.length; i++)
        {
            var layer = this.layerCollection[i];
            var layerBackdrops = layer.GetAllRectsByCategory("Backdrop");
            backDrops = backDrops.concat(layerBackdrops);
            
            var layerPlatforms = layer.GetAllRectsByCategory("Platform");
            platforms = platforms.concat(layerPlatforms);
            
            var layerEnemies = layer.GetAllRectsByCategory("Enemy");
            enemies = enemies.concat(layerEnemies);
            
            var layerProps = layer.GetAllRectsByCategory("Prop");
            props = props.concat(layerProps);
        }
        
        this.WriteDimensions();
        
        if(backDrops.length > 0)
        {
            this.WriteBackdrops(backDrops);
        }
        
        if(platforms.length > 0)
        {
            this.WritePlatforms(platforms);
        }

        this.outputXml.EndNode(LEVEL_TAG);
       
        this.WriteOutputFile();
    }
    
    WriteDimensions()
    {
        this.outputXml.AddChild(DIMENSIONS_TAG,true);
        this.outputXml.AddCompleteChild(WIDTH_TAG,this.levelWidth,true);
        this.outputXml.AddCompleteChild(HEIGHT_TAG,this.levelHeight,false);
        this.outputXml.EndNode(DIMENSIONS_TAG);
    }
    
    WritePlatforms(platforms)
    {
        this.outputXml.AddChild(PLATFORMS_TAG,false);
        for(var i=0; i<platforms.length; i++)
        {
            var isFirst = (i == 0);
            this.WritePlatform(platforms[i],isFirst);
        }
        this.outputXml.EndNode(PLATFORMS_TAG);
    }
    
    WritePlatform(platformRect, isFirst)
    {
        this.outputXml.AddChild(PLATFORM_TAG,isFirst);
        this.outputXml.AddCompleteChild(X_TAG,platformRect.XLocation,true);
        this.outputXml.AddCompleteChild(Y_TAG,platformRect.YLocation,false);
        this.outputXml.AddCompleteChild(WIDTH_TAG,platformRect.Width,false);
        this.outputXml.AddCompleteChild(HEIGHT_TAG,platformRect.Height,false);
        if(platformRect instanceof ImageRectangle)
        {
            this.outputXml.AddCompleteChild(IMAGENAME_TAG, platformRect.Name);
        }
        this.outputXml.AddCompleteChild(RENDERIDX_TAG,platformRect.RenderIdx,false);
        this.outputXml.EndNode(PLATFORM_TAG);
    }
    
    WriteBackdrops(backdrops)
    {
        this.outputXml.AddChild(IMAGE_TAG,false);
        for(var i=0; i<backdrops.length; i++)
        {
            var isFirst = (i == 0);
            this.WriteBackdrop(backdrops[i],isFirst);
        }
        this.outputXml.EndNode(IMAGE_TAG);
    }
    
    WriteBackdrop(imageRect,isFirst)
    {
        this.outputXml.AddChild(imageRect.Name,isFirst);
        this.outputXml.AddCompleteChild(X_TAG,imageRect.XLocation,true);
        this.outputXml.AddCompleteChild(Y_TAG,imageRect.YLocation,false);
        this.outputXml.AddCompleteChild(WIDTH_TAG,imageRect.Width,false);
        this.outputXml.AddCompleteChild(HEIGHT_TAG,imageRect.Height,false);
        this.outputXml.AddCompleteChild(RENDERIDX_TAG,imageRect.RenderIdx,false);
        this.outputXml.EndNode(imageRect.Name);
    }
    
    WriteEnemies(enemies)
    {
        
    }
    
    WriteEnemy(enemyRect)
    {
        
    }
    
    WriteProps(props)
    {
        
    }

    WriteProp(propRect)
    {
        
    }
    
    WriteOutputFile()
    {
         fs.writeFileSync(this.outputFilePath, this.outputXml.GetXml(), 'utf8');
    }
}