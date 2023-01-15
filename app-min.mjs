"use strict";

import * as fs from "fs";
import * as XLSX from "xlsx/xlsx.mjs";
import {
   appendFileSync as append,
   unlinkSync as del,
   writeFileSync as write,
} from "fs";
import csv from "csvtojson";

main().catch(e => console.log(e));

async function main() {
   let inputPath = "./input.xlsx",
      tempInputCSV = "./tempInputCSV.csv",
      outputPath = `./${new Date().toDateString()}-output.csv`;

   XLSX.set_fs(fs);
   XLSX.writeFile(XLSX.readFile(inputPath), tempInputCSV, { bookType: "csv" });

   let rows = await csv().fromFile(tempInputCSV),
      cache = {},
      freq = {};

   for (let row of rows) {
      let id = row.Sample_ID,
         cq = parseFloat(row.CQ);

      cache[id] ? (cache[id] += cq) : (cache[id] = cq);
      freq[id] ? freq[id]++ : (freq[id] = 1);
   }

   write(outputPath, "SampleID,CQ average\n");

   for (let sample in cache) {
      let val = (cache[sample] / freq[sample]).toFixed(2);
      append(outputPath, `${sample},${val}\n`);
   }

   del(tempInputCSV);
}
