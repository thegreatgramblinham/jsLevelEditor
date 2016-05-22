//DOM Access and Setup
var _widthInputBox = document.getElementById("levelWidthBox");
var _heightInputBox = document.getElementById("levelHeightBox");
var _canvas = document.getElementById("mainCanvas");
var _verticalScroll = document.getElementById("vScroll")
var _horizontalScroll = document.getElementById("hScroll");
var _verticalThumb = document.getElementById("vThumb");
var _horizThumb = document.getElementById("hThumb");
var _drawContext = _canvas.getContext("2d");
var _mouseDown = false;
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

//Rectangle Collection
var _rectangles = [];
var _currentRectangle = undefined;

//Update the scrollbars on window load, they may not need to be visible
UpdateScrollThumbs();

//Internal use Point object
//We may want to make a class file for this later
function point(x,y)
{
    this.xCoordinate = x;
    this.yCoordinate = y;
}

//Canvas Events
_canvas.onmousedown = function(e)
{
    if(e.button == 0)
    {
        _mouseDown = true;
        _downPoint = GetMousePointInElement(_canvas,e.clientX,e.clientY);
    }
    else
    {
        _mouseDown = false;
        _downPoint = undefined;
    }
};

_canvas.onmousemove = function(e)
{
    clearCanvas();
    RefreshRectangles();
    if(_mouseDown && _downPoint != undefined)
    {
        var currPoint = GetMousePointInElement(_canvas,e.clientX, e.clientY);
        
        var rectX = Math.min(_downPoint.xCoordinate+_scrollOffsetX, currPoint.xCoordinate+_scrollOffsetX);
        var rectY =  Math.min(_downPoint.yCoordinate+_scrollOffsetY, currPoint.yCoordinate+_scrollOffsetY);
        
        var width = Math.max(_downPoint.xCoordinate+_scrollOffsetX,currPoint.xCoordinate+_scrollOffsetX) - Math.min(_downPoint.xCoordinate+_scrollOffsetX, currPoint.xCoordinate+_scrollOffsetX);
        var height = Math.max(_downPoint.yCoordinate+_scrollOffsetY, currPoint.yCoordinate+_scrollOffsetY) - Math.min(_downPoint.yCoordinate+_scrollOffsetY, currPoint.yCoordinate+_scrollOffsetY);
        
        
        _drawContext.beginPath();
        _drawContext.setLineDash([3,4])
        _drawContext.strokeStyle = "#D1A147"
        _drawContext.rect(rectX, rectY,width,height, 1);
        _drawContext.stroke();
        _drawContext.closePath();
        
        _currentRectangle = new Rectangle(rectX, rectY,width,height,_rectangles.length.toString());
    }
    var locPoint = GetMousePointInElement(_canvas, e.clientX, e.clientY);
    var worldPoint = new point(locPoint.xCoordinate+_scrollOffsetX, locPoint.yCoordinate+_scrollOffsetY);
    var locationText = "(" + worldPoint.xCoordinate +","+worldPoint.yCoordinate+")";
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
        clearCanvas();
        if(_currentRectangle != undefined && IsValidRectangle())
        {
            AddRectangle();
        }
        RefreshRectangles();
    }
    
};

///<summary>
///Method to redraw all current rectangles on the screen
///</summary>
function RefreshRectangles()
{
    var i;
    for(i=0; i<_rectangles.length; i++)
    {
        var refreshRect = _rectangles[i];
        _drawContext.beginPath();
        _drawContext.fillStyle="#4FD921";
        _drawContext.fillRect(refreshRect.XLocation,refreshRect.YLocation, refreshRect.Width,refreshRect.Height);
        _drawContext.closePath();
    }
}

//Input Events
_widthInputBox.onchange = function(e)
{
    UpdateHorizontalScrollVisual();
}

_heightInputBox.onchange = function(e)
{
    UpdateVerticalScrollVisual();
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
        //get the current 'style top' value
            //NOTE: this is the y value of the vertical thumb within the entire window, not necessarily within the scrollbar itself
        var currentTop = _verticalThumb.style.top;
        //set up a variable for the new top value
        var newTop = 0;
        //Convert the currentTop number from a style string "Zpx" where Z is the actual number value
        //hence the substring operation to remove the "px" before converting to a number
        newTop = Number(currentTop.substr(0,currentTop.length-2));
        //add the delta y to the top value 
        newTop += deltaPos.yCoordinate;
        
        //If the top value calculated is inclusive in the range of 0 to the max top offset
        //we can go ahead and set the top Value, then update our start point for the next iteration of the function
        var maxOffset =  _verticalScroll.clientHeight-_verticalThumb.clientHeight;
        if(newTop >= 0 && newTop <= maxOffset)
        {
            //get the percentage scrolled as the newTop offset divided by the maximum offset
            var scrollPercent = Number(((newTop/maxOffset).toFixed(2)));
            _verticalThumb.style.top = newTop.toString()+"px";
            _verticalThumbStartPoint = GetMousePointInElement(_verticalScroll,e.clientX,e.clientY);
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
}

_horizontalScroll.onmousemove = function(e)
{
    if(_horizthumbMouseDown)
    {
        //get current position of mouse within the scrollbar
        var currentPoint = GetMousePointInElement(_horizontalScroll,e.clientX,e.clientY);
        //get the delta position - the difference between the current mouse pointand the thumb start point
        var deltaPos = new point(currentPoint.xCoordinate - _horizThumbStartPoint.xCoordinate, 0);
        //get the current 'style left' value
            //NOTE: this is the x value of the horizontal thumb within the entire window, not necessarily within the scrollbar itself
        var currentLeft = _horizThumb.style.left;
        //set up a variable for the new top value
        var newLeft = 0;

        newLeft = Number(currentLeft.substr(0,currentLeft.length-2));
        newLeft += deltaPos.xCoordinate;

        if(newLeft >= 0 && newLeft <= _horizontalScroll.clientWidth-_horizThumb.clientWidth)
        {
            _horizThumb.style.left = newLeft.toString()+"px";
            _horizThumbStartPoint = GetMousePointInElement(_horizontalScroll,e.clientX,e.clientY);
            _scrollOffsetX += deltaPos.xCoordinate;
            _scrollXDelta = deltaPos.xCoordinate;
            OnHorizontalScroll();
        }
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
       _verticalThumb.style.height = levelHeightPercentage*_verticalScroll.clientHeight;
       
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
        _horizThumb.style.width = levelWidthPercentage*_horizontalScroll.clientWidth;
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
function AddRectangle()
{
    var addRect = new Rectangle(_currentRectangle.XLocation, _currentRectangle.YLocation, _currentRectangle.Width, _currentRectangle.Height, _rectangles.length.toString());
    _rectangles.push(addRect);
    _currentRectangle = undefined;
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
    
    if(_rectangles.length == 0)
    {
        return true;
    }
    
    return true;
    
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
    clearCanvas();
    RefreshRectangles();
}

function OnVerticalScroll()
{
     _drawContext.translate(0, -_scrollYDelta);
    clearCanvas();
    RefreshRectangles();
}


