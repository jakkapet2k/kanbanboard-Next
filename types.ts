
export interface Task {
    column_id: any;
    id: number;
    content: string;
    description?: string;
    tags: string[]; 
}

export interface ColumnType {
    index: number;
    id: number;
    title: string;
    tasks: Record<number, Task>;
}

export interface Columns {
    [key: number]: ColumnType;
}
