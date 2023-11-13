export const colorFromString = (str: String, alpha: number) => {
    var hash = 0,
        chr, color;
    for (let i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    const hashString: String = hash.toString(10)
    console.log(hashString)
    color = `hsla(${hashString.substring(1, 4)},50%,50%,${alpha})`
    console.group(color)
    return color;
}