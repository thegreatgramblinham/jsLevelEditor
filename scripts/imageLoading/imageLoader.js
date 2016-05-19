//Global Variables
var ImageCache = [];
var ImagePalleteDiv = document.getElementById("ImagePalleteDiv");

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
        var ext = imgFileName.split('.').pop();
        
        console.log("Processing: " + imgFileName);        
        switch(ext)
        {
            case "png":
                LoadImage(imgFileName, directoryPath);
        }
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
    var form = document.createElement("FORM");
    for(var i = 0; i < ImageCache.length; i++)
    {
        var button = document.createElement("BUTTON");
        button.className="imageListButton";
        //button.id = "imageListButton";
        button.appendChild(ImageCache[i]);
        form.appendChild(button);
    }
    
    ImagePalleteDiv.appendChild(form);
}