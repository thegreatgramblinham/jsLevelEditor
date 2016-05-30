//This file is for events related to the file management buttons (load/save)
//Private Constants
var MAASHES_LEVEL_EXT = "lvl";
var SAM_LEVEL_EXT = "pld";


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
    dialog.showSaveDialog(
        { filters: [{ name: "Shade Level Files (*."+MAASHES_LEVEL_EXT+")", extensions: [MAASHES_LEVEL_EXT] },
                    { name: "HERDERR Level Files (*."+SAM_LEVEL_EXT+")", extensions: [SAM_LEVEL_EXT] }
        ]},
        function (filePath) 
        {
            if (filePath === undefined) return;
            
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
    );
}

openLevelButton.onclick = function(event) 
{
    dialog.showOpenDialog(
        { filters: [{ name: "Shade Level Files (*."+MAASHES_LEVEL_EXT+")", extensions: [MAASHES_LEVEL_EXT] },
                    { name: "HERDERR Level Files (*."+SAM_LEVEL_EXT+")", extensions: [SAM_LEVEL_EXT] }
        ]},
        function (filePaths) 
        {
            if (filePaths === undefined) return;
            var filePath = filePaths[0];
            
            var ext = filePath.split('.').pop();
            
            if(ext === MAASHES_LEVEL_EXT)
            {
                //Call maashes' level reconst function here.
                var lvlImporter = new LvlImporter(filePath);
                try
                {
                    lvlImporter.ImportLvlFile();
                }
                catch(ex)
                {
                    dialog.showMessageBox({ message: "IMPORT FAILED: "+ex.toString(), buttons: ["OK"]})
                }
            }
            else if(ext === SAM_LEVEL_EXT)
            {
                //Call sam's level reconst function here.
                var pldImporter = new PLDImporter(filePath);      
                try
                {
                   pldImporter.Import();  
                }
                catch(ex)
                {
                    dialog.showMessageBox({ message: "IMPORT FAILED: "+ex.toString(), buttons: ["OK"]})
                }
            }
        }
    );
}

