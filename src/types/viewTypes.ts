export interface TableTextEntry {
    text: string,
    html?: never
}

export interface TableHtmlEntry {
    text?: never,
    html: string
}

export type TableEntry = TableTextEntry | TableHtmlEntry;
