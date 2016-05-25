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
    
    OverlayMouseMove(clientX,clientY,maxX,maxY)
    {
        if(this.thumbHit && this.currentThumb != undefined)
        {   
            if(this.CheckThumbEquality(this.currentThumb,this.centerThumb))
            {
                var delta = new point((clientX-this.centerThumb.centerX),(clientY-this.centerThumb.centerY));
                var xLoc = this.element.XLocation;
                xLoc += delta.xCoordinate;
                var yLoc = this.element.YLocation;
                yLoc += delta.yCoordinate;
                
                if(xLoc >= 0 && (xLoc + this.element.Width) <= maxX)
                {
                    this.element.XLocation = xLoc;
                }
                
                if(yLoc>= 0 && (yLoc+this.element.Height)<=maxY)
                {
                    this.element.YLocation = yLoc;
                }

                
                var newCenterX = this.element.XLocation + (this.element.Width/2);
                var newCenterY = this.element.YLocation + (this.element.Height/2);
                this.currentThumb = new resizeThumb(newCenterX,newCenterY,10);
                return;
            }
            
            if(this.CheckThumbEquality(this.currentThumb,this.topLeftThumb))
            {
                var delta = new point((clientX-this.topLeftThumb.centerX),(clientY-this.topLeftThumb.centerY));
                var oldBottom = this.element.Height + this.element.YLocation;
                var oldRight = this.element.Width + this.element.XLocation;
                
                var xLoc = this.element.XLocation + delta.xCoordinate;
                var yLoc = this.element.YLocation + delta.yCoordinate;
                
                if(xLoc >= 0 && (xLoc + this.element.Width) <= maxX)
                {
                     this.element.XLocation = xLoc;
                     this.element.Width = Math.abs(this.element.XLocation - oldRight);
                }
                
                if(yLoc>= 0 && (yLoc+this.element.Height)<=maxY)
                {
                    this.element.YLocation = yLoc;
                    this.element.Height = Math.abs(this.element.YLocation - oldBottom);
                }
                
                var newTopLeftX = this.element.XLocation;
                var newTopLeftY = this.element.YLocation;
                this.currentThumb = new resizeThumb(newTopLeftX, newTopLeftY, 10);
                return;
            }
            
            if(this.CheckThumbEquality(this.currentThumb,this.bottomLeftThumb))
            {
                var delta = new point((clientX-this.bottomLeftThumb.centerX),(clientY-this.bottomLeftThumb.centerY));
                var oldRight = this.element.Width + this.element.XLocation;
                var xLoc = this.element.XLocation + delta.xCoordinate;
                var newHeight = this.element.Height + delta.yCoordinate;
                var proposedBottom = newHeight + this.element.YLocation;
                
                if(xLoc >= 0 && (xLoc + this.element.Width) <= maxX)
                {
                     this.element.XLocation = xLoc;
                     this.element.Width = Math.abs(this.element.XLocation - oldRight);
                }
                
                if(proposedBottom >= 0 && proposedBottom <= maxY)
                {
                    this.element.Height = newHeight;
                }
                
                var actualBottom = this.element.YLocation + this.element.Height;
                this.currentThumb = new resizeThumb(this.element.XLocation,actualBottom,10);
                return;
            }
            
            if(this.CheckThumbEquality(this.currentThumb, this.bottomRightThumb))
            {
                var delta = new point((clientX-this.bottomRightThumb.centerX),(clientY-this.bottomRightThumb.centerY));
                var newWidth = this.element.Width + delta.xCoordinate;
                var newHeight = this.element.Height + delta.yCoordinate;
                var proposedRight = this.element.XLocation + newWidth;
                var proposedBottom = this.element.YLocation + newHeight;
                
                if(proposedRight >= 0 && proposedRight <= maxX)
                {
                    this.element.Width = newWidth;
                }
                
                if(proposedBottom >= 0 && proposedBottom <= maxY)
                {
                    this.element.Height = newHeight;
                }
                
                var actualRight = this.element.XLocation + this.element.Width;
                var actualBottom = this.element.YLocation + this.element.Height;
                this.currentThumb = new resizeThumb(actualRight, actualBottom, 10);
                return;
            }
            
            if(this.CheckThumbEquality(this.currentThumb, this.topRightThumb))
            {
                var delta = new point((clientX-this.topRightThumb.centerX),(clientY-this.topRightThumb.centerY));
                var oldBottom = this.element.Height + this.element.YLocation;
                var yLoc = this.element.YLocation + delta.yCoordinate;
                var newWidth = this.element.Width + delta.xCoordinate;
                var proposedRight = this.element.XLocation + newWidth;
                
                if(proposedRight >= 0 && proposedRight <= maxX)
                {
                    this.element.Width = newWidth;
                }
                
                if(yLoc >= 0 && yLoc <= maxY)
                {
                    this.element.YLocation = yLoc;
                    this.element.Height = Math.abs(this.element.YLocation - oldBottom);
                }
                
                var actualTop = this.element.YLocation;
                var actualRight = this.element.XLocation + this.element.Width;
                this.currentThumb = new resizeThumb(actualRight,actualTop,10);
                
                return;
            }
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