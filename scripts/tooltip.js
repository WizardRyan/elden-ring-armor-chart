import { CONFIG } from './config.js';

export class Tooltip {
    constructor() {
        this.element = this.createTooltip();
        this.setupScrollHandler();
    }

    createTooltip() {
        const tooltip = document.createElement("div");
        tooltip.setAttribute("class", "tooltip");
        document.body.appendChild(tooltip);
        
        const dimensions = CONFIG.getResponsiveDimensions();
        tooltip.style.maxWidth = `${Math.floor(dimensions.width)}px`;
        
        return tooltip;
    }

    setupScrollHandler() {
        window.onwheel = (event) => {
            // Only handle tooltip scrolling when tooltip is visible
            if (this.element.style.display === "flex") {
                const scrollAmount = 100;
                if(event.deltaY > 0) {
                    this.element.scrollLeft += scrollAmount;
                } else {
                    this.element.scrollLeft -= scrollAmount;
                }
                // event.preventDefault();
            }
        };
    }

    show(items, mouseX, mouseY) {
        this.element.style.display = "flex";
        this.element.style.position = "fixed";
        this.element.innerHTML = "";

        items.forEach(item => {
            const armorSummary = document.createElement('div');
            armorSummary.className = 'armor-summary';
            
            const itemImage = document.createElement('img');
            itemImage.setAttribute("src", item.image);
            itemImage.style.maxWidth = "200px";
            itemImage.style.maxHeight = "200px";
            armorSummary.appendChild(itemImage);

            for (const prop of CONFIG.infoOptions) {
                const el = document.createElement("p");
                el.innerHTML = `${prop}: <b>${item[prop]}</b>`;
                armorSummary.appendChild(el);
            }
            this.element.appendChild(armorSummary);
        });

        setTimeout(() => {
            this.positionTooltip(mouseX, mouseY);
        }, 0);
    }

    hide() {
        this.element.style.display = "none";
    }

    positionTooltip(mouseX, mouseY) {
        const tooltipRect = this.element.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let left = mouseX + 20;
        let top = mouseY - 40;
        
        if (left + tooltipRect.width > viewportWidth) {
            left = mouseX - tooltipRect.width - 20;
        }
        
        if (left < 0) {
            left = 10;
        }
        if (left + tooltipRect.width > viewportWidth) {
            left = viewportWidth - tooltipRect.width - 10;
        }
        
        if (top + tooltipRect.height > viewportHeight) {
            top = viewportHeight - tooltipRect.height - 10;
        }
        if (top < 0) {
            top = 10;
        }
        
        this.element.style.left = left + 'px';
        this.element.style.top = top + 'px';
    }
}