var IMAGE_TAG = "Images";
var PLATFORM_TAG = "Platform";
var DIMENSIONS_TAG = "Dimensions";
var GROUP_TAG = "Group";
var GROUPS_TAG = "Groups";
var NAME_TAG = "Name";
var IMAGENAME_TAG = "ImageName";
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
        var groups = this.xmlDoc.getElementsByTagName(GROUP_TAG);
        
        if(dimensionsCollection != undefined && dimensionsCollection.children.length == 2)
        {
            this.SetLevelBounds(dimensionsCollection)
        }
        
        if(imagesCollection != undefined && imagesCollection.children.length > 0)
        {
            this.LoadLevelBackgrounds(imagesCollection);
        }

        if(groups != undefined)
        {
            this.LoadGroups(groups);
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
        
        ImportLevelBounds(lvlWidth, lvlHeight);
    }
    
    LoadLevelBackgrounds(imagesArray)
    {
        for(var i=0; i<imagesArray.children.length; i++)
        {
            var child = imagesArray.children[i];
            this.BuildImageRect(child.tagName,child);
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
            
            else if(imageProperty.tagName == RENDERIDX_TAG)
            {
                imageProperties[RENDERIDX_TAG] = imageProperty.innerHTML;
            }
        }
        
        this.AddImageToCanvas(imageName,imageProperties);
    }
    
    LoadGroups(groupsArray)
    {
        for(var i=0; i<groupsArray.length; i++)
        {
            this.BuildGroupRect(groupsArray[i]);
        }
    }

    BuildGroupRect(group)
    {
        var groupProperties = [];
        for(var i=0; i<group.children.length; i++)
        {
            var groupProperty = group.children[i];
            if(groupProperty.tagName == NAME_TAG)
            {
                groupProperties[NAME_TAG] = groupProperty.innerHTML;
            }

            else if(groupProperty.tagName == X_TAG)
            {
                groupProperties[X_TAG] = Number(groupProperty.innerHTML);
            }

            else if(groupProperty.tagName == Y_TAG)
            {
                groupProperties[Y_TAG] = Number(groupProperty.innerHTML);
            }
            
            else if(groupProperty.tagName == WIDTH_TAG)
            {
                groupProperties[WIDTH_TAG] = Number(groupProperty.innerHTML);
            }
            
            else if(groupProperty.tagName == HEIGHT_TAG)
            {
                groupProperties[HEIGHT_TAG] = Number(groupProperty.innerHTML);
            }
            
            else if(groupProperty.tagName == RENDERIDX_TAG)
            {
                groupProperties[RENDERIDX_TAG] = Number(groupProperty.innerHTML);
            }
        }

        this.AddGroupToCanvas(groupProperties);
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
        var isImagePlatform = false;
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

            else if(platformProperty.tagName == IMAGENAME_TAG)
            {
                platformProperties[IMAGENAME_TAG] = platformProperty.innerHTML;
                isImagePlatform = true;
            }
        }

        if(!isImagePlatform)
        {
            this.AddPlatformToCanvas(platformProperties,count);
        }
        else
        {
            this.AddImagePlatformToCanvas(platformProperties);
        }

    }
    
    AddPlatformToCanvas(platformProperties,count)
    {
        AddRectangleToLayer(platformProperties[X_TAG],platformProperties[Y_TAG],
            platformProperties[WIDTH_TAG],platformProperties[HEIGHT_TAG],"Platform" + count,"Platform", 
            platformProperties[RENDERIDX_TAG])
    }

    AddGroupToCanvas(groupProperties)
    {
        AddRectangleToLayer(groupProperties[X_TAG],groupProperties[Y_TAG],
        groupProperties[WIDTH_TAG],groupProperties[HEIGHT_TAG],groupProperties[NAME_TAG],
        "Group",groupProperties[RENDERIDX_TAG]);
    }

    AddImagePlatformToCanvas(platformProperties)
    {
        var platformImageName = platformProperties[IMAGENAME_TAG];
        var image = GetImageElementByFileName(platformImageName);
        if(image == undefined)
            throw "Could not find file "+ platformImageName +" in open images.";
        
        AddImageToLayer(platformProperties[X_TAG],platformProperties[Y_TAG],image,platformImageName,"Platform",
            platformProperties[RENDERIDX_TAG])

    }
    
    AddImageToCanvas(imageTypeName,imageProperties)
    {
       var image = GetImageElementByFileName(imageTypeName);    
       if(image == undefined)
                throw "Could not find file "+ imageTypeName +" in open images.";
                
        AddImageToLayer(imageProperties[X_TAG], imageProperties[Y_TAG],image,imageTypeName,"Backdrop"
        ,imageProperties[RENDERIDX_TAG]);
    }
}