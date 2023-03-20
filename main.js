import fs from "fs";

let rawdata = fs.readFileSync("pik3ca.json");
let db = JSON.parse(rawdata);

//console.log(db);

const patients = Object.entries(db).reduce((acc, [mutation, tissues]) => {
  /*   console.log(key);
  console.log(value); */
  //console.log(acc);

  Object.entries(tissues).forEach(([tissue, nPatients]) =>
    acc.push({
      mutation,
      tissue,
      value: nPatients,
    })
  );

  return acc;
}, []);

console.log(patients);

/* db.essentiality = db.essentiality.map((item) => ({
  ...item,
  logFC: Number(item.logFC.replace(",", ".")),
}));
 */

const patientsStr = JSON.stringify(patients);

fs.writeFileSync("db-2.json", patientsStr);
