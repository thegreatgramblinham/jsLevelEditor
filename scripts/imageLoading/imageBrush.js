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
    
    get Width()
    {
        return this.image.width;
    }
    
    get Height()
    {
        return this.image.height;
    }
    
    set ImagePath(imageFilePath)
    {
        this.imagePath = imageFilePath;
    }
    
    set Image(image)
    {
        this.image = image;
    }
    
    GetFileName()
    {
       return this.imagePath.split('/').pop().split('.')[0];
    }
}