//DOM Access and Setup

//Private Constants
var _widthInputBox = document.getElementById("levelWidthBox");
var _heightInputBox = document.getElementById("levelHeightBox");
var _canvas = document.getElementById("mainCanvas");
var _verticalScroll = document.getElementById("vScroll")
var _horizontalScroll = document.getElementById("hScroll");
var _verticalThumb = document.getElementById("vThumb");
var _horizThumb = document.getElementById("hThumb");
var _drawContext = _canvas.getContext("2d");
var CTRL_SCROLL_SPEED = .25;

//Private Variables
var _mouseDown = false;
var _ctrlPressed = false;
var _downPoint = undefined;

var _verticalThumbStartPoint = 0;
var _horizThumbStartPoint = 0;
var _verticalThumbMouseDown = false;
var _horizthumbMouseDown = false;
var _verticalScrollVisible = true;
var _horizScrollVisible = true;
var _scrollOffsetX = 0;
var _scrollOffsetY = 0;
var _scrollXDelta = 0;
var _scrollYDelta = 0;
var _prevScrollOffsetY = 0;
var _prevScrollOffsetX = 0;
var _scale = 1;
var _selectedRectOverlay = undefined;
const _minThumbWidth = 15;
const _minThumbHeight = 15;


_canvas.width = _canvas.offsetWidth;
_canvas.height = _canvas.offsetHeight;
_verticalScroll.style.height = "100%";
_verticalScroll.style.width = 25;
_verticalThumb.style.top="0px";
_verticalThumb.style.cursor = "n-resize";
_horizThumb.style.left = "0px";
_horizThumb.style.cursor= "w-resize";
_horizontalScroll.style.height = 25;
_widthInputBox.value = _canvas.width;
_heightInputBox.value = _canvas.height;
LevelWidth = _canvas.width;
LevelHeight = _canvas.height;

//Rectangle Collection
var _currentRectangle = undefined;

//Update the scrollbars on window load, they may not need to be visible
UpdateScrollThumbs();
InitLayers();

//Initialize Layers

//Canvas Events
_canvas.onmousedown = function(e)
{
    if(e.button == 0)
    {
        _mouseDown = true;
        _downPoint = GetMousePointInElement(_canvas,e.clientX,e.clientY);
        if(CanvasMode == UIMode.Modify)
        {
            var hitPoint = new point(_downPoint.xCoordinate + _scrollOffsetX, _downPoint.yCoordinate + _scrollOffsetY);
            DetectRectangleHit(hitPoint);
        }
    }
    else
    {
        _mouseDown = false;
        _downPoint = undefined;
    }
};

_canvas.onmousemove = function(e)
{
    RefreshRectangles();
    if(_mouseDown && _downPoint != undefined)
    {
        var currPoint = GetMousePointInElement(_canvas,e.clientX, e.clientY);
        
        if(!_ctrlPressed)
        {
            if(CanvasMode == UIMode.Add)
            {
                if(BrushSelection == BrushType.BasicRect)
                {
                    var rectX = Math.min(_downPoint.xCoordinate+_scrollOffsetX, currPoint.xCoordinate+_scrollOffsetX);
                    var rectY =  Math.min(_downPoint.yCoordinate+_scrollOffsetY, currPoint.yCoordinate+_scrollOffsetY);

                    var width = Math.max(_downPoint.xCoordinate+_scrollOffsetX,currPoint.xCoordinate+_scrollOffsetX) 
                        - Math.min(_downPoint.xCoordinate+_scrollOffsetX, currPoint.xCoordinate+_scrollOffsetX);
                    var height = Math.max(_downPoint.yCoordinate+_scrollOffsetY, currPoint.yCoordinate+_scrollOffsetY) 
                        - Math.min(_downPoint.yCoordinate+_scrollOffsetY, currPoint.yCoordinate+_scrollOffsetY);
                    
                    if((rectX < 0 || rectX > LevelWidth) ||
                        (rectY < 0 || rectY > LevelHeight))
                    {
                        _currentRectangle = undefined;
                        return;
                    }
                    
                    if(rectX + width > LevelWidth )
                    {
                        width = LevelWidth-rectX;
                    }
                    
                    if(rectY + height > LevelHeight)
                    {
                        height = LevelHeight-rectY;
                    }   
                        
                    rectX = Number(rectX.toFixed(0));
                    rectY = Number(rectY.toFixed(0));
                    width = Number(width.toFixed(0));
                    height = Number(height.toFixed(0));
                    _drawContext.beginPath();
                    _drawContext.setLineDash([3,4])
                    _drawContext.strokeStyle = "#D1A147"
                    _drawContext.rect(rectX, rectY,width,height, 1);
                    _drawContext.stroke();
                    _drawContext.closePath();

                    _currentRectangle = new NamedRectangle(rectX, rectY,width,height,CurrentLayer.ChildCount().toString());
                    
                }
               
            }
            else if(CanvasMode == UIMode.Modify)
            {
                if(_selectedRectOverlay != undefined)
                {
                    _selectedRectOverlay.OverlayMouseMove(currPoint.xCoordinate+_scrollOffsetX, currPoint.yCoordinate+_scrollOffsetY, LevelWidth, LevelHeight);
                    _selectedRectOverlay.DrawRectCoords(_drawContext);
                    OnSelectedRectangleChanged();
                }
            }
        }
        else
        {
            var delta = new point(
                (currPoint.xCoordinate - _downPoint.xCoordinate)*CTRL_SCROLL_SPEED,
                (currPoint.yCoordinate - _downPoint.yCoordinate)*CTRL_SCROLL_SPEED);
            
            if(_horizScrollVisible)
            {
                var deltaX = delta.xCoordinate*-1;
                MoveHorizontalThumb(deltaX)
            }
            
            if(_verticalScrollVisible)
            {
                var deltaY = delta.yCoordinate*-1;
                MoveVerticalThumb(deltaY);
            }
            _downPoint = currPoint;
        }
        
    }
    var locPoint = GetMousePointInElement(_canvas, e.clientX, e.clientY);
    var worldPoint = new point(locPoint.xCoordinate+_scrollOffsetX, locPoint.yCoordinate+_scrollOffsetY);
    var locationText = "(" + worldPoint.xCoordinate.toFixed(0) +","+worldPoint.yCoordinate.toFixed(0)+")";
    _drawContext.beginPath();
    _drawContext.font = "16px Arial";
    _drawContext.fillStyle = "black";
    _drawContext.fillText(locationText,worldPoint.xCoordinate, worldPoint.yCoordinate);
    _drawContext.closePath();
};

_canvas.onmouseup = function(e)
{
    if(_mouseDown)
    {
        _mouseDown = false;
        _downPoint = undefined;
        if(_currentRectangle != undefined && IsValidRectangle())
        {
            AddRectangle(_currentRectangle.XLocation, _currentRectangle.YLocation, _currentRectangle.Width,
                _currentRectangle.Height, "Rectangle "+CurrentLayer.ChildCount(), DefaultCategory);
        }
        else if(BrushSelection == BrushType.Image && CanvasMode == UIMode.Add && !_ctrlPressed)
        {
            var canvasMouseUpPoint = GetMousePointInElement(_canvas,e.clientX,e.clientY);
            var imagePlacePoint = new point(canvasMouseUpPoint.xCoordinate+_scrollOffsetX,canvasMouseUpPoint.yCoordinate + _scrollOffsetY);
            if(CurrentImageBrush != undefined)
            {
                AddImage(imagePlacePoint.xCoordinate, imagePlacePoint.yCoordinate, CurrentImageBrush.Image,
                     CurrentImageBrush.GetFileName(), DefaultCategory);
            }
        }
        RefreshRectangles();
    }
    
};

//Window events
window.onresize = function(e)
{
    _canvas.width = Math.floor((window.innerWidth * .77));
    _canvas.height = Math.floor((window.innerHeight * .77));   
    RefreshRectangles();
    UpdateScrollThumbs();
}

window.onkeydown = function(e)
{
    if(e.keyCode == "17")
    {
     _ctrlPressed = true;
    }
    else if(e.keyCode == "46")
    {
        if(CanvasMode == UIMode.Modify && SelectedRectangle != undefined)
        {
            RemoveSelectedRectangle();   
        }
    }
}

window.onkeyup = function(e)
{
    if(e.keyCode == "17")
    {
        _ctrlPressed = false;
    }
}

///<summary>
///Method to redraw all current rectangles on the screen
///</summary>
function RefreshRectangles()
{
    clearCanvas();
    var i;
    for(i=0; i<LayerCollection.length; i++)
    {
        LayerCollection[i].RefreshLayer(_drawContext);
    }
    
    if(_selectedRectOverlay != undefined && SelectedRectangle != undefined)
    {
        _selectedRectOverlay.RenderOverlay(_drawContext);
    }
}

//Input Events
_widthInputBox.onchange = function(e)
{
    UpdateHorizontalScrollVisual();
    LevelWidth = _widthInputBox.value;
    
    if(!LoadingLevel && !FileChangeMade)
    {
        FileChangeMade = true;
    }
}

_heightInputBox.onchange = function(e)
{
    UpdateVerticalScrollVisual();
    LevelHeight = _heightInputBox.value;
    
    if(!LoadingLevel && !FileChangeMade)
    {
        FileChangeMade = true;
    }
}

//Scroll Handling
///<summary>
///Initially sets position of vertical thumb when the user first clicks on it,
///Also sets bool to allow the dragging of the thumb
///</summary>
_verticalThumb.onmousedown = function(e)
{       
    if(e.button == 0)
    {
        _verticalThumbMouseDown = true;
        _verticalThumbStartPoint = GetMousePointInElement(_verticalScroll,e.clientX,e.clientY);
    }
    
}

_horizThumb.onmousedown = function(e)
{
    if(e.button == 0)
    {
        _horizthumbMouseDown = true;
        _horizThumbStartPoint = GetMousePointInElement(_horizontalScroll,e.clientX, e.clientY);
    }
}

///<summary>
///Drags the vertical thumb along with the user's mouse as it moves
///</summary>
_verticalScroll.onmousemove = function(e)
{
    if(_verticalThumbMouseDown)
    {
        //get current position of mouse within the scrollbar
        var currentPoint = GetMousePointInElement(_verticalScroll,e.clientX,e.clientY);
        //get the delta position - the difference between the current mouse pointand the thumb start point
        var deltaPos = new point(0, currentPoint.yCoordinate - _verticalThumbStartPoint.yCoordinate);
        MoveVerticalThumb(deltaPos.yCoordinate);
        _verticalThumbStartPoint = GetMousePointInElement(_verticalScroll,e.clientX,e.clientY);
    }
}

function MoveVerticalThumb(deltaY)
{
     //get the current 'style top' value
            //NOTE: this is the y value of the vertical thumb within the entire window, not necessarily within the scrollbar itself
        var currentTop = _verticalThumb.style.top;
        //set up a variable for the new top value
        var newTop = 0;
        //Convert the currentTop number from a style string "Zpx" where Z is the actual number value
        //hence the substring operation to remove the "px" before converting to a number
        newTop = Number(currentTop.substr(0,currentTop.length-2));
        //add the delta y to the top value 
        newTop += deltaY;
        
        //If the top value calculated is inclusive in the range of 0 to the max top offset
        //we can go ahead and set the top Value, then update our start point for the next iteration of the function
        var maxOffset =  _verticalScroll.clientHeight-_verticalThumb.clientHeight;
        if(newTop >= 0 && newTop <= maxOffset)
        {
            //get the percentage scrolled as the newTop offset divided by the maximum offset
            var scrollPercent = Number(((newTop/maxOffset).toFixed(2)));
            _verticalThumb.style.top = newTop.toString()+"px";
            //get the scroll offset as a percentage of the difference between the level height and the viewport (canvas height)
                //this is done because we need to take into account that the canvas is displaying a part of the level
            _scrollOffsetY = (scrollPercent*(_heightInputBox.value-_canvas.height));
            //The delta (how much we translate the canvas by) is the difference between our current offset
            //and the one of the previous iteration
            _scrollYDelta = _scrollOffsetY - _prevScrollOffsetY;
            //scroll the canvas
            OnVerticalScroll();
            _prevScrollOffsetY = _scrollOffsetY;
        }
}

_horizontalScroll.onmousemove = function(e)
{
    if(_horizthumbMouseDown)
    {
        //get current position of mouse within the scrollbar
        var currentPoint = GetMousePointInElement(_horizontalScroll,e.clientX,e.clientY);
        //get the delta position - the difference between the current mouse pointand the thumb start point
        var deltaPos = new point(currentPoint.xCoordinate - _horizThumbStartPoint.xCoordinate, 0);
        MoveHorizontalThumb(deltaPos.xCoordinate);
        _horizThumbStartPoint = GetMousePointInElement(_horizontalScroll,e.clientX,e.clientY);
    }
    
}

function MoveHorizontalThumb(deltaX)
{
    //get the current 'style left' value
        //NOTE: this is the x value of the horizontal thumb within the entire window, not necessarily within the scrollbar itself
    var currentLeft = _horizThumb.style.left;
    //set up a variable for the new top value
    var newLeft = 0;

    newLeft = Number(currentLeft.substr(0,currentLeft.length-2));
    newLeft += deltaX;
    var maxOffset = _horizontalScroll.clientWidth-_horizThumb.clientWidth;
    if(newLeft >= 0 && newLeft <= maxOffset)
    {
        var scrollPercent = Number(((newLeft/maxOffset).toFixed(2)));
        _horizThumb.style.left = newLeft.toString()+"px";
        _scrollOffsetX = (scrollPercent*(_widthInputBox.value-_canvas.width));
        _scrollXDelta = _scrollOffsetX - _prevScrollOffsetX;
        OnHorizontalScroll();
        _prevScrollOffsetX = _scrollOffsetX;
    }
}

///<summary>
///Whjen the user releases the mouse within the scrollbar, stop scrolling the thumb
///</summary>
_verticalScroll.onmouseup = function(e)
{
    _verticalThumbMouseDown = false;
    _verticalThumbStartPoint = undefined;
}

_horizontalScroll.onmouseup = function(e)
{
    _horizthumbMouseDown = false;
    _horizThumbStartPoint = undefined;
}

///<summary>
/// Updates all scroll thumbs based on width of bar, etc
///</summary>
function UpdateScrollThumbs()
{
   UpdateVerticalScrollVisual();
   UpdateHorizontalScrollVisual();
}

///<summary>
/// Initializes the first canvas layer
///</summary>
function InitLayers()
{
    LayerCollection.push(new RenderLayer(LayerCollection.length));
    CurrentLayer = LayerCollection[0];
    CurrentLayer.IsSelected = true;
}

function AddLayer()
{
    LayerCollection.push(new RenderLayer(LayerCollection.length));
    RefreshPropertyControls();
}

function AddMultipleLayers(layersToAdd)
{
    for(var i=0; i <layersToAdd; i++)
    {
        AddLayer();
    }
}

function RemoveLayer(layerIdx)
{
    if(layerIdx > -1 && LayerCollection.length > 1)
    {
        LayerCollection.splice(layerIdx, 1);
        CurrentLayer = LayerCollection[LayerCollection.length-1]; 
    }
}

function RectRenderLayerChanged(oldLayerIdx)
{
    if(SelectedRectangle != undefined)
    {
        var newLayerIdx = SelectedRectangle.RenderIdx;
        if(newLayerIdx > LayerCollection.length-1)
        {
           var layersToAdd = newLayerIdx - (LayerCollection.length-1);
           AddMultipleLayers(layersToAdd); 
           CurrentLayer.RemoveRectangle(SelectedRectangle);  
        }
        else
        {
            var oldLayer = LayerCollection[oldLayerIdx];
            oldLayer.RemoveRectangle(SelectedRectangle);
        }
       
        var newLayer = LayerCollection[newLayerIdx];
        newLayer.AddRectangle(SelectedRectangle);
        OnCurrentLayerSelected(newLayerIdx);
        RefreshRectangles();
    }
}

///<summary>
/// Updates the vertical scroll bar thumb based on height of window or level height
///</summary>
function UpdateVerticalScrollVisual()
{
    var levelHeightPercentage =  +(_canvas.height/_heightInputBox.value).toFixed(2);
    if(levelHeightPercentage <= .99)
    {
        if(!_verticalScrollVisible)
        {
            _verticalScroll.style.display = "inline-block";
            _verticalScrollVisible = true;
        }
        var proposedHeight = levelHeightPercentage*_verticalScroll.clientHeight;
        
        if(proposedHeight >= _minThumbHeight)
        {
            _verticalThumb.style.height = proposedHeight; 
        }
        else
        {
            _verticalThumb.style.height = _minThumbHeight;
        }

       
    }
    else
    {
        if(_verticalScrollVisible)
        {
            //hide scroll bar when level height is the same or less than canvas height
            _verticalScroll.style.display = "none";
            _verticalScrollVisible = false;
        }
    }
}

///<summary>
/// Update horizontal scroll thumb in a similar way to previous method
///</summary>
function UpdateHorizontalScrollVisual()
{
     var levelWidthPercentage = (_canvas.width/_widthInputBox.value);
    if(levelWidthPercentage <= .99)
    {
        if(!_horizScrollVisible)
        {
            _horizontalScroll.style.display = "";
            _horizScrollVisible = true;
        }
        var proposedWidth = levelWidthPercentage * _horizontalScroll.clientWidth;
        if(proposedWidth >= _minThumbWidth)
        {
            _horizThumb.style.width = proposedWidth;
        }
        else
        {
            _horizThumb.style.width = _minThumbWidth;
        }

    }
    else
    {
        if(_horizScrollVisible)
        {
            _horizontalScroll.style.display = "none";
            _horizScrollVisible = false;
        }
    }

}

///<summary>
/// Adds a rectangle data object to the internal collection
///</summary>
function AddRectangle(x, y, width, height, name, category)
{
    var addRect = new NamedRectangle(x, y, width, height, name);
    addRect.Category = category == undefined ? DefaultCategory : category;
    CurrentLayer.AddRectangle(addRect);
    _currentRectangle = undefined;
    RefreshPropertyControls();
    RefreshRectangles();

    if(!LoadingLevel && !FileChangeMade)
    {
        FileChangeMade = true;
    }
}

function AddRectangleToLayer(x,y,width,height,name,category,layerIdx)
{
    if(layerIdx != CurrentLayer.LayerIdx)
    {
        var addRect = new NamedRectangle(x, y, width, height, name);
        addRect.Category = category == undefined ? DefaultCategory : category;
        
        if(layerIdx > LayerCollection.length - 1)
        {
            var layersToAdd = layerIdx - (LayerCollection.length-1);
            AddMultipleLayers(layersToAdd);
        }

        var newLayer = LayerCollection[layerIdx];
        newLayer.AddRectangle(addRect);
        OnCurrentLayerSelected(layerIdx);
    }
    else
    {
        AddRectangle(x,y,width,height,name,category);
    }
    
    RefreshRectangles();
}

function AddImage(imageX,imageY, image, imageFileName, category)
{
    var imgRect = new ImageRectangle(imageX,imageY, image, imageFileName);
    imgRect.Category = category == undefined ? DefaultCategory : category;
    CurrentLayer.AddRectangle(imgRect);
    RefreshPropertyControls();
    if(imageX + image.width > LevelWidth || imageY + image.height > LevelWidth)
    {
        var newRight = imageX + image.width;
        var newBottom = imageY + image.height;
        _widthInputBox.value = newRight;
        _heightInputBox.value = newBottom;
        LevelWidth = newRight;
        LevelHeight = newBottom;
        UpdateScrollThumbs();
    }
    RefreshRectangles();
    
    if(!LoadingLevel && !FileChangeMade)
    {
        FileChangeMade = true;
    }
}

function AddImageToLayer(imageX,imageY,image,imageFileName,category,layerIdx)
{
    if(layerIdx != CurrentLayer.LayerIdx)
    {
        var imgRect = new ImageRectangle(imageX,imageY, image, imageFileName);
        imgRect.Category = category == undefined ? DefaultCategory : category;
    
        if(layerIdx > LayerCollection.length - 1)
        {
            var layersToAdd = layerIdx - (LayerCollection.length-1);
            AddMultipleLayers(layersToAdd);
        }

        var newLayer = LayerCollection[layerIdx];
        newLayer.AddRectangle(imgRect);
        OnCurrentLayerSelected(layerIdx);
        RefreshPropertyControls();
        
        if(imageX + image.width > LevelWidth || imageY + image.height > LevelWidth)
        {
            var newRight = imageX + image.width;
            var newBottom = imageY + image.height;
            _widthInputBox.value = newRight;
            _heightInputBox.value = newBottom;
            LevelWidth = newRight;
            LevelHeight = newBottom;
            UpdateScrollThumbs();
        }
    }
    else
    {
        AddImage(imageX,imageY,image,imageFileName,category);
    }
    
    RefreshRectangles();
}

function RemoveSelectedRectangle()
{
    var rectToRemove = SelectedRectangle;
    if(rectToRemove != undefined)
    {
        CurrentLayer.RemoveRectangle(rectToRemove);
        SelectedRectangle = undefined;
        OnSelectedRectangleChanged();
        _selectedRectOverlay = undefined;
        RefreshPropertyControls();
        RefreshRectangles();
    }
    
    if(!LoadingLevel && !FileChangeMade)
    {
        FileChangeMade = true;
    }
}

///<summary>
/// Stub method to validate rectangles, currently just makes sure
/// the rectangle exists. But can be changed to prevent intersection, etc
///</summary>
function IsValidRectangle(rect)
{
    if(rect === undefined)
    {
        rect = _currentRectangle;
    }
    
    if(CurrentLayer.ChildCount() == 0)
    {
        return true;
    }
    
    return true;
    
}

function DetectRectangleHit(hitPoint)
{
    var rectHit = false;
    var i = 0;
    for(i = 0; i <CurrentLayer.ChildCount(); i++)
    {
        if(CheckPointWithinRectBounds(hitPoint,CurrentLayer.GetRectangle(i)))
        {
            rectHit = true;
            if(CurrentLayer.GetRectangle(i) != SelectedRectangle)
            {
                AddResizeOverlay(CurrentLayer.GetRectangle(i));
                SelectedRectangle = CurrentLayer.GetRectangle(i);
                OnSelectedRectangleChanged();
                RefreshPropertyControls();
            }
            else
            {
                _selectedRectOverlay.OverlayMouseDown(0,hitPoint.xCoordinate, hitPoint.yCoordinate);
            }
        }
    }
    
    if(!rectHit)
    {
        SelectedRectangle = undefined;
        OnSelectedRectangleChanged();
        _selectedRectOverlay = undefined;
        RefreshPropertyControls();
    }
}

function SelectRectangleByGuid(rectGuid)
{
    if(!_ctrlPressed)
    {
        if(!CurrentLayer.IsRectInLayer(rectGuid))
        {
            var newLayerIdx = GetLayerByRectGuid(rectGuid);
            if(newLayerIdx < 0)
            {
                return;
            }
            OnCurrentLayerSelected(newLayerIdx);
        }
        
        var rect = CurrentLayer.GetRectangleByGuid(rectGuid);
        if(rect != undefined)
        {
            AddResizeOverlay(rect);
            SelectedRectangle = rect;
            OnSelectedRectangleChanged();
            RefreshRectangles();
            RefreshPropertyControls();
        }
    }
}

function GetLayerByRectGuid(rectGuid)
{
    var i;
    for(i=0; i<LayerCollection.length; i++)
    {
        if(LayerCollection[i].IsRectInLayer(rectGuid))
        {
            return LayerCollection[i].LayerIdx;
        }
    }
    
    return -1;
}

function EditRectName(rectGuid,newName)
{
    if(CurrentLayer.IsRectInLayer(rectGuid))
    {
        var rect = CurrentLayer.GetRectangleByGuid(rectGuid);
        rect.Name = newName;
    }
}

function CheckPointWithinRectBounds(point,rectangle)
{
    var top = rectangle.YLocation;
    var left = rectangle.XLocation;
    var bottom = top + rectangle.Height;
    var right = left + rectangle.Width;
    
    if(point.xCoordinate >= left && point.xCoordinate <= right)
    {
        if(point.yCoordinate >= top && point.yCoordinate <= bottom)
        {
            return true;
        }
    }
    
    return false;
}

function AddResizeOverlay(rectangle)
{
    _selectedRectOverlay = new RectResizeOverlay(rectangle);
    _selectedRectOverlay.RenderOverlay(_drawContext);
}
    
///<summary>
/// Utility method to get the mouse point within an element, generally called
/// from mouseDown or mouseOver events
///</summary>
function GetMousePointInElement(element,clientX,clientY)
{
    var boundingRect = element.getBoundingClientRect();
    var height = element.height;
    var width = element.width;
    //handle instances where element's height and width are not available
    if(element.height == undefined)
    {
        height = element.offsetHeight;
    }
    if(element.width == undefined)
    {
        width = element.offsetWidth;
    }
    
    var xCoord = Math.floor((clientX - boundingRect.left) / (boundingRect.right - boundingRect.left) * width);
    var yCoord = Math.floor((clientY - boundingRect.top) / (boundingRect.bottom - boundingRect.top) * height);
    
    return new point(xCoord,yCoord);
}

///<summary>
/// Clears the canvas of all elements at a specified offset
///</summary>
function clearCanvas() {
    _drawContext.clearRect(_scrollOffsetX,_scrollOffsetY, _canvas.width, _canvas.height);
}

function OnHorizontalScroll()
{
    _drawContext.translate(-_scrollXDelta, 0);
    RefreshRectangles();
}

function OnVerticalScroll()
{
     _drawContext.translate(0, -_scrollYDelta);
    RefreshRectangles();
}

//Reset and clear all canvas properties and setting canvas on load
function ResetCanvas()
{
    if(_horizScrollVisible)
    {
        var currentLeft = _horizThumb.style.left;
        var newLeft = 0;
        newLeft = Number(currentLeft.substr(0,currentLeft.length-2));
        MoveHorizontalThumb((-newLeft));
    }
    
    if(_verticalScrollVisible)
    {
        var currentTop = _verticalThumb.style.top;
        var newTop = 0;
        newTop = Number(currentTop.substr(0,currentTop.length-2));
        MoveVerticalThumb((-newTop));
    }

    LayerCollection = [];
    SelectedRectangle = undefined;
    CurrentLayer = undefined;
    _selectedRectOverlay = undefined;
    InitLayers();
    RefreshPropertyControls();
    RefreshRectangles();
}

function RefreshPropertyControls()
{
    RefreshLayerControls();
    RefreshCategoryView();
    OnSelectedRectangleChanged();
}

//Set level height and width on load
function ImportLevelBounds(levelWidth, levelHeight)
{
    if(levelHeight != undefined)
    {
        LevelHeight = levelHeight;
        _heightInputBox.value = levelHeight;
    }
    else
    {
        LevelHeight = _canvas.height;
        _heightInputBox.value = _canvas.height;
    }
    
    if(levelWidth != undefined)
    {
        LevelWidth = levelWidth;
        _widthInputBox.value = levelWidth;
    }
    else
    {
        LevelWidtrh = _canvas.width;
        _widthInputBox.value = _canvas.Width;
    }
    
    UpdateScrollThumbs();
}

//Import basic rectangles
function ImportRectangles(rectArray)
{
    
}

//Import images
function ImportImages(imageArray)
{
    
}


