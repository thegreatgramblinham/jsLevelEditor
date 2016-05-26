class RenderLayer
{
    constructor(layerIdx)
    {
        this.rectangles = [];
        this.layerIndex = 0;
        this.isVisible = true;
    }
    
    get LayerIdx()
    {
        return this.layerIndex;
    }
    
    ChildCount()
    {
        return this.rectangles.length;
    }
    
    GetRectangle(idx)
    {
        if(idx < this.rectangles.length && idx > -1)
        {
            return this.rectangles[idx];
        }
        
        return undefined;
    }
    
    HasChildren()
    {
        return this.rectangles.length > 0;
    }
    
    AddRectangle(rect)
    {
        rect.RenderIdx = this.layerIdx;
        this.rectangles.push(rect);
    }
    
    RemoveRectangle(rect)
    {
        var rectIdx = _rectangles.indexOf(rect);
        if(rectIdx > -1)
        {
            this.rectangles.splice(rectIdx,1);
        }
    }
    
    ToggleVisibility()
    {
        this.isVisible = !this.isVisible;
    }
    
    RefreshLayer(drawingCtx)
    {
        var i;
        for(i=0; i<this.rectangles.length; i++)
        {
            var refreshRect = this.rectangles[i];
            drawingCtx.beginPath();
            drawingCtx.fillStyle="#4FD921";
            drawingCtx.fillRect(refreshRect.XLocation,refreshRect.YLocation, refreshRect.Width,refreshRect.Height);
            drawingCtx.closePath();
        }
    }
}