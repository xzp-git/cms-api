const {Controller} = require('egg')


module.exports = class extends Controller{

    async index(){
        const {ctx, service} = this
        const result = await service[this.entity].index(ctx.query)
        this.ctx.body = {
            success: true,
            message: '查询成功',
            data: result
        }
    }


    async create(){
        const {ctx, service} = this
        const body = ctx.request.body

        await service[this.entity].create(body)
        ctx.body = {
            success: true,
            message:'创建成功'
        }
    }

    async update(){
        const {ctx, service, app} = this
        const body = ctx.request.body

        body.id = ctx.params.id
        body.updated = app.mysql.literals.now

        await service[this.entity].update(body)
        ctx.body = {
            success:true,
            message:'更新成功'
        }
    }

    async destroy(){
        const  {ctx, service} = this
        const id = ctx.params.id //如果只是删除单个 只有params.id
        let {ids} = ctx.request.body//如果是批量删除, 会把要删除的ID数组批量的从请求体重接收
        if (!ids) {
            ids = [id]
        }
        await service[this.entity].destroy(ids)
        this.ctx.body = {
            success: true,
            message:'删除成功'
        }
    }
}