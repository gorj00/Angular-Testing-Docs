 import { async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync } from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { queryAllByTestAttr, click } from '../../../utils/test.utils';
// import { click } from '../common/test-utils'

describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let el: DebugElement;
  let coursesService: any; // not CoursesService because TestBed,get is any

  const beginnerCourses = setupCourses()
      .filter(course => course.category === 'BEGINNER');

  const advancedCourses = setupCourses()
      .filter(course => course.category === 'ADVANCED');

  beforeEach(waitForAsync(() => {

      const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses'])

      TestBed.configureTestingModule({
          imports: [
              CoursesModule,
              NoopAnimationsModule
          ],
          providers: [
              {provide: CoursesService, useValue: coursesServiceSpy}
          ]
      }).compileComponents()
          .then(() => {
              fixture = TestBed.createComponent(HomeComponent);
              component = fixture.componentInstance;
              el = fixture.debugElement;
              coursesService = TestBed.get(CoursesService);
          });

  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display only beginner courses", () => {
      coursesService.findAllCourses.and.returnValue(of(beginnerCourses)); //happens as sync
      fixture.detectChanges();

      const tabs = queryAllByTestAttr(el, 'courses-tab');
      expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });


  it("should display only advanced courses", () => {
      coursesService.findAllCourses.and.returnValue(of(advancedCourses)); //happens as sync
      fixture.detectChanges();

      const tabs = queryAllByTestAttr(el, 'courses-tab');
      expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });


  it("should display both tabs", () => {

      coursesService.findAllCourses.and.returnValue(of(setupCourses())); //happens as sync
      fixture.detectChanges();

      const tabs = queryAllByTestAttr(el, 'courses-tab');
      expect(tabs.length).toBe(2, 'Unexpected number of tabs found');
  });

  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses())); //happens as sync
    fixture.detectChanges();

    const tabs = queryAllByTestAttr(el, 'courses-tab');
    // const tabs = el.queryAll(By.css('.mdc-tab'));

    // Click performs asynchronous operations related to animations
    click(tabs[1]);
    // tabs[1].triggerEventHandler('click', { button: 0 })
    fixture.detectChanges(); // not enough to capture the async result

    // Below needs to be handled async way
    flush();
    fixture.detectChanges(); // needed again, not in video, not working wiuthout it now
    const cardTitles = queryAllByTestAttr(el, 'course-card-title');
    expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
  }));

  it("should display advanced courses when tab clicked - async", async(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses())); //happens as sync
    fixture.detectChanges();

    const tabs = queryAllByTestAttr(el, 'courses-tab');
    // const tabs = el.queryAll(By.css('.mdc-tab'));

    // Click performs asynchronous operations related to animations
    click(tabs[1]);
    // tabs[1].triggerEventHandler('click', { button: 0 })
    fixture.detectChanges(); // not enough to capture the async result

    // Below needs to be handled async way
    // async does not allow to write tests in sync way as fakeAsync, whenStable cb used instead
    // no control over time passage, no control over micro/macrotasks, not written in sync way
    // fakeAsync does not support http requests, async does
    fixture.whenStable().then(() => {
      // After all async operations completed...
      fixture.detectChanges(); // needed again, not in video, not working wiuthout it now
      const cardTitles = queryAllByTestAttr(el, 'course-card-title');
      expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
    });
  }));

});




















