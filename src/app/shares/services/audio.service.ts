import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    audio: HTMLAudioElement | undefined;

    constructor() { }

    playAudio(value: string, voice: string = 'US') {
        console.log('run');
        return new Promise((resolve) => {
            this.audioBrowser(value, `en-${voice}`)!.onend = resolve;
        });
    }

    audioBrowser(value: string, lang: string) {
        const newvalue = value.replace(/(<([^>]+)>)/ig, '');
        if (!newvalue) return;

        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        const msg = new SpeechSynthesisUtterance();

        msg.volume = 1;
        msg.rate = 0.68;
        msg.pitch = 1;
        msg.text = newvalue;
        msg.lang = lang;

        setTimeout(() => {
            const voiceList = speechSynthesis.getVoices();
            const voiceMatch = voiceList.find(item => item.lang === lang);
            msg.voice = voiceMatch!;
            speechSynthesis.speak(msg);
        }, 10)

        return msg
    }
}
