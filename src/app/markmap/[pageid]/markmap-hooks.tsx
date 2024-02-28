"use client"

import React, { useEffect } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { Toolbar } from 'markmap-toolbar';
import 'markmap-toolbar/dist/style.css';

import styles from "./markmap-hooks.module.css";


function renderToolbar(mm: Markmap, wrapper: HTMLElement | null, refresh: () => void) {
    if (mm && wrapper) {
        while (wrapper?.firstChild) wrapper.firstChild.remove();
        const toolbar = new Toolbar();
        toolbar.attach(mm);
        // Register custom buttons
        toolbar.register({
            id: 'refresh',
            title: 'Click to refresh',
            content: Toolbar.icon('M10 1.875C5.52 1.875 1.875 5.52 1.875 10s3.645 8.125 8.125 8.125s8.125-3.645 8.125-8.125h-1.25c0 3.80375-3.07125 6.875-6.875 6.875S3.125 13.80375 3.125 10S6.19625 3.125 10 3.125c2.421875 0 4.53875 1.24 5.761875 3.125H12.5v1.25h5V2.5h-1.25v2.324375C14.76 3.0275 12.5 1.875 10 1.875'),
            onClick: refresh,
        });
        toolbar.setItems([...Toolbar.defaultItems, 'refresh']);
        wrapper.append(toolbar.render());
    }
}

const transformer = new Transformer();

interface MarkmapHooksProps {
    md: string;
    refresh: () => void
}

function MarkmapHooks({ md, refresh }: MarkmapHooksProps) {
    useEffect(() => {
        "use client";
        const { root } = transformer.transform(md);
        // 清空之前点的数据
        const svg = document.getElementById('markmap');
        const toolbar = document.getElementById('toolbar');
        while (svg?.firstChild) svg.firstChild.remove();

        const markMap = Markmap.create('#markmap', {
            id: 'markmap'
        }, root);

        // Toolbar(document.getElementById('markmap'));
        renderToolbar(markMap, toolbar, refresh)
    }, [md, refresh]);

    return (
        <React.Fragment>
            <svg id="markmap" className={styles.mindmap} />
            <div id="toolbar" className="absolute bottom-1 right-1"></div>
        </React.Fragment>
    );
}

MarkmapHooks.defaultProps = {
    refresh: () => {}
}

export default MarkmapHooks;
