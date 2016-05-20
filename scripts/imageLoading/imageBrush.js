class ImageBrush
{
    constructor(imageFilePath)
    {
        this.imagePath = imageFilePath;
        this.image = document.createElement("IMG"); 
        this.image.src = imageFilePath;
    }
    
    get ImagePath()
    {
        return imagePath;
    }
    
    get Image()
    {
        return this.image;
    }
    
    set ImagePath(imageFilePath)
    {
        this.imagePath = imageFilePath;
    }
    
    set Image(image)
    {
        this.image = image;
    }
}