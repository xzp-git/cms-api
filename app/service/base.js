const {Service} = require('egg')

module.exports = class extends Service{

    async index(query){
        const {app} = this
        let {current, pageSize, sort, orderm, created, ...where} = query
        current = isNaN(current) ? 1 : Number(current)
        pageSize = isNaN(pageSize) ? 1 : Number(pageSize)
        const offset = (current - 1) * pageSize

        //如果有值，说明要按创建时间筛选
        if (created) {
            const filterFields = Object.entries(where).map(([key, value]) => `${key}='${value}'`)
            const [startCreated, endCreated] = created.split(',')
            filterFields.push(`created between '${startCreated}' and '${endCreated}'`)
            let filterSQL = ''
            if (filterFields.length > 0) {
                filterSQL += `where ${filterFields.join(' and ')}`
            }
            const [{total}] = await app.mysql.query(`SELECT COUNT(*) as total FROM ${this.entity} ${filterSQL}`)
            if(sort && order){
                filterSQL += ` ORDER BY ${sort} ${order}`
            }
            filterSQL += ` LIMIT ${offset},${pageSize}`
            const list = await app.mysql.query(`SELECT *  FROM ${this.entity} ${filterSQL}`)
            return {
                list,
                total
            }
        }else{
            let options = { where };
            options.offset = offset;
            options.limit = pageSize;
            if (sort && order) {
                options.orders = [[sort, order]];
            }
            const list = await app.mysql.select(this.entity, options);
            const total = await app.mysql.count(this.entity, where);
            return {
                list,
                total,
                current,
                pageSize
            }
        }

    }

    

    async create(body){
        const {app} = this

        delete body.id
        body.created = app.mysql.literals.now
        body.updated = app.mysql.literals.now
        return await app.mysql.insert(this.entity, body)
    }

    async update(body){
        const {app} = this
        return await app.mysql.update(this.entity, body)
    }

    async destroy(ids){
        const {app} = this

        return await app.mysql.delete(this.entity, {id: ids})
    }
}