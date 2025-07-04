export const CONFIG = {
    axisOptions: ['Phy','Strike','Slash','Pierce','Magic','Fire','Ligt','Holy', "weight", 'Immunity','Robustness','Focus','Vitality','Poise'],
    infoOptions: ['name', 'Phy','Strike','Slash','Pierce','Magic','Fire','Ligt','Holy', "weight", 'Immunity','Robustness','Focus','Vitality','Poise'],
    armorTypes: ["All", "Chest Armor", "Leg Armor", "Gauntlets", "Helm", "Gauntlet"],
    
    getResponsiveDimensions() {
        const containerWidth = Math.min(window.innerWidth * 0.9, 2000);
        const containerHeight = Math.min(window.innerHeight * 0.8, 1200);
        
        return {
            margin: {top: 30, right: 30, bottom: 70, left: 100},
            width: containerWidth - 130,
            height: containerHeight - 100
        };
    },

    getAxisDisplayName(option) {
        if(option == "Ligt") return "Lightning";
        if(option == "Phy") return "Physical";
        if(option == "weight") return "Weight";
        return option;
    }
};