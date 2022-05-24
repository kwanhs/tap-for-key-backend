const { Op } = require('sequelize');
const Error = require('../helper/error')

function handleFilter(filters = []) {
    return (ctx, next) => {
        let query = ctx.request.query;

        if (!filters.length) {
            ctx.filter = {};
            return next();
        }

        ctx.filter = {
            base: {
                where:{}
            }
        };

        filters.forEach(f => {
            const { field, op, val: getVal, as } = f;

            if (!query[field]) return;
            const clause = { [op]: getVal(query[field]) };
            
            if (as) {
                let [, aliasedModel, aliasedField] = as.match(/(?:(\w+)(?=\.)\.)?(\w+)/);

                if (!ctx.filter[aliasedModel])
                    ctx.filter[aliasedModel] = { required: true, where: {} }

                ctx.filter[aliasedModel].where[aliasedField] = clause;

            } else {
                ctx.filter.base.where[field] = clause;

            }
        })

        return next();
    }
}

function handlePaginate(defaultLimit = 5, defaultSkip = 0) {
    return (ctx, next) => {
        let { limit, skip } = ctx.request.query;

        if ( !isInteger(limit) || limit <= 0 )
            limit = defaultLimit;
        else
            limit = parseInt(limit);

        if ( !isInteger(skip) || skip < 0 )
            skip = defaultSkip;
        else
            skip = parseInt(skip);

        ctx.paginate = {
            limit,
            offset: skip, // offset in sequelize
        }

        return next();
    }
}

function handleSort(aliases = {}, defaultSort = []) {
    return (ctx, next) => {
        let sort = ctx.request.query.sort;

        if (!sort) {
            ctx.sort = defaultSort;

        } else {
            let [, negative, field] = sort.match(/(-)?(.+)/);
            let order = negative === '-' ? 'desc' : 'asc';
            let alias = aliases[field];

            let sortItem;

            if (alias) {
                let [, aliasedModel, aliasedField] = alias.match(/(?:(\w+)(?=\.)\.)?(\w+)/);
                sortItem = [aliasedModel, aliasedField, order]
            } else {
                sortItem = [field, order]
            }

            ctx.sort = [sortItem];

        }

        return next();
    }
}

function isInteger(str) {
    if (!str) return false;

    let n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str;
}

module.exports = {
    handleFilter,
    handlePaginate,
    handleSort,
}