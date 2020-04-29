const graphql = require('graphql');
// const _ = require('lodash');
const User = require('../models/user');
const Project = require('../models/project');
const Question = require('../models/question');


const { GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLList,
    GraphQLID,
} = graphql;


// var users = [
//     { id: "1", username: "Sapient", password: "Sapient_123", role: "admin" },
// ]

//USER TYPE
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLID }, //can be string or number
        role: { type: GraphQLString },
        token: { type: GraphQLString }
    })
});

//QUESTION TYPE 
const QuestionType = new GraphQLObjectType({
    name: "Question",
    fields: () => ({
        id: { type: GraphQLString },
        user_token: { type: GraphQLString },
        question: { type: GraphQLString },
        answer: { type: GraphQLString },
        priority: { type: GraphQLString }, //mandatory questions should be listed above optional
        category: { type: GraphQLString },
        editingAllowed: { type: GraphQLString }
    })
})

// PROJECT TYPE
const ProjectType = new GraphQLObjectType({
    name: "Project",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        owner: {
            type: UserType,
            resolve(parent, args) {
                // return _.find(users, { id: parent.Id });
                return User.findById(parent.id); //return the name of the user whose id matches with the parent id(Project)
            }
        },
        status: { type: GraphQLString }, //in reviewed , approved
        approved_by: {
            type: UserType,
            resolve(parent, args) {
                console.log(parent)
                return User.findById(parent.id);
            }
        },
        approval_date: { type: GraphQLString }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,     //store the username and passsword in the db for demo
            args: {
                username: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            // Logging in user with username and password
            resolve(parent, args) {
                const { username, password } = args
                User.findOne({ username, password }).select(['id', 'username', 'role', 'token']).then(console.log)
                return User.findOne({ username, password }).select(['id', 'username', 'role', 'token'])
            }
        },
        project: {   //project
            type: ProjectType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Project.findById(args.id);
            }
        },
        question: {     // question
            type: QuestionType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                return Question.findById(args.id);
            }
        },
        questions: {
            type: new GraphQLList(QuestionType), //list of Questions
            args: { user_token: { type: GraphQLString } },
            async resolve(parent, args) {
                const { role } = await User.findOne({ token: args.user_token }).select(['role']);
                console.log(role);
                const questions = await Question.find({})
                let editingAllowed = true;
                if (role == "Admin" || role == "Editor") {
                    editingAllowed = true;
                }
                return questions.map((q) => {
                    q.editingAllowed = editingAllowed
                    return q
                })
            }
        },
        projects: {
            type: new GraphQLList(ProjectType), //list of Projects
            resolve(parent, args) {
                return Project.find({});
            }
        }
    }
});


//MUTATION METHODS
//addUser  
//addProject
//addQuestion
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {    //Type of mutation
        addUser: {
            type: UserType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLID) },
                role: { type: new GraphQLNonNull(GraphQLString) },
                token: { type: new GraphQLNonNull(GraphQLString) }
            },
            //Created the instance of the models (collections) to 
            //save the data to the database and return the data to the frond end
            resolve(parent, args) {

                let user = new User({
                    username: args.username,
                    password: args.password,
                    role: args.role,
                    token: args.token
                });
                return user.save(); //save the collection to the database     
            }
        },
        addProject: {
            type: ProjectType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                owner: { type: new GraphQLNonNull(GraphQLString) },
                status: { type: new GraphQLNonNull(GraphQLString) }

            },
            resolve(parent, args) {
                let project = new Project({
                    name: args.name,
                    owner: args.owner,
                    status: args.status
                });
                return project.save();
            }
        },
        updateStatus: {
            type: ProjectType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                status: { type: new GraphQLNonNull(GraphQLString) }

            },
            resolve(parent, args) {
                const { id, name, status } = args;
                return Project.findOneAndUpdate({ _id: id }, { $set: { name, status } })
            }
        },
        editQuestion: {
            type: QuestionType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                question: { type: new GraphQLNonNull(GraphQLString) },
                answer: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                const { id, question, answer } = args;
                return Question.findOneAndUpdate({ _id: id }, { $set: { question, answer } })
            }

        },
        addQuestion: {
            type: QuestionType,
            args: {
                question: { type: new GraphQLNonNull(GraphQLString) },
                answer: { type: new GraphQLNonNull(GraphQLString) },
                category: { type: GraphQLString },
                priority: { type: GraphQLString },

            },
            resolve(parent, args) {
                let question = new Question({
                    question: args.question,
                    answer: args.answer,
                    category: args.category,
                    priority: args.priority
                });
                return question.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})



