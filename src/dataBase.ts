import { StudentID, Student, Course, CourseGrade, Transcript } from './Types'
import { IDataBase } from './IDataBase'

const Avery : Student = { studentID: -1, studentName: "Avery"}
const emptyTranscript : Transcript = { student: Avery, grades: [] };

export class DataBase implements IDataBase {

    /** the list of transcripts in the database */
    private transcripts : Transcript [] = []

    /** the last assigned student ID 
     * @note Assumes studentID is Number
    */
    private lastID : number
    constructor () {this.lastID = 0}

    /** Adds a new student to the database
     * @param {string} newName - the name of the student
     * @returns {StudentID} - the newly-assigned ID for the new student
     */
    addStudent (newName: string): StudentID {
        const newID = this.lastID++
        const newStudent:Student = {studentID: newID, studentName: newName}
        this.transcripts.push({student: newStudent, grades: []})
        return newID
    }


    /**
     * @param studentName 
     * @returns list of studentIDs associated with that name
     */
    nameToIDs (studentName: string) : StudentID[] {
        return this.transcripts
            .filter(t => t.student.studentName === studentName)
            .map(t => t.student.studentID)
    }


    /**
     * 
     * @param id - the id to look up
     * @returns the transcript for this ID
     */
    getTranscript (id: StudentID): Transcript {
        const ret : Transcript = this.transcripts.find(t => t.student.studentID === id)
            if (ret === undefined) {throw new Error("unknown ID")}
            else {return ret}
    }

        
    deleteStudent (id: StudentID): void  {
        let studentTranscript = this.getTranscript(id);

        const transcriptIndex = this.transcripts.findIndex((transcript) => {
            return transcript.student.studentID === id;
        })

        this.transcripts.splice(transcriptIndex, 1); 
    }   


    addGrade (id: Student, course: Course, courseGrade: CourseGrade) : void {
        
        let studentTranscript:Transcript = this.getTranscript(id.studentID);

        //if course do not match
        if(course != courseGrade.course) {
            throw new Error("Courses do not align");
        }


        //Check valid grade
        if(courseGrade.grade > 100 || courseGrade.grade < 0) {
            throw new Error("Not A Valid Grade"); 
        }

        let doesCourseExists = false;
        let orginalCourseGrade = undefined;

        studentTranscript.grades.forEach((cg) =>
            {
                if(cg.course === course) {
                    doesCourseExists = true;
                    orginalCourseGrade = cg;
                }
            }
        )

        if(doesCourseExists) {
            //replacing old course grade
            orginalCourseGrade.grade == courseGrade.grade;
        }
        else {
            studentTranscript.grades.push(courseGrade);
        }
 



    }
    getGrade (id: Student, course: Course) : CourseGrade {
        const studentTranscript = this.getTranscript(id.studentID);

        studentTranscript.grades.forEach(grade => {

            if(grade.course === course) {
                return grade;
            }
            
        });

        throw new Error("Could not find course")
    }
    getAllStudentIDs () : StudentID[] {
        const allIDs : StudentID[] = [];

        this.transcripts.forEach((transcript) => {
            allIDs.push(transcript.student.studentID);
        })

        return allIDs;
    }
    
    
}
    