//This file is for events related to the file management buttons (load/save)
//Private Constants
var MAASHES_LEVEL_EXT = "lvl";
var SAM_LEVEL_EXT = "pld";

window.addEventListener("beforeunload", function (event) {
    if(FileChangeMade)
    {
      var decision = dialog.showMessageBox(
                    {type:"warning", title:"Unsaved Changes",
                    message:"You are about to close with unsaved changes!"+"\n"+"What do?",
                    buttons:["Save","Discard","Cancel"]});
                    
        if(decision == 0)
        {
           SaveLevel();
        }
        else if(decision == 2)
        {
            return false;
        }
    }   
});

//Methods
openFolderButton.onclick = function(event) 
{
    dialog.showOpenDialog(
        { properties: ['openDirectory'] },
        function (filePaths) 
        {
            if (filePaths === undefined) return;
            var filePath = filePaths[0];
            console.log(filePath + " has been selected.");
            
            LoadImagesFromDirectory(filePath);
        }
    );
}

saveLevelButton.onclick = function(event) 
{
    SaveLevel();
}

openLevelButton.onclick = function(event) 
{
   OpenLevel();
}

function SaveLevel()
{
    var filePath =  dialog.showSaveDialog(
        { filters: [{ name: "Shade Level Files (*."+MAASHES_LEVEL_EXT+")", extensions: [MAASHES_LEVEL_EXT] },
                    { name: "HERDERR Level Files (*."+SAM_LEVEL_EXT+")", extensions: [SAM_LEVEL_EXT] }
        ]});
        
        if (filePath === undefined) return false;
        
        var ext = filePath.split('.').pop();
        
        if(ext === MAASHES_LEVEL_EXT)
        {
            //Call maashes' xml writing function here.
            var lvlExporter = new LvlExporter(filePath, LayerCollection, LevelHeight, LevelWidth);
            
            lvlExporter.ExportLevel();
        }
        else if(ext === SAM_LEVEL_EXT)
        {
            //Call sam's xml writing function here.
            var pldExporter = new PLDExporter(filePath, LayerCollection, LevelWidth, LevelHeight);
            
            try
            {
                pldExporter.Export();  
            }
            catch(ex)
            {
                dialog.showMessageBox({ message: "EXPORT FAILED: "+ex.toString(), buttons: ["OK"]})
            }
            
        } 
}

function OpenLevel()
{
    var filePaths = dialog.showOpenDialog(
        { filters: [
            { name: "Shade Level Files (*."+MAASHES_LEVEL_EXT+"), Penguin Level Designs (*."+SAM_LEVEL_EXT+") ",
              extensions: [MAASHES_LEVEL_EXT, SAM_LEVEL_EXT] }
        ]});
        
    if (filePaths == undefined || filePaths.length == 0) return;

    var filePath = filePaths[0];
    
    var ext = filePath.split('.').pop();
    
    if(ext === MAASHES_LEVEL_EXT)
    {
        //Call maashes' level reconst function here.
        var lvlImporter = new LvlImporter(filePath);
        try
        {
            LoadingLevel = true;
            lvlImporter.ImportLvlFile();
        }
        catch(ex)
        {
            dialog.showMessageBox({ message: "IMPORT FAILED: "+ex.toString(), buttons: ["OK"]})
        }
        LoadingLevel = false;
    }
    else if(ext === SAM_LEVEL_EXT)
    {
        //Call sam's level reconst function here.
        var pldImporter = new PLDImporter(filePath);      
        try
        {
            LoadingLevel = true;
            pldImporter.Import();

        }
        catch(ex)
        {
            dialog.showMessageBox({ message: "IMPORT FAILED: "+ex.toString(), buttons: ["OK"]})
        }
        LoadingLevel = false;
    }
}

