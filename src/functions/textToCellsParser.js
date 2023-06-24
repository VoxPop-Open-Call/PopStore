function textToCellsParser(text) {
    // splitting on new line outside quotes - https://stackoverflow.com/questions/62898644/regex-splitting-on-newline-outside-of-quotes
    const rows = text.split(/\r?\n/)
    // split rows into cells and remove boundary quotes in each cell - https://stackoverflow.com/questions/19156148/i-want-to-remove-double-quotes-from-a-string
    const filteredRows = rows.map(
        row => ({ cells: row.split('\t').map(cell => cell.replace(/^"|"$/g, '').trim())
    }))
    return filteredRows.filter(row => row.cells.length > 0)
}

export default textToCellsParser
