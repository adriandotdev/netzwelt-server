module.exports = function buildHierarchy(data) {
    const territories = {}; // This is the container of all the invidual territories.
    const topMostTerritories = []; // This is the container of all nodes which its parent is null.

    data.forEach(item => {
        territories[item.id] = item;
    });

    // Traverse to all of teritories
    data.forEach(item => {
        if (item.parent === null) {
            topMostTerritories.push(item);
        } else {
            const parent = territories[item.parent];
            if (parent) {
                parent.children = parent.children || [];
                parent.children.push(item);
            }
        }
    });

    return topMostTerritories;
}