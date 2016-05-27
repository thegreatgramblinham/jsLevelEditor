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
    RefreshLayerControls();
}

function OnRectChildSelected(rectGuid)
{
    if(CanvasMode == UIMode.Modify)
    {
        SelectRectangleByGuid(rectGuid);
    }
}

function OnRectChildEditMode(rectGuid)
{
    
}