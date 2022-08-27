import getFlatArray from 'utilFunctions/getFlatArray';
import BagPrintLogs from 'components/BagPrint/BagPrintLogs';

const getDashboardLogs = (services) => {
    services.sort();
    let dynamicCards = services.map((item) => {
        let component;
        switch (item) {
            case 'WI.PC':
                component = BagPrintLogs;
                break;
            default:
                break;
        }
        return component;
    });
    let hardCards = [];
    let finalCards = hardCards.concat(dynamicCards);
    finalCards = finalCards.filter((item) => item !== undefined);
    return getFlatArray(finalCards);
};

export default getDashboardLogs;