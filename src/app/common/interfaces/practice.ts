import { ObjectKey } from "./common";

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

export interface PracticeSummary {
    done_questions: ObjectKey<number[]>,
    false_questions: ObjectKey<number[]>
}

export interface PracticeSummaryResponse {
    summary: PracticeSummary,
    history: HistoryPractice[]
}
