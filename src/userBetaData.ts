const text = await Deno.readTextFile('src/user-betas_enablement-by-business-role.php_2022-12-07.txt');
const rawData = text.split('\n');
let allDataRows: string[] = []
rawData.forEach(item => {
    const [id, data] = item.split('	')

    const parsedData = JSON.parse(data);
    console.log(parsedData)
    const dataRows: string[] = []
    Object.keys(parsedData).forEach((key) => {
        if (key !== "returnValue") {
            dataRows.push(parsedData[key].split('|').join(','))
        }
    })
    allDataRows = [...allDataRows, ...dataRows]
})

console.log(allDataRows)


Deno.writeTextFileSync('./userBetaOutput.txt', allDataRows.join('\n'))