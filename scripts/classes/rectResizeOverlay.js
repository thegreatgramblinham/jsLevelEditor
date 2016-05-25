class RectResizeOverlay extends Overlay
{
    constructor(rectangle)
    {
        super(rectangle);
        this.topLeftThumb = undefined;
        this.topRightThumb = undefined;
        this.bottomLeftThumb = undefined;
        this.bottomRightThumb = undefined;
        this.centerThumb = undefined;
        this.centerThumb = undefined;
        this.thumbHit = false;
        this.currentThumb = undefined;
    }

    RenderOverlay(drawingCtx)
    {
        var rect = this.element;
        var top = rect.YLocation;
        var left =rect.XLocation;
        var bottom = top+rect.Height;
        var right = left + rect.Width;
        var centerX = left + (rect.Width/2)
        var centerY = top + (rect.Height/2);
        
        if(!(this.element instanceof ImageRectangle))
        {
            drawingCtx.beginPath();
            drawingCtx.fillStyle = "DarkOrange"
            drawingCtx.arc(left,top,10,0,2*Math.PI);
            drawingCtx.fill();
            drawingCtx.closePath();
            this.topLeftThumb = new resizeThumb(left,top,10);

            drawingCtx.beginPath();
            drawingCtx.fillStyle = "DarkOrange"
            drawingCtx.arc(right,top,10,0,2*Math.PI);
            drawingCtx.fill();
            drawingCtx.closePath();
            this.topRightThumb = new resizeThumb(right,top,10);

            drawingCtx.beginPath();
            drawingCtx.fillStyle = "DarkOrange"
            drawingCtx.arc(left,bottom,10,0,2*Math.PI);
            drawingCtx.fill();
            drawingCtx.closePath();
            this.bottomLeftThumb = new resizeThumb(left,bottom,10);

            drawingCtx.beginPath();
            drawingCtx.fillStyle = "DarkOrange"
            drawingCtx.arc(right,bottom,10,0,2*Math.PI);
            drawingCtx.fill();
            drawingCtx.closePath();
            this.bottomRightThumb = new resizeThumb(right,bottom,10);
        }

        drawingCtx.beginPath();
        drawingCtx.fillStyle = "DarkViolet"
        drawingCtx.arc(centerX,centerY,10,0,2*Math.PI);
        drawingCtx.fill();
        drawingCtx.closePath();
        this.centerThumb = new resizeThumb(centerX,centerY,10);
    }
    
    OverlayMouseDown(button,clientX,clientY)
    {
        if(button == 0)
        {
            this.CheckThumbBounds(clientX,clientY);
        }
    }
    
    OverlayMouseMove(clientX,clientY)
    {
        if(this.thumbHit && this.currentThumb != undefined)
        {   
            if(this.CheckThumbEquality(this.currentThumb,this.centerThumb))
            {
                var delta = new point((clientX-this.centerThumb.centerX),(clientY-this.centerThumb.centerY));
                var xLoc = this.element.XLocation;
                xLoc += delta.xCoordinate;
                this.element.XLocation = xLoc;
                
                var yLoc = this.element.YLocation;
                yLoc += delta.yCoordinate;
                this.element.YLocation = yLoc;
                
                var newCenterX = this.element.XLocation + (this.element.Width/2);
                var newCenterY = this.element.YLocation + (this.element.Height/2);
                this.currentThumb = new resizeThumb(newCenterX,newCenterY,10);
                return;
            }
            
            if(this.currentThumb === this.topLeftThumb)
            {
                return;
            }
            
            if(this.currentThumb == this.bottomLeftThumb)
            {
                return;
            }
            
            if(this.currentThumb == this.bottomRightThumb)
            {
                return;
            }
            
            if(this.currentThumb == this.topRightThumb)
            {
                return;
            }
            console.log("thumb not found");
            return;
        }
    }
    
    DrawRectCoords(drawCtx)
    {
        var locationText = "(" + this.element.XLocation.toFixed(0) +","+this.element.YLocation.toFixed(0)+")";
        drawCtx.beginPath();
        drawCtx.font = "16px Arial";
        drawCtx.fillStyle = "DarkSlateGray";
        drawCtx.fillText(locationText,this.element.XLocation-30, this.element.YLocation-20);
        drawCtx.closePath();
    }
    
    CheckThumbBounds(hitX,hitY)
    {
        if(this.CheckHitThumb(hitX,hitY,this.centerThumb))
        {
            this.thumbHit = true;
            this.currentThumb = this.centerThumb;
            return;
        }
        
        if(this.topLeftThumb != undefined)
        {
           if(this.CheckHitThumb(hitX,hitY,this.topLeftThumb))
           {
               this.thumbHit = true;
               this.currentThumb = this.topLeftThumb;
               return;
           }
        }

        if(this.topRightThumb != undefined)
        {
           if(this.CheckHitThumb(hitX,hitY,this.topRightThumb))
           {
               this.thumbHit = true;
               this.currentThumb = this.topRightThumb;
               return;
           }
        }
        
        if(this.bottomLeftThumb != undefined)
        {
            if(this.CheckHitThumb(hitX,hitY,this.bottomLeftThumb))
            {
                this.thumbHit = true;
                this.currentThumb = this.bottomLeftThumb;
                return;
            }
        }
        
        if(this.bottomRightThumb != undefined)
        {
            if(this.CheckHitThumb(hitX,hitY,this.bottomRightThumb))
            {
                this.thumbHit = true;
                this.currentThumb = this.bottomRightThumb;
                return;
            }
        }
        
        this.thumbHit = false;
        this.currentThumb = undefined;
    }
        
    CheckHitThumb(hitX,hitY,thumb)
    {
        return Math.pow((hitX - thumb.centerX),2) + Math.pow((hitY-thumb.centerY),2) < Math.pow(thumb.radius,2);
    }
    
    
    CheckThumbEquality(thumbA, thumbB)
    {
        return thumbA.centerX == thumbB.centerX && thumbA.centerY == thumbB.centerY && thumbA.radius == thumbB.radius;
    }
}