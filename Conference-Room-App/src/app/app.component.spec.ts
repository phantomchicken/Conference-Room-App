import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatabaseService } from './database.service';
import { UsersComponent } from './users/users.component';
import { of } from 'rxjs';
import { ConferenceRoomsComponent } from './conference-rooms/conference-rooms.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let mockDbService: jasmine.SpyObj<DatabaseService>;

  beforeEach(async () => {
    mockDbService = jasmine.createSpyObj('DatabaseService', ['getUsers', 'addUser']);
    mockDbService.addUser.and.returnValue(of({ id: 1, name: 'Test User' }));
    mockDbService.getUsers.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [UsersComponent, HttpClientTestingModule],
      providers: [{ provide: DatabaseService, useValue: mockDbService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add a user', () => {
    component.name = 'Test User';
    component.addUser();
    fixture.detectChanges();
    expect(mockDbService.addUser).toHaveBeenCalledWith({ name: 'Test User' });
    expect(component.status).toBe('User added successfully.');
    expect(component.statusClass).toBe('alert alert-success');
  });
});

describe('ConferenceRoomsComponent', () => {
  let component: ConferenceRoomsComponent;
  let fixture: ComponentFixture<ConferenceRoomsComponent>;
  let mockDbService: jasmine.SpyObj<DatabaseService>;

  beforeEach(async () => {
    mockDbService = jasmine.createSpyObj('DatabaseService', ['getConferenceRooms', 'addConferenceRoom']);
    mockDbService.addConferenceRoom.and.returnValue(of({ id: 1, name: 'Test Conference Room' }));
    mockDbService.getConferenceRooms.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ConferenceRoomsComponent, HttpClientTestingModule],
      providers: [{ provide: DatabaseService, useValue: mockDbService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConferenceRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add a conference room', () => {
    component.name = 'Test Conference Room';
    component.addConferenceRoom();
    fixture.detectChanges();
    expect(mockDbService.addConferenceRoom).toHaveBeenCalledWith({ name: 'Test Conference Room' });
    expect(component.status).toBe('Conference room added successfully.');
    expect(component.statusClass).toBe('alert alert-success');
  });
});
