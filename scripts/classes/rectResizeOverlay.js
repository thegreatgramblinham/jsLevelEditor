class RectResizeOverlay extends Overlay
{
    constructor(rectangle)
    {
        super(rectangle);
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

            drawingCtx.beginPath();
            drawingCtx.fillStyle = "DarkOrange"
            drawingCtx.arc(right,top,10,0,2*Math.PI);
            drawingCtx.fill();
            drawingCtx.closePath();

            drawingCtx.beginPath();
            drawingCtx.fillStyle = "DarkOrange"
            drawingCtx.arc(left,bottom,10,0,2*Math.PI);
            drawingCtx.fill();
            drawingCtx.closePath();

            drawingCtx.beginPath();
            drawingCtx.fillStyle = "DarkOrange"
            drawingCtx.arc(right,bottom,10,0,2*Math.PI);
            drawingCtx.fill();
            drawingCtx.closePath();
        }

        drawingCtx.beginPath();
        drawingCtx.fillStyle = "DarkViolet"
        drawingCtx.arc(centerX,centerY,10,0,2*Math.PI);
        drawingCtx.fill();
        drawingCtx.closePath();
    }
}