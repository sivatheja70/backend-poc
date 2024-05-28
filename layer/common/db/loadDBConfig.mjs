
export default function loadDBConfig(){
    const env = process.env.Env

    if (['local', 'dev'].includes(env)) {
        dynamoose.aws.ddb.local(process.env.DYNAMO_DB_LOCAL)
    }
}