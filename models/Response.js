import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
    answer: {
        type: String,
        required: true,
        trim: true,
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
    },
    surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    respondentId: {
        type: String,
        required: false,
        trim: true,
        default: 'anonymous',
    }, 
    });

const Response = mongoose.model('Response', responseSchema);

export default Response;