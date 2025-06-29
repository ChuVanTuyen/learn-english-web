import { Component } from '@angular/core';
import {CdkDragEnd, CdkDragMove, CdkDragStart, DragDropModule} from '@angular/cdk/drag-drop';
import { ResultGame, WordFlashCard, WordNotebook } from '../../../../common/interfaces/note';
import { AudioService } from '../../../../shares/services/audio.service';
import { NgTemplateOutlet } from '@angular/common';
import { ResultGameComponent } from "../result-game/result-game.component";
import { CommonService } from '../../../../shares/services/common.service';
import { NoteService } from '../../../../shares/services/note.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
    selector: 'app-flashcard',
    imports: [
    DragDropModule,
    NgTemplateOutlet,
    ResultGameComponent,
    RouterLink
],
    templateUrl: './flashcard.component.html',
    styleUrl: './flashcard.component.css'
})
export class FlashcardComponent {

    isDragging: boolean = false;
    isReview: boolean = false;
    isDone: boolean = false;

    forget: number = 0;
    total: number = 0;
    noteId: number = 0;

    nameNotebook: string = '';

    words: WordNotebook[] = [
        {
            "id": 818,
            "notebook_id": 21,
            "word": "some",
            "pronounce": "/sʌm, səm/",
            "mean": "nào đó",
            "note": ""
        },
        {
            "id": 817,
            "notebook_id": 21,
            "word": "western",
            "pronounce": "/'west n/",
            "mean": "(thuộc) phía tây; của phưng tây",
            "note": ""
        },
        {
            "id": 816,
            "notebook_id": 21,
            "word": "west",
            "pronounce": "/west/",
            "kind": "",
            "mean": "hướng tây, phưng tây, phía tây",
            "note": ""
        },
        {
            "id": 815,
            "notebook_id": 21,
            "word": "good",
            "pronounce": "/gud/",
            "kind": "",
            "mean": "tốt, hay, tuyệt",
            "note": ""
        },
        {
            "id": 814,
            "notebook_id": 21,
            "word": "okok",
            "pronounce": "oke",
            "mean": "được được",
            "note": ""
        },
        {
            "id": 812,
            "notebook_id": 21,
            "word": "ok1",
            "pronounce": "",
            "mean": "được1",
            "note": ""
        },
        {
            "id": 811,
            "notebook_id": 21,
            "word": "hello",
            "pronounce": "helo",
            "mean": "Xin chào",
            "note": ""
        }
    ];
    listWord: WordFlashCard[] = [];
    listWordOrigin: WordFlashCard[] = [];

    resultGame!: ResultGame;

    timeInterval: NodeJS.Timeout | undefined;

    constructor(
        private audioService: AudioService,
        private commonService: CommonService,
        private route: ActivatedRoute,
        private noteService: NoteService
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const noteId = Number(params.get('id'));
            if(noteId) {
                this.noteId = noteId;
                this.noteService.getDetailNote(this.noteId).subscribe({
                    next: res => {
                        this.nameNotebook = res.name;
                        this.words = res.words;
                        this.prepared(this.words);
                    }
                })
            }
        });
    }


    prepared(words: WordNotebook[]) {
        let list: WordNotebook[] = JSON.parse(JSON.stringify(words));
        this.listWordOrigin = list.map((word, idx) => ({
            ...word,
            status: 0,
            pEvent: false,
            flip: false,
            isShowMix: idx % 2 ?  true : false
        }));
        this.total = this.listWordOrigin.length;
        this.listWord = JSON.parse(JSON.stringify(this.listWordOrigin));
        this.resultGame = {
            name: this.nameNotebook,
            date: new Date(),
            time: 0,
            total: words.length,
            correct: words.length
        }

        if(this.commonService.getEnvironment() === 'client') {
            this.timeInterval = setInterval(() => {
                this.resultGame.time ++;
            }, 1000)
        }
    }

    toggleFlip(item: WordFlashCard) {
        if(this.isDragging) return;
        item.flip = !item.flip;
    }

    onDragStarted(event: CdkDragStart) {
        this.isDragging = true;
    }

    onDragMoved(event: CdkDragMove, item: any) {
        if ( Math.abs(event.distance.y) > 100) {
            if(event.distance.x > 0) {
                item.status = 2;
            } else {
                item.status = 1;
            }
        } else {
            if(event.distance.x > 100) {
                item.status = 2;
            } else if (event.distance.x < -100) {
                item.status = 1;
            } else {
                item.status = 0;
            }
        }
    }

    onDragEnded(event: CdkDragEnd, item: any) {
        const element = event.source.getRootElement();
        element.style.transition = 'all 0.5s';

        if( Math.abs(event.distance.x) > 100 || Math.abs(event.distance.y) > 100) {
            event.source.setFreeDragPosition({ x: event.distance.x * 10, y: event.distance.y * 10 });
            item.pEvent = true;
            setTimeout(() => {
                this.listWord.shift();
                if(item.status === 1) {
                    item.status = 0;
                    item.pEvent = false;
                    item.flash = false;
                    this.listWord.push(item);
                    element.style.transition = 'all 0s';
                    event.source.setFreeDragPosition({ x: 0, y: 0 });
                }
                if(!this.listWord.length) {
                    clearInterval(this.timeInterval);
                }
            }, 500);
            if(item.status === 1) {
                this.forget++;
            }
        } else {
            event.source.setFreeDragPosition({ x: 0, y: 0 });
            setTimeout(() => {
                element.style.transition = 'all 0s';
            }, 500);
        }

        setTimeout(() => {
            this.isDragging = false;
        }, 10);
    }

    playAudio(word: string, event: any) {
        this.audioService.playAudio(word);
        event.stopPropagation();
    }

    ngOnDestroy() {
        clearInterval(this.timeInterval);
    }
}
