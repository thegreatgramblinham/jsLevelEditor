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


_canvas.width = _canvas.offsetWidth;
_canvas.height = _canvas.offsetHeight;
_verticalScroll.style.height = "100%";
_verticalScroll.style.width = 25;
_horizontalScroll.style.width = _canvas.width;
_horizontalScroll.style.height = 25;
_widthInputBox.value = _canvas.width;
_heightInputBox.value = _canvas.height;

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

//Clear canvas Utility method
function clearCanvas() {
    _drawContext.clearRect(0, 0, _canvas.width, _canvas.height);
}

//Canvas Events
_canvas.onmousedown = function(e)
{
    if(e.button == 0)
    {
        _mouseDown = true;
        var canvasRect = _canvas.getBoundingClientRect();
        var xCoord = Math.floor((e.clientX - canvasRect.left) / (canvasRect.right - canvasRect.left) * _canvas.width);
        var yCoord = Math.floor((e.clientY - canvasRect.top) / (canvasRect.bottom - canvasRect.top) * _canvas.height);
        _downPoint = new point(xCoord,yCoord);
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
        var canvasRect = _canvas.getBoundingClientRect();
        var xCoord = Math.floor((e.clientX - canvasRect.left) / (canvasRect.right - canvasRect.left) * _canvas.width);
        var yCoord = Math.floor((e.clientY - canvasRect.top) / (canvasRect.bottom - canvasRect.top) * _canvas.height);
        
        var rectX = Math.min(_downPoint.xCoordinate, xCoord);
        var rectY =  Math.min(_downPoint.yCoordinate, yCoord);
        
        var width = Math.max(_downPoint.xCoordinate,xCoord) - Math.min(_downPoint.xCoordinate, xCoord);
        var height = Math.max(_downPoint.yCoordinate, yCoord) - Math.min(_downPoint.yCoordinate, yCoord);
        
        
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
    RefreshRectangles();
}

_heightInputBox.onchange = function(e)
{
    RefreshRectangles();
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



