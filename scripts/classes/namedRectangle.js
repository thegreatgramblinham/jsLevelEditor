class NamedRectangle extends Rectangle
{
    constructor(x,y,width,height,name)
    {
        super(x,y,width,height);
        this.name = name;
        this.category = "None";
        this.group = undefined;
    }
    
    get Name()
    {
        return this.name;
    }
    
    get Category()
    {
        return this.category;
    }

    get Group()
    {
        return this.Group;
    }
    
    set Name(name)
    {
        this.name = name;
    }
    
    set Category(category)
    {
        this.category = category;
    }

    set Group(group)
    {
        this.group = group;
    }
}