class ImageRectangle extends NamedRectangle
{
    constructor(x,y,image, name)
    {
        super(x, y, image.width, image.height, name);
        this.image = image;
    }
    
    get Image()
    {
        return this.image;
    }
}