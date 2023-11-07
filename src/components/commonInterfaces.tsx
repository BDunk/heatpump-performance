export interface XYArray {
    x: number[],
    y: number[],
}

interface PerformanceProperty {
    name: string,
    values: XYArray,
}

export interface Chiller {
    name: string,
    envelope: XYArray,
    performance: PerformanceProperty[]
    active: boolean,
}