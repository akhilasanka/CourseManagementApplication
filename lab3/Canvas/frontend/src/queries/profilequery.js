    
import { gql } from 'apollo-boost';

const profilequery = gql`
query profile($id:String!){
    profile(id:$id){
      _id,
      firstname,
      lastname,
      phoneNumber,
      aboutMe,
      company,
      city,
      country,
      hometown,
      languages,
      gender
    }
  }
`

export {profilequery};