import {
    cpSync,
    existsSync,
    lstatSync,
    readdirSync,
    readFileSync,
    writeFileSync,
} from "fs"

const [, , nn = "00"] = process.argv

const minDay = "01"
const maxDay = "25"

if (
    nn.length !== minDay.length ||
    parseInt(nn, 10) < parseInt(minDay, 10) ||
    parseInt(nn, 10) > parseInt(maxDay, 10)
)
    process.exit()

const inputFolder = "./src/00"
const outputFolder = `./src/${nn}`

if (existsSync(outputFolder)) process.exit()

const inputFiles = readdirSync(inputFolder, { recursive: true })
    .map(String)
    .filter((path) => !lstatSync(`${inputFolder}/${path}`).isDirectory())
    .map((path) => ({
        content: readFileSync(`${inputFolder}/${path}`, "utf-8"),
        parent: inputFolder,
        path,
    }))

const outputFiles = inputFiles.map(({ content, path }) => ({
    content: content.replaceAll("00", nn).replace(".todo", ""),
    parent: outputFolder,
    path,
}))

cpSync(inputFolder, outputFolder, { recursive: true })

outputFiles.forEach(({ content, parent, path }) => {
    writeFileSync(`${parent}/${path}`, content)
})
