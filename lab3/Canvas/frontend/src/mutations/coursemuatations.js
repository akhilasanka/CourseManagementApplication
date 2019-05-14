import { gql } from 'apollo-boost';


const createcoursemutation = gql`
mutation createcourse(
    $id: String!,
    $name: String!,
    $dept: String!,
    $desc: String,
    $room: String,
    $capacity: String!,
    $waitlistCapacity: String!,
    $courseTerm: String!,
    $faculty_id: String!,
    $faculty_name: String!
){
    createcourse(
        id: $id,
        name: $name,
        dept: $dept,
        desc: $desc,
        room: $room,
        capacity: $capacity,
        waitlistCapacity: $waitlistCapacity,
        courseTerm: $courseTerm,
        faculty_id: $faculty_id,
        faculty_name: $faculty_name
    ){
        responseMessage  
    }

}


`;




export { createcoursemutation };