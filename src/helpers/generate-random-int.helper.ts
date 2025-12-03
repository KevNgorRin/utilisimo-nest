export function generateRandomInt(digits: number): number {
    const min = Math.pow(10, digits - 1)
    return Math.round(Math.random() * min * 9) + min
}
