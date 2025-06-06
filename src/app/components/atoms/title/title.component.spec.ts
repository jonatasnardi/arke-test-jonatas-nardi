import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleComponent } from './title.component';
import { By } from '@angular/platform-browser';

describe('TitleComponent', () => {
  let component: TitleComponent;
  let fixture: ComponentFixture<TitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TitleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TitleComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the provided title in the DOM', () => {
    component.title = 'Test Title';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('.first-title')).nativeElement;
    expect(titleElement.textContent).toBe('Test Title');
  });

  it('should contain an h2 element with class "title"', () => {
    fixture.detectChanges();
    const h2Element = fixture.debugElement.query(By.css('h2.title'));
    expect(h2Element).toBeTruthy();
  });

  it('should not display anything if title is not set', () => {
    component.title = '';
    fixture.detectChanges();
    
    const titleElement = fixture.debugElement.query(By.css('.first-title')).nativeElement;
    expect(titleElement.textContent).toBe('');
  });
});
