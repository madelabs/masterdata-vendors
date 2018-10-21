const uuid = require('uuid');

class Product {
    constructor(
        id,
        code,
        description,
        height,
        length,
        name,
        revision,
        status,
        unitOfMeasure,
        weight,
        width
        ) {
        
        if (!id) {
            id = uuid.v1();
        }
        
        this.id = id;
        this.code = code;
        this.description = description;
        this.height = height;
        this.length = length;
        this.name = name;
        this.revision = revision;
        this.status = status;
        this.unitOfMeasure = unitOfMeasure;
        this.weight = weight;
        this.width = width;
    }
}

module.exports = Product;