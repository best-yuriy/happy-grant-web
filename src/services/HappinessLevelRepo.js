import { getStat, setStat } from "./HappinessStatService";

async function setHappinessLevel(date, value) {
    // Simulate call to an API
    await new Promise(resolve => setTimeout(resolve, 500));
    // if (Math.random() < 0.1) {
    //     throw new Error("failed to save stats");
    // }
    
    setStat(date, value);
}

function getHappinessLevel(date) {
    return getStat(date);
}

export { setHappinessLevel, getHappinessLevel };