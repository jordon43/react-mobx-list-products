import {makeAutoObservable, runInAction} from "mobx";
import md5 from "md5";
import ApiService from "../service/api-service";

class ProductsStore {
    productsId = null;
    productsInfo = null;
    countAllProducts = 0;
    countFilteredProducts = 0
    retryCount = 0;
    maxRetryCount = 5;

    constructor() {
        makeAutoObservable(this);
    }

    resetProducts = () => {
        this.productsId = null;
        this.productsInfo = null;
        this.countFilteredProducts = 0
    };

    updateProducts = (newData) => {
        this.productsId = newData;
        this.countFilteredProducts = newData.length
    };

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
                    runInAction(() => {
                        this.countAllProducts = jsonData.result.length;
                    })
                } else {
                    runInAction(() => {
                        this.productsId = jsonData.result;
                        this.retryCount = 0;
                    })
                }
            } else if (this.retryCount < this.maxRetryCount) {
                console.error("Ошибка:", fetchProductsId.status, "Повтор запроса.");
                runInAction(() => {
                    this.retryCount++;
                    this.getProductsId(this.getHash(), offset, limit);
                })

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
                runInAction(() => {
                    this.productsInfo = jsonData.result;
                    this.retryCount = 0;
                })
            } else if (this.retryCount < this.maxRetryCount) {
                console.error("Ошибка:", fetchProductsData.status, "Повтор запроса.");
                runInAction(() => {
                    this.retryCount++;
                    this.getItems();
                })

            } else {
                console.error("Достигнуто максимальное количество повторных попыток.");
            }
        } catch (e) {
            console.error("Ошибка:", e);
        }
    };

    filterProducts = async (mod, value, selectMod) => {
        if (selectMod && value) {
            try {
                if (mod === "price") value = Number(value);
                const fetchFiltered = await ApiService.fetchFiltered(this.getHash(), mod, value);
                if (fetchFiltered.status === 200) {
                    const jsonData = await fetchFiltered.json();
                    runInAction(() => {
                        this.countFilteredProducts = jsonData.result.length
                        this.resetProducts()
                        this.updateProducts(jsonData.result);
                    })
                } else if (this.retryCount < this.maxRetryCount) {
                    console.error("Ошибка:", fetchFiltered.status, "Повтор запроса.");
                    runInAction(() => {
                        this.retryCount++;
                        this.filterProducts();
                    })
                } else {
                    console.error("Достигнуто максимальное количество повторных попыток.");
                }
            } catch (e) {
                console.error("Ошибка:", e);
            }
        } else {
            return 0;
        }

    };


}

export default new ProductsStore();
