import { type SaveSurveyResultModel, type SaveSurveyResultRepository, type SurveyResultModel } from '../../../../data/usecases/save-survey-result/db-save-survey-result-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const res = await surveyResultCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId
    },
    {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true,
      returnDocument: 'after'
    })
    const surveyResultCreated = res.value as SurveyResultModel
    return {
      id: res.value?._id.toString() as string,
      accountId: surveyResultCreated.accountId,
      answer: surveyResultCreated.answer,
      date: surveyResultCreated.date,
      surveyId: surveyResultCreated.surveyId
    }
  }
}
