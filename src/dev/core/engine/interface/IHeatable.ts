interface IHeatable {
    getMinHeatValue(): number

    getIdealHeatValue(): number

    getMaxHeatValue(): number

    getCurrentHeatValue(): number
}