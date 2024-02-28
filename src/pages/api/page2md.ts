import fs from 'fs/promises'
import { Client  } from "@notionhq/client";
import { Notion2Markdown } from "../../libs/Notion2Markdown";
import type { NextApiRequest, NextApiResponse } from 'next'

import { ResponseData } from '../../interface';
import { parseCacheMd, addMdPrefix } from '../../utils/cache';

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})
// passing notion client to the option
const n2m = new Notion2Markdown({
    notionClient: notion,
    config: {
        parseChildPages: false, // default: parseChildPages
        convertImagesToBase64: false,
    }
});



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const pageId = req.query?.pageId;
    const disabledCache = req.query?.disabledCache || req.query?._d;
    const forceRefresh = req.query?.forceRefresh || req.query?._f;

    const resultJson: ResponseData = {
        md: '',
        msg: '',
        isCache: false,
    }

    if (!pageId) {
        resultJson.msg = "pageId is required";
        res.status(400).json(resultJson);
        return;
    } else if (Array.isArray(pageId)) {
        resultJson.msg = "pageId is not array";
        res.status(400).json(resultJson);
        return;
    }

    const cacheFileName = `${process.env.CACHE_FILE_PATH}/${pageId}.md`;

    const tryUseCache = !forceRefresh && !disabledCache;
    if (tryUseCache) {
        // 缓存
        try {
            const cacheFile = await fs.readFile(cacheFileName, 'utf8');

            const cacheMd = parseCacheMd(cacheFile, process.env.CACHE_FILE_DIVISION);

            resultJson.msg = 'success';
            resultJson.isCache = true;
            resultJson.md = cacheMd || '';

            if (cacheMd) {
                res.status(200).json(resultJson);
                return;
            }
        } catch (error) {
            // ignore
            console.log('get cache failed:', error);
        }
    }

    // https://www.notion.so/theone1006/notion-mind-820876eb920748f2abe4ba19cee6249e?pvs=4
    try {
        const mdblocks = await n2m.pageToMarkdown(pageId, 0);
        const mdString = n2m.toMarkdownString(mdblocks);
        const md = mdString.parent

        if (!disabledCache || forceRefresh) {
            const now = new Date().getTime();
            const expired = now + parseInt(process.env.CACHE_DURATION || '36000000');
            // 写入缓存
            const mdInCache = addMdPrefix(md, expired, now, process.env.CACHE_FILE_DIVISION);
            await fs.writeFile(`${process.env.CACHE_FILE_PATH}/${pageId}.md`, mdInCache);
        }

        resultJson.msg = 'success';
        resultJson.isCache = false;
        resultJson.md = md;

        res.status(200).json(resultJson);
        return;
    } catch (error) {
        resultJson.msg = `pageId ${pageId} is error`;
        resultJson.isCache = false;
        resultJson.md = '';
        res.status(400).json(resultJson);
        return;
    }

}
