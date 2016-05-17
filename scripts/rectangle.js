"use strict";
class Rectangle
{
    constructor(x,y,height,width,id)
    {
        this.height = heaight;
        this.width = width;
        this.xLocation = x;
        this.yLocation = y;
        this.id = id;
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
    
    calcArea()
    {
        return this.height * this.width;
    }
}