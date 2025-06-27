import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from "lexical"

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    LinkNode,
    AutoLinkNode,
    TableNode,
    TableRowNode,
    TableCellNode,
    HorizontalRuleNode,
    ListNode,
    ListItemNode,
  ]


// HeadingNode,
//   ParagraphNode,
//   TextNode,
//   QuoteNode,
//   ListNode,
//   ListItemNode,
//   CodeNode,
//   CodeHighlightNode,
//   LinkNode,
//   AutoLinkNode,
//   TableNode,
//   TableRowNode,
//   TableCellNode,
//   HorizontalRuleNode,