import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

console.log(chalk.blue.bold('\n Bienvenido al Analizador de Recursos Gráficos(ARG) de Daemon Studios \n'));
console.log('Este proyecto ha sido diseñado para ayudarte a analizar carpetas llenas de recursos gráficos.');
console.log('Simplemente ' + chalk.cyan('introduce una ruta a una carpeta') + ', y el sistema hará el resto.\n');
console.log('Detectaremos imágenes, íconos u otros elementos que pueden necesitar optimización.\n ');
console.log('Los recursos que ya están optimizados' + chalk.green.bold(' se mostrarán en verde.'));
console.log('Los recursos que recomendamos que sean optimizados' + chalk.red.yellow(' se mostrarán de color amarillo.'));
console.log('Los recursos que necesitan ser optimizados' + chalk.red.bold(' se mostrarán claramente en rojo.\n'));
console.log(chalk.blue.bold('RECUERDA mantener tus recursos optimizados para mejorar el rendimiento de tu proyecto.\n'));
console.log('¡Listo para comenzar! \n');


const askDirectory = async() => {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'directoryPath',
            message: chalk.cyan.bold('¿Cuál es la ruta que quieres analizar?'),
            default: './fotosDePrueba',
        }
    ]);
    return answer.directoryPath;
};
const analyzeDirectory = async() => {

try {
        const directoryPath = await askDirectory();

        // Verificar si el directorio existe
        if (!fs.existsSync(directoryPath)) {
            console.log(chalk.red('El directorio no existe'));
            return;
        }

        const files = await fs.promises.readdir(directoryPath);

        // Procesar archivos secuencialmente
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            
            try {
                const stats = await fs.promises.stat(filePath);
                
                if (stats.isFile()) {
                    let colorFunc;
                    const sizeKB = stats.size / 1024;
                    let arrow = '';
                    
                    if (sizeKB < 100) {
                        colorFunc = chalk.green;
                    } else if (sizeKB <= 250) {
                        colorFunc = chalk.yellow;
                    } else {
                        colorFunc = chalk.red;
                        arrow = chalk.red.bold('<---OPTIMIZAR---');
                    }
                    
                    console.log(colorFunc(`${file}\t${stats.size} bytes`) + ('  ')+(arrow ? '' + arrow : ''));
                }
            } catch (err) {
                console.error(chalk.red(`Error al leer: ${file}`), err);
            }
        }
    } catch (err) {
        console.error(chalk.red('Error al leer archivos:'), err);
    }
};

// Execute the analysis
analyzeDirectory();
