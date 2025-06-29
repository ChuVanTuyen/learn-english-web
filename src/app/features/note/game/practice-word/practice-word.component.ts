import { Component } from '@angular/core';
import { AnswerWord, MultiQuestionWord, ResultGame, WordNotebook } from '../../../../common/interfaces/note';
import { NoteService } from '../../../../shares/services/note.service';
import { OTHER_WORDS } from '../../../../shares/data/note';
import { AudioService } from '../../../../shares/services/audio.service';
import { ResultGameComponent } from "../result-game/result-game.component";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonService } from '../../../../shares/services/common.service';

@Component({
    selector: 'app-practice-word',
    imports: [ResultGameComponent, RouterLink],
    templateUrl: './practice-word.component.html',
    styleUrl: './practice-word.component.css'
})
export class PracticeWordComponent {

    noteId: number = 0;
    arrType: number = 1; //1. đọc chọn nghĩa, 2 cho nghĩa chọn từ đúng, 3 nghe chọn từ
    activeQues: number = 0;
    isShowResult: boolean = false;

    nameNotebook: string = '';

    listWordNote: WordNotebook[] = [];
    ortherWords: WordNotebook[] = OTHER_WORDS as WordNotebook[];
    questions: MultiQuestionWord[] = [];
    resultGame!: ResultGame;
    timeInterval:NodeJS.Timeout | undefined;
    constructor(
        private noteService: NoteService,
        protected readonly audioService: AudioService,
        private commonService: CommonService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const noteId = Number(params.get('id'));
            if(noteId) {
                this.noteId = noteId;
                this.noteService.getDetailNote(this.noteId).subscribe({
                    next: res => {
                        this.nameNotebook = res.name;
                        this.listWordNote = res.words;
                        this.preparePractice();
                    }
                })
            }
        });
    }

    preparePractice() {
        this.resultGame = {
            name: 'Sổ tay 1',
            date: new Date(),
            time: 0,
            total: 6,
            correct: 4
        }
        if(this.commonService.getEnvironment() === 'client') {
            this.timeInterval = setInterval(() => {
                this.resultGame.time ++;
            }, 1000)
        }
        this.questions = this.createQuestionMultipleChoice(this.listWordNote);
    }

    createQuestionMultipleChoice(listWordNote: WordNotebook[]): MultiQuestionWord[] {
        const questions = listWordNote.map((word, idx) => {
            const type = Math.floor(Math.random() * 3) + 1;
            let question = '';
            switch (type) {
                case 2:
                    question = `Đâu là "${word.mean}"?`
                    break;
                case 3:
                    question = `Bạn nghe được gì?`
                    break;
                default:
                    question = `"${word.word}" nghĩa là gì?`
                    break;
            }
            let ques = {
                question,
                answers: this.createAnswerMultipleChoice(idx, type),
                word,
                choose: -1,
                userAns: '',
                type: type,
                isCorrect: false,
                submit: false
            }
            return ques
        });
        return questions;
    }

    createAnswerMultipleChoice(idx: number, type: number) {
        const filterW = this.listWordNote.filter((w, i) => i!== idx);
        const list: WordNotebook[] = [...this.ortherWords, ...filterW];
        let listAnswer: AnswerWord[] = [];
        list.splice(idx, 1);
        list.sort(() => Math.random() - 0.5);
        listAnswer = list.slice(0, 3).map(word => ({ 
            id: word.id,
            content: type !== 1 ? word.word : word.mean, 
            pronounce: word.pronounce 
        }));
        listAnswer.push({ 
            id: this.listWordNote[idx].id,
            content: type !== 1 ? this.listWordNote[idx].word : this.listWordNote[idx].mean, 
            pronounce: this.listWordNote[idx].pronounce 
        });
        listAnswer.sort(() => Math.random() - 0.5);

        return listAnswer;
    }

    chooseAnswer(idxAns: number) {
        if(this.questions[this.activeQues].submit) return;
        this.questions[this.activeQues].choose = idxAns;
    }

    check() {
        if(this.questions[this.activeQues].answers[this.questions[this.activeQues].choose].id === this.questions[this.activeQues].word.id) {
            this.resultGame.correct++;
        }
        this.questions[this.activeQues].submit = true;
    }

    next() {
        if(this.activeQues + 1 < this.questions.length - 1) {
            this.activeQues++;
        } else {
            this.isShowResult = true;
            clearInterval(this.timeInterval);
        }
    }

    ngOnDestroy() {
        clearInterval(this.timeInterval);
    }
}
