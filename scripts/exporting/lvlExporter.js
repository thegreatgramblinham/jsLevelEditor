class LvlExporter
{
    constructor(outputPath, layerCollection)
    {
        this.outputFilePath = outputPath;
        this.outputXml = new XmlStringBuilder();
        this.layerCollection = layerCollection;
    }
    
    ExportLevel()
    {
        this.outputXml.BeginNode("Level");
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
        
        if(backDrops.length > 0)
        {
            this.WriteBackdrops(backDrops);
        }
        
        if(platforms.length > 0)
        {
            this.WritePlatforms(platforms);
        }

        this.outputXml.EndNode("Level");
        
        return this.outputXml.GetXml();
    }
    
    WritePlatforms(platforms)
    {
        this.outputXml.AddChild("Platforms",false);
        for(var i=0; i<platforms.length; i++)
        {
            var isFirst = (i == 0);
            this.WritePlatform(platforms[i],isFirst);
        }
        this.outputXml.EndNode("Platforms");
    }
    
    WritePlatform(platformRect, isFirst)
    {
        this.outputXml.AddChild("Platform",isFirst);
        this.outputXml.AddCompleteChild("X",platformRect.XLocation,true);
        this.outputXml.AddCompleteChild("Y",platformRect.YLocation,false);
        this.outputXml.AddCompleteChild("Width",platformRect.Width,false);
        this.outputXml.AddCompleteChild("Height",platformRect.Height,false);
        this.outputXml.EndNode("Platform");
    }
    
    WriteBackdrops(backdrops)
    {
        this.outputXml.AddChild("Images",true);
        for(var i=0; i<backdrops.length; i++)
        {
            var isFirst = (i == 0);
            this.WriteBackdrop(backdrops[i],isFirst);
        }
        this.outputXml.EndNode("Images");
    }
    
    WriteBackdrop(imageRect,isFirst)
    {
        this.outputXml.AddCompleteChild(imageRect.Name,imageRect.Image.src,isFirst);
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
}