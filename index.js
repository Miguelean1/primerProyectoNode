import fs from 'fs';
import path from 'path';
import chalk from 'chalk';


const directoryPath = 'C:\\Users\\DAW2\\Desktop\\fotosDePrueba';

fs.readdir(directoryPath, (err, files) => {
    if(err) { 
        console.log('Error al leer los archivos: ' + err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        fs.stat(filePath, (err, stats) => {
            if(err) {
            console.error(err);
            return;
            }
            if(stats.isFile()){
                //formateo de colores;

                let colorFunc;
                const sizeKB =stats.size /1024;

                    if(sizeKB < 100){
                        colorFunc = chalk.green;
                    } else if (sizeKB <= 250) {
                        colorFunc = chalk.white;
                    } else {
                        colorFunc = chalk.red;
                    }
                    console.log(colorFunc(`${file}\t${stats.size} bytes`));
            }
    });
    });
});
