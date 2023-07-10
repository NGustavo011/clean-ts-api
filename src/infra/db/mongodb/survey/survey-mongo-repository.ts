
import { ObjectId } from 'mongodb'
import { type LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository'
import { type AddSurveyParams, type AddSurveyRepository } from '../../../../data/usecases/survey/add-survey/db-add-survey-protocols'
import { type SurveyModel } from '../../../../domain/models/survey'
import { type LoadSurveyById } from '../../../../domain/usecases/survey/load-survey-by-id'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyById {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return surveys && MongoHelper.mongoMapCollection(surveys)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({
      _id: new ObjectId(id)
    })
    return survey && MongoHelper.mongoMap(survey)
  }
}
