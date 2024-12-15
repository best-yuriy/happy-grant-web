import { getStat, setStat } from "./HappinessStatService";

async function setHappinessLevel(date, value) {
    await setStat(date, value);
}

async function getHappinessLevel(date) {
    return getStat(date);
}

export { setHappinessLevel, getHappinessLevel };
