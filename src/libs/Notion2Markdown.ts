import { NotionToMarkdown } from "notion-to-md";
import { getBlockChildren } from "notion-to-md/build/utils/notion";

import type { ListBlockChildrenResponseResult, ListBlockChildrenResponseResults, MdBlock } from "notion-to-md/build/types";

import { markmapPageLink } from "../utils/url";


// 跳过一些 types
const skipTypes = ['embed'];

export class Notion2Markdown extends NotionToMarkdown {
    /**
   * Converts list of Notion Blocks to Markdown Blocks
   * @param {ListBlockChildrenResponseResults | undefined} blocks - List of notion blocks
   * @param {number} totalPage - Retrieve block children request number, page_size Maximum = totalPage * 100
   * @param {MdBlock[]} mdBlocks - Defines max depth of nesting
   * @returns {Promise<MdBlock[]>} - Array of markdown blocks with their children
   */
    async blocksToMarkdown(
        blocks?: ListBlockChildrenResponseResults,
        totalPage: number | null = null,
        mdBlocks: MdBlock[] = []
    ): Promise<MdBlock[]> {
        //  hack
        if (!this['notionClient']) {
            throw new Error(
                "notion client is not provided, for more details check out https://github.com/souvikinator/notion-to-md"
            );
        }

        if (!blocks) return mdBlocks;

        for (let i = 0; i < blocks.length; i++) {
            let block: ListBlockChildrenResponseResult = blocks[i];

            
            /**
             * skip some types
             */
            // @ts-ignore
            if (block.type.includes(skipTypes)) {
                // @ts-ignore
                continue;
            }

            /**
             * custom child page
             */
            // @ts-ignore
            if (block.type === "child_page" && !this.config.parseChildPages) {
                // @ts-ignore
                const mockTitle = block['child_page'].title;
                const linkInSite = markmapPageLink(block.id);
                mdBlocks.push({
                    type: 'paragraph',
                    blockId: block.id,
                    parent: await this.blockToMarkdown({
                        type: 'paragraph',
                        paragraph: {
                            rich_text: [{
                                type: 'text',
                                text: {
                                    content: mockTitle,
                                    link: { url: linkInSite }
                                },
                                annotations: {
                                    bold: false,
                                    italic: false,
                                    strikethrough: false,
                                    underline: false,
                                    code: false,
                                    color: 'default'
                                },
                                plain_text: mockTitle,
                                href: linkInSite
                            }], color: 'default'
                        },
                        object: 'block',
                        id: block.id
                    }),
                    children: [],
                });
                continue;
            }

            if ("has_children" in block && block.has_children) {
                const block_id =
                    block.type == "synced_block" &&
                        block.synced_block?.synced_from?.block_id
                        ? block.synced_block.synced_from.block_id
                        : block.id;
                // Get children of this block.
                let child_blocks = await getBlockChildren(
                    this['notionClient'],
                    block_id,
                    totalPage
                );

                // Push this block to mdBlocks.
                mdBlocks.push({
                    type: block.type,
                    blockId: block.id,
                    parent: await this.blockToMarkdown(block),
                    children: [],
                });

                // Recursively call blocksToMarkdown to get children of this block.
                // check for custom transformer before parsing child
                if (
                    !(block.type in this['customTransformers']) &&
                    !this['customTransformers'][block.type]
                ) {
                    let l = mdBlocks.length;
                    await this.blocksToMarkdown(
                        child_blocks,
                        totalPage,
                        mdBlocks[l - 1].children
                    );
                }

                continue;
            }

            let tmp = await this.blockToMarkdown(block);
            mdBlocks.push({
                // @ts-ignore
                type: block.type,
                blockId: block.id,
                parent: tmp,
                children: [],
            });
        }
        return mdBlocks;
    }
}
