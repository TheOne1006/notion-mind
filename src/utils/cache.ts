// 添加 prefix
export function addMdPrefix(md: string, expired: number, timestamp: number, division = process.env.CACHE_FILE_DIVISION) {
    return `${division}\n` +
        `expired: ${expired}\n` +
        `timestamp: ${timestamp}\n` +
        `${division}\n` +
        md;
}

const defaultDivision = '============cache info==============';
export function parseCacheMd(md: string, division: string = process.env.CACHE_FILE_DIVISION || defaultDivision): string | null {
    const now = new Date().getTime();
    // 获取两个 division 之间的内容
    const parts = md.split(division);

    if (parts.length !== 3) {
        return null;
    }

    try {
        const info = parts[1];
        const lines = info.split('\n');
        const expired = parseInt(lines[1].split(':')[1].trim());
        if (expired < now) {
            return null;
        }
        return parts[2];
    } catch (error) {
        console.error(error)
        return null;
    }
}
