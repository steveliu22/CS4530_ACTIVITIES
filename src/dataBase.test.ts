import { StudentID, Student, Course, CourseGrade, Transcript } from './Types';
import { DataBase } from './dataBase';

let db: DataBase;

// start each test with a fresh empty database.
beforeEach(() => {
  db = new DataBase();
});

// this may look undefined in TSC until you do an npm install
// and possibly restart VSC.
describe('tests for addStudent', () => {
  test('addStudent should add a student to the database', () => {
    // const db = new DataBase ()
    expect(db.nameToIDs('blair')).toEqual([]);
    const id1 = db.addStudent('blair');
    expect(db.nameToIDs('blair')).toEqual([id1]);
  });

  test('addStudent should return an unique ID for the new student', () => {
    // we'll just add 3 students and check to see that their IDs
    // are all different.
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('corey');
    const id3 = db.addStudent('delta');
    expect(id1).not.toEqual(id2);
    expect(id1).not.toEqual(id3);
    expect(id2).not.toEqual(id3);
  });

  test('the db can have more than one student with the same name', () => {
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('blair');
    expect(id1).not.toEqual(id2);
  });

  test('A newly-added student should have an empty transcript', () => {
    const id1 = db.addStudent('blair');
    const retrievedTranscript = db.getTranscript(id1);
    expect(retrievedTranscript.grades).toEqual([]);
    expect(retrievedTranscript.student).toEqual({
      studentID: id1,
      studentName: 'blair',
    });
  });

  test('getTranscript should return the right transcript', () => {
    // add a student, getting an ID
    const id1 = db.addStudent('Tom');
    const student1 = { studentID: id1, studentName: 'Tom' };
    // add some grades for that student
    db.addGrade(student1, 'CS4530', { course: 'CS4530', grade: 2 });
    db.addGrade(student1, 'CS1800', { course: 'CS1800', grade: 99 });
    // retrieve the transcript for that ID
    const studentTranscript = db.getTranscript(id1);
    // check to see that the retrieved grades are
    // exactly the ones you added.
    expect(studentTranscript.grades).toEqual([
      { course: 'CS4530', grade: 2 },
      { course: 'CS1800', grade: 99 },
    ]);
  });

  test('getTranscript should throw an error when given a bad ID', () => {
    // in an empty database, all IDs are bad :)
    // Note: the expression you expect to throw must be wrapped in a (() => ...)
    expect(() => db.getTranscript(1)).toThrowError();
  });

  test('getTranscript should throw an error when given a bad ID (bogus version)', () => {
    // in an empty database, all IDs are bad :)
    // Note: the expression you expect to throw must be wrapped in a (() => ...)
    expect(() => db.getTranscript(1)).toThrowError();
  });

  test('addGrade thows an error when adding a grade to a non-existent student', () => {
    const studentIDTom: StudentID = db.addStudent('Tom');
    const studentCharles: Student = { studentID: 2, studentName: 'Charles' };

    expect(() =>
      db.addGrade(studentCharles, 'CS4530', { course: 'CS4530', grade: 2 }),
    ).toThrowError('unknown ID');
  });

  test('addGrade throws an error when attempting to add a grade that is greater than 100 or less than 0', () => {
    const studentIDTom: StudentID = db.addStudent('Tom');
    const studentTom: Student = { studentID: studentIDTom, studentName: 'Tom' };

    //verifies initial transcript for tom is empty
    expect(db.getTranscript(studentIDTom).grades).toEqual([]);

    expect(() => db.addGrade(studentTom, 'CS4530', { course: 'CS4530', grade: -1 })).toThrowError(
      'Not A Valid Grade',
    );
    expect(() => db.addGrade(studentTom, 'CS4530', { course: 'CS4530', grade: 101 })).toThrowError(
      'Not A Valid Grade',
    );

    //verifies transcript for tom is still empty
    expect(db.getTranscript(studentIDTom).grades).toEqual([]);
  });

  test('addGrade throws an error when the given course and the course in the courseGrade does not align', () => {
    const studentIDTom: StudentID = db.addStudent('Tom');
    const studentTom: Student = { studentID: studentIDTom, studentName: 'Tom' };

    expect(() => db.addGrade(studentTom, 'CS4530', { course: 'CS4531', grade: 4 })).toThrowError(
      'Courses do not align',
    );
  });

  test("addGrade for a course that doesn't exist on the student transcript should create a new course to the student's transcript with the given correlating grade", () => {
    //creates student ID with Name of Tom
    const student1 = db.addStudent('Tom');

    //Course Number
    const course1 = 'CS4530';

    //Creates Transcript
    const transcript = db.getTranscript(student1);

    expect(db.getTranscript(student1).grades).toEqual([]);

    //Adds Grade
    db.addGrade({ studentID: student1, studentName: 'Tom' }, course1, {
      course: course1,
      grade: 90,
    });

    expect(db.getTranscript(student1).grades).toEqual([{ course: 'CS4530', grade: 90 }]);
  });

  test('addGrade with a new grade for an existing course should override the old grade regardless if the old grade was higher, lower or equal to the new grade', () => {
    //creates student ID with Name of Tom
    const student1 = db.addStudent('Tom');
    //Course Number
    const course1 = 'CS4530';
    //Creates Transcript
    const transcript = db.getTranscript(student1);
    const tom: Student = { studentID: student1, studentName: 'Tom' };
    //Adds Grade

    db.addGrade(tom, course1, { course: course1, grade: 50 });
    //Expects a new course called CS4530 to be added to Tom's transcript and their grade for the course would be equal 50
    expect(db.getTranscript(student1).grades).toEqual([{ course: 'CS4530', grade: 50 }]);
    //Expects the grade for Tom's CS4530 course to be 50
    expect(db.getGrade(tom, course1).grade).toEqual(50);

    //Replacing Tom's grade in CS4530 to 90
    db.addGrade(tom, course1, { course: course1, grade: 90 });
    //Expects no new courseGrade to be added to Tom's transcript
    expect(db.getTranscript(student1).grades).toEqual([{ course: 'CS4530', grade: 90 }]);
    //Expects the grade for Tom's CS4530 course to be 90
    expect(db.getGrade(tom, course1).grade).toEqual(90);

    //Replacing Tom's grade in CS4530 to 30
    db.addGrade(tom, course1, { course: course1, grade: 30 });
    //Expects no new courseGrade to be added to Tom's transcript
    expect(db.getTranscript(student1).grades).toEqual([{ course: 'CS4530', grade: 30 }]);
    //Expects the grade for Tom's CS4530 course to be 30
    expect(db.getGrade(tom, course1).grade).toEqual(30);

    //Not changing Tom's grade in CS4530 at all
    db.addGrade(tom, course1, { course: course1, grade: 30 });
    //Expects no new courseGrade to be added to Tom's transcript
    expect(db.getTranscript(student1).grades).toEqual([{ course: 'CS4530', grade: 30 }]);
    //Expects the grade for Tom's CS4530 course to still be 30
    expect(db.getGrade(tom, course1).grade).toEqual(30);
  });

  test('addGrade the transcript after adding a new courseGrade contains both the new course and the grade for the given student on their transcript', () => {
    //creates student ID with Name of Tom
    const student1 = db.addStudent('Tom');
    //Course Number
    const course1 = 'CS4530';
    const course2 = 'CS1800';
    //Retrieves Transcript for Tom
    const transcript = db.getTranscript(student1);
    const tom: Student = { studentID: student1, studentName: 'Tom' };

    //verifies initial transcript for tom is empty
    expect(transcript.grades).toEqual([]);

    db.addGrade(tom, course1, { course: course1, grade: 70 });
    //verifies the new course, CS4530, with Tom's grade for the course has been added
    expect(db.getTranscript(student1).grades).toEqual([{ course: 'CS4530', grade: 70 }]);

    db.addGrade(tom, course2, { course: course2, grade: 20 });

    //Expects the old grade
    expect(db.getTranscript(student1).grades).toEqual([
      { course: 'CS4530', grade: 70 },
      { course: 'CS1800', grade: 20 },
    ]);
  });

  test('addGrade, check that the transcript after adding an existing courseGrade does not create a duplicate course and the old course remains with the changed grade', () => {
    //creates student ID with Name of Tom
    const student1 = db.addStudent('Tom');
    //Course Number
    const course1 = 'CS4530';
    //Retrieves Transcript for Tom
    const transcript = db.getTranscript(student1);
    const tom: Student = { studentID: student1, studentName: 'Tom' };

    //verifies initial transcript for tom is empty
    expect(transcript.grades).toEqual([]);

    db.addGrade(tom, course1, { course: course1, grade: 70 });
    //verifies the new course, CS4530, with Tom's grade for the course has been added
    expect(db.getTranscript(student1).grades).toEqual([{ course: 'CS4530', grade: 70 }]);

    db.addGrade(tom, course1, { course: course1, grade: 70 });

    //Expects the old grade
    expect(db.getTranscript(student1).grades).toEqual([{ course: 'CS4530', grade: 70 }]);
  });
});
