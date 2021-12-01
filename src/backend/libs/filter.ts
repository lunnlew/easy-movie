import dataM from '../database/DataM'

export function setFilterData(event: any, params: any) {
    dataM.knexInstance('config').where('type', '=', 'type_filter').where({ val: params.options.name }).update({
        state: params.options.value ? 1 : 0
    }).on('query', (query: any) => {
        console.log(query.sql)
    }).catch(err => {
        console.log(err)
    })
}