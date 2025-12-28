export const findInMongo = async(colname, query) => {
    const doc = await colname.findOne(query);

    return doc
}

export const findInMongoWithSelectQuery = async(colname, query, selectQuery) => {
    const doc = await colname.findOne(query).select(selectQuery);

    return doc
}

export const countDocuments = async(colname, query) => {
    const totalRecs = await colname.countDocuments(query);

    return totalRecs;
}

export const findManyInMongo = async(colname, query) => {
    const docs = await colname.find(query);

    return docs
}

export const findManyWithLimitAndSkip = async(colname, query, sortOption, limit, skip) => {
    const records = colname.find(query).sort(sortOption).limit(Number(limit)).skip(skip);

    return records;
}

export const findManyInMongoWithSelectQuery = async(colname, query, selectQuery) => {
    const docs = await colname.find(query).select(selectQuery);

    return docs
}

export const createRecordInMongo = async(colname, data) => {
    const record = new colname(data)

    return record.save()
}

export const updateRecordInMongo = async(colname, filterQuery, updateQuery) => {
    const result = await colname.updateOne(filterQuery, updateQuery);

    if(result.matchedCount === 0){
        const error = new Error("Document not found for update");
        error.statusCode = 404;
        throw error;
    }

    return
}

export const updateRecordInMongoWithId = async(colname, id, updateData,options) => {
    const record = await colname.findByIdAndUpdate(id, updateData, options);

    if(!record){
        const error = new Error("record not found for update");
        error.statusCode = 404;
        throw error;
    }

    return record
}

export const updateRecordInMongoWithOptions = async(colname, filterQuery, updateQuery, options) => {
    const result = await colname.updateOne(filterQuery, updateQuery, options);

    if(result.matchedCount === 0){
        const error = new Error("Document not found for update");
        error.statusCode = 404;
        throw error;
    }

    return
}

export const deleteInMongo = async(colname, query) => {
    await colname.deleteOne(query)

    return
}

