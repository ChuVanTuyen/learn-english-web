export interface Notebook {
    id: number,
    user_id: number,
    name: string,
    total: number,
    created_at: string,
    updated_at: string,
}

export interface WordNotebook {
    id: number;
    notebook_id: number;
    word: string;
    kind?: string;
    pronounce?: string;
    mean: string;
    note?: string;
}

export interface DetailNotebook {
    id: number,
    user_id: number,
    name: string,
    total: number,
    words: WordNotebook[],
    created_at: string,
    updated_at: string,
}

export interface DataAddWord {
    word: string,
    pronounce?: string,
    kind?: string,
    mean: string,
    note?: string,
}

// export interface WordNotebook{
//     "id": 811,
//     "notebook_id": 21,
//     "word": "hello",
//     "pronounce": "helo",
//     "kind": "",
//     "mean": "Xin chào",
//     "note": "",
//     "created_at": "2025-06-27T12:32:18.427Z",
//     "updated_at": "2025-06-27T12:32:18.427Z"
// }