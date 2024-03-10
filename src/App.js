import "./App.css";
import {useEffect, useMemo, useState} from "react";
import {observer} from "mobx-react-lite";
import ProductsStore from "./store/products-store";
import ProductsList from "./components/productsList/productsList";
import {Box, Pagination} from "@mui/material";
import ApiService from "./service/api-service";
import Filtration from "./components/filtration/filtration";

const App = observer(() => {
    const {
        productsId,
        productsInfo,
        countAllProducts,
        getProductsId,
        getItems,
        filterProducts
    } = ProductsStore;


    const mods = ["brand", "price", "product"];
    const [selectMod, setSelectMod] = useState(null);
    const [valueFilter, setValueFilter] = useState("");

    const [offset, setOffset] = useState(0);


    // const filterProducts = async (mod, value) => {
    //     if (selectMod && value) {
    //         try {
    //             if (mod === "price") value = Number(value);
    //
    //             console.log(value);
    //             console.log(mod, value);
    //             const mem = await ApiService.fetchFiltered(getHash(), mod, value);
    //             const dataMem = await mem.json();
    //             console.log(dataMem.result);
    //             resetProducts()
    //             updateProducts(dataMem.result);
    //             setOffset(0)
    //         } catch (e) {
    //         }
    //     } else {
    //         return 0;
    //     }
    //
    // };

    const onChangeMod = (a) => {
        setSelectMod(a)
    }

    const onChangeValueFilter = (a) => {
        setValueFilter(a)
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const countPage = useMemo(() => Math.floor(countAllProducts / limit), [offset, countAllProducts]);

    const filter = (mod, value) => {
        filterProducts(mod, value, selectMod)
        setOffset(0)
    }
    const resetFiltration = () => {
        setSelectMod(null)
        setOffset(0)
    }

    useEffect(() => {
        getProductsId();
    }, []);

    useEffect(() => {
        if (selectMod === null) {
            getProductsId(offset, limit);
        } else {

        }
    }, [offset, selectMod]);

    useEffect(() => {
        if (productsId) {
            getItems();
        }
    }, [productsId]);

    return (
        <div className="App">
            <Filtration
                selectMod={selectMod}
                mods={mods}
                valueFilter={valueFilter}
                onChangeMod={onChangeMod}
                onChangeValueFilter={onChangeValueFilter}
                filterProducts={filter}
                resetFiltration={resetFiltration}
            >
            </Filtration>

            {(productsInfo !== null) &&

                <div className="pagination">
                    <Box display="flex" justifyContent="center">
                        {countPage > 1 && (
                            <Pagination
                                count={countPage}
                                page={currentPage}
                                onChange={(event, value) => {
                                    //resetProducts()
                                    setCurrentPage(value);
                                    setOffset(limit * (value - 1))
                                }}
                                variant="outlined"
                                shape="rounded"
                            />
                        )}
                    </Box>
                </div>

            }

            {(productsInfo !== null) ?
                <ProductsList
                    productsInfo={selectMod === null
                        ? productsInfo
                        : productsInfo.slice(offset, offset + limit)}
                ></ProductsList>
                :
                <div className="download">
                    <p>Загрузка.....</p>
                </div>
            }

            {(productsInfo !== null && countPage > 1) &&
                <div className="pagination">
                    <Box display="flex" justifyContent="center">
                        <Pagination
                            count={countPage}
                            page={currentPage}
                            onChange={(event, value) => {
                                //resetProducts()
                                setCurrentPage(value);
                                setOffset(limit * (value - 1))
                            }}
                            variant="outlined"
                            shape="rounded"
                        />
                    </Box>
                </div>
            }

        </div>
    );
});

export default App;
