"use strict";

import * as fs from "fs";
import * as XLSX from "xlsx/xlsx.mjs";
import {
   appendFileSync as append,
   unlinkSync as del,
   writeFileSync as write,
} from "fs";
import csv from "csvtojson";

main().catch(error => console.log(error));

async function main() {
   let input = "./input.xlsx",
      temp = "./temp.csv",
      output = `./${new Date().toDateString()}-output.csv`;

   XLSX.set_fs(fs);
   XLSX.writeFile(XLSX.readFile(input), temp, { bookType: "csv" });

   let rows = await csv().fromFile(temp),
      cache = {},
      freq = {};

   for (let row of rows) {
      let id = row.Sample_ID,
         cq = parseFloat(row.CQ);

      cache[id] ? (cache[id] += cq) : (cache[id] = cq);
      freq[id] ? freq[id]++ : (freq[id] = 1);
   }

   write(output, "SampleID,CQ average\n");

   for (let sample in cache) {
      let val = (cache[sample] / freq[sample]).toFixed(2);
      append(output, `${sample},${val}\n`);
   }

   del(temp);
}
