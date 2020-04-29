import { gql } from "apollo-boost";


const loginUserQuery = gql`
query($username: String, $password: String){
    user(username: $username, password: $password){
        id,
        username,
        role,
        token
    }
}
`

const getProjectsQuery = gql`
  {
      projects{
          id
          name
          owner{
              id
          }
          status
      }
  }
`

const getQuestionsQueryUsingToken = gql`
query($token:String) {
    questions(user_token: $token){
      id
      question,
      answer,
      priority,
      category,
      editingAllowed
    }
  }
`

//Using query variables to get the values in the fields 
// from the updated state in the component


const addQuestionMutation = gql` 
mutation($question :String! ,$answer :String!, $priority :String!,$category :String!){
    addQuestion(question :$question ,answer :$answer ,priority :$priority,category :$category){
       question,
       answer,
       priority,
       category
    }
}
 `
const editQuestionMutation = gql` 
mutation($id :String!, $question :String! ,$answer :String!){
    editQuestion(id :$id ,question :$question ,answer :$answer){
        question,
        answer
    }
}
 `
const projectStatusMutation = gql`
 mutation($id :String! ,$name :String! ,$status :String! ){
    updateStatus(id :$id ,name :$name ,status :$status){
        id,
        name,
        status
    }
}
 `
export {
    loginUserQuery,
    getProjectsQuery,
    getQuestionsQueryUsingToken,
    addQuestionMutation,
    editQuestionMutation,
    projectStatusMutation
}