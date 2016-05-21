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


_canvas.width = _canvas.offsetWidth;
_canvas.height = _canvas.offsetHeight;
_verticalScroll.style.height = "100%";
_verticalScroll.style.width = 25;
_verticalThumb.style.top="0px"
_horizontalScroll.style.height = 25;
_widthInputBox.value = _canvas.width;
_heightInputBox.value = _canvas.height;
UpdateScrollThumbs();

//Rectangle Collection
var _rectangles = [];
var _currentRectangle = undefined;

//Internal use Point object
//We may want to make a class file for this later
function point(x,y)
{
    this.xCoordinate = x;
    this.yCoordinate = y;
}

//window.onresize = function(e)
//{
//    UpdateScrollThumbs();
//}

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
    if(_mouseDown && _downPoint != undefined)
    {
        clearCanvas();
        RefreshRectangles();
        
        var currPoint = GetMousePointInElement(_canvas,e.clientX, e.clientY);
        
        var rectX = Math.min(_downPoint.xCoordinate, currPoint.xCoordinate);
        var rectY =  Math.min(_downPoint.yCoordinate, currPoint.yCoordinate);
        
        var width = Math.max(_downPoint.xCoordinate,currPoint.xCoordinate) - Math.min(_downPoint.xCoordinate, currPoint.xCoordinate);
        var height = Math.max(_downPoint.yCoordinate, currPoint.yCoordinate) - Math.min(_downPoint.yCoordinate, currPoint.yCoordinate);
        
        
        _drawContext.beginPath();
        _drawContext.setLineDash([3,4])
        _drawContext.strokeStyle = "#D1A147"
        _drawContext.rect(rectX, rectY,width,height, 1);
        _drawContext.stroke();
        _drawContext.closePath();
        
        _currentRectangle = new Rectangle(rectX, rectY,width,height,_rectangles.length.toString());
    }
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
_verticalThumb.onmousedown = function(e)
{       
    if(e.button == 0)
    {
        _verticalThumbMouseDown = true;
        _verticalThumbStartPoint = GetMousePointInElement(_verticalScroll,e.clientX,e.clientY);
    }
    
}

_verticalScroll.onmousemove = function(e)
{
    if(_verticalThumbMouseDown)
    {
        var currentPoint = GetMousePointInElement(_verticalScroll,e.clientX,e.clientY);
        var deltaPos = new point(0, currentPoint.yCoordinate - _verticalThumbStartPoint.yCoordinate);

        var currentTop = _verticalThumb.style.top;
        var newTop = 0;

        newTop = Number(currentTop.substr(0,currentTop.length-2));
        newTop += deltaPos.yCoordinate;

        if(newTop >= 0 && newTop <= _verticalScroll.clientHeight-_verticalThumb.clientHeight)
        {
            _verticalThumb.style.top = newTop.toString()+"px";
            _verticalThumbStartPoint = GetMousePointInElement(_verticalScroll,e.clientX,e.clientY);
        }
    }
}

_verticalScroll.onmouseup = function(e)
{
    _verticalThumbMouseDown = false;
    _verticalThumbStartPoint = undefined;
}

function UpdateScrollThumbs()
{
   UpdateVerticalScrollVisual();
   UpdateHorizontalScrollVisual();
}

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
             _verticalScroll.style.display = "none";
            _verticalScrollVisible = false;
        }
    }
}

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

//Rectangle Building
function AddRectangle()
{
    var addRect = new Rectangle(_currentRectangle.XLocation, _currentRectangle.YLocation, _currentRectangle.Width, _currentRectangle.Height, _rectangles.length.toString());
    _rectangles.push(addRect);
    _currentRectangle = undefined;
}

//Rectangle Validation
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
    
//Utility
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

function clearCanvas() {
    _drawContext.clearRect(0, 0, _canvas.width, _canvas.height);
}



