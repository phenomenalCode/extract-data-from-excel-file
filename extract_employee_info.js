const reader = require('xlsx')
//const mysql = require('mysql2')
const db = require('./db_mysql')
// Reading the Excel file
const file = reader.readFile('reconomy-excel.xlsx')

let extractedData = []
const sheetNames = file.SheetNames

for (let i = 0; i < sheetNames.length; i++) {
  console.log(`iterating sheet: ${sheetNames[i]}`)
  let sheet = file.Sheets[sheetNames[i]]
  let rowIndex = 7

  console.log('iterating rows:')

  while (sheet[`A${rowIndex}`] && sheet[`A${rowIndex}`].v) {
    console.log(`iterating row: ${rowIndex}`)
    const employee_info = {
      first_name: sheet[`A${rowIndex}`].v,
      last_name: sheet[`B${rowIndex}`]?.v || '',
      personal_num: sheet[`E${rowIndex}`]?.v || '',
      start_date: sheet[`F${rowIndex}`]?.w || '',
      end_date: sheet[`G${rowIndex}`]?.w || '',
      arendenummer1: sheet[`C${rowIndex}`]?.w || '',
      arendenummer2: sheet[`D${rowIndex}`]?.w || '',
      location_name:  sheetNames[i]
    }
    console.log(`employee_info: ${JSON.stringify(employee_info)}`)

    let insertQuery = `INSERT INTO employee_info (first_name, last_name, personal_num, start_date, end_date, arendenummer1, arendenummer2, location_name) VALUES ('${employee_info.first_name}','${employee_info.last_name}','${employee_info.personal_num}','${employee_info.start_date}','${employee_info.end_date}','${employee_info.arendenummer1}','${employee_info.arendenummer2}','${employee_info.location_name}')`

    console.log(`insertQuery: ${insertQuery}`)

    db.query(insertQuery,(err, result) => {
        if (err){
          console.log(`error inserting employee: ${employee_info.first_name} ${employee_info.last_name}`);
          //throw err
        } else{
          //save the query to dump
          extractedData.push(insertQuery)
          console.log(`Inserted employee: ${JSON.stringify(result)}`);
          console.log(`Inserted employee: ${employee_info.first_name} ${employee_info.last_name}`);
        }
      }
    )
    
    rowIndex++; // Move to the next row
  }
}

console.log(extractedData)
