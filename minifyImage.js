const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function resizeImagesInFolder(folderPath) {
  // read all files in the folder
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    // loop through each file
    files.forEach((file) => {
      // check if it's an image file
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        // get the input and output file paths
        const inputFile = path.join(folderPath, file);
        const outputFile = path.join(folderPath, `resized-${file}`);

        // resize the image
        sharp(inputFile)
          .resize(500)
          .toFile(outputFile, (err) => {
            if (err) {
              console.error(err);
            } else {
              // delete the original file and rename the resized file
              fs.unlink(inputFile, (err) => {
                if (err) {
                  console.error(err);
                } else {
                  fs.rename(outputFile, inputFile, (err) => {
                    if (err) {
                      console.error(err);
                    }
                  });
                }
              });
            }
          });
      }
    });
  });
}


resizeImagesInFolder('public/image');
