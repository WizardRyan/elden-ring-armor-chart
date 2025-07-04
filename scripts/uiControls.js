import { CONFIG } from './config.js';

export class UIControls {
    constructor(onAxisChange, onArmorTypeChange, onResetZoom) {
        this.onAxisChange = onAxisChange;
        this.onArmorTypeChange = onArmorTypeChange;
        this.onResetZoom = onResetZoom;
        this.inputDiv = document.getElementById("input-div");
        this.setupControls();
    }

    setupControls() {
        this.createAxisControls();
        this.createArmorTypeControl();
        this.setupZoomControls();
    }

    createAxisControls() {
        this.xSelect = this.createSelect(CONFIG.axisOptions);
        this.ySelect = this.createSelect(CONFIG.axisOptions);
        
        this.addDropDown(this.xSelect, "X axis:");
        this.addDropDown(this.ySelect, "Y axis:");
        
        this.xSelect.value = "weight";
        this.ySelect.value = "Phy";
        
        this.xSelect.onchange = () => this.onAxisChange(this.xSelect.value, this.ySelect.value);
        this.ySelect.onchange = () => this.onAxisChange(this.xSelect.value, this.ySelect.value);
    }

    createArmorTypeControl() {
        const armorTypeDiv = document.createElement("div");
        armorTypeDiv.id = "armor-type-div";
        
        const armorTypeSpan = document.createElement("span");
        armorTypeSpan.innerText = "Filter Armor Types:";
        
        this.armorTypeSelect = this.createSelect(CONFIG.armorTypes);
        this.armorTypeSelect.onchange = () => this.onArmorTypeChange(this.armorTypeSelect.value);
        
        armorTypeDiv.appendChild(armorTypeSpan);
        armorTypeDiv.appendChild(this.armorTypeSelect);
        this.inputDiv.appendChild(armorTypeDiv);
    }

    setupZoomControls() {
        const resetButton = document.createElement("button");
        resetButton.innerText = "Reset Zoom";
        resetButton.setAttribute("id", "reset-zoom");
        resetButton.onclick = this.onResetZoom;
        this.inputDiv.appendChild(resetButton);
    }

    createSelect(options) {
        const select = document.createElement("select");
        for(const option of options) {
            const optionElement = document.createElement("option");
            optionElement.value = option;
            optionElement.innerText = CONFIG.getAxisDisplayName ? CONFIG.getAxisDisplayName(option) : option;
            select.appendChild(optionElement);
        }
        return select;
    }

    addDropDown(element, text) {
        const container = document.createElement("div");
        container.setAttribute("class", "input-pair");
        const label = document.createElement("span");
        label.innerText = text;
        container.appendChild(label);
        container.appendChild(element);
        this.inputDiv.appendChild(container);
    }

    getCurrentAxes() {
        return {
            x: this.xSelect.value,
            y: this.ySelect.value
        };
    }

    getCurrentArmorType() {
        return this.armorTypeSelect.value;
    }
}