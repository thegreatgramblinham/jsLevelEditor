var canvasDiv = document.getElementById("MainCanvasDiv");
var canvas =document.createElement("canvas");
canvas.id="MainCanvas";
canvasDiv.appendChild(canvas);

var drawContext = canvas.getContext("2d");
var mouseDown = false;
var downPoint = undefined;
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

function point(x,y)
{
    this.xCoordinate = x;
    this.yCoordinate = y;
}

function clearCanvas() {
    drawContext.clearRect(0, 0, canvas.width, canvas.height);
}

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
        var canvasRect = canvas.getBoundingClientRect();
        var xCoord = Math.floor((e.clientX - canvasRect.left) / (canvasRect.right - canvasRect.left) * canvas.width);
        var yCoord = Math.floor((e.clientY - canvasRect.top) / (canvasRect.bottom - canvasRect.top) * canvas.height);
        
        var rectX = Math.min(downPoint.xCoordinate, xCoord);
        var rectY =  Math.min(downPoint.yCoordinate, yCoord);
        
        var width = Math.max(downPoint.xCoordinate,xCoord) - Math.min(downPoint.xCoordinate, xCoord);
        var height = Math.max(downPoint.yCoordinate, yCoord) - Math.min(downPoint.yCoordinate, yCoord);
        
        
        drawContext.beginPath();
        //drawContext.rect(rectX,rectY,width,height);
        drawContext.strokeRect(rectX, rectY,width,height, 1);
        drawContext.closePath();
    }
};

canvas.onmouseup = function(e)
{
    if(mouseDown)
    {
        mouseDown = false;
        downPoint = undefined;
    }
    
};
