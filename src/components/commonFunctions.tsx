export const colorFromString = (str: String, alpha: number) => {
    var hash = 0,
        chr, color;
    for (let i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    const hashString: String = hash.toString(16)
    color = `rgba(${hashString.substring(0, 2)},${hashString.substring(2, 4)},${hashString.substring(4, 6)},${alpha})`
    return color;
}