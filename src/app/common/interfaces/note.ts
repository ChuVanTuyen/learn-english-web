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

export interface MultiQuestionWord {
    question: string;
    answers: AnswerWord[];
    word: WordNotebook;
    choose: number;
    type: number;
    userAns: string;
    isCorrect: boolean;
    submit: boolean;
}

export interface AnswerWord {
    id: number,
    content: string;
    pronounce?: string;
}

export interface ResultGame {
    name: string;
    date: Date;
    time: number;
    total: number;
    correct: number;
}

export interface WordFlashCard extends WordNotebook {
    status: number,
    pEvent: boolean,
    flip: boolean,
    isShowMix: boolean
}