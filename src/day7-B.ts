const text = await Deno.readTextFile('src/day7Data.txt');
// const text = await Deno.readTextFile('src/day7TestInput.txt');
const rawData = text.split('\n');

type File = {
    name: string,
    size: number
}
type Directory = {
    directoryId: string
}
type DirectoryMapItem = {
    items: Record<string, File | Directory>
    size: null | number,
    allInnerSizesCalculated: boolean
}

const fileDirectoryMap: Record<string, DirectoryMapItem> = {
    '/': {
        items: {},
        size: null,
        allInnerSizesCalculated: false
    }
}

// Constuct all tree data
let currentDirectoryPath = ['~'];
let currentCommand = ''
rawData.forEach(row => {
    if (row.startsWith('$')){
        if (row === '$ ls'){
            currentCommand = 'ls'
            console.log('listing files')
    
            return;
        }
        const [_, secondPart, thirdPart] = row.split(' ')
    
        if (secondPart === 'cd') {
            currentCommand = 'cd'
            const destination = thirdPart;
    
            if (destination === '/') {
                currentDirectoryPath = ['~'];
                console.log('change directory to ~', currentDirectoryPath)
                return;
            }
            if (destination === '..') {
                if (currentDirectoryPath.length > 1) {
                    currentDirectoryPath.pop()
                    console.log('change directory back one folder', currentDirectoryPath)
    
                }
                return;
            }
            currentDirectoryPath.push(destination)
            console.log('changing into a folder', destination, currentDirectoryPath)
            return;
        }
    }

    if (currentCommand !== 'ls') {
        console.log('currentCommand should be ls!', currentCommand)
        return
    }
    const [firstPart, secondPart] = row.split(' ')


    const pathId = currentDirectoryPath.join('/');
    if (typeof fileDirectoryMap[pathId] === 'undefined') {
        fileDirectoryMap[pathId] = {
            size: null,
            items: {},
            allInnerSizesCalculated: false
        }
    }

    if (firstPart === 'dir') {
        const directoryName = secondPart;

        fileDirectoryMap[pathId].items[directoryName] = {directoryId: `${pathId}/${directoryName}`};

        console.log('there is a directory named', directoryName)
        return;
    }
    const fileSize = firstPart;
    const fileName = secondPart;
    
    fileDirectoryMap[pathId].items[fileName] = {name: fileName, size: parseInt(fileSize)}
    console.log('There is a file with name and size', fileName, fileSize)

})

console.log(fileDirectoryMap)

console.log('///////////////////////////////')
console.log('///////////////////////////////')
console.log('///////////////////////////////')
console.log('///////////////////////////////')
// iterate over tree data to get all folder sizes

const getSizeOfDirectory = (directoryMapItem: DirectoryMapItem) => {
    if (directoryMapItem.allInnerSizesCalculated) {
        return directoryMapItem.size; 
    }
    let directorySize = 0;
    Object.values(directoryMapItem.items).forEach((value) => {
        if ('size' in value) {
            // We have a file
            directorySize += value.size;
            return;
        }
        // we have a directory
        const directoryData = fileDirectoryMap[value.directoryId]
        const innerDirectorySize = getSizeOfDirectory(directoryData);
        directorySize += innerDirectorySize ?? 0;
    })

    directoryMapItem.allInnerSizesCalculated = true;
    directoryMapItem.size = directorySize;
    return directorySize;
}
const rootDirectorySize = getSizeOfDirectory(fileDirectoryMap['~']) ?? 0
console.log(rootDirectorySize)

console.log('///////////////////////////////')
console.log('///////////////////////////////')
console.log('///////////////////////////////')
console.log('///////////////////////////////')

const totalFileSystemSpace = 70000000;
const necessaryUnusedSpace = 30000000;
const targetFileSize = totalFileSystemSpace - necessaryUnusedSpace;
const fileSizeToDelete = rootDirectorySize - targetFileSize;
console.log('need to delete', fileSizeToDelete)

let smallestDirectoryBiggerThanMinimum = Infinity;
Object.values(fileDirectoryMap).forEach((item) => {
    console.log(item)
    if (item.size !== null && (item.size >= fileSizeToDelete) && (item.size < smallestDirectoryBiggerThanMinimum)) {
        smallestDirectoryBiggerThanMinimum = item.size
    }
})

console.log(smallestDirectoryBiggerThanMinimum)