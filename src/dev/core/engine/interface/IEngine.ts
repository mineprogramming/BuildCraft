interface IEngine {
    canReceiveFromEngine(side: number): boolean

    receiveEnergyFromEngine(side: number, amount: number, simulate: boolean): number
}