class Rectangle
{
    constructor(x,y,width,height,id)
    {
        this.height = height;
        this.width = width;
        this.xLocation = x;
        this.yLocation = y;
        this.id = id;
        this.renderIdx = 0;
    }
    
    get XLocation()
    {
        return this.xLocation;
    }
    
    get YLocation()
    {
        return this.yLocation;
    }
    
    get Width()
    {
        return this.width;
    }
    
    get Height()
    {
        return this.height;
    }
    
    get Id()
    {
        return this.id;
    }
    
    get RenderIdx()
    {
        return this.renderIdx;
    }
    
    set Id(idString)
    {
        this.id = idString;
    }
    
    set Height(height)
    {
        this.height = height;
    }
    
    set Width(width)
    {
        this.width = width;
    }
    
    set YLocation(yLoc)
    {
        this.yLocation = yLoc;
    }
    
    set XLocation(xLoc)
    {
        this.xLocation = xLoc;
    }
    
    set RenderIdx(idx)
    {
        this.renderIdx = idx;
    }
    
    calcArea()
    {
        return this.height * this.width;
    }
    
    toXml()
    {
        var xmlOut = "<Rectangle id="+this.id+"/>";
        xmlOut += "\r\n";
        xmlOut+="\t"+"<X>"+this.xLocation+"</X>"
        xmlOut += "\r\n";
        xmlOut+="\t"+"<Y>"+this.yLocation+"</Y>"
        xmlOut += "\r\n";
        xmlOut+="\t"+"<Width>"+this.width+"</Width>"
        xmlOut += "\r\n";
        xmlOut+="\t"+"<Height>"+this.height+"</Height>"
        xmlOut += "\r\n";
        xmlOut +="</Rectangle>"
        
        return xmlOut;
    }
}
