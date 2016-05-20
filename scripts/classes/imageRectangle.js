class ImageRectangle extends Rectangle
{
    constructor(x,y,image, id)
    {
        super(x, y, image.width, image.height, id);
        this.image = image;
    }
    
    get Image()
    {
        return this.image;
    }
}