import { ObjectKey } from "./common";

export interface SummaryPractice {
    done_question_ids: number[],
    false_question_ids: ObjectKey<number[]>
}

export interface HistoryPractice {
    id: number,
    content: ObjectKey<number>,
    total: number,
    time: number,
    correct: number,
    part_id: number,
    created_at: string | number,
    updated_at: string | number,
}