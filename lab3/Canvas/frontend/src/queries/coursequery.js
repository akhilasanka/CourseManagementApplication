    
import { gql } from 'apollo-boost';

const coursequery = gql`
query courses($id:String!){
    courses(id:$id){
        courses{
            course_id,
            course_name,
            status,
            waitlistCode,
            grade,
            dept,
            faculty_id,
            faculty_name,
            term
        }
    }
  }
`


const facultycoursequery = gql`
query facultycourses($id:String!){
    facultycourses(faculty_id:$id){
        courses{
            _id,
            id,
            name,
            dept,
            description,
            room,
            capacity,
            courseTerm,
            waitlistCapacity,
            currentEnrolledStudents
        }
    }
  }
`
export {coursequery, facultycoursequery};