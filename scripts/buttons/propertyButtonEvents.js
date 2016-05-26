//This file is for events related to the property controls along the bottom bar.

//Private Variables
var _xBox = document.getElementById("rectXBox");
var _yBox = document.getElementById("rectYBox");
var _widthBox = document.getElementById("rectWidthBox");
var _heightBox = document.getElementById("rectHeightBox");
var _renderIdxBox = document.getElementById("rectRenderIdxBox");

function OnSelectedRectangleChanged()
{
    if(SelectedRectangle != undefined)
    {
        _xBox.value = Number(Number(SelectedRectangle.XLocation).toFixed(0));
        _yBox.value =  Number(Number(SelectedRectangle.YLocation).toFixed(0));
        _widthBox.value = Number(Number(SelectedRectangle.Width).toFixed(0));
        _heightBox.value = Number(Number(SelectedRectangle.Height).toFixed(0));
        _renderIdxBox.value = SelectedRectangle.RenderIdx;
    }
    else
    {
        _xBox.value = 0;
        _yBox.value = 0;
        _widthBox.value = 0;
        _heightBox.value = 0;
        _renderIdxBox.value = 0;
    }

}

//Rect Controls
_xBox.onchange = function(e)
{
    if(SelectedRectangle != undefined)
    {
        SelectedRectangle.XLocation = Number(Number(_xBox.value).toFixed(0));
        RefreshRectangles(); //needs to be a canvas func for complete redraw. goes here.
    }
}

_yBox.onchange = function(e)
{
    if(SelectedRectangle != undefined)
    {
        SelectedRectangle.YLocation = Number(Number(_yBox.value).toFixed(0));
        RefreshRectangles();
    }
}

_widthBox.onchange = function(e)
{
    if(SelectedRectangle != undefined)
    {
        SelectedRectangle.Width = Number(Number(_widthBox.value).toFixed(0));
        RefreshRectangles();
    }
}

_heightBox.onchange = function(e)
{
    if(SelectedRectangle != undefined)
    {
        SelectedRectangle.Height = Number(Number(_heightBox.value).toFixed(0));
        RefreshRectangles();
    }
}

_renderIdxBox.onchange = function(e)
{
    if(SelectedRectangle != undefined)
    {
        SelectedRectangle.RenderIdx = Number(_renderIdxBox.value);
        RectRenderLayerChanged();
    }
}

//Render Controls
