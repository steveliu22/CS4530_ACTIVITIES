import { StudentID, Student, Course, CourseGrade, Transcript } from './Types'
import { DataBase } from './dataBase';

let db: DataBase;

// start each test with a fresh empty database.
beforeEach(() => {
  db = new DataBase
});

// this may look undefined in TSC until you do an npm install
// and possibly restart VSC.
describe('tests for addStudent', () => {

  test('addStudent should add a student to the database', () => {
    // const db = new DataBase ()
    expect(db.nameToIDs('blair')).toEqual([])
    const id1 = db.addStudent('blair');
    expect(db.nameToIDs('blair')).toEqual([id1])
  });

  test('addStudent should return an unique ID for the new student',
    () => {
      // we'll just add 3 students and check to see that their IDs
      // are all different.
      const id1 = db.addStudent('blair');
      const id2 = db.addStudent('corey');
      const id3 = db.addStudent('delta');
      expect(id1).not.toEqual(id2)
      expect(id1).not.toEqual(id3)
      expect(id2).not.toEqual(id3)
    });

  test('the db can have more than one student with the same name',
    () => {
      const id1 = db.addStudent('blair');
      const id2 = db.addStudent('blair');
      expect(id1).not.toEqual(id2)
    })

  test('A newly-added student should have an empty transcript',
    () => {
      const id1 = db.addStudent('blair');
      const retrievedTranscript = db.getTranscript(id1)
      expect(retrievedTranscript.grades).toEqual([])
      expect(retrievedTranscript.student)
        .toEqual({
          studentID: id1, studentName: "blair"
        })
    });

  test('getTranscript should return the right transcript',
    () => {
      // add a student, getting an ID
      // add some grades for that student
      // retrieve the transcript for that ID
      // check to see that the retrieved grades are 
      // exactly the ones you added.    
    });

  test('getTranscript should throw an error when given a bad ID',
    () => {
      // in an empty database, all IDs are bad :)
      // Note: the expression you expect to throw must be wrapped in a (() => ...)
      expect(() => db.getTranscript(1)).toThrowError()
    });

    test('getTranscript should throw an error when given a bad ID (bogus version)',
    () => {
      // in an empty database, all IDs are bad :)
      // Note: the expression you expect to throw must be wrapped in a (() => ...)
      expect(db.getTranscript(1)).toThrowError()
    });

    test('addGrade for an existing student', () => {
      //creates student ID with Name of Tom
      const student1 = db.addStudent("Tom");

      //Course Number
      const course1 = "CS4530";

      //Creates Transcript
      const transcript = db.getTranscript(student1);

      //Adds Grade
      db.addGrade({studentID: student1, studentName: "Tom"}, course1, {course: course1, grade: 90});

      //Expects grade to be added and to equal 90
      expect(db.getGrade({studentID: student1, studentName: "Tom"},course1)).toEqual(90);
    })

    test('Override old grade with a better grade', () => {
      //creates student ID with Name of Tom
      const student1 = db.addStudent("Tom");

      //Course Number
      const course1 = "CS4530";

      //Creates Transcript
      const transcript = db.getTranscript(student1);

      //Adds Grade
      db.addGrade({studentID: student1, studentName: "Tom"}, course1, {course: course1, grade: 50});

      //Expects grade to be added and to equal 90
      expect(db.getGrade({studentID: student1, studentName: "Tom"},course1)).toEqual(50);

      //adds a better grade
      db.addGrade({studentID: student1, studentName: "Tom"}, course1, {course: course1, grade: 100});

      //Expects a new and better grade
      expect(db.getGrade({studentID: student1, studentName: "Tom"},course1)).toEqual(100);
    })

    test('Dose not add a new grade, since new grade is lower', () => {
      //creates student ID with Name of Tom
      const student1 = db.addStudent("Tom");

      //Course Number
      const course1 = "CS4530";

      //Creates Transcript
      const transcript = db.getTranscript(student1);

      //Adds Grade
      db.addGrade({studentID: student1, studentName: "Tom"}, course1, {course: course1, grade: 70});

      //Expects grade to be added and to equal 90
      expect(db.getGrade({studentID: student1, studentName: "Tom"},course1)).toEqual(70);

       //Adds worst grade
       db.addGrade({studentID: student1, studentName: "Tom"}, course1, {course: course1, grade: 50});

       //Expects the old grade
       expect(db.getGrade({studentID: student1, studentName: "Tom"},course1)).toEqual(50);
    })

    test('Adds Grade to none existing student', () => {
     
    })

    test('Adds Grade to different course', () => {
     
    })

    test('Adds a Grade that is invalid <100 >0', () => {
     
    })

})


