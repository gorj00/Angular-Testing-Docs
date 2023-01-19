import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';
import { queryAllByTestAttr, queryByTestAttr } from '../../../utils/test.utils';


describe('CoursesCardListComponent', () => {
  let component: CoursesCardListComponent;
  // utilities
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  // IMPORTANT! Because beforeEach is async code, the result
  // is not available to the tests
  // SOLUTION: use Angular's async function, provides 5s to finish
  // (it is not JS/TS traditional async keyword)
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // Cards list contains many components, to save time, just import its parent module rather than decalring all of them
      // Such module should contain only pres components and common module
      imports: [CoursesModule]
    }).compileComponents()
      // needed to capture all downloaded style sheets etc.
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));


  it("should create the component", () => {
   expect(component).toBeTruthy();
  });


  // SYNCHRONOUS TESTING - preferred
  it("should display the course list", () => {
    // Setting an input property
    component.courses = setupCourses();
    // After input property set, must inform about change
    fixture.detectChanges();
    // console.log(el.nativeElement.outerHTML)

    const cards = queryAllByTestAttr(el, 'course-card');
    // console.log(cards)
    expect(cards).toBeTruthy('Could not find cards');
    expect(cards.length).toBe(12, 'Unexpected number of courses');
  });


  it("should display the first course", () => {
      component.courses = setupCourses();
      fixture.detectChanges();
      const course = component.courses[0];
      const card = queryByTestAttr(el, 'course-card', ':first-child');
      const title = card.query(By.css('mat-card-title'));
      const image = card.query(By.css('img'));
      expect(card).toBeTruthy('Could not find course card');
      expect(title.nativeElement.textContent).toBe(course.titles.description);
      expect(image.nativeElement.src).toBe(course.iconUrl);
  });


});


