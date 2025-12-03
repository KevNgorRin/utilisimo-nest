export function calculatePercentage(numberA: number, numberB: number): number {
    if (!numberB) {
        return 0
    }

    return Math.round((numberA / numberB) * 10000) / 100
}
