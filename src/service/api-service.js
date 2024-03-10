class ApiService {


    //take info for products
    async fetchProductsData(hash, productsId) {
        return await fetch("https://api.valantis.store:41000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Auth": hash
            },
            body: JSON.stringify({
                action: "get_items",
                params: {
                    ids: productsId
                }
            })
        });
    }


    //take id products
    async fetchProductsId(hash, offset, limit) {
        return await fetch("https://api.valantis.store:41000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Auth": hash
            },
            body: JSON.stringify({
                action: "get_ids",
                params: {offset: offset, limit: limit}
            })
        });
    }

    //take info from field products
    async fetchProductsFilter(hash, filterMode, offset, limit) {
        return await fetch("https://api.valantis.store:41000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Auth": hash
            },
            body: JSON.stringify({
                action: "get_fields",
                params: {
                    field: filterMode,
                    offset: offset,
                    limit: limit
                }
            })
        })
    }

    async fetchFiltered(hash, mod, value) {
        const params = {};
        params[mod] = value;
        return await fetch("https://api.valantis.store:41000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Auth": hash,
            },
            body: JSON.stringify({
                action: "filter",
                params,
            }),
        });
    };
}

export default new ApiService();