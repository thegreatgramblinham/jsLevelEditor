//This file is for events related to the file management buttons (load/save)
//Private Constants
var MAASHES_LEVEL_EXT = "lvl";
var SAM_LEVEL_EXT = "";


//Methods
openFolderButton.onclick = function(event) 
{
    dialog.showOpenDialog(
        { properties: ['openDirectory'] },
        function (fileNames) 
        {
            if (fileNames === undefined) return;
            var fileName = fileNames[0];
            console.log(fileName + " has been selected.");
            
            LoadImagesFromDirectory(fileName);
        }
    );
}

saveLevelButton.onclick = function(event) 
{
    dialog.showSaveDialog(
        { filters: [{ name: "Shade Level Files (*."+MAASHES_LEVEL_EXT+")", extensions: [MAASHES_LEVEL_EXT] },
                    { name: "HERDERR Level Files (*."+SAM_LEVEL_EXT+")", extensions: [SAM_LEVEL_EXT] }
        ]},
        function (fileName) 
        {
            if (fileName === undefined) return;
            
            var ext = fileName.split('.').pop();
            
            if(ext === MAASHES_LEVEL_EXT)
            {
                //Call maashes' xml writing function here.
            }
            else if(ext === SAM_LEVEL_EXT)
            {
                //Call sam's xml writing function here.
            }       
        }
    );
}

openLevelButton.onclick = function(event) 
{
    dialog.showOpenDialog(
        { filters: [{ name: "Shade Level Files (*."+MAASHES_LEVEL_EXT+")", extensions: [MAASHES_LEVEL_EXT] },
                    { name: "HERDERR Level Files (*."+SAM_LEVEL_EXT+")", extensions: [SAM_LEVEL_EXT] }
        ]},
        function (fileNames) 
        {
            if (fileNames === undefined) return;
            var fileName = fileNames[0];
            
            var ext = fileName.split('.').pop();
            
            if(ext === MAASHES_LEVEL_EXT)
            {
                //Call maashes' level reconst function here.
            }
            else if(ext === SAM_LEVEL_EXT)
            {
                //Call sam's level reconst function here.
            }
        }
    );
}

