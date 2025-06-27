
"use client"

import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    linkPlugin,
    linkDialogPlugin,
    tablePlugin,
    // codeBlockPlugin,
    // codeMirrorPlugin,
    diffSourcePlugin,
    frontmatterPlugin,
    directivesPlugin,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    // CodeToggle,
    CreateLink,
    // InsertImage,
    InsertTable,
    ListsToggle,
    BlockTypeSelect,

} from "@mdxeditor/editor"
import "@mdxeditor/editor/style.css"
import { useState } from "react"

interface MDXRichEditorProps {
    initialContent?: string
    onChange?: (content: string) => void
    placeholder?: string
}

export default function MDXRichEditor({
    initialContent = "",
    onChange,
    placeholder = "Start writing...",
}: MDXRichEditorProps) {
    const [content, setContent] = useState(initialContent)

    const handleChange = (newContent: string) => {
        setContent(newContent)
        onChange?.(newContent)
    }

    return (
        <div>

            <MDXEditor
                onChange={handleChange}
                markdown={content}
                placeholder={placeholder}
                plugins={[
                    // Core plugins
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),

                    // Link plugins
                    linkPlugin(),
                    linkDialogPlugin(),

                    // Image plugin
                    // imagePlugin({
                    //
                    // }),

                    // Table plugin
                    tablePlugin(),

                    // Code plugins
                    // codeBlockPlugin({ defaultCodeBlockLanguage: "javascript" }),
                    // codeMirrorPlugin({
                    //     codeBlockLanguages: {
                    //         javascript: "JavaScript",
                    //         typescript: "TypeScript",
                    //         python: "Python",
                    //         html: "HTML",
                    //         css: "CSS",
                    //         json: "JSON",
                    //         markdown: "Markdown",
                    //     },
                    // }),

                    // Advanced plugins
                    diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
                    frontmatterPlugin(),
                    directivesPlugin(),

                    // Toolbar plugin with all tools
                    toolbarPlugin({
                        toolbarContents: () => (
                            <div className="flex flex-wrap items-center gap-2 rounded-md w-full">
                                <div className={"bg-white shadow p-2 rounded-md"}>
                                    <UndoRedo />
                                </div>
                                <div className={"bg-white shadow p-2 rounded-md"}>
                                    <BoldItalicUnderlineToggles />
                                </div>

                                <div className={"bg-white shadow p-2 rounded-md"}>
                                    <BlockTypeSelect />
                                </div>
                                <div className={"bg-white shadow p-2 rounded-md"}>
                                    <ListsToggle />
                                </div>

                                <div className={"bg-white shadow p-1.5 rounded-md"}>
                                    <CreateLink />
                                </div>

                                <div className={"bg-white shadow p-2 flex items-center rounded-md"}>
                                    <InsertTable />
                                </div>

                                {/* <div className={"bg-white shadow p-2 rounded-md"}>
                                    <CodeToggle />
                                </div> */}
                                {/* <div className={"bg-white shadow p-2 flex items-center rounded-md"}>
                                    <InsertImage />
                                </div> */}

                                {/*<InsertCodeBlock/>*/}
                                {/*<InsertThematicBreak/>*/}
                            </div>
                        ),
                    }),
                ]}
                className="border border-gray-200 rounded-md"
            />
        </div>

    )
}
