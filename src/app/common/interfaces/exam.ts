import { ObjectKey } from "./common"

export interface Test {
    id: number,
    name: string,
    time: number,
    type: string,
    histories?: HistoryTest[];
}

export interface DetailTest {
    id: number,
    name: string,
    time: number,
    type: string,
    skills: SkillTest[]
}

export interface SkillTest {
    id: number,
    name: string,
    type: string,
    time: number,
    is_listening: number,
    parts: PartTest[]
}

export interface PartTest {
    id: number,
    name: string,
    title: string,
    amount: number,
    questions: Question[]
}

export interface IntroPart {
    id: number,
    title: string,
    audio: string,
    answers: any, // string[],
    correct_answer: number,
    image: string,
    explains: string,
    created_at: string,
    updated_at: string
}

export interface Question {
    id: number,
    audio: string,
    text_read: string,
    text_read_trans: string,
    text_audio: string,
    text_audio_trans: any,
    image: string,
    title: string,
    child_ques: ChildQues[],
    done: boolean;
}

export interface ChildQues {
    id: number,
    title: string,
    answers: any,
    correct_answer: number,
    image: string,
    explains: any,
    write_answer: string,
    selected: number,
    isCorrect: boolean,
    idx: number
}

export interface SaveHistoryTest {
    content: ObjectKey<number>;
    correct_listen: number;
    correct_read: number;
    score: number;
    time: number;
    created_at?: string;
}

export interface HistoryTest extends SaveHistoryTest {
    id: number;
    created_at: string;
}