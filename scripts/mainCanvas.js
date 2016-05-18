//DOM Access and Setup
var canvasDiv = document.getElementById("MainCanvasDiv");
var canvas =document.createElement("canvas");
canvas.id="MainCanvas";
canvasDiv.appendChild(canvas);
var drawContext = canvas.getContext("2d");
var mouseDown = false;
var downPoint = undefined;
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

//Rectangle Collection
var rectangles = [];
var currentRectangle = undefined;

//Internal use Point object
//We may want to make a class file for this later
function point(x,y)
{
    this.xCoordinate = x;
    this.yCoordinate = y;
}

//Clear canvas Utility method
function clearCanvas() {
    drawContext.clearRect(0, 0, canvas.width, canvas.height);
}

//Canvas Events
canvas.onmousedown = function(e)
{
    if(e.button == 0)
    {
        mouseDown = true;
        var canvasRect = canvas.getBoundingClientRect();
        var xCoord = Math.floor((e.clientX - canvasRect.left) / (canvasRect.right - canvasRect.left) * canvas.width);
        var yCoord = Math.floor((e.clientY - canvasRect.top) / (canvasRect.bottom - canvasRect.top) * canvas.height);
        downPoint = new point(xCoord,yCoord);
    }
    else
    {
        mouseDown = false;
        downPoint = undefined;
    }
};

canvas.onmousemove = function(e)
{
    if(mouseDown && downPoint != undefined)
    {
        clearCanvas();
        RefreshRectangles();
        var canvasRect = canvas.getBoundingClientRect();
        var xCoord = Math.floor((e.clientX - canvasRect.left) / (canvasRect.right - canvasRect.left) * canvas.width);
        var yCoord = Math.floor((e.clientY - canvasRect.top) / (canvasRect.bottom - canvasRect.top) * canvas.height);
        
        var rectX = Math.min(downPoint.xCoordinate, xCoord);
        var rectY =  Math.min(downPoint.yCoordinate, yCoord);
        
        var width = Math.max(downPoint.xCoordinate,xCoord) - Math.min(downPoint.xCoordinate, xCoord);
        var height = Math.max(downPoint.yCoordinate, yCoord) - Math.min(downPoint.yCoordinate, yCoord);
        
        
        drawContext.beginPath();
        drawContext.setLineDash([3,4])
        drawContext.strokeStyle = "#D1A147"
        drawContext.rect(rectX, rectY,width,height, 1);
        drawContext.stroke();
        drawContext.closePath();
        
        currentRectangle = new Rectangle(rectX, rectY,width,height,rectangles.length.toString());
    }
};

canvas.onmouseup = function(e)
{
    if(mouseDown)
    {
        mouseDown = false;
        downPoint = undefined;
        clearCanvas();
        if(currentRectangle != undefined && IsValidRectangle())
        {
            AddRectangle();
        }
        RefreshRectangles();
    }
    
};

function RefreshRectangles()
{
    var i;
    for(i=0; i<rectangles.length; i++)
    {
        var refreshRect = rectangles[i];
        drawContext.beginPath();
        drawContext.fillStyle="#4FD921";
        drawContext.fillRect(refreshRect.XLocation,refreshRect.YLocation, refreshRect.Width,refreshRect.Height);
        drawContext.closePath();
    }
}


//Rectangle Building
function AddRectangle()
{
    var addRect = new Rectangle(currentRectangle.XLocation, currentRectangle.YLocation, currentRectangle.Width, currentRectangle.Height, rectangles.length.toString());
    rectangles.push(addRect);
    currentRectangle = undefined;
}

//Rectangle Validation
function IsValidRectangle(rect)
{
    if(rect === undefined)
    {
        rect = currentRectangle;
    }
    
    if(rectangles.length == 0)
    {
        return true;
    }
    
    return true;
    
}



