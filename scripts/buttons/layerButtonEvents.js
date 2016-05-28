//This file is for events pertaining to the layer controls
function OnCurrentLayerSelected(layerIdx)
{
    var i;
    var layer = LayerCollection[layerIdx];
    layer.IsSelected = true;
    for(i=0; i<LayerCollection.length; i++)
    {
        if(i!=layerIdx)
        {
            LayerCollection[i].IsSelected = false;
        }
    }
    CurrentLayer = layer;
    RefreshPropertyControls();
}

function OnRectChildSelected(rectGuid)
{
    if(CanvasMode == UIMode.Add)
    {
        SwitchToModify();
    }
        
    SelectRectangleByGuid(rectGuid);
}

function OnRectChildEditMode(spanElement)
{
    var actualSpan = document.getElementById(spanElement.id);
    actualSpan.contentEditable = true;
    actualSpan.focus();
    actualSpan.onblur = function()
    {
        OnApplyRectangleName(actualSpan.id,actualSpan.innerHTML)
    }
    
    actualSpan.onkeydown = function(e)
    {
        if(e.keyCode == "13")
        {
            this.contentEditable = false;
            this.blur();
        }
    }
}

function OnApplyRectangleName(rectGuid,name)
{
    EditRectName(rectGuid,name);
}