class NamedRectangle extends Rectangle
{
    constructor(x,y,width,height,name)
    {
        super(x,y,width,height);
        this.name = name;
    }
    
    get Name()
    {
        return this.name;
    }
    
    set Name(name)
    {
        this.name = name;
    }
}