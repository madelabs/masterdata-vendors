const uuid = require('uuid');

class Vendor {
    constructor(
        id,
        tenant_id,
        name,
        description,
        status,
        phone,
        email,
        address,
        created,
        lastUpdated
    ) {
        
        if (!id) {
            id = uuid.v1();
        }

        if (status) {
            status = 'active';
        }

        if (!created) {
            created = new Date();
        }
        
        this.id = id;
        this.tenant_id = tenant_id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.created = created;
        this.lastUpdated = lastUpdated;
    }
}

module.exports = Vendor;