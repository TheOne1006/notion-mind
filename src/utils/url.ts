
/**
 * 根据pageId 获取连接
 * @param pageId 
 * @returns 
 */
export function markmapPageLink(pageId: string) {
    // const url = `${process.env.SITE_URL}/markmap/${pageId}`;
    const url = `/markmap/${pageId}`;
    return url;
}
