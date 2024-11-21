import { getStat, setStat } from "./HappinessStatService";

function setHappinessLevel(date, value) {
    setStat(date, value);
}

function getHappinessLevel(date) {
    return getStat(date);
}

export { setHappinessLevel, getHappinessLevel };