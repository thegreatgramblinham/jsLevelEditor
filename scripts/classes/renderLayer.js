class RenderLayer
{
    constructor(layerIdx)
    {
        this.rectangles = [];
        this.layerIndex = layerIdx;
        this.isVisible = true;
        this.isSelected = false;
    }
    
    get LayerIdx()
    {
        return this.layerIndex;
    }
    
    get IsSelected()
    {
        return this.isSelected;
    }
    
    set IsSelected(selected)
    {
        this.isSelected = selected;
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
    
    GetRectangleByGuid(rectGuid)
    {
        var i;
        for(i=0; i<this.rectangles.length; i++)
        {
            if(rectGuid == this.rectangles[i].Id)
            {
                return this.rectangles[i];
            }
        }
        return undefined;
    }
    
    GetAllRectsByCategory(categoryString)
    {
        var i;
        var rects = [];
        for(i=0; i <this.rectangles.length; i++)
        {
            if(this.rectangles[i].Category == categoryString)
            {
                rects.push(this.rectangles[i]);
            }
        }
        return rects;
    }
    
    IsRectInLayer(rectGuid)
    {
        var i;
        for(i=0; i<this.rectangles.length; i++)
        {
            if(rectGuid == this.rectangles[i].Id)
            {
                return true;
            }
        }
        return false;
    }
    
    HasChildren()
    {
        return this.rectangles.length > 0;
    }
    
    AddRectangle(rect)
    {
        rect.RenderIdx = this.layerIndex;
        this.rectangles.push(rect);
    }
    
    RemoveRectangle(rect)
    {
        var rectIdx = this.rectangles.indexOf(rect);
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
            if(!(refreshRect instanceof ImageRectangle))
            {
                drawingCtx.setLineDash([0]);
                drawingCtx.beginPath();
                drawingCtx.strokeStyle="#4FD921";
                drawingCtx.strokeRect(refreshRect.XLocation,refreshRect.YLocation, refreshRect.Width,refreshRect.Height);
                drawingCtx.closePath();
            }
            else
            {
                drawingCtx.beginPath();
                drawingCtx.drawImage(refreshRect.Image,refreshRect.XLocation,refreshRect.YLocation);
            }
            
        }
    }
}