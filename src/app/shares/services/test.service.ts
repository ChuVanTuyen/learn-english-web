import { Injectable } from '@angular/core';
import * as CONFIG from "../data/config";
import { HttpClient } from '@angular/common/http';
import { DetailTest } from '../../common/interfaces/exam';
import { map, of, tap } from 'rxjs';
import { ObjectKey } from '../../common/interfaces/common';
import { historyTest } from '../data/toeic';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  cache: ObjectKey<any> = {};

  constructor(
    private http: HttpClient
  ) { }

  getDetailTest(id: number) {
    const url = CONFIG.BASE_URL + 'exam/detail/' + id;
    // if(this.cache[url]) return of<DetailTest>(this.handlePreTest(this.cache[url]));
    return this.http.get<DetailTest>(url, CONFIG.HTTP_OPTION).pipe(
      // map(res => {
      //   if(res.id){
      //     this.cache[url] = res;
      //     res = this.handlePreTest(res);
      //   }
      //   return res;
      // })
    );
  }

  // handlePreTest(data: DetailTest) {
  //   let test: DetailTest = JSON.parse(JSON.stringify(data));
  //   test.skills.forEach(skill => {
  //     skill.parts.forEach(part => {
  //       if(part.intro?.answers) {
  //         part.intro.answers = JSON.parse(part.intro.answers);
  //       }
  //       part.questions.forEach(ques => {
  //         if(ques.text_audio_trans) {
  //           ques.text_audio_trans = JSON.parse(ques.text_audio_trans);
  //         }
  //         ques.childrens.forEach(child => {
  //           if(child.answers) {
  //             child.answers = JSON.parse(child.answers);
  //           }
  //           if(child.explains) {
  //             child.explains = JSON.parse(child.explains);
  //           }
  //         })
  //       })
  //     })
  //   });
  //   return test;
  // }

  getDetailHistory(id: number) {
    const url = '';
    
    return of(historyTest);
  }
}
