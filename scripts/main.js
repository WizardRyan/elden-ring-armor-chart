import { CONFIG } from './config.js';
import { DataProcessor } from './dataProcessor.js';
import { UIControls } from './uiControls.js';
import { Tooltip } from './tooltip.js';
import { Scatterplot } from './scatterplot.js';

class ArmorChartApp {
    constructor() {
        this.fullData = [];
        this.currentData = [];
        this.init();
    }

    async init() {
        try {
            // Load and process data
            this.fullData = await DataProcessor.loadData();
            this.currentData = Array.from(this.fullData);
            console.log('Data loaded:', this.fullData);

            // Initialize components
            this.tooltip = new Tooltip();
            this.scatterplot = new Scatterplot('graphic-container', this.tooltip);
            
            this.uiControls = new UIControls(
                (x, y) => this.handleAxisChange(x, y),
                (armorType) => this.handleArmorTypeChange(armorType),
                () => this.scatterplot.resetZoom()
            );

            // Set initial data and render
            this.scatterplot.setData(this.currentData);
            const axes = this.uiControls.getCurrentAxes();
            this.scatterplot.updateChart(axes.x, axes.y);

        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }

    handleAxisChange(x, y) {
        this.scatterplot.updateChart(x, y);
    }

    handleArmorTypeChange(armorType) {
        this.currentData = DataProcessor.filterData(this.fullData, armorType);
        this.scatterplot.setData(this.currentData);
        
        const axes = this.uiControls.getCurrentAxes();
        this.scatterplot.updateChart(axes.x, axes.y);
    }
}

// Initialize the application
new ArmorChartApp();