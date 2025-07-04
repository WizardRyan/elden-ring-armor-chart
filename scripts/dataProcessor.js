import { CONFIG } from './config.js';

export class DataProcessor {
    static async loadData() {
        const data = await d3.csv("./data/armors.csv");
        return this.processData(data);
    }

    static processData(data) {
        for(const row of data) {
            row.dmgNegation = row.dmgNegation.replace(/'/g, `"`);
            row.dmgNegation = JSON.parse(row.dmgNegation);
            row.resistance = row.resistance.replace(/'/g, `"`);
            row.resistance = JSON.parse(row.resistance);
            row.weight = parseFloat(row.weight);
            
            for(const property of CONFIG.axisOptions.filter(o => o != "weight")) {
                try {
                    row[property] = row.dmgNegation.find((o) => o.name == property).amount;
                } catch(err) {
                    try {
                        row[property] = row.resistance.find(o => o.name == property).amount;
                    } catch(err) {
                        row[property] = 0;
                    }
                }
            }
        }
        return data;
    }

    static filterData(data, armorType) {
        return armorType === "All" ? data : data.filter(d => d.category === armorType);
    }
}