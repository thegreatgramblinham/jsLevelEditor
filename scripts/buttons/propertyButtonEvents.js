//This file is for events related to the property controls along the bottom bar.

//Private Variables
var _xBox = document.getElementById("rectXBox");
var _yBox = document.getElementById("rectYBox");
var _widthBox = document.getElementById("rectWidthBox");
var _heightBox = document.getElementById("rectHeightBox");

function OnSelectedRectangleChanged()
{
    _xBox.value = SelectedRectangle.XLocation;
    _yBox.value = SelectedRectangle.YLocation;
    _widthBox.value = SelectedRectangle.Width;
    _heightBox.value = SelectedRectangle.Height;
}

_xBox.onchange = function(e)
{
    if(SelectedRectangle != undefined)
    {
        SelectedRectangle.XLocation = _xBox.value;
        RefreshRectangles(); //needs to be a canvas func for complete redraw. goes here.
    }
}

_yBox.onchange = function(e)
{
    if(SelectedRectangle != undefined)
    {
        SelectedRectangle.YLocation = _yBox.value;
        RefreshRectangles();
    }
}

_widthBox.onchange = function(e)
{
    if(SelectedRectangle != undefined)
    {
        SelectedRectangle.Width = _widthBox.value;
        RefreshRectangles();
    }
}

_heightBox.onchange = function(e)
{
    if(SelectedRectangle != undefined)
    {
        SelectedRectangle.Height = _heightBox.value;
        RefreshRectangles();
    }
}
