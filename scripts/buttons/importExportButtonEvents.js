//This file is for events related to the file management buttons (load/save)

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
        { filters: [{ name: 'JsLeveLEditor Files (*.msg)', extensions: ['msg'] }] },
        function (fileName) 
        {
            if (fileName === undefined) return;
            
            //Call xml writing function here.
        }
    );
}

openLevelButton.onclick = function(event) 
{
    dialog.showOpenDialog(
        { filters: [{ name: 'JsLeveLEditor Files (*.msg)', extensions: ['msg'] }] },
        function (fileNames) 
        {
            if (fileNames === undefined) return;
            var fileName = fileNames[0];
            
            //Call level reconst function here.
        }
    );
}

