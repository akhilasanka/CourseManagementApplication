import { gql } from 'apollo-boost';

const signupmutation = gql`
mutation signup(
    $email: String!,
    $firstname: String!,
    $lastname: String!,
    $password: String!,
    $role: String!) {
    signup(
        email: $email,
        firstname: $firstname,
        lastname: $lastname,
        password: $password,
        role: $role) {
        responseMessage
    }
}
`;


const loginmutation = gql`
mutation login(
    $email: String!,
    $password: String!,
    $role: String!) {
    login(
        email: $email,
        password: $password,
        role: $role) {
        isValidUser,
        cookie1,
        cookie2,
        cookie3,
        cookie4
    }
}
`;

const updateprofilemutation = gql`
mutation updateProfile(
        $id:String!,
        $firstname:String!,
        $lastname:String!,
        $phoneNumber:String!,
        $aboutMe:String!, 
        $company: String!,
        $city: String!,
        $country: String!,
        $school: String!,
        $hometown: String!,
        $languages: String!,
        $gender: String!
  )
  {
    updateProfile(
        id: $id,
        firstname: $firstname,
        lastname: $lastname,
        phoneNumber: $phoneNumber,
        aboutMe: $aboutMe, 
        company: $company,
        city: $city,
        country: $country,
        school: $school,
        hometown: $hometown,
        languages: $languages,
        gender: $gender
        ){
            responseMessage
        }
    }

`;


export { signupmutation, loginmutation, updateprofilemutation };