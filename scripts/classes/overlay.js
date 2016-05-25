class Overlay
{
    constructor(elementObject)
    {
        this.element = elementObject;
    }
    
    RenderOverlay(drawingCtx){}
    
    OverlayMouseDown(button, clientX, clientY){}
    
    OverlayMouseUp(button){}
    
    OverlayMouseMove(clientX, clientY){}
    
    OverlayKeyDown(key){}
    
    OverlayKeyUp(key){}
    
}