//Global Variables
var ImageCache = [];
var ImageDiv = document.createElement("DIV");
var ImagePalleteDiv = document.getElementById("ImagePalleteDiv");

//Main
ImagePalleteDiv.appendChild(ImageDiv);

//Methods
function LoadImagesFromDirectory(directoryPath)
{
    if (directoryPath === undefined)
        throw "Can't Load Images - null directory."
        
    console.log("Loading images from: " + directoryPath);
    
    var fileList = fs.readdirSync(directoryPath, 'utf8');
    
    console.log(fileList.length+" files in directory."); 
    
    for(var i = 0; i < fileList.length; i++)
    {
        var imgFileName = fileList[i];
        var pathArr = imgFileName.split('.');
        var ext = imgFileName.split('.').pop();
        
        console.log("Processing: " + imgFileName);        
        switch(ext)
        {
            case "png":
                LoadImage(imgFileName, directoryPath);
        }
        
        if(pathArr.length === 1) //doesn't have extension, likely another folder.
            LoadImagesFromDirectory(directoryPath+"/"+imgFileName);
             
    }  
    console.log("Finished loading images."); 
    
    BuildItemsControl();
}

function LoadImage(imgFileName, containingDirectory)
{
    var image = document.createElement("IMG");    
    image.src = containingDirectory+"/"+imgFileName;   
    image.width = 64;
    image.height = 64;
    ImageCache.push(image);
    console.log("Loaded: " + imgFileName);  
}

function BuildItemsControl()
{   
    var div = document.createElement("DIV");
    for(var i = 0; i < ImageCache.length; i++)
    {
        var button = document.createElement("BUTTON");
        button.className="imageListButton";
        button.id="imageListButton."+ i;
        button.onclick = function() 
            { 
                ImageButtonOnClick(this.id.split('.').pop());
            };
        button.appendChild(ImageCache[i]);
        div.appendChild(button);
    }
    
    ImagePalleteDiv.replaceChild(div, ImageDiv);
    ImageDiv = div;
}