import {makeAutoObservable} from "mobx";
import md5 from "md5";
import ApiService from "../service/api-service";

class ProductsStore {
    productsId = null;
    productsInfo = null;
    brandsInfo = [];
    priceInfo = []
    productInfo = [];
    countAllProducts = 0;

    retryCount = 0;
    maxRetryCount = 5;

    constructor() {
        makeAutoObservable(this);
    }

    resetProducts = () => {
        this.productsId = null;
        this.productsInfo = null;
    };

    // getAllId = async () => {
    //     try {
    //         const fetchProductsAllId = await ApiService.fetchProductsId(
    //             this.getHash(),
    //             offset,
    //             limit,
    //         );
    //     }catch (e) {
    //
    //     }
    // };

    updateProducts = (newData) => {
        console.log("newData", newData);
        this.productsId = newData;
        this.countAllProducts = newData.length
        console.log("this.countAllProducts", this.countAllProducts)
    };


    getPaginationProductInfo(isFilter, offset, limit) {
        if (isFilter === true) {
            return this.productsInfo.slice(offset, offset + limit)
        } else {
            if (this.productsInfo)
                return this.productsInfo
        }
    }

    getHash = () => {
        const date = new Date();
        const timestamp =
            date.getFullYear() +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            ("0" + date.getUTCDate()).slice(-2);
        const password = "Valantis";
        return md5(password + "_" + timestamp);
    };

    getProductsId = async (offset = null, limit = null) => {
        try {
            const fetchProductsId = await ApiService.fetchProductsId(
                this.getHash(),
                offset,
                limit,
            );
            if (fetchProductsId.status === 200) {
                const jsonData = await fetchProductsId.json();
                if (offset === null && limit === null) {
                    this.countAllProducts = jsonData.result.length;
                    console.log("this.countAllProducts", this.countAllProducts);
                } else {
                    this.productsId = jsonData.result;
                    this.retryCount = 0;
                }
            } else if (this.retryCount < this.maxRetryCount) {
                console.error("Ошибка:", fetchProductsId.status, "Повтор запроса.");
                this.retryCount++;
                await this.getProductsId(this.getHash(), offset, limit);
            } else {
                console.error("Достигнуто максимальное количество повторных попыток.");
            }
        } catch (e) {
            console.error("Ошибка:", e);
        }
    };

    getItems = async () => {
        try {
            const fetchProductsData = await ApiService.fetchProductsData(
                this.getHash(),
                this.productsId,
            );
            if (fetchProductsData.status === 200) {
                const jsonData = await fetchProductsData.json();
                this.productsInfo = jsonData.result;
                this.retryCount = 0;
            } else if (this.retryCount < this.maxRetryCount) {
                console.error("Ошибка:", fetchProductsData.status, "Повтор запроса.");
                this.retryCount++;
                await this.getItems();
            } else {
                console.error("Достигнуто максимальное количество повторных попыток.");
            }
        } catch (e) {
            console.error("Ошибка:", e);
        }
    };

    toFormatForFilter = (data) => {
        return data.filter((item) => {
            if (data.includes(item)) {
                return item;
            }
        });
    };

    getFilters = async (offset, limit, mode) => {
        const fetchProductsFilter = await ApiService.fetchProductsFilter(
            this.getHash(),
            mode,
            offset,
            limit,
        );
        const jsonData = await fetchProductsFilter.json();
        if (mode === "brand")
            this.brandsInfo = this.toFormatForFilter(jsonData.result);
        if (mode === "price")
            this.priceInfo = this.toFormatForFilter(jsonData.result);
        if (mode === "product")
            this.productInfo = this.toFormatForFilter(jsonData.result);
    };

    filterProducts = async (mod, value, selectMod) => {
        if (selectMod && value) {
            try {
                if (mod === "price") value = Number(value);
                const fetchFiltered = await ApiService.fetchFiltered(this.getHash(), mod, value);
                if (fetchFiltered.status === 200) {
                    const jsonData = fetchFiltered.json();
                    this.resetProducts()
                    this.updateProducts(jsonData.result);
                } else if (this.retryCount < this.maxRetryCount) {
                    console.error("Ошибка:", fetchFiltered.status, "Повтор запроса.");
                    this.retryCount++;
                    await this.filterProducts();
                } else {
                    console.error("Достигнуто максимальное количество повторных попыток.");
                }
            } catch (e) {
                console.error("Ошибка:", e);
            }
        } else {
            console.log("ну пиздец че сказать то ещё");
            return 0;
        }

    };


}

export default new ProductsStore();