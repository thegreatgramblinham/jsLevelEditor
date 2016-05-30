var IMAGE_TAG = "Images";
var PLATFORM_TAG = "Platform";
var DIMENSIONS_TAG = "Dimensions"
var BACKGROUND_TAG = "Background";
var FOREGROUND_TAG = "Foreground";
var IMAGESOURCE_TAG = "Source";

var X_TAG = "X";
var Y_TAG = "Y";
var WIDTH_TAG = "Width";
var HEIGHT_TAG = "Height";
var RENDERIDX_TAG = "RenderIdx";

class LvlImporter
{
    constructor(inputPath)
    {
        this.inputFile = inputPath;
        this.xmlDoc = undefined;
        this.OpenFile();
    }
    
    OpenFile()
    {
        try
        {
            var xmlInputString = fs.readFileSync(this.inputFile, 'utf8');
            var parser = new DOMParser();
            this.xmlDoc = parser.parseFromString(xmlInputString,"text/xml");
        }
        catch(ex)
        {
            throw "Failed to open xml doc: "+ex.toString();
        }
    }
    
    ImportLvlFile()
    {
        ResetCanvas();
        var dimensions = this.xmlDoc.getElementsByTagName(DIMENSIONS_TAG);
        var dimensionsCollection = dimensions[0];
        var images = this.xmlDoc.getElementsByTagName(IMAGE_TAG);
        var imagesCollection = images[0];
        var platforms = this.xmlDoc.getElementsByTagName(PLATFORM_TAG);
        
        if(dimensionsCollection != undefined && dimensionsCollection.children.length == 2)
        {
            this.SetLevelBounds(dimensionsCollection)
        }
        
        if(imagesCollection != undefined && imagesCollection.children.length > 0)
        {
            this.LoadLevelBackgrounds(imagesCollection);
        }
        
        if(platforms != undefined)
        {
            this.LoadPlatforms(platforms)
        }
    }
    
    SetLevelBounds(dimensionsArray)
    {
        var lvlHeight;
        var lvlWidth;
        
        for(var i=0; i<dimensionsArray.children.length; i++)
        {
            var child = dimensionsArray.children[i];
            if(child.tagName == WIDTH_TAG)
            {
                lvlWidth = Number(child.innerHTML);
            }
            
            if(child.tagName == HEIGHT_TAG)
            {
                lvlHeight = Number(child.innerHTML);
            }
        }
        
        ImportLevelBounds(lvlHeight,lvlWidth);
    }
    
    LoadLevelBackgrounds(imagesArray)
    {
        for(var i=0; i<imagesArray.children.length; i++)
        {
            var child = imagesArray.children[i];
            if(child.tagName == BACKGROUND_TAG)
            {
                this.BuildImageRect(BACKGROUND_TAG,child);
            }
            
            if(child.tagName == FOREGROUND_TAG)
            {
                this.BuildImageRect(FOREGROUND_TAG,child);
            }
        }
    }
    
    BuildImageRect(imageName,imageChildNode)
    {
        var imageProperties = [];
        for(var i=0; i< imageChildNode.children.length; i++)
        {
            var imageProperty = imageChildNode.children[i];
            
            if(imageProperty.tagName == X_TAG)
            {
                imageProperties[X_TAG] = Number(imageProperty.innerHTML);
            }
            
            else if(imageProperty.tagName == Y_TAG)
            {
                imageProperties[Y_TAG] = Number(imageProperty.innerHTML);
            }
            
            else if(imageProperty.tagName == WIDTH_TAG)
            {
                imageProperties[WIDTH_TAG] = Number(imageProperty.innerHTML);
            }
            
            else if(imageProperty.tagName == HEIGHT_TAG)
            {
                imageProperties[HEIGHT_TAG] = Number(imageProperty.innerHTML);
            }
            
            else if(imageProperty.tagName == IMAGESOURCE_TAG)
            {
                imageProperties[IMAGESOURCE_TAG] = imageProperty.innerHTML;
            }
            
            else if(imageProperty.tagName == RENDERIDX_TAG)
            {
                imageProperties[RENDERIDX_TAG] = imageProperty.innerHTML;
            }
        }
        
        this.AddImageToCanvas(imageName,imageProperties);
    }
    
    
    
    LoadPlatforms(platformsArray)
    {
        for(var i=0; i<platformsArray.length; i++)
        {
            this.BuildPlatformRect(platformsArray[i], i);
        }
    }
    
    BuildPlatformRect(platformNode, count)
    {
        var platformProperties = [];
        for(var i=0;i<platformNode.children.length;i++)
        {
            var platformProperty = platformNode.children[i];
            
            if(platformProperty.tagName == X_TAG)
            {
                platformProperties[X_TAG] = Number(platformProperty.innerHTML);
            }
            
            else if(platformProperty.tagName == Y_TAG)
            {
                platformProperties[Y_TAG] = Number(platformProperty.innerHTML);
            }
            
            else if(platformProperty.tagName == WIDTH_TAG)
            {
                platformProperties[WIDTH_TAG] = Number(platformProperty.innerHTML);
            }
            
            else if(platformProperty.tagName == HEIGHT_TAG)
            {
                platformProperties[HEIGHT_TAG] = Number(platformProperty.innerHTML);
            }
            
            else if(platformProperty.tagName == RENDERIDX_TAG)
            {
                platformProperties[RENDERIDX_TAG] = Number(platformProperty.innerHTML);
            }
        }
        this.AddPlatformToCanvas(platformProperties,count);
    }
    
    AddPlatformToCanvas(platformProperties,count)
    {
        AddRectangleToLayer(platformProperties[X_TAG],platformProperties[Y_TAG],
            platformProperties[WIDTH_TAG],platformProperties[HEIGHT_TAG],"Platform" + count,"Platform", 
            platformProperties[RENDERIDX_TAG])
    }
    
    AddImageToCanvas(imageTypeName,imageProperties)
    {
        var image = document.createElement("img");
        image.src = imageProperties[IMAGESOURCE_TAG];
        AddImageToLayer(imageProperties[X_TAG], imageProperties[Y_TAG],image,imageTypeName,"Backdrop"
        ,imageProperties[RENDERIDX_TAG]);
    }
}