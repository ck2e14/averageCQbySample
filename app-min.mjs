"use strict";

import * as fs from "fs";
import * as XLSX from "xlsx/xlsx.mjs";
import { appendFileSync, unlinkSync, writeFileSync } from "fs";
import csv from "csvtojson";

let print = console.log;
let now = () => new Date().toDateString();

main().catch(e => print(e));

async function main() {
   let inputPath = "./input.xlsx",
      tempInputCSV = "./tempInputCSV.csv",
      outputPath = `./${now()}-output.csv`;

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

   writeFileSync(outputPath, "SampleID,CQ average\n");

   for (let sample in cache)
      appendFileSync(
         outputPath,
         `${sample},${(cache[sample] / freq[sample]).toFixed(2)}\n`
      );

   unlinkSync(tempInputCSV);
}