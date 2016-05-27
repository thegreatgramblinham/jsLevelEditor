class NamedRectangle extends Rectangle
{
    constructor(x,y,width,height,name)
    {
        super(x,y,width,height);
        this.name = name;
        this.category = "";
    }
    
    get Name()
    {
        return this.name;
    }
    
    get Category()
    {
        return this.Category;
    }
    
    set Name(name)
    {
        this.name = name;
    }
    
    set Category(category)
    {
        this.category = category;
    }
}